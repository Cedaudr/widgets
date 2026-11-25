const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "")

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

function withParams(path, params) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value))
  })
  const query = search.toString()
  return query ? `${path}?${query}` : path
}

async function request(path, { body, headers, signal, ...options } = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal,
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error?.name === "AbortError") throw error
    throw new ApiError("Cannot reach the API. Is the backend running?", 0)
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`
    try {
      const payload = await response.json()
      if (typeof payload.detail === "string") detail = payload.detail
      else if (Array.isArray(payload.detail)) {
        detail = payload.detail.map((item) => item.msg ?? String(item)).join(", ")
      }
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error
    }
    throw new ApiError(detail, response.status)
  }

  if (response.status === 204) return null
  return response.json()
}

export const api = {
  getSummary: (range, signal) => request(withParams("/analytics/summary", { range }), { signal }),
  getSlaCompliance: (signal) => request("/analytics/sla-compliance", { signal }),
  getCsatNps: (signal) => request("/analytics/csat-nps", { signal }),
  getWorkload: (signal) => request("/analytics/workload", { signal }),

  getActivityTabs: (signal) => request("/activities/tabs", { signal }),
  getActivities: ({ tab, q, skip = 0, limit = 100 } = {}, signal) =>
    request(withParams("/activities", { tab, q, skip, limit }), { signal }),

  getTickets: ({ q, priority, status, sortBy = "id", dir = 1, skip = 0, limit = 50 } = {}, signal) =>
    request(
      withParams("/tickets", { q, priority, status, sort_by: sortBy, dir, skip, limit }),
      { signal }
    ),
  getBreachRisks: (signal) => request("/tickets/sla/breach-risk", { signal }),
  getTicket: (id, signal) => request(`/tickets/${id}`, { signal }),
  updateTicket: (id, changes) => request(`/tickets/${id}`, { method: "PATCH", body: changes }),
  deleteTicket: (id) => request(`/tickets/${id}`, { method: "DELETE" }),

  getCurrentUser: (signal) => request("/users/me", { signal }),

  getNotifications: (signal) => request("/notifications", { signal }),
  setNotificationRead: (id, read) => request(`/notifications/${id}/read`, { method: "PATCH", body: { read } }),

  getClients: (signal) => request("/clients", { signal }),
  getAgents: (signal) => request("/agents", { signal }),
  getTeams: (signal) => request("/teams", { signal }),
  getArticles: (status, signal) => request(withParams("/articles", { status }), { signal }),
  getFeedback: (signal) => request("/feedback", { signal }),
  getIntegrations: (signal) => request("/integrations", { signal }),

  getSettings: (signal) => request("/settings", { signal }),
  updateSettings: (changes) => request("/settings", { method: "PATCH", body: changes }),
}
