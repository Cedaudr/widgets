import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { RouteErrorPage } from "@/pages/not-found"
import { SupportDashboard } from "@/pages/support-dashboard"

const router = createBrowserRouter([
  {
    path: "/",
    element: <SupportDashboard />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/dashboard",
    element: <SupportDashboard />,
    errorElement: <RouteErrorPage />,
  },
  { path: "*", element: <Navigate to="/" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
