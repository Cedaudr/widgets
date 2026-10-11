import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import {
  Activity,
  ChartPie,
  CloudSun,
  Flame,
  LayoutGrid,
  Menu,
  TrendingUp,
  X,
  Zap,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export const NAV_LINKS = [
  { to: "/", label: "Home", icon: LayoutGrid, end: true },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/feature", label: "Feature", icon: Flame },
  { to: "/sales", label: "Sales", icon: ChartPie },
  { to: "/insight", label: "Insight", icon: Zap },
  { to: "/stat", label: "Stats", icon: TrendingUp },
]

function DesktopLink({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
        )
      }
    >
      <Icon className="size-4" />
      {label}
    </NavLink>
  )
}

function MobileLink({ to, label, icon: Icon, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
          isActive
            ? "bg-blue-600/10 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
        )
      }
    >
      <Icon className="size-5" />
      {label}
    </NavLink>
  )
}

export function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Widget dashboard home">
          <span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">
            <LayoutGrid className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight">Widgets</span>
            <span className="block text-xs text-muted-foreground">Dashboard</span>
          </span>
        </Link>

        <nav aria-label="Widget pages" className="mx-auto hidden lg:block">
          <div className="flex items-center gap-1 rounded-full border border-foreground/10 bg-background/60 p-1">
            {NAV_LINKS.map((link) => (
              <DesktopLink key={link.to} {...link} />
            ))}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full border border-foreground/10 text-foreground transition-colors hover:bg-foreground/5 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Widget pages mobile" className="border-t border-foreground/10 lg:hidden">
          <div className="mx-auto grid w-full max-w-7xl gap-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <MobileLink key={link.to} {...link} onNavigate={() => setOpen(false)} />
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
