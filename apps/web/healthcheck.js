const url = process.env.HEALTHCHECK_URL ?? "http://127.0.0.1:3000/";

async function main() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Unexpected status ${response.status}`);
    }
  } catch (error) {
    console.error("[healthcheck] failed", error);
    process.exit(1);
  } finally {
    clearTimeout(timeout);
  }
}

void main();
