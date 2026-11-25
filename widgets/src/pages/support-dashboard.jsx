import { useEffect, useRef, useState } from "react"
import {
  Greeting,
  KpiCards,
  LatestUpdates,
  Sidebar,
  SlaTable,
  Topbar,
  VolumeChart,
} from "@/components/dashboard"
import { DashboardView } from "@/components/dashboard-views"
import { VIEW_META } from "@/lib/view-meta"
import { useApiResource } from "@/hooks/use-api-resource"
import { api } from "@/lib/api"

const TICKET_VIEWS = ["tickets", "breach-risk", "escalations"]

export function SupportDashboard() {
  const [range, setRange] = useState("This week")
  const [view, setView] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarSearch, setSidebarSearch] = useState("")
  const [actionError, setActionError] = useState(null)
  const searchRef = useRef(null)

  const summary = useApiResource((signal) => api.getSummary(range, signal), range)
  const user = useApiResource((signal) => api.getCurrentUser(signal), "current-user")
  const notifications = useApiResource((signal) => api.getNotifications(signal), "notifications")

  const summaryForRange = summary.data?.range === range ? summary.data : null
  const summaryLoading = summary.loading || (!summaryForRange && !summary.error)
  const notificationItems = notifications.data?.items ?? []
  const unreadCount = notificationItems.filter((item) => !item.read).length
  const globalError = actionError ?? user.error ?? notifications.error

  const changeView = (next) => {
    setView(next)
    setSidebarOpen(false)
    setActionError(null)
  }

  const refreshAll = () => {
    summary.reload()
    user.reload()
    notifications.reload()
  }

  const toggleNotificationRead = async (item) => {
    setActionError(null)
    try {
      await api.setNotificationRead(item.id, !item.read)
      notifications.reload()
    } catch (error) {
      setActionError(error.message)
    }
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors lg:flex">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        searchRef={searchRef}
        user={user.data}
        view={view}
        onViewChange={changeView}
        search={sidebarSearch}
        onSearchChange={setSidebarSearch}
      />

      <div className="min-w-0 flex-1">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          unreadCount={unreadCount}
          notifications={notificationItems}
          onToggleRead={toggleNotificationRead}
          onRefreshNotifications={notifications.reload}
          viewLabel={VIEW_META[view] ?? "Overview"}
          onNavigateHome={() => changeView("overview")}
        />

        <main className="space-y-4 p-4 md:p-6">
          {globalError && (
            <div
              role="alert"
              className="flex flex-wrap items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400"
            >
              <span>{globalError.message}</span>
              <button
                type="button"
                onClick={() => {
                  if (actionError) setActionError(null)
                  if (user.error) user.reload()
                  if (notifications.error) notifications.reload()
                }}
                className="rounded-md border px-2 py-0.5 font-medium hover:bg-red-500/10"
              >
                Retry
              </button>
            </div>
          )}

          <Greeting
            range={range}
            onRangeChange={setRange}
            user={user.data}
            onRefresh={refreshAll}
            onNavigateHome={() => changeView("overview")}
          />

          {view === "overview" && (
            <div className="flex flex-col gap-4 xl:flex-row">
              <div className="min-w-0 flex-1 space-y-4 empty:hidden">
                <KpiCards
                  data={summaryForRange}
                  loading={summaryLoading}
                  error={summary.error}
                  onRetry={summary.reload}
                />
                <VolumeChart
                  key={range}
                  range={range}
                  data={summaryForRange}
                  loading={summaryLoading}
                  error={summary.error}
                  onRetry={summary.reload}
                  onRangeChange={setRange}
                />
              </div>
              <LatestUpdates className="xl:w-85 xl:shrink-0 xl:[:empty+&]:w-full" />
            </div>
          )}

          {TICKET_VIEWS.includes(view) && (
            <SlaTable
              key={view}
              title={VIEW_META[view]}
              mode={view === "breach-risk" ? "breach" : "all"}
              fixedPriority={view === "escalations" ? "High" : undefined}
              onChanged={() => notifications.reload()}
            />
          )}

          {view !== "overview" && !TICKET_VIEWS.includes(view) && <DashboardView view={view} />}
        </main>
      </div>
    </div>
  )
}
