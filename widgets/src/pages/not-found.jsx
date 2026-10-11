import { Link, useRouteError } from "react-router-dom"
import { Compass } from "lucide-react"
import { NAV_LINKS } from "@/components/Navigation"

export function RouteErrorPage() {
  const error = useRouteError()
  const status = error?.status ?? 404
  const message =
    status === 404
      ? "This page doesn't exist. The menu above has every real page."
      : (error?.statusText ?? error?.message ?? "Something went wrong.")

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-20 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
        <Compass className="size-7" />
      </span>
      <p className="mt-6 text-7xl font-bold tracking-tight tabular-nums">{status}</p>
      <p className="mt-3 text-lg text-muted-foreground">{message}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <Link
          to="/"
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Back to dashboard
        </Link>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {NAV_LINKS.filter((l) => l.to !== "/").map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-full border border-foreground/10 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
