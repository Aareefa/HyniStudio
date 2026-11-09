import { createServer } from "node:http";
import {
  randomBytes,
  scrypt,
  timingSafeEqual
} from "node:crypto";
import { promisify } from "node:util";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Buffer } from "node:buffer";
import process from "node:process";
import DEMO_USERS from "../src/data/demoUsers.js";

const scryptAsync = promisify(scrypt);
const dataDirectory = process.env.HYNI_AUTH_DATA_DIR
  ? resolve(process.env.HYNI_AUTH_DATA_DIR)
  : fileURLToPath(new URL("./data/", import.meta.url));
const accountsFile = resolve(dataDirectory, "accounts.json");
const loginHistoryFile = resolve(dataDirectory, "login-history.json");
const attendanceFile = resolve(dataDirectory, "worker-attendance.json");
const salesFile = resolve(dataDirectory, "worker-sales.json");
const dressCodeFile = resolve(dataDirectory, "worker-dress-code.json");
const maximumRequestSize = 16 * 1024;
const passwordLength = 64;
const workerSessions = new Map();
const adminSessions = new Map();
const dressCodeChecks = ["uniform", "nameBadge", "footwear", "grooming"];

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function readJsonArray(path) {
  try {
    const parsed = JSON.parse(await readFile(path, "utf8"));
    if (!Array.isArray(parsed)) {
      throw new Error(`Expected an array in ${path}`);
    }
    return parsed;
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveJsonArray(path, values) {
  const temporaryPath = `${path}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(values, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600
  });
  await rename(temporaryPath, path);
}

function createPersistenceQueue() {
  let pendingWrites = Promise.resolve();

  return function persist(path, values) {
    const nextWrite = pendingWrites.then(() => saveJsonArray(path, values));
    pendingWrites = nextWrite.catch(() => {});
    return nextWrite;
  };
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(value));
}

async function readRequestBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maximumRequestSize) {
      throw new HttpError(413, "Request body is too large.");
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "Invalid JSON request.");
  }
}

function normalizeEmail(value) {
  if (typeof value !== "string") {
    throw new HttpError(400, "Enter a valid email address.");
  }
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "Enter a valid email address.");
  }
  return email;
}

function publicAccount(account) {
  return { name: account.name, email: account.email, role: account.role };
}

function businessDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

async function createAuthServer() {
  await mkdir(dataDirectory, { recursive: true });
  const accounts = await readJsonArray(accountsFile);
  const loginHistory = await readJsonArray(loginHistoryFile);
  const attendance = await readJsonArray(attendanceFile);
  const sales = await readJsonArray(salesFile);
  const dressCode = await readJsonArray(dressCodeFile);
  const persist = createPersistenceQueue();
  const dummySalt = randomBytes(16);

  async function startWorkerShift(account) {
    const now = new Date().toISOString();
    for (const previousShift of attendance) {
      if (previousShift.email === account.email && !previousShift.logoutAt) {
        previousShift.logoutAt = now;
        previousShift.logoutReason = "Closed when a new shift started";
      }
    }

    const attendanceId = randomBytes(16).toString("hex");
    const token = randomBytes(32).toString("hex");
    attendance.push({
      id: attendanceId,
      email: account.email,
      name: account.name,
      date: businessDate(),
      loginAt: now,
      logoutAt: null
    });
    await persist(attendanceFile, attendance);
    workerSessions.set(token, { email: account.email, attendanceId });
    return { ...publicAccount(account), sessionToken: token };
  }

  async function recordLogin(account) {
    loginHistory.push({
      ...publicAccount(account),
      loggedAt: new Date().toISOString()
    });
    await persist(loginHistoryFile, loginHistory);
    return publicAccount(account);
  }

  async function createLoginUser(account) {
    if (account.role === "Worker") {
      return startWorkerShift(account);
    }

    const user = await recordLogin(account);
    if (account.role !== "Admin") return user;

    const token = randomBytes(32).toString("hex");
    adminSessions.set(token, account.email);
    return { ...user, sessionToken: token };
  }

  return createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url, "http://localhost");
      if (request.method === "GET" && requestUrl.pathname === "/api/health") {
        sendJson(response, 200, { status: "ok" });
        return;
      }

      const workerEndpoint = requestUrl.pathname.startsWith("/api/worker/");
      const adminEndpoint = requestUrl.pathname.startsWith("/api/admin/");
      let workerSession = null;
      if (workerEndpoint) {
        const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
        workerSession = workerSessions.get(token);
        if (!workerSession) {
          throw new HttpError(401, "Your worker session expired. Please sign in again.");
        }
      }

      if (adminEndpoint) {
        const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
        if (!token || !adminSessions.has(token)) {
          throw new HttpError(401, "An active admin session is required.");
        }
        if (request.method === "GET" && requestUrl.pathname === "/api/admin/workers") {
          const workerAccounts = [
            ...accounts.filter((entry) => entry.role === "Worker"),
            ...DEMO_USERS.filter((entry) => entry.role === "Worker").map(publicAccount)
          ];
          sendJson(response, 200, {
            workers: workerAccounts.map((worker) => ({
              name: worker.name,
              email: worker.email,
              attendance: attendance.filter((entry) => entry.email === worker.email),
              sales: sales.filter((entry) => entry.email === worker.email),
              dressCode: dressCode.filter((entry) => entry.email === worker.email)
            }))
          });
          return;
        }
        throw new HttpError(404, "Not found.");
      }

      if (workerEndpoint && request.method === "GET" &&
          requestUrl.pathname === "/api/worker/dashboard") {
        const currentDate = businessDate();
        sendJson(response, 200, {
          day: currentDate,
          attendance: attendance.filter((entry) => entry.email === workerSession.email),
          sales: sales.filter((entry) => entry.email === workerSession.email),
          dressCode: dressCode.find(
            (entry) => entry.email === workerSession.email && entry.date === currentDate
          ) || null
        });
        return;
      }

      if (request.method !== "POST") {
        throw new HttpError(404, "Not found.");
      }

      if (workerEndpoint && requestUrl.pathname === "/api/worker/sales") {
        const body = await readRequestBody(request);
        if (!body || typeof body !== "object" || Array.isArray(body)) {
          throw new HttpError(400, "A JSON object is required.");
        }
        const description = typeof body.description === "string"
          ? body.description.trim()
          : "";
        const amount = Number(body.amount);
        const cost = Number(body.cost);
        const quantity = Number(body.quantity);
        if (!description || description.length > 120) {
          throw new HttpError(400, "Enter a sale description (up to 120 characters).");
        }
        if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
          throw new HttpError(400, "Enter a valid sale amount.");
        }
        if (!Number.isFinite(cost) || cost < 0 || cost > 10000000) {
          throw new HttpError(400, "Enter a valid total cost for this sale.");
        }
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000) {
          throw new HttpError(400, "Enter a valid item quantity.");
        }
        const sale = {
          id: randomBytes(16).toString("hex"),
          email: workerSession.email,
          attendanceId: workerSession.attendanceId,
          date: businessDate(),
          description,
          amount,
          cost,
          profit: amount - cost,
          quantity,
          createdAt: new Date().toISOString()
        };
        sales.push(sale);
        await persist(salesFile, sales);
        sendJson(response, 201, { sale });
        return;
      }

      if (workerEndpoint && requestUrl.pathname === "/api/worker/dress-code") {
        const body = await readRequestBody(request);
        if (!body || typeof body !== "object" || Array.isArray(body) ||
            !body.checklist || typeof body.checklist !== "object") {
          throw new HttpError(400, "A dress-code checklist is required.");
        }
        const checklist = Object.fromEntries(
          dressCodeChecks.map((key) => [key, body.checklist[key] === true])
        );
        const date = businessDate();
        const record = {
          email: workerSession.email,
          name: attendance.find((entry) => entry.id === workerSession.attendanceId)?.name,
          date,
          checklist,
          updatedAt: new Date().toISOString()
        };
        const existingIndex = dressCode.findIndex(
          (entry) => entry.email === workerSession.email && entry.date === date
        );
        if (existingIndex < 0) dressCode.push(record);
        else dressCode[existingIndex] = record;
        await persist(dressCodeFile, dressCode);
        sendJson(response, 200, { dressCode: record });
        return;
      }

      if (workerEndpoint && requestUrl.pathname === "/api/worker/logout") {
        const shift = attendance.find((entry) => entry.id === workerSession.attendanceId);
        if (shift && !shift.logoutAt) {
          shift.logoutAt = new Date().toISOString();
          await persist(attendanceFile, attendance);
        }
        const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
        workerSessions.delete(token);
        sendJson(response, 200, { success: true });
        return;
      }

      const body = await readRequestBody(request);
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new HttpError(400, "A JSON object is required.");
      }
      if (requestUrl.pathname === "/api/auth/signup") {
        const name = typeof body.name === "string" ? body.name.trim() : "";
        const email = normalizeEmail(body.email);
        const password = body.password;
        const role = body.role;

        if (!name || name.length > 100) {
          throw new HttpError(400, "Enter your name (up to 100 characters).");
        }
        if (!["Customer", "Wholesaler", "Worker"].includes(role)) {
          throw new HttpError(400, "Choose Customer, Wholesaler, or Worker as your account type.");
        }
        if (
          typeof password !== "string" ||
          password.length < 8 ||
          password.length > 128
        ) {
          throw new HttpError(400, "Your password must be between 8 and 128 characters.");
        }

        const salt = randomBytes(16);
        const passwordHash = await scryptAsync(password, salt, passwordLength);
        if (accounts.some((account) => account.email === email) ||
            DEMO_USERS.some((account) => account.email.toLowerCase() === email)) {
          throw new HttpError(409, "An account with this email already exists.");
        }
        const account = {
          name,
          email,
          role,
          salt: salt.toString("hex"),
          passwordHash: passwordHash.toString("hex"),
          createdAt: new Date().toISOString()
        };
        accounts.push(account);
        await persist(accountsFile, accounts);
        const user = await createLoginUser(account);
        sendJson(response, 201, { user });
        return;
      }

      if (requestUrl.pathname === "/api/auth/login") {
        const email = normalizeEmail(body.email);
        const password = typeof body.password === "string" ? body.password : "";
        const account = accounts.find((item) => item.email === email);

        let isValid = false;
        if (account) {
          const salt = Buffer.from(account.salt, "hex");
          const storedHash = Buffer.from(account.passwordHash, "hex");
          const candidateHash = await scryptAsync(password, salt, passwordLength);
          isValid = storedHash.length === candidateHash.length &&
            timingSafeEqual(storedHash, candidateHash);
        } else {
          await scryptAsync(password, dummySalt, passwordLength);
          const demoAccount = DEMO_USERS.find(
            (item) => item.email.toLowerCase() === email
          );
          isValid = Boolean(demoAccount && demoAccount.password === password);
          if (isValid) {
            const user = await createLoginUser(demoAccount);
            sendJson(response, 200, { user });
            return;
          }
        }

        if (!account || !isValid) {
          throw new HttpError(401, "Email or password is incorrect.");
        }

        const user = await createLoginUser(account);
        sendJson(response, 200, { user });
        return;
      }

      throw new HttpError(404, "Not found.");
    } catch (error) {
      if (error instanceof HttpError) {
        sendJson(response, error.status, { error: error.message });
        return;
      }
      console.error("Authentication request failed:", error);
      sendJson(response, 500, { error: "The account server could not complete the request." });
    }
  });
}

const server = await createAuthServer();
const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || "127.0.0.1";
server.listen(port, host, () => {
  console.log(`Hyni account API listening on http://${host}:${port}`);
});

server.on("error", (error) => {
  console.error("Could not start the Hyni account API:", error);
  process.exitCode = 1;
});
