import {
  ActivityWidget,
  FeatureWidget,
  InsightWidget,
  SalesReportWidget,
  StatWidget,
  WeatherWidget,
} from "@/components/widgets"
import { Navigation } from "@/components/Navigation"
import { createBrowserRouter, RouterProvider, Routes, Route } from "react-router-dom"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="px-4 py-20">
          <Routes>
            <Route path="/" element={<div />} />
            <Route path="/activity" element={<ActivityWidget />} />
            <Route path="/weather" element={<WeatherWidget />} />
            <Route path="/feature" element={<FeatureWidget />} />
            <Route path="/sales" element={<SalesReportWidget />} />
            <Route path="/insight" element={<InsightWidget />} />
            <Route path="/stat" element={<StatWidget />} />
          </Routes>
        </div>
      </div>
    ),
  },
])

export default function App() {
  return <RouterProvider router={router} />
}