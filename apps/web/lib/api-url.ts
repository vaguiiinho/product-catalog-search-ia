const DEFAULT_API_URL = "http://localhost:3001";

export function getApiUrl() {
  return (process.env.API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
}
