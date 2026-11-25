import { useId, useState } from "react"
import {
  Activity,
  ArrowUpDown,
  Bell,
  BookOpen,
  CalendarDays,
  ChartColumn,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Clock,
  EllipsisVertical,
  FileChartColumn,
  FileText,
  Gauge,
  Headset,
  LayoutGrid,
  ListFilter,
  Menu,
  MessageSquare,
  PanelLeft,
  Pencil,
  Plug,
  Plus,
  Repeat2,
  Search,
  Settings,
  ShieldCheck,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Star,
  Ticket,
  TriangleAlert,
  UserCheck,
  Users,
  X,
  Zap,
  Download,
  Eye,
  RefreshCw,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useApiResource } from "@/hooks/use-api-resource"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

const RANGE_OPTIONS = ["This week", "Last week", "Last month", "This month"]
const ACTIVITY_TAB_FALLBACK = ["Today", "Yesterday", "This week"]

const ICONS = {
  Activity,
  Ticket,
  Zap,
  Gauge,
  UserCheck,
  Repeat2,
  TriangleAlert,
  BookOpen,
  Star,
  Clock,
  Check,
  FileText,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Headset,
  LayoutGrid,
}

const PRIORITY = {
  High: { icon: SignalHigh, tone: "text-red-500" },
  Medium: { icon: SignalMedium, tone: "text-orange-500" },
  Low: { icon: SignalLow, tone: "text-amber-400" },
}
const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 }

const STATUS = {
  "In Review": { icon: FileText, tone: "text-blue-500" },
  Delivered: { icon: Check, tone: "text-emerald-500" },
  "In Progress": { icon: Clock, tone: "text-amber-500" },
}

const ACTIVITY_TYPES = [
  "ticket_updated",
  "client_added",
  "agent_reassigned",
  "sla_breach_risk",
  "knowledge_base",
  "customer_feedback",
]

const COLUMNS = [
  { key: "id", label: "Ticket ID", sortKey: "id" },
  { key: "subject", label: "Subject", sortKey: "subject" },
  { key: "priority", label: "Priority", sortKey: "priority" },
  { key: "agent", label: "Assigned To", sortKey: "agent" },
  { key: "status", label: "Status", sortKey: "status" },
  { key: "created", label: "Created Date", sortKey: "created" },
  { key: "due", label: "SLA Due", sortKey: "due" },
]

const NAV = [
  {
    heading: "Main Navigation",
    items: [
      { label: "Overview", icon: LayoutGrid, view: "overview" },
      {
        label: "Tickets",
        icon: Ticket,
        view: "tickets",
        children: [
          { label: "All / My Queue", view: "tickets" },
          { label: "SLA Breach Risk", view: "breach-risk" },
          { label: "Escalations", view: "escalations" },
        ],
      },
      { label: "Clients", icon: UserCheck, view: "clients" },
      {
        label: "Agents & Teams",
        icon: Users,
        view: "agents",
        children: [
          { label: "Agents", view: "agents" },
          { label: "Teams", view: "teams" },
        ],
      },
      {
        label: "Knowledge Base",
        icon: BookOpen,
        view: "articles",
        children: [
          { label: "Articles", view: "articles" },
          { label: "Drafts", view: "drafts" },
        ],
      },
      { label: "Integrations", icon: Plug, view: "integrations" },
    ],
  },
  {
    heading: "Analytics & Insights",
    items: [
      { label: "SLA Compliance", icon: ShieldCheck, view: "sla" },
      { label: "CSAT & NPS", icon: Star, view: "csat" },
      { label: "Workload Analytics", icon: ChartColumn, view: "workload" },
      { label: "Reports", icon: FileChartColumn, view: "reports" },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Feedback", icon: MessageSquare, view: "feedback" },
      { label: "Help & Support", icon: Headset, view: "help" },
      { label: "Settings", icon: Settings, view: "settings" },
    ],
  },
]

const hatch = {
  backgroundImage:
    "repeating-linear-gradient(135deg, color-mix(in oklch, var(--foreground) 5%, transparent) 0 1px, transparent 1px 7px)",
}

function iconFor(name) {
  return ICONS[name] ?? LayoutGrid
}

function timeInMinutes(time) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time ?? "")
  if (!match) return null
  const hours = Number(match[1]) % 12 + (match[3].toUpperCase() === "PM" ? 12 : 0)
  return hours * 60 + Number(match[2])
}

function compareActivities(a, b) {
  const aMinutes = timeInMinutes(a.time)
  const bMinutes = timeInMinutes(b.time)
  if (aMinutes !== null && bMinutes !== null && aMinutes !== bMinutes) return bMinutes - aMinutes
  return (a.id ?? 0) - (b.id ?? 0)
}

function compareTickets(a, b, sort) {
  const direction = sort.dir > 0 ? 1 : -1
  if (sort.key === "id") return ((a.id ?? 0) - (b.id ?? 0)) * direction
  if (sort.key === "due") return ((a.dueH ?? 0) - (b.dueH ?? 0)) * direction
  if (sort.key === "priority") {
    return ((PRIORITY_RANK[a.priority] ?? 0) - (PRIORITY_RANK[b.priority] ?? 0)) * direction
  }
  return String(a[sort.key] ?? "").localeCompare(String(b[sort.key] ?? ""), undefined, { sensitivity: "base" }) * direction
}

function RichText({ value }) {
  const text = value == null ? "" : String(value)
  return text.split(/(<b>.*?<\/b>)/g).map((part, index) => {
    const bold = /^<b>(.*?)<\/b>$/.exec(part)
    return bold ? <b key={index}>{bold[1]}</b> : <span key={index}>{part}</span>
  })
}

function Panel({ title, icon: Icon, action, className, bodyClassName, children }) {
  return (
    <section className={cn("flex flex-col rounded-2xl border bg-muted/60 p-1.5 dark:bg-muted/30", className)}>
      <header style={hatch} className="flex min-h-10 items-center gap-2 rounded-t-xl px-2.5 py-1.5">
        <h2 className="text-sm font-medium">{title}</h2>
        <div className="ml-auto flex items-center gap-2 text-muted-foreground">
          {action}
          {Icon && <Icon className="size-4" aria-hidden />}
        </div>
      </header>
      <div className={cn("flex-1 rounded-xl border bg-card shadow-xs", bodyClassName)}>{children}</div>
    </section>
  )
}

function RangeSelect({ value, onChange }) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Date range</span>
      <CalendarDays className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 appearance-none rounded-lg border bg-card pr-7 pl-8 text-xs font-medium text-foreground shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {RANGE_OPTIONS.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 size-3 text-muted-foreground" />
    </label>
  )
}

function IconButton({ label, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function Dropdown({ children, onClose, className, placement = "bottom" }) {
  const position = placement === "top" ? "right-0 bottom-full mb-2" : "top-full right-0 mt-2"
  return (
    <>
      <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Close menu" onClick={onClose} />
      <div className={cn("absolute z-50 w-60 rounded-xl border bg-card p-2 shadow-lg", position, className)}>
        {children}
      </div>
    </>
  )
}

function MenuItem({ icon: Icon, children, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-muted",
        danger ? "text-red-600" : "text-foreground"
      )}
    >
      {Icon && <Icon className="size-3.5" />}
      {children}
    </button>
  )
}

function PanelMessage({ loading, error, onRetry, empty, label }) {
  if (loading) {
    return <div className="flex min-h-28 items-center justify-center text-sm text-muted-foreground">Loading {label}…</div>
  }

  if (error || empty) {
    return (
      <div className="flex min-h-28 flex-col items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground">
        {error ? <TriangleAlert className="size-4 text-red-500" /> : null}
        <span>{error?.message ?? `No ${label} available.`}</span>
        {error && onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-xs hover:bg-muted"
          >
            Retry
          </button>
        ) : null}
      </div>
    )
  }

  return null
}

function Delta({ value }) {
  const amount = Number(value) || 0
  return (
    <span className={cn("font-medium", amount < 0 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400")}>
      {amount > 0 ? "+" : ""}
      {amount}%
    </span>
  )
}

function Sparkline({ data, negative }) {
  const id = useId()
  const w = 80
  const h = 36
  const values = data?.length ? data : [0, 0]
  const max = Math.max(...values)
  const min = Math.min(...values)
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 2 - ((v - min) / (max - min || 1)) * (h - 6)])
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("")
  const color = negative ? "var(--color-red-500)" : "var(--color-emerald-500)"
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-20 shrink-0" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.3" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line}L${w},${h}L0,${h}Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function KpiCard({ label, icon, value, delta, data }) {
  return (
    <Panel title={label} icon={iconFor(icon)} className="flex-1" bodyClassName="flex items-end justify-between gap-3 p-4">
      <div>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          <Delta value={delta} /> vs last week
        </p>
      </div>
      <Sparkline data={data} negative={Number(delta) < 0} />
    </Panel>
  )
}

export function VolumeChart({ range, onRangeChange, data, loading, error, onRetry }) {
  const [active, setActive] = useState(null)
  const volume = data?.volume
  const bars = volume?.bars ?? []
  const days = volume?.days ?? []
  const axis = volume?.axis ?? []
  const highlightIndex =
    Number.isInteger(volume?.highlightIndex) &&
    volume.highlightIndex >= 0 &&
    volume.highlightIndex < bars.length
      ? volume.highlightIndex
      : null
  const preferred = active ?? highlightIndex ?? 3
  const activeIndex = bars.length ? Math.min(preferred, bars.length - 1) : 0
  const value = bars[activeIndex] ?? 0
  const chartMax = axis[0] || Math.max(...bars, 1)
  const hasBars = bars.length > 0

  return (
    <Panel
      title="Ticket Volume Trend"
      action={<RangeSelect value={range} onChange={onRangeChange} />}
      bodyClassName="p-4"
    >
      {hasBars ? (
        <>
          <p className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight tabular-nums">{volume?.total ?? "—"}</span>
            <span className="text-xs text-muted-foreground">
              <Delta value={volume?.totalDelta} /> vs last week
            </span>
          </p>

          <div className="mt-6 flex gap-3">
            <div className="relative h-56 flex-1">
              {value > 0 && (
                <div
                  className="pointer-events-none absolute inset-x-0 z-10 border-t border-dashed border-foreground/40 transition-all"
                  style={{ bottom: `${(value / chartMax) * 100}%` }}
                >
                  <span
                    className="absolute -translate-x-full -translate-y-1/2 rounded-md bg-foreground px-2 py-1 text-[11px] font-medium whitespace-nowrap text-background"
                    style={{ left: `max(calc(${(activeIndex / bars.length) * 100}% - 6px), 4.5rem)` }}
                  >
                    {days[activeIndex] ?? ""}
                    {activeIndex === highlightIndex ? " (Today)" : ""} : {value}
                  </span>
                </div>
              )}
              <div className="flex h-full items-end gap-1.5 sm:gap-2.5" onMouseLeave={() => setActive(null)}>
                {bars.map((bar, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`${days[index] ?? ""}${index === highlightIndex ? " (Today)" : ""}: ${bar} tickets`}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    style={{ height: `${(bar / chartMax) * 100}%` }}
                    className={cn(
                      "flex-1 rounded-t-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      index === highlightIndex
                        ? "bg-linear-to-b from-sky-500 to-sky-700 ring-2 ring-sky-500/60 ring-offset-1 dark:from-sky-400 dark:to-sky-600"
                        : index === activeIndex
                          ? "bg-linear-to-b from-slate-600 to-slate-900 dark:from-slate-200 dark:to-slate-400"
                          : "bg-linear-to-b from-foreground/10 to-foreground/3"
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="flex h-56 flex-col justify-between text-right text-xs text-muted-foreground tabular-nums">
              {axis.map((tick) => (
                <span key={tick} className="leading-none">
                  {tick}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2 flex pr-9 text-xs text-muted-foreground">
            {days.map((day, index) => (
              <span
                key={`${day}-${index}`}
                title={index === highlightIndex ? "Today" : undefined}
                className={cn(
                  "flex-1 text-center",
                  index === highlightIndex && "font-semibold text-sky-600 dark:text-sky-400"
                )}
              >
                {day}
              </span>
            ))}
          </div>
        </>
      ) : (
        <PanelMessage
          loading={loading}
          error={error}
          onRetry={onRetry}
          empty={!loading && !error}
          label="chart data"
        />
      )}
    </Panel>
  )
}

export function KpiCards({ data, loading, error, onRetry }) {
  const kpis = data?.kpis ?? []

  if (!kpis.length) {
    return (
      <Panel title="Key metrics" className="flex-1">
        <PanelMessage
          loading={loading}
          error={error}
          onRetry={onRetry}
          empty={!loading && !error}
          label="metrics"
        />
      </Panel>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {kpis.map((kpi) => (
        <KpiCard key={`${kpi.label}-${data?.range}`} {...kpi} />
      ))}
    </div>
  )
}

export function LatestUpdates({ className }) {
  const [tab, setTab] = useState("Today")
  const [query, setQuery] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState(null)
  const debouncedQuery = useDebouncedValue(query)

  const tabsResource = useApiResource((signal) => api.getActivityTabs(signal), "activity-tabs", {
    initialData: ACTIVITY_TAB_FALLBACK,
  })
  const activities = useApiResource(
    (signal) => api.getActivities({ tab, q: debouncedQuery }, signal),
    `${tab}|${debouncedQuery}`
  )

  const saveActivity = async (payload) => {
    setBusy(true)
    setActionError(null)
    try {
      await api.createActivity(payload)
      activities.reload()
    } catch (error) {
      setActionError(error.message)
      throw error
    } finally {
      setBusy(false)
    }
  }

  const removeActivity = async (item) => {
    if (!window.confirm(`Delete update "${item.title}"?`)) return
    setBusy(true)
    setActionError(null)
    try {
      await api.deleteActivity(item.id)
      activities.reload()
    } catch (error) {
      setActionError(error.message)
    } finally {
      setBusy(false)
    }
  }

  const items = [...(activities.data?.items ?? [])].sort(compareActivities)
  const tabs = tabsResource.data?.length ? tabsResource.data : ACTIVITY_TAB_FALLBACK
  const total = activities.data?.total ?? items.length

  return (
    <Panel
      title="Latest Updates"
      icon={FileChartColumn}
      className={className}
      bodyClassName="flex flex-col p-3"
      action={
        <button
          type="button"
          disabled={busy}
          onClick={() => setFormOpen(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-card px-2.5 text-xs font-medium shadow-xs hover:bg-muted disabled:opacity-60"
        >
          <Plus className="size-3.5" /> Add update
        </button>
      }
    >
      {actionError && (
        <p role="alert" className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-600">
          {actionError}
        </p>
      )}
      <div role="tablist" className="grid grid-cols-3 gap-2">
        {tabs.map((option) => (
          <button
            key={option}
            role="tab"
            aria-selected={tab === option}
            onClick={() => setTab(option)}
            className={cn(
              "h-8 rounded-lg border text-xs font-medium transition-colors",
              tab === option ? "border-transparent bg-foreground text-background" : "hover:bg-foreground/5"
            )}
          >
            {option}
          </button>
        ))}
      </div>
      <label className="relative mt-3 block">
        <span className="sr-only">Search activities</span>
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search activities"
          className="h-8 w-full rounded-lg border bg-transparent pr-3 pl-8 text-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </label>
      <p className="mt-3 border-b border-dashed pb-3 text-xs text-muted-foreground">
        <span className="text-base font-semibold text-foreground">{total}</span> new activities{" "}
        {tab === "This week" ? "this week" : tab.toLowerCase()}
      </p>

      {activities.loading && !items.length ? <PanelMessage loading label="activities" /> : null}
      {activities.error && !items.length ? (
        <PanelMessage error={activities.error} onRetry={activities.reload} label="activities" />
      ) : null}

      <ol className="relative mt-3 flex-1 space-y-4 overflow-y-auto xl:max-h-110">
        {items.map((item, index) => {
          const Icon = iconFor(item.icon)
          return (
            <li key={item.id ?? index} className="group relative flex gap-3">
              {index < items.length - 1 && (
                <span className="absolute top-8 -bottom-4 left-3.75 border-l border-dashed" aria-hidden />
              )}
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border bg-card shadow-xs">
                <Icon className={cn("size-4", item.tone)} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline justify-between gap-2 text-xs font-medium">
                  {item.title}
                  <span className="flex shrink-0 items-center gap-1 font-normal text-muted-foreground">
                    {item.time}
                    {item.id && (
                      <IconButton
                        label={`Delete update ${item.title}`}
                        disabled={busy}
                        onClick={() => removeActivity(item)}
                        className="size-6 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-60"
                      >
                        <X className="size-3.5" />
                      </IconButton>
                    )}
                  </span>
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground [&_b]:font-medium [&_b]:text-foreground">
                  <RichText value={item.body ?? item.bodyText} />
                </p>
              </div>
            </li>
          )
        })}
        {!items.length && !activities.loading && !activities.error && (
          <li className="py-6 text-center text-xs text-muted-foreground">No matching activity.</li>
        )}
      </ol>
      {formOpen && (
        <ActivityForm onClose={() => setFormOpen(false)} onSave={saveActivity} />
      )}
    </Panel>
  )
}

function Avatar({ name, initials, className }) {
  const value = initials ?? name?.split(" ").map((part) => part[0]).join("") ?? "?"
  return (
    <span
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br from-slate-300 to-slate-500 text-[10px] font-semibold text-white dark:from-slate-500 dark:to-slate-700",
        className
      )}
      aria-hidden
    >
      {value}
    </span>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <IconButton label="Close dialog" onClick={onClose}>
            <X className="size-4" />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  )
}

function TicketForm({ ticket, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    subject: ticket?.subject ?? "",
    priority: ticket?.priority ?? "Medium",
    agent: ticket?.agent ?? "",
    status: ticket?.status ?? "In Review",
    created: ticket?.created ?? new Date().toISOString().slice(0, 10),
    due: ticket?.due ?? "",
    dueH: ticket?.dueH ?? 1,
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const field = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const dueH = Number(form.dueH) || 0
    try {
      await onSave({ ...form, dueH, due: form.due.trim() || `${dueH}h left` })
      onClose()
    } catch (caught) {
      setError(caught.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={ticket ? `Edit ticket #${ticket.id}` : "New ticket"} onClose={onClose}>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Subject</span>
          <input
            required
            autoFocus
            value={form.subject}
            onChange={(event) => field("subject", event.target.value)}
            className="h-9 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Priority</span>
            <select
              value={form.priority}
              onChange={(event) => field("priority", event.target.value)}
              className="h-9 w-full rounded-lg border bg-background px-2 text-sm"
            >
              {Object.keys(PRIORITY).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Status</span>
            <select
              value={form.status}
              onChange={(event) => field("status", event.target.value)}
              className="h-9 w-full rounded-lg border bg-background px-2 text-sm"
            >
              {Object.keys(STATUS).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Assigned to</span>
          <input
            required
            value={form.agent}
            onChange={(event) => field("agent", event.target.value)}
            className="h-9 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Created</span>
            <input
              type="date"
              required
              value={form.created}
              onChange={(event) => field("created", event.target.value)}
              className="h-9 w-full rounded-lg border bg-background px-2 text-sm"
            />
          </label>
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">SLA hours</span>
            <input
              type="number"
              min="0"
              required
              value={form.dueH}
              onChange={(event) => field("dueH", event.target.value)}
              className="h-9 w-full rounded-lg border bg-background px-2 text-sm"
            />
          </label>
        </div>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">SLA due label (optional)</span>
          <input
            value={form.due}
            onChange={(event) => field("due", event.target.value)}
            placeholder={`${Number(form.dueH) || 0}h left`}
            className="h-9 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </label>
        {error && <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-muted">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background disabled:opacity-60"
          >
            {saving ? "Saving…" : ticket ? "Save changes" : "Create ticket"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ActivityForm({ onClose, onSave }) {
  const [form, setForm] = useState({ type: ACTIVITY_TYPES[0], tab: "Today", title: "", time: "Just now", body: "" })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const field = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave({ ...form, bodyText: form.body })
      onClose()
    } catch (caught) {
      setError(caught.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="New update" onClose={onClose}>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Title</span>
          <input
            required
            autoFocus
            value={form.title}
            onChange={(event) => field("title", event.target.value)}
            className="h-9 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Type</span>
            <select
              value={form.type}
              onChange={(event) => field("type", event.target.value)}
              className="h-9 w-full rounded-lg border bg-background px-2 text-sm"
            >
              {ACTIVITY_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Tab</span>
            <select
              value={form.tab}
              onChange={(event) => field("tab", event.target.value)}
              className="h-9 w-full rounded-lg border bg-background px-2 text-sm"
            >
              {["Today", "Yesterday", "This week"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Time</span>
          <input
            required
            value={form.time}
            onChange={(event) => field("time", event.target.value)}
            className="h-9 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Message</span>
          <textarea
            required
            rows={3}
            value={form.body}
            onChange={(event) => field("body", event.target.value)}
            className="w-full rounded-lg border bg-background px-2.5 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </label>
        {error && <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-muted">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add update"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function TicketDetail({ ticket, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Ticket #{ticket.id}</p>
            <h3 className="mt-0.5 text-lg font-semibold">{ticket.subject}</h3>
          </div>
          <IconButton label="Close ticket details" onClick={onClose}>
            <X className="size-4" />
          </IconButton>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {[
            ["Priority", ticket.priority],
            ["Status", ticket.status],
            ["Assigned to", ticket.agent],
            ["Created", ticket.created],
            ["SLA due", ticket.due],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export function SlaTable({ title = "SLA Monitoring", mode = "all", fixedPriority, onChanged }) {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query)
  const [sort, setSort] = useState({ key: "id", dir: 1 })
  const [filters, setFilters] = useState({ priority: fixedPriority ?? "", status: "" })
  const [selected, setSelected] = useState(() => new Set())
  const [filterOpen, setFilterOpen] = useState(false)
  const [tableMenuOpen, setTableMenuOpen] = useState(false)
  const [actionMenuId, setActionMenuId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formTicket, setFormTicket] = useState(null)

  const tickets = useApiResource(
    (signal) =>
      mode === "breach"
        ? api.getBreachRisks(signal)
        : api.getTickets({ q: debouncedQuery, ...filters, sortBy: sort.key, dir: sort.dir }, signal),
    `${mode}|${debouncedQuery}|${sort.key}|${sort.dir}|${filters.priority}|${filters.status}`
  )

  const sourceRows = tickets.data?.items ?? []
  const rows =
    mode === "breach"
      ? [...sourceRows]
          .filter((ticket) => {
            const needle = debouncedQuery.trim().toLowerCase().replace(/^#/, "")
            return (
              !needle ||
              String(ticket.id).includes(needle) ||
              ticket.subject.toLowerCase().includes(needle) ||
              ticket.agent.toLowerCase().includes(needle)
            )
          })
          .sort((a, b) => compareTickets(a, b, sort))
      : sourceRows
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id))
  const activeFilters = Object.values(filters).filter(Boolean).length

  const toggle = (id) =>
    setSelected((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })

  const exportCsv = () => {
    setTableMenuOpen(false)
    const headers = ["id", "subject", "priority", "agent", "status", "created", "due"]
    const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`
    const csv = [headers.join(","), ...rows.map((row) => headers.map((key) => escape(row[key])).join(","))].join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `tickets-${mode}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const mutate = async (run) => {
    setBusy(true)
    setActionError(null)
    try {
      await run()
      tickets.reload()
      onChanged?.()
    } catch (error) {
      setActionError(error.message)
    } finally {
      setBusy(false)
    }
  }

  const saveTicket = async (ticket, payload) => {
    setBusy(true)
    setActionError(null)
    try {
      if (ticket) await api.updateTicket(ticket.id, payload)
      else await api.createTicket(payload)
      tickets.reload()
      onChanged?.()
    } catch (error) {
      setActionError(error.message)
      throw error
    } finally {
      setBusy(false)
    }
  }

  const setDelivered = (ids) =>
    mutate(async () => {
      await Promise.all(ids.map((id) => api.updateTicket(id, { status: "Delivered" })))
      setSelected(new Set())
    })

  const removeTickets = (ids) => {
    setActionMenuId(null)
    if (!window.confirm(`Delete ${ids.length} ticket${ids.length > 1 ? "s" : ""}?`)) return
    mutate(async () => {
      await Promise.all(ids.map((id) => api.deleteTicket(id)))
      setSelected(new Set())
    })
  }

  return (
    <Panel
      title={title}
      action={
        <>
          {mode === "all" && (
            <button
              type="button"
              onClick={() => {
                setFormTicket(null)
                setFormOpen(true)
              }}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-foreground px-2.5 text-xs font-medium text-background hover:opacity-90"
            >
              <Plus className="size-3.5" /> <span className="hidden sm:inline">New ticket</span>
            </button>
          )}
          <label className="relative hidden sm:block">
            <span className="sr-only">Search tickets</span>
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ticket"
              className="h-8 w-44 rounded-lg border bg-card pr-3 pl-8 text-xs text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 md:w-56"
            />
          </label>
          {mode === "all" && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-card px-2.5 text-xs font-medium text-foreground shadow-xs hover:bg-muted"
              >
                <ListFilter className="size-3.5" /> Filter{activeFilters ? ` (${activeFilters})` : ""}
              </button>
              {filterOpen && (
                <Dropdown onClose={() => setFilterOpen(false)}>
                  <label className="block px-2.5 py-1.5 text-xs">
                    <span className="mb-1 block text-muted-foreground">Priority</span>
                    <select
                      value={filters.priority}
                      onChange={(event) => setFilters({ ...filters, priority: event.target.value })}
                      className="h-8 w-full rounded-lg border bg-background px-2 text-xs"
                    >
                      <option value="">All</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </label>
                  <label className="block px-2.5 py-1.5 text-xs">
                    <span className="mb-1 block text-muted-foreground">Status</span>
                    <select
                      value={filters.status}
                      onChange={(event) => setFilters({ ...filters, status: event.target.value })}
                      className="h-8 w-full rounded-lg border bg-background px-2 text-xs"
                    >
                      <option value="">All</option>
                      <option value="In Review">In Review</option>
                      <option value="Delivered">Delivered</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                  </label>
                  <MenuItem
                    icon={X}
                    onClick={() => {
                      setFilters({ priority: fixedPriority ?? "", status: "" })
                      setFilterOpen(false)
                    }}
                  >
                    Clear filters
                  </MenuItem>
                </Dropdown>
              )}
            </div>
          )}
          <div className="relative">
            <IconButton label="More options" onClick={() => setTableMenuOpen(!tableMenuOpen)} className="border bg-card shadow-xs">
              <EllipsisVertical className="size-4" />
            </IconButton>
            {tableMenuOpen && (
              <Dropdown onClose={() => setTableMenuOpen(false)}>
                <MenuItem
                  icon={RefreshCw}
                  onClick={() => {
                    tickets.reload()
                    setTableMenuOpen(false)
                  }}
                >
                  Refresh tickets
                </MenuItem>
                <MenuItem icon={Download} onClick={exportCsv}>
                  Export CSV
                </MenuItem>
              </Dropdown>
            )}
          </div>
        </>
      }
      bodyClassName="overflow-x-auto"
    >
      {actionError && (
        <p role="alert" className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-600">
          {actionError}
        </p>
      )}
      {selected.size > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs">
          <span className="font-medium">{selected.size} selected</span>
          <button type="button" onClick={() => setDelivered([...selected])} disabled={busy} className="rounded-md border bg-card px-2 py-1 hover:bg-muted disabled:opacity-60">
            Mark delivered
          </button>
          <button type="button" onClick={() => removeTickets([...selected])} disabled={busy} className="rounded-md border px-2 py-1 text-red-600 hover:bg-red-500/10 disabled:opacity-60">
            Delete
          </button>
          <button type="button" onClick={() => setSelected(new Set())} className="ml-auto text-muted-foreground hover:text-foreground">
            Clear
          </button>
        </div>
      )}
      <table className="w-full min-w-190 text-left text-xs">
        <thead className="text-muted-foreground">
          <tr className="border-b bg-muted/50">
            <th className="w-10 py-2.5 pl-3">
              <input
                type="checkbox"
                aria-label="Select all tickets"
                checked={allSelected}
                onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.id)))}
                className="size-3.5 accent-foreground"
              />
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                className="px-3 py-2.5 font-medium"
                aria-sort={sort.key === column.sortKey ? (sort.dir > 0 ? "ascending" : "descending") : "none"}
              >
                <button
                  type="button"
                  onClick={() =>
                    setSort((current) => ({
                      key: column.sortKey,
                      dir: current.key === column.sortKey ? -current.dir : 1,
                    }))
                  }
                  className="inline-flex items-center gap-1.5 hover:text-foreground"
                >
                  {column.label}
                  <ArrowUpDown className={cn("size-3", sort.key === column.sortKey && "text-foreground")} />
                </button>
              </th>
            ))}
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {rows.map((ticket) => {
            const priority = PRIORITY[ticket.priority] ?? { icon: Ticket, tone: "text-muted-foreground" }
            const status = STATUS[ticket.status] ?? { icon: Clock, tone: "text-muted-foreground" }
            return (
              <tr key={ticket.id} className="border-b last:border-0 hover:bg-muted/40">
                <td className="py-3 pl-3">
                  <input
                    type="checkbox"
                    aria-label={`Select ticket ${ticket.id}`}
                    checked={selected.has(ticket.id)}
                    onChange={() => toggle(ticket.id)}
                    className="size-3.5 accent-foreground"
                  />
                </td>
                <td className="px-3 py-3 font-medium">#{ticket.id}</td>
                <td className="px-3 py-3">{ticket.subject}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <priority.icon className={cn("size-3.5", priority.tone)} /> {ticket.priority}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-2">
                    <Avatar name={ticket.agent} /> {ticket.agent}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <status.icon className={cn("size-3.5", status.tone)} /> {ticket.status}
                  </span>
                </td>
                <td className="px-3 py-3 tabular-nums">{ticket.created}</td>
                <td className={cn("px-3 py-3", ticket.dueH <= 2 && "font-medium text-red-500")}>{ticket.due}</td>
                <td className="pr-2">
                  <div className="relative">
                    <IconButton
                      label={`Actions for ticket ${ticket.id}`}
                      onClick={() => setActionMenuId(actionMenuId === ticket.id ? null : ticket.id)}
                    >
                      <EllipsisVertical className="size-4" />
                    </IconButton>
                    {actionMenuId === ticket.id && (
                      <Dropdown onClose={() => setActionMenuId(null)}>
                        <MenuItem
                          icon={Eye}
                          onClick={() => {
                            setDetail(ticket)
                            setActionMenuId(null)
                          }}
                        >
                          View details
                        </MenuItem>
                        <MenuItem
                          icon={Pencil}
                          onClick={() => {
                            setFormTicket(ticket)
                            setFormOpen(true)
                            setActionMenuId(null)
                          }}
                        >
                          Edit ticket
                        </MenuItem>
                        <MenuItem
                          icon={Check}
                          onClick={() => {
                            setActionMenuId(null)
                            setDelivered([ticket.id])
                          }}
                        >
                          Mark delivered
                        </MenuItem>
                        <MenuItem icon={X} danger onClick={() => removeTickets([ticket.id])}>
                          Delete ticket
                        </MenuItem>
                      </Dropdown>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
          {tickets.loading && !rows.length && (
            <tr>
              <td colSpan={COLUMNS.length + 2}>
                <PanelMessage loading label="tickets" />
              </td>
            </tr>
          )}
          {tickets.error && !rows.length && (
            <tr>
              <td colSpan={COLUMNS.length + 2}>
                <PanelMessage error={tickets.error} onRetry={tickets.reload} label="tickets" />
              </td>
            </tr>
          )}
          {!rows.length && !tickets.loading && !tickets.error && (
            <tr>
              <td colSpan={COLUMNS.length + 2} className="py-8 text-center text-muted-foreground">
                No tickets match "{debouncedQuery}".
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {detail && <TicketDetail ticket={detail} onClose={() => setDetail(null)} />}
      {formOpen && (
        <TicketForm
          ticket={formTicket}
          onClose={() => setFormOpen(false)}
          onSave={(payload) => saveTicket(formTicket, payload)}
        />
      )}
    </Panel>
  )
}

function NavItem({ label, icon: Icon, active, view, children, onViewChange }) {
  const [open, setOpen] = useState(Boolean(children?.some((child) => child.view === active)))
  const base =
    "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors hover:bg-foreground/5 hover:text-foreground"
  const isActive = active === view || children?.some((child) => child.view === active)

  if (!children) {
    return (
      <button
        type="button"
        aria-current={isActive ? "page" : undefined}
        onClick={() => onViewChange(view)}
        className={cn(base, isActive ? "border bg-card font-medium text-foreground shadow-xs" : "text-muted-foreground")}
      >
        <Icon className="size-4" /> {label}
      </button>
    )
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen(!open)
          onViewChange(view)
        }}
        className={cn(base, isActive ? "border bg-card font-medium text-foreground shadow-xs" : "text-muted-foreground")}
      >
        <Icon className="size-4" /> {label}
        <ChevronDown className={cn("ml-auto size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="mt-1 ml-4.25 space-y-0.5 border-l pl-3">
          {children.map((child) => (
            <li key={child.view + child.label}>
              <button
                type="button"
                onClick={() => onViewChange(child.view)}
                className={cn(
                  "block w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-foreground/5 hover:text-foreground",
                  active === child.view ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {child.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Sidebar({ open, onClose, searchRef, user, view, onViewChange, search, onSearchChange }) {
  const [userMenu, setUserMenu] = useState(false)
  const needle = search.trim().toLowerCase()
  const groups = NAV.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        item.label.toLowerCase().includes(needle) ||
        item.children?.some((child) => child.label.toLowerCase().includes(needle))
    ),
  })).filter((group) => group.items.length)
  const firstMatch = NAV.flatMap((group) =>
    group.items.flatMap((item) => {
      const children = item.children?.filter((child) => child.label.toLowerCase().includes(needle)) ?? []
      if (children.length) return children
      return item.label.toLowerCase().includes(needle) ? [item] : []
    })
  )[0]

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} aria-hidden />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col overflow-y-auto border-r bg-sidebar p-3 text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 px-1 py-1">
          <button type="button" onClick={() => onViewChange("overview")} className="flex items-center gap-2" aria-label="Support dashboard home">
            <span className="grid size-7 place-items-center rounded-lg bg-foreground text-sm font-bold text-background">K</span>
            <span className="text-lg font-semibold tracking-tight">Kravio</span>
          </button>
          <IconButton label="Close sidebar" className="ml-auto lg:hidden" onClick={onClose}>
            <PanelLeft className="size-4" />
          </IconButton>
        </div>

        <label className="relative mt-4 block">
          <span className="sr-only">Search navigation</span>
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && firstMatch) onViewChange(firstMatch.view)
            }}
            placeholder="Search navigation"
            className="h-9 w-full rounded-lg border bg-card pr-12 pl-8 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[11px] text-muted-foreground">
            ⌘ K
          </kbd>
        </label>

        <nav aria-label="Dashboard" className="mt-4 space-y-5">
          {groups.map((group) => (
            <div key={group.heading}>
              <p className="mb-1.5 px-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{group.heading}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={`${item.label}-${view}`} {...item} active={view} onViewChange={onViewChange} />
                ))}
              </div>
            </div>
          ))}
          {!groups.length && <p className="px-1 text-xs text-muted-foreground">No matching pages.</p>}
        </nav>

        <div className="relative mt-auto pt-6">
          <button
            type="button"
            onClick={() => setUserMenu(!userMenu)}
            className="mt-3 flex w-full items-center gap-2.5 rounded-xl border bg-card p-2 text-left shadow-xs hover:bg-muted"
          >
            <span className="relative">
              <Avatar name={user?.name ?? "Support Agent"} initials={user?.avatarInitials} className="size-9 text-xs" />
              {user?.online !== false && (
                <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{user?.name ?? "Support Agent"}</span>
              <span className="block truncate text-xs text-muted-foreground">{user?.email ?? "No user data"}</span>
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </button>
          {userMenu && (
            <Dropdown placement="top" onClose={() => setUserMenu(false)} className="w-full">
              <p className="px-2.5 py-1.5 text-xs font-medium">{user?.role ?? "Support agent"}</p>
              <p className="px-2.5 pb-2 text-[11px] text-muted-foreground">{user?.email ?? "No user data"}</p>
              <MenuItem icon={RefreshCw} onClick={() => window.location.reload()}>
                Reload dashboard
              </MenuItem>
              <div className="px-2.5 py-1.5">
                <ThemeToggle className="size-8" />
              </div>
            </Dropdown>
          )}
        </div>
      </aside>
    </>
  )
}

export function Topbar({
  onMenuClick,
  unreadCount = 0,
  notifications = [],
  onToggleRead,
  onRefreshNotifications,
  viewLabel,
  onNavigateHome,
}) {
  const [open, setOpen] = useState(false)
  const unread = notifications.filter((item) => !item.read)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-xl">
      <IconButton label="Open sidebar" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="size-4" />
      </IconButton>
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <LayoutGrid className="size-4 text-muted-foreground" />
        <button type="button" onClick={onNavigateHome} className="text-muted-foreground hover:text-foreground">
          Overview
        </button>
        <span className="text-muted-foreground/60">/</span>
        <span className="font-medium">{viewLabel}</span>
      </nav>
      <div className="ml-auto flex items-center gap-1">
        <div className="relative">
          <IconButton
            label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            onClick={() => setOpen(!open)}
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 grid min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] leading-4 font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </IconButton>
          {open && (
            <Dropdown onClose={() => setOpen(false)} className="w-80">
              <div className="flex items-center justify-between px-2.5 py-1.5">
                <span className="text-xs font-medium">Notifications</span>
                <IconButton label="Refresh notifications" onClick={onRefreshNotifications}>
                  <RefreshCw className="size-3.5" />
                </IconButton>
              </div>
              <div className="max-h-72 space-y-1 overflow-y-auto">
                {notifications.length ? (
                  notifications.map((item) => (
                    <div key={item.id} className="flex gap-2 rounded-lg px-2.5 py-2 hover:bg-muted">
                      <button
                        type="button"
                        aria-label={item.read ? `Mark ${item.title} unread` : `Mark ${item.title} read`}
                        onClick={() => onToggleRead(item)}
                        className="mt-0.5 text-muted-foreground hover:text-foreground"
                      >
                        {item.read ? <Check className="size-4 text-emerald-500" /> : <Bell className="size-4 text-blue-500" />}
                      </button>
                      <div className="min-w-0">
                        <p className="text-xs font-medium">{item.title}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{item.body}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="px-2.5 py-4 text-center text-xs text-muted-foreground">No notifications.</p>
                )}
              </div>
              {unread.length > 0 && (
                <MenuItem icon={Check} onClick={() => unread.forEach(onToggleRead)}>
                  Mark all as read
                </MenuItem>
              )}
            </Dropdown>
          )}
        </div>
        <ThemeToggle className="size-8" />
      </div>
    </header>
  )
}

export function Greeting({ range, onRangeChange, user, onRefresh, onNavigateHome }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const name = user?.name ?? "there"
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hello, {name} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here are the latest insights from your customer interactions.</p>
      </div>
      <div className="flex items-center gap-2">
        <RangeSelect value={range} onChange={onRangeChange} />
        <div className="relative">
          <IconButton label="More options" onClick={() => setMenuOpen(!menuOpen)} className="border bg-card shadow-xs">
            <EllipsisVertical className="size-4" />
          </IconButton>
          {menuOpen && (
            <Dropdown onClose={() => setMenuOpen(false)}>
              <MenuItem
                icon={RefreshCw}
                onClick={() => {
                  onRefresh()
                  setMenuOpen(false)
                }}
              >
                Refresh dashboard
              </MenuItem>
              <MenuItem
                icon={LayoutGrid}
                onClick={() => {
                  onNavigateHome()
                  setMenuOpen(false)
                }}
              >
                Go to overview
              </MenuItem>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  )
}
