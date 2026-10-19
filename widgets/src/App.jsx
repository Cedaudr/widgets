import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {
  ActivityWidget,
  FeatureWidget,
  InsightWidget,
  SalesReportWidget,
  StatWidget,
  WeatherWidget,
} from "@/components/widgets"
import { RootLayout } from "@/components/layout"
import { HomePage } from "@/pages/home"
import { WidgetDetail } from "@/pages/widget-detail"
import { RouteErrorPage } from "@/pages/not-found"
import { SupportDashboard } from "@/pages/support-dashboard"

const router = createBrowserRouter([
  // Full-screen app with its own sidebar, so it sits outside RootLayout.
  { path: "/dashboard", element: <SupportDashboard />, errorElement: <RouteErrorPage /> },
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "activity",
        element: (
          <WidgetDetail
            eyebrow="Activity widget"
            title="Daily Writing"
            description="A focus timer with a progress ring. Start it, pause it, hit your daily goal."
          >
            <ActivityWidget />
          </WidgetDetail>
        ),
      },
      {
        path: "weather",
        element: (
          <WidgetDetail
            eyebrow="Weather widget"
            title="Local forecast"
            description="Current temperature with an hourly forecast strip. Tap a time slot to preview it."
          >
            <WeatherWidget />
          </WidgetDetail>
        ),
      },
      {
        path: "feature",
        element: (
          <WidgetDetail
            eyebrow="Feature widget"
            title="Feature showcase"
            description="A sliding feature card. Use the pager dots to flip through slides."
          >
            <FeatureWidget />
          </WidgetDetail>
        ),
      },
      {
        path: "sales",
        element: (
          <WidgetDetail
            eyebrow="Sales widget"
            title="Sales report"
            description="Summary, monthly and yearly stats, plus a regional breakdown."
          >
            <SalesReportWidget />
          </WidgetDetail>
        ),
      },
      {
        path: "insight",
        element: (
          <WidgetDetail
            eyebrow="Insight widget"
            title="Performance insight"
            description="A headline metric with trend indicator. Page through the insight slides."
          >
            <InsightWidget />
          </WidgetDetail>
        ),
      },
      {
        path: "stat",
        element: (
          <WidgetDetail
            eyebrow="Stat widget"
            title="Key stat"
            description="A single bold percentage with a vertical pager for more slides."
          >
            <StatWidget />
          </WidgetDetail>
        ),
      },
      { path: "*", element: <RouteErrorPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
