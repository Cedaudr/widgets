import { ThemeToggle } from "@/components/theme-toggle"
import {
  ActivityWidget,
  FeatureWidget,
  InsightWidget,
  SalesReportWidget,
  WeatherWidget,
} from "@/components/widgets"

export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      <ThemeToggle className="fixed top-4 right-4 z-10" />
      <div className="mx-auto grid max-w-7xl items-start justify-items-center gap-10 px-4 py-20 md:grid-cols-2 xl:grid-cols-3">
        <InsightWidget />
        <SalesReportWidget />
        <FeatureWidget />
        <ActivityWidget />
        <WeatherWidget />
      </div>
    </main>
  )
}
