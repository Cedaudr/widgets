import { Outlet } from "react-router-dom"
import { Navigation } from "@/components/Navigation"

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navigation />
      <main className="mx-auto w-full max-w-7xl px-4 pt-10 pb-20">
        <Outlet />
      </main>
      <footer className="border-t border-foreground/10">
        <p className="mx-auto w-full max-w-7xl px-4 py-6 text-sm text-muted-foreground">
          Widget dashboard - pick any widget from the menu above.
        </p>
      </footer>
    </div>
  )
}
