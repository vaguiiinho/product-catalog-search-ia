import fs from "node:fs";
import path from "node:path";

function parseEnvFile(contents: string) {
  const entries: Array<[string, string]> = [];

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const cleanedLine = line.startsWith("export ") ? line.slice(7).trim() : line;
    const separatorIndex = cleanedLine.indexOf("=");

    if (separatorIndex < 0) {
      continue;
    }

    const key = cleanedLine.slice(0, separatorIndex).trim();
    let value = cleanedLine.slice(separatorIndex + 1).trim();

    if (!key) {
      continue;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    value = value.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t");
    entries.push([key, value]);
  }

  return entries;
}

function resolveEnvFile() {
  const searchOrder = process.env.NODE_ENV === "production" ? [".env"] : [".env.local", ".env"];

  for (const relativePath of searchOrder) {
    const candidate = path.resolve(process.cwd(), relativePath);

    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function loadApiEnv() {
  const envFile = resolveEnvFile();

  if (!envFile) {
    return;
  }

  const parsedEntries = parseEnvFile(fs.readFileSync(envFile, "utf8"));

  for (const [key, value] of parsedEntries) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
