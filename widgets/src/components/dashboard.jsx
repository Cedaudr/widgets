import { useId, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
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
  Plug,
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
  Zap,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

// Mock data. Swap for API calls when a backend exists.
const RANGES = {
  "Last week": {
    kpis: [
      { label: "Current Tickets", icon: Ticket, value: "3,484", delta: 7.1, data: [8, 12, 10, 18, 11, 16, 9, 14, 12, 15, 10] },
      { label: "Daily Avg. Resolution", icon: Zap, value: "486", delta: 2, data: [6, 8, 7, 12, 9, 14, 10, 15, 11, 9, 13] },
      { label: "SLA Compliance Rate", icon: Gauge, value: "92%", delta: -1.3, data: [10, 14, 9, 16, 11, 15, 12, 17, 10, 14, 12] },
    ],
    total: "4,790",
    totalDelta: 8,
    bars: [280, 560, 650, 380, 480, 584, 440, 560, 740, 650, 610, 650, 420, 680],
  },
  "This week": {
    kpis: [
      { label: "Current Tickets", icon: Ticket, value: "1,902", delta: 3.4, data: [6, 9, 12, 10, 14, 11, 13, 9, 15, 12, 16] },
      { label: "Daily Avg. Resolution", icon: Zap, value: "512", delta: 5.3, data: [7, 9, 8, 11, 13, 12, 15, 14, 16, 13, 17] },
      { label: "SLA Compliance Rate", icon: Gauge, value: "94%", delta: 2.1, data: [9, 11, 10, 13, 12, 14, 13, 15, 14, 16, 15] },
    ],
    total: "2,615",
    totalDelta: -4,
    bars: [320, 410, 590, 520, 470, 630, 380, 450, 0, 0, 0, 0, 0, 0],
  },
}
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const ACTIVITY = {
  Today: [
    { icon: Ticket, tone: "text-blue-500", title: "Ticket Updated", time: "11:20 AM", body: <>Ticket <b>#2319</b> SLA updated</> },
    { icon: UserCheck, tone: "text-emerald-500", title: "New Client Added", time: "11:15 AM", body: "PT. Alpha Indonesia registered" },
    { icon: Repeat2, tone: "text-violet-500", title: "Agent Reassigned", time: "11:00 AM", body: <>Ticket <b>#2322</b> moved to <b>Michael Wong</b></> },
    { icon: TriangleAlert, tone: "text-red-500", title: "SLA Breach Risk", time: "10:45 AM", body: <>Ticket <b>#2320</b> "Login issue"</> },
    { icon: BookOpen, tone: "text-teal-500", title: "Knowledge Base", time: "10:30 AM", body: <>New article published: "<b>Login Troubleshooting</b>"</> },
    { icon: Star, tone: "text-amber-500", title: "Customer Feedback", time: "10:30 AM", body: <b>"Great support response, thanks Sarah!"</b> },
    { icon: Ticket, tone: "text-blue-500", title: "Ticket Updated", time: "09:50 AM", body: <>Ticket <b>#2318</b> closed</> },
    { icon: UserCheck, tone: "text-emerald-500", title: "New Client Added", time: "09:10 AM", body: "Northwind Ltd. registered" },
  ],
  Yesterday: [
    { icon: TriangleAlert, tone: "text-red-500", title: "SLA Breach Risk", time: "04:40 PM", body: <>Ticket <b>#2315</b> "Refund delay"</> },
    { icon: Star, tone: "text-amber-500", title: "Customer Feedback", time: "02:15 PM", body: <b>"Quick and friendly, 5 stars"</b> },
    { icon: Repeat2, tone: "text-violet-500", title: "Agent Reassigned", time: "11:05 AM", body: <>Ticket <b>#2311</b> moved to <b>Sarah Lee</b></> },
  ],
  "This week": [
    { icon: BookOpen, tone: "text-teal-500", title: "Knowledge Base", time: "Mon", body: <>Updated "<b>Billing FAQ</b>"</> },
    { icon: UserCheck, tone: "text-emerald-500", title: "New Client Added", time: "Mon", body: "Acme Corp registered" },
  ],
}

const TICKETS = [
  { id: 2319, subject: "Payment failed on invoice", priority: "High", agent: "John Doe", status: "In Review", created: "2025-08-18", due: "2h left", dueH: 2 },
  { id: 2320, subject: "Login issue", priority: "Medium", agent: "Sarah Lee", status: "Delivered", created: "2025-08-19", due: "1h left", dueH: 1 },
  { id: 2321, subject: "Feature request export", priority: "Low", agent: "John Doe", status: "In Progress", created: "2025-08-19", due: "1d left", dueH: 24 },
  { id: 2322, subject: "Contract renewal issue", priority: "Medium", agent: "Michael Wong", status: "In Progress", created: "2025-08-20", due: "9h left", dueH: 9 },
]
const PRIORITY = {
  High: { icon: SignalHigh, tone: "text-red-500", rank: 3 },
  Medium: { icon: SignalMedium, tone: "text-orange-500", rank: 2 },
  Low: { icon: SignalLow, tone: "text-amber-400", rank: 1 },
}
const STATUS = {
  "In Review": { icon: FileText, tone: "text-blue-500" },
  Delivered: { icon: Check, tone: "text-emerald-500" },
  "In Progress": { icon: Clock, tone: "text-amber-500" },
}
const COLUMNS = [
  { key: "id", label: "Ticket ID" },
  { key: "subject", label: "Subject" },
  { key: "priority", label: "Priority", sortBy: (t) => PRIORITY[t.priority].rank },
  { key: "agent", label: "Assigned To" },
  { key: "status", label: "Status" },
  { key: "created", label: "Created Date" },
  { key: "due", label: "SLA Due", sortBy: (t) => t.dueH },
]

const NAV = [
  {
    heading: "Main Navigation",
    items: [
      { label: "Overview", icon: LayoutGrid, active: true },
      { label: "Tickets", icon: Ticket, children: ["All / My Queue", "SLA Breach Risk", "Escalations"] },
      { label: "Clients", icon: UserCheck },
      { label: "Agents & Teams", icon: Users, children: ["Agents", "Teams"] },
      { label: "Knowledge Base", icon: BookOpen, children: ["Articles", "Drafts"] },
      { label: "Integrations", icon: Plug },
    ],
  },
  {
    heading: "Analytics & Insights",
    items: [
      { label: "SLA Compliance", icon: ShieldCheck },
      { label: "CSAT & NPS", icon: Star },
      { label: "Workload Analytics", icon: ChartColumn },
      { label: "Reports", icon: FileChartColumn },
    ],
  },
]

// Subtle diagonal hatch used on panel headers, tinted from the theme foreground.
const hatch = {
  backgroundImage:
    "repeating-linear-gradient(135deg, color-mix(in oklch, var(--foreground) 5%, transparent) 0 1px, transparent 1px 7px)",
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
        onChange={(e) => onChange(e.target.value)}
        className="h-8 appearance-none rounded-lg border bg-card pr-7 pl-8 text-xs font-medium text-foreground shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {Object.keys(RANGES).map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 size-3.5 text-muted-foreground" />
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

function Delta({ value }) {
  return (
    <span className={cn("font-medium", value < 0 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400")}>
      {value > 0 ? "+" : ""}
      {value}%
    </span>
  )
}

function Sparkline({ data, negative }) {
  const id = useId()
  const w = 80
  const h = 36
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 2 - ((v - min) / (max - min || 1)) * (h - 6)])
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("")
  const color = negative ? "var(--color-red-500)" : "var(--color-emerald-500)"
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-20 shrink-0" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
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
    <Panel title={label} icon={icon} className="flex-1" bodyClassName="flex items-end justify-between gap-3 p-4">
      <div>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          <Delta value={delta} /> vs last week
        </p>
      </div>
      <Sparkline data={data} negative={delta < 0} />
    </Panel>
  )
}

// Uses the page's shared range when passed in, otherwise keeps its own,
// so a section still works if the page stops passing props to it.
function useRange({ range, onRangeChange }) {
  const [own, setOwn] = useState("Last week")
  return [range ?? own, onRangeChange ?? setOwn]
}

const AXIS = [800, 600, 400, 200, 0]

export function VolumeChart(props) {
  const [range, setRange] = useRange(props)
  const { bars, total, totalDelta } = RANGES[range]
  const [active, setActive] = useState(5)
  const value = bars[active]

  return (
    <Panel
      title="Ticket Volume Trend"
      action={<RangeSelect value={range} onChange={setRange} />}
      bodyClassName="p-4"
    >
      <p className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{total}</span>
        <span className="text-xs text-muted-foreground">
          <Delta value={totalDelta} /> vs last week
        </span>
      </p>

      <div className="mt-6 flex gap-3">
        <div className="relative h-56 flex-1">
          {/* Guide line + label for the hovered bar */}
          {value > 0 && (
            <div
              className="pointer-events-none absolute inset-x-0 z-10 border-t border-dashed border-foreground/40 transition-all"
              style={{ bottom: `${(value / 800) * 100}%` }}
            >
              <span
                className="absolute -translate-x-full -translate-y-1/2 rounded-md bg-foreground px-2 py-1 text-[11px] font-medium whitespace-nowrap text-background"
                style={{ left: `max(calc(${(active / bars.length) * 100}% - 6px), 4.5rem)` }}
              >
                {DAYS[Math.floor(active / 2)]} : {value}
              </span>
            </div>
          )}
          <div className="flex h-full items-end gap-1.5 sm:gap-2.5" onMouseLeave={() => setActive(5)}>
            {bars.map((v, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${DAYS[Math.floor(i / 2)]}: ${v} tickets`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{ height: `${(v / 800) * 100}%` }}
                className={cn(
                  "flex-1 rounded-t-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  i === active
                    ? "bg-linear-to-b from-slate-600 to-slate-900 dark:from-slate-200 dark:to-slate-400"
                    : "bg-linear-to-b from-foreground/10 to-foreground/3"
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex h-56 flex-col justify-between text-right text-xs text-muted-foreground tabular-nums">
          {AXIS.map((n) => (
            <span key={n} className="leading-none">
              {n}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-2 flex pr-9 text-xs text-muted-foreground">
        {DAYS.map((d) => (
          <span key={d} className="flex-1 text-center">
            {d}
          </span>
        ))}
      </div>
    </Panel>
  )
}

export function LatestUpdates({ className }) {
  const [tab, setTab] = useState("Today")
  const [query, setQuery] = useState("")
  const items = ACTIVITY[tab].filter((a) => a.title.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <Panel title="Latest Updates" icon={FileChartColumn} className={className} bodyClassName="flex flex-col p-3">
      <div role="tablist" className="grid grid-cols-3 gap-2">
        {Object.keys(ACTIVITY).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "h-8 rounded-lg border text-xs font-medium transition-colors",
              tab === t ? "border-transparent bg-foreground text-background" : "hover:bg-foreground/5"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <label className="relative mt-3 block">
        <span className="sr-only">Search activities</span>
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search activities"
          className="h-8 w-full rounded-lg border bg-transparent pr-3 pl-8 text-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </label>
      <p className="mt-3 border-b border-dashed pb-3 text-xs text-muted-foreground">
        <span className="text-base font-semibold text-foreground">{ACTIVITY[tab].length}</span> new activities{" "}
        {tab === "This week" ? "this week" : tab.toLowerCase()}
      </p>
      <ol className="relative mt-3 flex-1 space-y-4 overflow-y-auto xl:max-h-110">
        {items.map(({ icon: Icon, tone, title, time, body }, i) => (
          <li key={i} className="relative flex gap-3">
            {i < items.length - 1 && (
              <span className="absolute top-8 -bottom-4 left-3.75 border-l border-dashed" aria-hidden />
            )}
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border bg-card shadow-xs">
              <Icon className={cn("size-4", tone)} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline justify-between gap-2 text-xs font-medium">
                {title}
                <span className="shrink-0 font-normal text-muted-foreground">{time}</span>
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground [&_b]:font-medium [&_b]:text-foreground">
                {body}
              </p>
            </div>
          </li>
        ))}
        {!items.length && <li className="py-6 text-center text-xs text-muted-foreground">No matching activity.</li>}
      </ol>
    </Panel>
  )
}

function Avatar({ name, className }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
  return (
    <span
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br from-slate-300 to-slate-500 text-[10px] font-semibold text-white dark:from-slate-500 dark:to-slate-700",
        className
      )}
      aria-hidden
    >
      {initials}
    </span>
  )
}

export function SlaTable() {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState({ key: "id", dir: 1 })
  const [selected, setSelected] = useState(() => new Set([2319]))

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^#/, "")
    const col = COLUMNS.find((c) => c.key === sort.key)
    const get = col.sortBy ?? ((t) => t[col.key])
    return TICKETS.filter((t) => `${t.id} ${t.subject}`.toLowerCase().includes(q)).sort((a, b) =>
      get(a) > get(b) ? sort.dir : get(a) < get(b) ? -sort.dir : 0
    )
  }, [query, sort])

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id))
  const toggle = (id) =>
    setSelected((s) => {
      const next = new Set(s)
      if (!next.delete(id)) next.add(id)
      return next
    })

  return (
    <Panel
      title="SLA Monitoring"
      action={
        <>
          <label className="relative hidden sm:block">
            <span className="sr-only">Search tickets</span>
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ticket"
              className="h-8 w-44 rounded-lg border bg-card pr-3 pl-8 text-xs text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 md:w-56"
            />
          </label>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-card px-2.5 text-xs font-medium text-foreground shadow-xs hover:bg-muted"
          >
            <ListFilter className="size-3.5" /> Filter
          </button>
          <IconButton label="More options" className="border bg-card shadow-xs">
            <EllipsisVertical className="size-4" />
          </IconButton>
        </>
      }
      bodyClassName="overflow-x-auto"
    >
      <table className="w-full min-w-190 text-left text-xs">
        <thead className="text-muted-foreground">
          <tr className="border-b bg-muted/50">
            <th className="w-10 py-2.5 pl-3">
              <input
                type="checkbox"
                aria-label="Select all tickets"
                checked={allSelected}
                onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))}
                className="size-3.5 accent-foreground"
              />
            </th>
            {COLUMNS.map((c) => (
              <th
                key={c.key}
                className="px-3 py-2.5 font-medium"
                aria-sort={sort.key === c.key ? (sort.dir > 0 ? "ascending" : "descending") : "none"}
              >
                <button
                  type="button"
                  onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? -s.dir : 1 }))}
                  className="inline-flex items-center gap-1.5 hover:text-foreground"
                >
                  {c.label}
                  <ArrowUpDown className={cn("size-3", sort.key === c.key && "text-foreground")} />
                </button>
              </th>
            ))}
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => {
            const P = PRIORITY[t.priority]
            const S = STATUS[t.status]
            return (
              <tr key={t.id} className="border-b last:border-0 hover:bg-muted/40">
                <td className="py-3 pl-3">
                  <input
                    type="checkbox"
                    aria-label={`Select ticket ${t.id}`}
                    checked={selected.has(t.id)}
                    onChange={() => toggle(t.id)}
                    className="size-3.5 accent-foreground"
                  />
                </td>
                <td className="px-3 py-3 font-medium">#{t.id}</td>
                <td className="px-3 py-3">{t.subject}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <P.icon className={cn("size-3.5", P.tone)} /> {t.priority}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-2">
                    <Avatar name={t.agent} /> {t.agent}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <S.icon className={cn("size-3.5", S.tone)} /> {t.status}
                  </span>
                </td>
                <td className="px-3 py-3 tabular-nums">{t.created}</td>
                <td className={cn("px-3 py-3", t.dueH <= 2 && "font-medium text-red-500")}>{t.due}</td>
                <td className="pr-2">
                  <IconButton label={`Actions for ticket ${t.id}`}>
                    <EllipsisVertical className="size-4" />
                  </IconButton>
                </td>
              </tr>
            )
          })}
          {!rows.length && (
            <tr>
              <td colSpan={COLUMNS.length + 2} className="py-8 text-center text-muted-foreground">
                No tickets match "{query}".
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Panel>
  )
}

function NavItem({ label, icon: Icon, active, children }) {
  const [open, setOpen] = useState(label === "Tickets")
  const base =
    "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors hover:bg-foreground/5 hover:text-foreground"
  if (!children)
    return (
      <a
        href="#"
        aria-current={active ? "page" : undefined}
        className={cn(base, active ? "border bg-card font-medium text-foreground shadow-xs" : "text-muted-foreground")}
      >
        <Icon className="size-4" /> {label}
      </a>
    )
  return (
    <div>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className={cn(base, "text-muted-foreground")}>
        <Icon className="size-4" /> {label}
        <ChevronDown className={cn("ml-auto size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="mt-1 ml-4.25 space-y-0.5 border-l pl-3">
          {children.map((c) => (
            <li key={c}>
              <a href="#" className="block rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-foreground/5 hover:text-foreground">
                {c}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Sidebar({ open, onClose, searchRef }) {
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
          <Link to="/" className="flex items-center gap-2" aria-label="Back to widgets">
            <span className="grid size-7 place-items-center rounded-lg bg-foreground text-sm font-bold text-background">K</span>
            <span className="text-lg font-semibold tracking-tight">Kravio</span>
          </Link>
          <IconButton label="Close sidebar" className="ml-auto lg:hidden" onClick={onClose}>
            <PanelLeft className="size-4" />
          </IconButton>
        </div>

        <label className="relative mt-4 block">
          <span className="sr-only">Search anything</span>
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            placeholder="Search anything"
            className="h-9 w-full rounded-lg border bg-card pr-12 pl-8 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[11px] text-muted-foreground">
            ⌘ K
          </kbd>
        </label>

        <nav aria-label="Dashboard" className="mt-4 space-y-5">
          {NAV.map((g) => (
            <div key={g.heading}>
              <p className="mb-1.5 px-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{g.heading}</p>
              <div className="space-y-0.5">
                {g.items.map((item) => (
                  <NavItem key={item.label} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <p className="mb-1.5 px-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Support</p>
          <div className="space-y-0.5">
            <NavItem label="Feedback" icon={MessageSquare} />
            <NavItem label="Help & Support" icon={Headset} />
            <NavItem label="Settings" icon={Settings} />
          </div>
          <button
            type="button"
            className="mt-3 flex w-full items-center gap-2.5 rounded-xl border bg-card p-2 text-left shadow-xs hover:bg-muted"
          >
            <span className="relative">
              <Avatar name="Samantha Walker" className="size-9 text-xs" />
              <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">Samantha Walker</span>
              <span className="block truncate text-xs text-muted-foreground">samanwalker@gmail.com</span>
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </button>
        </div>
      </aside>
    </>
  )
}

export function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-xl">
      <IconButton label="Open sidebar" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="size-4" />
      </IconButton>
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <LayoutGrid className="size-4 text-muted-foreground" />
        <span className="text-muted-foreground">Overview</span>
        <span className="text-muted-foreground/60">/</span>
        <span className="font-medium">Dashboard</span>
      </nav>
      <div className="ml-auto flex items-center gap-1">
        <IconButton label="Notifications" className="relative">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-red-500" />
        </IconButton>
        <ThemeToggle className="size-8" />
      </div>
    </header>
  )
}

export function Greeting(props) {
  const [range, setRange] = useRange(props)
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hello, Samantha Walker 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here are the latest insights from your customer interactions.</p>
      </div>
      <div className="flex items-center gap-2">
        <RangeSelect value={range} onChange={setRange} />
        <IconButton label="More options" className="border bg-card shadow-xs">
          <EllipsisVertical className="size-4" />
        </IconButton>
      </div>
    </div>
  )
}

// Flex, not a fixed 3-col grid, so the remaining cards fill the row if one is removed.
export function KpiCards({ range = "Last week" }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {RANGES[range].kpis.map((k) => (
        <KpiCard key={k.label} {...k} />
      ))}
    </div>
  )
}
