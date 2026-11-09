async function requestJson(path, options) {
  let response;
  try {
    response = await fetch(path, options);
  } catch {
    throw new Error("Cannot connect to the account server. Please try again.");
  }

  const responseText = await response.text();
  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    if (!response.ok) {
      throw new Error(
        `The account server is unavailable (HTTP ${response.status}). Stop the old development server and restart with "npm run dev".`
      );
    }
    throw new Error("The account server returned an invalid response.");
  }
  if (!response.ok) {
    throw new Error(
      result?.error || "The account request could not be completed."
    );
  }
  return result;
}

async function postAuthRequest(path, payload) {
  const result = await requestJson(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!result?.user || typeof result.user.email !== "string") {
    throw new Error("The account server returned an invalid response.");
  }
  return result.user;
}

export async function workerRequest(path, token, { method = "GET", body } = {}) {
  const headers = { Authorization: `Bearer ${token}` };
  const options = { method, headers };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }
  return requestJson(path, options);
}

export function adminRequest(path, token) {
  return requestJson(path, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function loginAccount(email, password) {
  return postAuthRequest("/api/auth/login", { email, password });
}

export function registerAccount(account) {
  return postAuthRequest("/api/auth/signup", account);
}

export function logoutWorkerAccount(token) {
  return workerRequest("/api/worker/logout", token, { method: "POST" });
}
