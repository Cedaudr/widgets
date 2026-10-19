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

// Layout only. Each section is self-contained: comment out any one line below
// and the rest reflows (flex rows, empty columns collapse) without breaking.
export function SupportDashboard() {
  const [range, setRange] = useState("Last week")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const searchRef = useRef(null)

  // Cmd/Ctrl+K focuses the sidebar search.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSidebarOpen(true)
        searchRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} searchRef={searchRef} />

      <div className="min-w-0 flex-1">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="space-y-4 p-4 md:p-6">
          <Greeting range={range} onRangeChange={setRange} />

          <div className="flex flex-col gap-4 xl:flex-row">
            <div className="min-w-0 flex-1 space-y-4 empty:hidden">
              <KpiCards range={range} />
              <VolumeChart range={range} onRangeChange={setRange} />
            </div>
            <LatestUpdates className="xl:w-85 xl:shrink-0 xl:[:empty+&]:w-full" />
          </div>

          <SlaTable />
        </main>
      </div>
    </div>
  )
}
