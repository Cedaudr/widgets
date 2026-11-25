const LOREM =
  "Figma ipsum component variant main layer. " +
  "Prototype pixel flows hand vertical. Layer blur pixel pencil content."

const DESCRIPTION =
  "Figma ipsum component variant main layer. " +
  "Prototype pixel flows hand vertical."

const KPIS = [
  { range: "Last week", label: "Current Tickets", icon: "Ticket", value: "3,484", delta: 7.1, data: [8, 12, 10, 18, 11, 16, 9, 14, 12, 15, 10] },
  { range: "Last week", label: "Daily Avg. Resolution", icon: "Zap", value: "486", delta: 2, data: [6, 8, 7, 12, 9, 14, 10, 15, 11, 9, 13] },
  { range: "Last week", label: "SLA Compliance Rate", icon: "Gauge", value: "92%", delta: -1.3, data: [10, 14, 9, 16, 11, 15, 12, 17, 10, 14, 12] },
  { range: "This week", label: "Current Tickets", icon: "Ticket", value: "1,902", delta: 3.4, data: [6, 9, 12, 10, 14, 11, 13, 9, 15, 12, 16] },
  { range: "This week", label: "Daily Avg. Resolution", icon: "Zap", value: "512", delta: 5.3, data: [7, 9, 8, 11, 13, 12, 15, 16, 13, 17] },
  { range: "This week", label: "SLA Compliance Rate", icon: "Gauge", value: "94%", delta: 2.1, data: [9, 11, 10, 13, 12, 14, 13, 15, 14, 16, 15] },
  { range: "Last month", label: "Current Tickets", icon: "Ticket", value: "14,208", delta: 11.4, data: [7, 9, 13, 11, 15, 12, 16, 14, 18, 15, 17, 19, 16, 18] },
  { range: "Last month", label: "Daily Avg. Resolution", icon: "Zap", value: "498", delta: 4.8, data: [8, 10, 9, 12, 11, 14, 13, 15, 14, 16, 15, 17, 16, 18] },
  { range: "Last month", label: "SLA Compliance Rate", icon: "Gauge", value: "91%", delta: -0.8, data: [12, 15, 11, 16, 13, 17, 14, 18, 15, 17, 16, 19, 17, 18] },
  { range: "This month", label: "Current Tickets", icon: "Ticket", value: "8,641", delta: 6.2, data: [9, 12, 11, 14, 13, 16, 15, 18, 17, 19, 18, 20, 19, 21] },
  { range: "This month", label: "Daily Avg. Resolution", icon: "Zap", value: "521", delta: 5.9, data: [10, 11, 13, 12, 15, 14, 16, 15, 18, 17, 19, 18, 20, 19] },
  { range: "This month", label: "SLA Compliance Rate", icon: "Gauge", value: "93%", delta: 1.6, data: [11, 13, 12, 15, 14, 16, 15, 17, 16, 18, 17, 19, 18, 20] },
]

const VOLUMES = {
  "Last week": { total: "4,790", totalDelta: 8, axis: [800, 600, 400, 200, 0], bars: [620, 680, 740, 590, 760, 700, 700] },
  "This week": { total: "2,615", totalDelta: -4, axis: [800, 600, 400, 200, 0], bars: [280, 340, 420, 390, 360, 470, 355] },
  "Last month": { total: "18,420", totalDelta: 11, axis: [6000, 4500, 3000, 1500, 0], bars: [4200, 4600, 4800, 4820] },
  "This month": { total: "12,860", totalDelta: 7, axis: [4000, 3000, 2000, 1000, 0], bars: [2800, 3100, 3400, 3560] },
}

const ACTIVITIES = [
  { id: 1, tab: "Today", type: "ticket_updated", icon: "Ticket", tone: "text-blue-500", title: "Ticket Updated", time: "11:20 AM", body: "Ticket <b>#2319</b> SLA updated", bodyText: "Ticket #2319 SLA updated" },
  { id: 2, tab: "Today", type: "client_added", icon: "UserCheck", tone: "text-emerald-500", title: "New Client Added", time: "11:15 AM", body: "PT. Alpha Indonesia registered", bodyText: "PT. Alpha Indonesia registered" },
  { id: 3, tab: "Today", type: "agent_reassigned", icon: "Repeat2", tone: "text-violet-500", title: "Agent Reassigned", time: "11:00 AM", body: "Ticket <b>#2322</b> moved to <b>Michael Wong</b>", bodyText: "Ticket #2322 moved to Michael Wong" },
  { id: 4, tab: "Today", type: "sla_breach_risk", icon: "TriangleAlert", tone: "text-red-500", title: "SLA Breach Risk", time: "10:45 AM", body: "Ticket <b>#2320</b> \"Login issue\"", bodyText: "Ticket #2320 \"Login issue\"" },
  { id: 5, tab: "Today", type: "knowledge_base", icon: "BookOpen", tone: "text-teal-500", title: "Knowledge Base", time: "10:30 AM", body: "New article published: \"<b>Login Troubleshooting</b>\"", bodyText: "New article published: \"Login Troubleshooting\"" },
  { id: 6, tab: "Today", type: "customer_feedback", icon: "Star", tone: "text-amber-500", title: "Customer Feedback", time: "10:30 AM", body: "<b>\"Great support response, thanks Sarah!\"</b>", bodyText: "\"Great support response, thanks Sarah!\"" },
  { id: 7, tab: "Today", type: "ticket_updated", icon: "Ticket", tone: "text-blue-500", title: "Ticket Updated", time: "09:50 AM", body: "Ticket <b>#2318</b> closed", bodyText: "Ticket #2318 closed" },
  { id: 8, tab: "Today", type: "client_added", icon: "UserCheck", tone: "text-emerald-500", title: "New Client Added", time: "09:10 AM", body: "Northwind Ltd. registered", bodyText: "Northwind Ltd. registered" },
  { id: 9, tab: "Yesterday", type: "sla_breach_risk", icon: "TriangleAlert", tone: "text-red-500", title: "SLA Breach Risk", time: "04:40 PM", body: "Ticket <b>#2315</b> \"Refund delay\"", bodyText: "Ticket #2315 \"Refund delay\"" },
  { id: 10, tab: "Yesterday", type: "customer_feedback", icon: "Star", tone: "text-amber-500", title: "Customer Feedback", time: "02:15 PM", body: "<b>\"Quick and friendly, 5 stars\"</b>", bodyText: "\"Quick and friendly, 5 stars\"" },
  { id: 11, tab: "Yesterday", type: "agent_reassigned", icon: "Repeat2", tone: "text-violet-500", title: "Agent Reassigned", time: "11:05 AM", body: "Ticket <b>#2311</b> moved to <b>Sarah Lee</b>", bodyText: "Ticket #2311 moved to Sarah Lee" },
  { id: 12, tab: "This week", type: "knowledge_base", icon: "BookOpen", tone: "text-teal-500", title: "Knowledge Base", time: "Mon", body: "Updated \"<b>Billing FAQ</b>\"", bodyText: "Updated \"Billing FAQ\"" },
  { id: 13, tab: "This week", type: "client_added", icon: "UserCheck", tone: "text-emerald-500", title: "New Client Added", time: "Mon", body: "Acme Corp registered", bodyText: "Acme Corp registered" },
]

const CLIENTS = [
  { name: "PT. Alpha Indonesia", industry: "Technology", status: "Active" },
  { name: "Northwind Ltd.", industry: "Retail", status: "Active" },
  { name: "Acme Corp", industry: "Manufacturing", status: "Active" },
]

const AGENTS = [
  { name: "John Doe", team: "Support Tier 1", role: "Support Agent", online: true },
  { name: "Sarah Lee", team: "Support Tier 1", role: "Support Agent", online: true },
  { name: "Michael Wong", team: "Escalations", role: "Senior Support Agent", online: true },
]

const TEAMS = [
  { name: "Support Tier 1", description: "First response and general support", members: 2 },
  { name: "Escalations", description: "Complex and SLA-at-risk tickets", members: 1 },
]

const ARTICLES = [
  { title: "Login Troubleshooting", status: "published", category: "Account", updated: "2025-08-20" },
  { title: "Billing FAQ", status: "published", category: "Billing", updated: "2025-08-17" },
  { title: "Exporting Reports", status: "draft", category: "Reports", updated: "2025-08-15" },
]

const FEEDBACK = [
  { quote: "Great support response, thanks Sarah!", rating: 5, source: "Customer Feedback" },
  { quote: "Quick and friendly, 5 stars", rating: 5, source: "Customer Feedback" },
]

const INTEGRATIONS = [
  { name: "Zendesk", category: "Support", connected: true },
  { name: "Slack", category: "Communication", connected: true },
  { name: "HubSpot", category: "CRM", connected: false },
]

const WIDGETS = [
  { slug: "activity", eyebrow: "Activity widget", title: "Daily Writing", description: "A focus timer with a progress ring. Start it, pause it, hit your daily goal.", path: "/activity", icon: "Timer", config: { label: "Activity", title: "Daily Writing", goalMinutes: 30, remainingMinutes: 10 } },
  { slug: "weather", eyebrow: "Weather widget", title: "Local forecast", description: "Current temperature with an hourly forecast strip. Tap a time slot to preview it.", path: "/weather", icon: "Cloud", config: { location: "Palo Alto", icon: "Cloud", forecast: [{ time: "Now", temp: 12 }, { time: "14:00", temp: 15 }, { time: "15:00", temp: 16 }, { time: "16:00", temp: 17 }] } },
  { slug: "feature", eyebrow: "Feature widget", title: "Feature showcase", description: "A sliding feature card. Use the pager dots to flip through slides.", path: "/feature", icon: "Flame", config: { icon: "Flame", defaultIndex: 1, interval: 4000, slides: Array.from({ length: 5 }, () => ({ title: "Figma ipsum component", description: LOREM })) } },
  { slug: "sales", eyebrow: "Sales widget", title: "Sales report", description: "Summary, monthly and yearly stats, plus a regional breakdown.", path: "/sales", icon: "ChartNoAxesCombined", config: { title: "Sales Report", summaryLabel: "Summary", summary: 22870, currency: "$", monthly: { value: 8097, change: "19.6%", secondary: "44.714 USD" }, yearly: { value: 312134, change: "2.6%", secondary: "301.002 USD" }, regions: [{ name: "Los Angeles", value: "201,192" }, { name: "New York", value: "192.054" }, { name: "Canada", value: "166.401" }] } },
  { slug: "insight", eyebrow: "Insight widget", title: "Performance insight", description: "A headline metric with trend indicator. Page through the insight slides.", path: "/insight", icon: "TrendingUp", config: { label: "Insight", location: "Palo Alto", defaultIndex: 1, interval: 4000, slides: [72, 89, 64, 91, 78].map((value) => ({ value, title: "Figma ipsum component", description: LOREM })) } },
  { slug: "stat", eyebrow: "Stat widget", title: "Key stat", description: "A single bold percentage with a vertical pager for more slides.", path: "/stat", icon: "Percent", config: { defaultIndex: 1, interval: 4000, slides: [72, 89, 64].map((value) => ({ value, title: "Figma ipsum component", description: DESCRIPTION })) } },
]

const ACTIVITY_STYLE = {
  ticket_updated: ["Ticket", "text-blue-500"],
  client_added: ["UserCheck", "text-emerald-500"],
  agent_reassigned: ["Repeat2", "text-violet-500"],
  sla_breach_risk: ["TriangleAlert", "text-red-500"],
  knowledge_base: ["BookOpen", "text-teal-500"],
  customer_feedback: ["Star", "text-amber-500"],
}

const state = {
  tickets: [
    { id: 2319, subject: "Payment failed on invoice", priority: "High", agent: "John Doe", status: "In Review", created: "2025-08-18", due: "2h left", dueH: 2 },
    { id: 2320, subject: "Login issue", priority: "Medium", agent: "Sarah Lee", status: "Delivered", created: "2025-08-19", due: "1h left", dueH: 1 },
    { id: 2321, subject: "Feature request export", priority: "Low", agent: "John Doe", status: "In Progress", created: "2025-08-19", due: "1d left", dueH: 24 },
    { id: 2322, subject: "Contract renewal issue", priority: "Medium", agent: "Michael Wong", status: "In Progress", created: "2025-08-20", due: "9h left", dueH: 9 },
  ],
  activities: ACTIVITIES.map((item) => ({ ...item })),
  nextTicketId: 2323,
  nextActivityId: 14,
  notifications: [
    { id: 1, title: "SLA breach risk", body: "Ticket #2320 \"Login issue\" is due in 1h", read: false, createdAt: "2025-08-20T09:30:00" },
    { id: 2, title: "New client", body: "PT. Alpha Indonesia registered", read: true, createdAt: "2025-08-20T09:15:00" },
  ],
  settings: { theme: "light", notificationsEnabled: true, language: "en", timezone: "UTC" },
  user: { name: "Samantha Walker", email: "samanwalker@gmail.com", avatarInitials: "SW", online: true, theme: "light", role: "Support Manager" },
}

const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)))

const items = (list) => ({ items: clone(list), total: list.length })

function monthName(date) {
  return date.toLocaleDateString("en-US", { month: "short" })
}

function weekLabels(range) {
  const today = new Date()
  const mondayOffset = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - mondayOffset)
  const start = new Date(monday)
  if (range === "Last week") start.setDate(start.getDate() - 7)

  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start)
    day.setDate(start.getDate() + index)
    return `${day.toLocaleDateString("en-US", { weekday: "short" })} ${day.getDate()} ${monthName(day)}`
  })
  return { days, highlightIndex: range === "This week" ? mondayOffset : null }
}

function monthLabels(range) {
  const today = new Date()
  const first = new Date(today.getFullYear(), today.getMonth() - (range === "Last month" ? 1 : 0), 1)
  const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const chunk = Math.floor(lastDay / 4)
  const starts = [1, chunk + 1, chunk * 2 + 1, chunk * 3 + 1]
  const ends = [chunk, chunk * 2, chunk * 3, lastDay]
  return starts.map((start, index) => `${start}–${ends[index]} ${monthName(first)}`)
}

function volumeFor(range) {
  const source = VOLUMES[range] ?? VOLUMES["This week"]
  const labels = range === "Last week" || range === "This week" ? weekLabels(range) : { days: monthLabels(range), highlightIndex: null }
  const days = labels.days
  return {
    range,
    total: source.total,
    totalDelta: source.totalDelta,
    days,
    axis: [...source.axis],
    bars: [...source.bars],
    series: source.bars.map((value, index) => ({ day: days[index] ?? "", value })),
    highlightIndex: labels.highlightIndex,
  }
}

const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 }
const SORT_KEYS = {
  id: (ticket) => ticket.id,
  subject: (ticket) => ticket.subject.toLowerCase(),
  priority: (ticket) => PRIORITY_RANK[ticket.priority] ?? 0,
  agent: (ticket) => ticket.agent.toLowerCase(),
  status: (ticket) => ticket.status.toLowerCase(),
  created: (ticket) => String(ticket.created),
  due: (ticket) => ticket.dueH,
}

function listTickets(params) {
  const query = (params.get("q") ?? "").replace(/^#/, "").toLowerCase()
  const priority = params.get("priority")
  const status = params.get("status")
  const sortBy = params.get("sort_by") ?? "id"
  const dir = Number(params.get("dir") ?? 1)
  const skip = Number(params.get("skip") ?? 0)
  const limit = Number(params.get("limit") ?? 50)

  const filtered = state.tickets.filter((ticket) => {
    if (priority && ticket.priority !== priority) return false
    if (status && ticket.status !== status) return false
    if (!query) return true
    return (
      String(ticket.id).includes(query) ||
      ticket.subject.toLowerCase().includes(query) ||
      ticket.agent.toLowerCase().includes(query)
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    const key = SORT_KEYS[sortBy] ?? SORT_KEYS.id
    const av = key(a)
    const bv = key(b)
    const result = av < bv ? -1 : av > bv ? 1 : 0
    return dir < 0 ? -result : result
  })
  return items(sorted.slice(skip, skip + limit))
}

function listActivities(params) {
  const tab = params.get("tab")
  const query = (params.get("q") ?? "").toLowerCase()
  const skip = Number(params.get("skip") ?? 0)
  const limit = Number(params.get("limit") ?? 100)

  const filtered = state.activities.filter(
    (activity) => (!tab || activity.tab === tab) && (!query || activity.title.toLowerCase().includes(query))
  )
    .sort((a, b) => b.id - a.id)
  return items(filtered.slice(skip, skip + limit))
}

export function fallbackResponse(path, { method = "GET", body } = {}) {
  const url = new URL(path, "http://fallback.local")
  const route = url.pathname
  const params = url.searchParams

  if (route === "/analytics/summary") {
    const range = params.get("range") ?? "This week"
    return clone({ range, kpis: KPIS.filter((kpi) => kpi.range === range), volume: volumeFor(range) })
  }
  if (route === "/analytics/sla-compliance") return clone({ rate: 92, target: 95, breaches: 3, trend: -1.3 })
  if (route === "/analytics/csat-nps") return clone({ csat: 4.6, nps: 62, responses: 128 })
  if (route === "/analytics/workload") return clone({ openTickets: 1902, avgResolutionMinutes: 512, agentsOnline: 3 })

  if (route === "/activities/tabs") return ["Today", "Yesterday", "This week"]
  if (route === "/activities" && method === "GET") return listActivities(params)
  if (route === "/activities" && method === "POST") {
    const [icon, tone] = ACTIVITY_STYLE[body?.type] ?? ["Activity", "text-blue-500"]
    const activity = {
      id: state.nextActivityId++,
      type: body?.type ?? "ticket_updated",
      tab: body?.tab ?? "Today",
      icon: body?.icon || icon,
      tone: body?.tone || tone,
      title: body?.title ?? "Update",
      time: body?.time ?? "Just now",
      body: body?.body ?? "",
      bodyText: body?.bodyText ?? body?.body ?? "",
    }
    state.activities.push(activity)
    return clone(activity)
  }
  const activityMatch = route.match(/^\/activities\/(\d+)$/)
  if (activityMatch && method === "DELETE") {
    const index = state.activities.findIndex((item) => item.id === Number(activityMatch[1]))
    if (index === -1) return undefined
    state.activities.splice(index, 1)
    return null
  }

  if (route === "/tickets/sla/breach-risk") return items(state.tickets.filter((ticket) => ticket.dueH <= 2))
  if (route === "/tickets" && method === "GET") return listTickets(params)
  if (route === "/tickets" && method === "POST") {
    const ticket = {
      id: state.nextTicketId++,
      subject: body?.subject ?? "New ticket",
      priority: body?.priority ?? "Low",
      agent: body?.agent ?? "Unassigned",
      status: body?.status ?? "In Review",
      created: body?.created ?? new Date().toISOString().slice(0, 10),
      due: body?.due ?? "—",
      dueH: Number(body?.dueH) || 0,
    }
    state.tickets.push(ticket)
    return clone(ticket)
  }

  const ticketMatch = route.match(/^\/tickets\/(\d+)$/)
  if (ticketMatch) {
    const id = Number(ticketMatch[1])
    const index = state.tickets.findIndex((ticket) => ticket.id === id)
    if (method === "PATCH") {
      if (index === -1) return undefined
      state.tickets[index] = { ...state.tickets[index], ...body }
      return clone(state.tickets[index])
    }
    if (method === "DELETE") {
      if (index === -1) return undefined
      state.tickets.splice(index, 1)
      return null
    }
    const ticket = state.tickets.find((item) => item.id === id)
    return ticket ? clone(ticket) : undefined
  }

  if (route === "/users/me") return clone(state.user)

  if (route === "/notifications" && method === "GET") {
    return items([...state.notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }
  const notificationMatch = route.match(/^\/notifications\/(\d+)\/read$/)
  if (notificationMatch && method === "PATCH") {
    const notification = state.notifications.find((item) => item.id === Number(notificationMatch[1]))
    if (!notification) return undefined
    notification.read = Boolean(body?.read)
    return clone(notification)
  }

  if (route === "/clients") return items(CLIENTS)
  if (route === "/agents") return items(AGENTS)
  if (route === "/teams") return items(TEAMS)
  if (route === "/articles") {
    const status = params.get("status")
    return items(status ? ARTICLES.filter((article) => article.status === status) : ARTICLES)
  }
  if (route === "/feedback") return items(FEEDBACK)
  if (route === "/integrations") return items(INTEGRATIONS)
  if (route === "/widgets") return items(WIDGETS)

  const widgetMatch = route.match(/^\/widgets\/([^/]+)$/)
  if (widgetMatch) {
    const widget = WIDGETS.find((item) => item.slug === widgetMatch[1])
    return widget ? clone(widget) : undefined
  }
  if (route === "/weather") return clone(WIDGETS[1].config)
  if (route === "/sales/report") return clone(WIDGETS[3].config)

  if (route === "/settings" && method === "GET") return clone(state.settings)
  if (route === "/settings" && method === "PATCH") {
    state.settings = { ...state.settings, ...body }
    return clone(state.settings)
  }

  return undefined
}
