import {
  ActivityWidget,
  FeatureWidget,
  InsightWidget,
  SalesReportWidget,
  StatWidget,
  WeatherWidget,
} from "@/components/widgets"

export function HomePage() {
  return (
    <div>
      <div className="max-w-2xl">
        <p className="inline-block rounded-full border border-foreground/10 px-3 py-1 text-xs font-medium text-muted-foreground">
          Widget dashboard
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Every widget, one click away.
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Browse the full dashboard below, or jump straight to any widget from the top menu.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap items-start justify-center gap-x-8 gap-y-12">
        <InsightWidget />
        <SalesReportWidget />
        <FeatureWidget />
        <ActivityWidget />
        <WeatherWidget />
        <StatWidget />
      </div>
    </div>
  )
}
