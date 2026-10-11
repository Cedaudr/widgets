import { Link } from "react-router-dom"

export function Navigation() {
  return (
    <nav className="flex items-center gap-2 bg-background/80 backdrop-blur border-b border-border/50 px-4 py-2">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-sm font-medium hover:underline">
          Home
        </Link>
        <span className="text-xs text-foreground/60">|</span>
      </div>
      <Link to="/activity" className="text-sm font-medium hover:underline">
        Activity
      </Link>
      <span className="text-xs text-foreground/60">|</span>
      <Link to="/weather" className="text-sm font-medium hover:underline">
        Weather
      </Link>
      <span className="text-xs text-foreground/60">|</span>
      <Link to="/feature" className="text-sm font-medium hover:underline">
        Feature
      </Link>
      <span className="text-xs text-foreground/60">|</span>
      <Link to="/sales" className="text-sm font-medium hover:underline">
        Sales
      </Link>
      <span className="text-xs text-foreground/60">|</span>
      <Link to="/insight" className="text-sm font-medium hover:underline">
        Insight
      </Link>
      <span className="text-xs text-foreground/60">|</span>
      <Link to="/stat" className="text-sm font-medium hover:underline">
        Stat
      </Link>
    </nav>
  )
}