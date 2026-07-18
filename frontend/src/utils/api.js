/**
 * Centralized API client. Every backend call in the app goes through here so
 * base URL, error handling, and JSON parsing stay in one place.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // response had no JSON body — keep the default message
    }
    throw new ApiError(detail, response.status);
  }

  return response.json();
}

export const api = {
  health: () => request("/api/health"),

  sendChatMessage: (message, language, sessionId) =>
    request("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message, language, session_id: sessionId }),
    }),

  getCrowdSnapshot: () => request("/api/crowd/snapshot"),
  getCrowdRecommendations: () => request("/api/crowd/recommendations"),

  reportEmergency: (payload) =>
    request("/api/emergency/report", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getSustainabilitySnapshot: () => request("/api/sustainability/snapshot"),

  getAccessibleRoute: (start, destination) =>
    request("/api/accessibility/route", {
      method: "POST",
      body: JSON.stringify({ start, destination }),
    }),
};

export { ApiError };
