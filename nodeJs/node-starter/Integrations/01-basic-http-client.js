class HttpError extends Error {
  constructor({ message, status, url, body }) {
    super(message);
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

// simple structured logger
function logRequest(url, status) {
  console.log(
    JSON.stringify({
      time: new Date().toISOString(),
      url,
      status,
    })
  );
}

export async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s global timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    // log URL + status for every request
    logRequest(url, response.status);

    let data;
    try {
      data = await response.json();
    } catch (err) {
      // JSON parse error
      throw new HttpError({
        message: "Invalid JSON response",
        status: response.status,
        url,
      });
    }

    // handle non-200 responses consistently
    if (!response.ok) {
      throw new HttpError({
        message: "HTTP request failed",
        status: response.status,
        url,
        body: data,
      });
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out after 5s");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

(async () => {
  try {
    const data = await fetchJson("https://api.github.com");
    console.log(data);
  } catch (err) {
    console.error(err);
  }
})();
