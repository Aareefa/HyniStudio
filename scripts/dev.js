import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const projectDirectory = fileURLToPath(new URL("../", import.meta.url));
const children = [
  spawn(process.execPath, ["--watch", resolve(projectDirectory, "server/index.js")], {
    cwd: projectDirectory,
    env: process.env,
    stdio: "inherit"
  }),
  spawn(process.execPath, [resolve(projectDirectory, "node_modules/vite/bin/vite.js")], {
    cwd: projectDirectory,
    env: process.env,
    stdio: "inherit"
  })
];

let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill();
  }
}

for (const child of children) {
  child.on("error", (error) => {
    console.error("Could not start a development process:", error);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!stopping) stop(code || 0);
  });
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
