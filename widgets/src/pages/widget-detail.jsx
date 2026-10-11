import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export function WidgetDetail({ eyebrow, title, description, children }) {
  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All widgets
      </Link>

      <header className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase dark:text-blue-400">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-3 text-lg text-muted-foreground">{description}</p>}
      </header>

      <div className="mt-8 flex justify-center">{children}</div>
    </div>
  )
}
