import { useState } from "react"
import { Check, Copy, ExternalLink, RefreshCw, TriangleAlert } from "lucide-react"
import { useApiResource } from "@/hooks/use-api-resource"
import { api } from "@/lib/api"

function ViewPanel({ title, description, action, children }) {
  return (
    <section className="rounded-2xl border bg-muted/60 p-1.5 dark:bg-muted/30">
      <header className="flex min-h-10 items-center gap-2 rounded-t-xl px-2.5 py-1.5">
        <h2 className="text-sm font-medium">{title}</h2>
        {action && <div className="ml-auto flex items-center gap-2 text-muted-foreground">{action}</div>}
      </header>
      <div className="rounded-xl border bg-card p-4 shadow-xs">
        {description && <p className="mb-4 text-sm text-muted-foreground">{description}</p>}
        {children}
      </div>
    </section>
  )
}

function StateBlock({ loading, error, onRetry, empty }) {
  if (loading) return <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
        <TriangleAlert className="size-4 text-red-500" />
        <span>{error.message}</span>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border px-2.5 py-1 text-xs font-medium hover:bg-muted"
        >
          Retry
        </button>
      </div>
    )
  }
  if (empty) return <p className="py-8 text-center text-sm text-muted-foreground">No data available.</p>
  return null
}

function ResourceTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-140 text-left text-xs">
        <thead className="border-b text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-3 py-2.5 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? row.name ?? row.title ?? index} className="border-b last:border-0 hover:bg-muted/40">
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-3">
                  {column.render ? column.render(row) : String(row[column.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ResourceView({ title, description, load, resourceKey, columns }) {
  const { data, loading, error, reload } = useApiResource(load, resourceKey)
  const items = data?.items ?? []

  return (
    <ViewPanel
      title={title}
      description={description}
      action={
        <button
          type="button"
          onClick={reload}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium hover:bg-muted"
        >
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      }
    >
      <StateBlock loading={loading} error={error} onRetry={reload} empty={!items.length} />
      {items.length > 0 && <ResourceTable columns={columns} rows={items} />}
    </ViewPanel>
  )
}

function MetricView({ title, description, load, resourceKey, fields }) {
  const { data, loading, error, reload } = useApiResource(load, resourceKey)

  return (
    <ViewPanel
      title={title}
      description={description}
      action={
        <button
          type="button"
          onClick={reload}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium hover:bg-muted"
        >
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      }
    >
      <StateBlock loading={loading} error={error} onRetry={reload} empty={!data} />
      {data && (
        <div className="grid gap-3 sm:grid-cols-3">
          {fields.map((field) => (
            <div key={field.key} className="rounded-xl border bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">{field.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{String(data[field.key] ?? "—")}</p>
            </div>
          ))}
        </div>
      )}
    </ViewPanel>
  )
}

function ReportsView() {
  const { data, loading, error, reload } = useApiResource((signal) => api.getSummary("This week", signal), "reports-summary")
  const series = data?.volume?.series ?? []

  return (
    <ViewPanel
      title="Ticket volume report"
      description="Raw buckets from the API. The Overview chart renders the same data visually."
      action={
        <button
          type="button"
          onClick={reload}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium hover:bg-muted"
        >
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      }
    >
      <StateBlock loading={loading} error={error} onRetry={reload} empty={!series.length} />
      {series.length > 0 && (
        <ResourceTable
          columns={[
            { key: "day", label: "Day" },
            { key: "value", label: "Tickets" },
          ]}
          rows={series}
        />
      )}
    </ViewPanel>
  )
}

function SettingsForm({ initial, onReload }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await api.updateSettings(form)
      setSaved(true)
      onReload()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block text-muted-foreground">Theme</span>
        <select
          value={form.theme}
          onChange={(event) => setForm({ ...form, theme: event.target.value })}
          className="h-9 w-full rounded-lg border bg-background px-2 text-sm"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.notificationsEnabled}
          onChange={(event) => setForm({ ...form, notificationsEnabled: event.target.checked })}
          className="size-4 accent-foreground"
        />
        Notifications enabled
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted-foreground">Language</span>
        <input
          value={form.language}
          onChange={(event) => setForm({ ...form, language: event.target.value })}
          className="h-9 w-full rounded-lg border bg-background px-2 text-sm"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted-foreground">Timezone</span>
        <input
          value={form.timezone}
          onChange={(event) => setForm({ ...form, timezone: event.target.value })}
          className="h-9 w-full rounded-lg border bg-background px-2 text-sm"
        />
      </label>
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-background disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
            <Check className="size-3.5" /> Saved
          </span>
        )}
      </div>
    </div>
  )
}

function SettingsView() {
  const { data, loading, error, reload } = useApiResource((signal) => api.getSettings(signal), "settings")

  return (
    <ViewPanel
      title="Dashboard settings"
      description="Settings are persisted in MongoDB through the API."
      action={
        <button
          type="button"
          onClick={reload}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium hover:bg-muted"
        >
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      }
    >
      <StateBlock loading={loading} error={error} onRetry={reload} empty={!data} />
      {data && <SettingsForm key={JSON.stringify(data)} initial={data} onReload={reload} />}
    </ViewPanel>
  )
}

function HelpView() {
  const [copied, setCopied] = useState(false)
  const email = "support@kravio.example"

  const copy = async () => {
    let success = false
    try {
      await navigator.clipboard.writeText(email)
      success = true
    } catch {
      const input = document.createElement("textarea")
      input.value = email
      input.style.position = "fixed"
      input.style.opacity = "0"
      document.body.appendChild(input)
      input.select()
      success = document.execCommand("copy")
      input.remove()
    }
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <ViewPanel title="Help & Support" description="Quick links and support contact for this dashboard.">
      <div className="space-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-medium hover:bg-muted">
            <ExternalLink className="size-4" /> Email support
          </a>
          <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-medium hover:bg-muted">
            <Copy className="size-4" /> {copied ? "Copied" : "Copy email"}
          </button>
        </div>
        <p className="text-muted-foreground">
          API documentation is available at{" "}
          <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="underline">
            /docs
          </a>
          .
        </p>
      </div>
    </ViewPanel>
  )
}

export function DashboardView({ view }) {
  switch (view) {
    case "clients":
      return (
        <ResourceView
          title="Clients"
          description="Active clients from the API."
          load={(signal) => api.getClients(signal)}
          resourceKey="clients"
          columns={[
            { key: "name", label: "Client" },
            { key: "industry", label: "Industry" },
            {
              key: "status",
              label: "Status",
              render: (row) => <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600">{row.status}</span>,
            },
          ]}
        />
      )
    case "agents":
      return (
        <ResourceView
          title="Agents"
          description="Support agents from the API."
          load={(signal) => api.getAgents(signal)}
          resourceKey="agents"
          columns={[
            { key: "name", label: "Agent" },
            { key: "team", label: "Team" },
            { key: "role", label: "Role" },
            { key: "online", label: "Online", render: (row) => (row.online ? "Yes" : "No") },
          ]}
        />
      )
    case "teams":
      return (
        <ResourceView
          title="Teams"
          description="Teams from the API."
          load={(signal) => api.getTeams(signal)}
          resourceKey="teams"
          columns={[
            { key: "name", label: "Team" },
            { key: "description", label: "Description" },
            { key: "members", label: "Members" },
          ]}
        />
      )
    case "articles":
    case "drafts":
      return (
        <ResourceView
          title={view === "drafts" ? "Draft articles" : "Knowledge base articles"}
          description={view === "drafts" ? "Articles still in draft." : "Published and draft articles from the API."}
          load={(signal) => api.getArticles(view === "drafts" ? "draft" : undefined, signal)}
          resourceKey={`articles-${view}`}
          columns={[
            { key: "title", label: "Title" },
            { key: "category", label: "Category" },
            { key: "status", label: "Status" },
            { key: "updated", label: "Updated" },
          ]}
        />
      )
    case "integrations":
      return (
        <ResourceView
          title="Integrations"
          description="Connected tools from the API."
          load={(signal) => api.getIntegrations(signal)}
          resourceKey="integrations"
          columns={[
            { key: "name", label: "Tool" },
            { key: "category", label: "Category" },
            { key: "connected", label: "Connected", render: (row) => (row.connected ? "Yes" : "No") },
          ]}
        />
      )
    case "feedback":
      return (
        <ResourceView
          title="Customer feedback"
          description="Latest feedback from the API."
          load={(signal) => api.getFeedback(signal)}
          resourceKey="feedback"
          columns={[
            { key: "quote", label: "Quote" },
            { key: "rating", label: "Rating" },
            { key: "source", label: "Source" },
          ]}
        />
      )
    case "sla":
      return (
        <MetricView
          title="SLA compliance"
          description="Current SLA metrics from the API."
          load={(signal) => api.getSlaCompliance(signal)}
          resourceKey="sla"
          fields={[
            { key: "rate", label: "Compliance rate" },
            { key: "target", label: "Target" },
            { key: "breaches", label: "Breaches" },
            { key: "trend", label: "Trend" },
          ]}
        />
      )
    case "csat":
      return (
        <MetricView
          title="CSAT & NPS"
          description="Customer satisfaction metrics from the API."
          load={(signal) => api.getCsatNps(signal)}
          resourceKey="csat"
          fields={[
            { key: "csat", label: "CSAT" },
            { key: "nps", label: "NPS" },
            { key: "responses", label: "Responses" },
          ]}
        />
      )
    case "workload":
      return (
        <MetricView
          title="Workload analytics"
          description="Agent workload metrics from the API."
          load={(signal) => api.getWorkload(signal)}
          resourceKey="workload"
          fields={[
            { key: "openTickets", label: "Open tickets" },
            { key: "avgResolutionMinutes", label: "Avg. resolution (min)" },
            { key: "agentsOnline", label: "Agents online" },
          ]}
        />
      )
    case "reports":
      return <ReportsView />
    case "settings":
      return <SettingsView />
    case "help":
      return <HelpView />
    default:
      return null
  }
}
