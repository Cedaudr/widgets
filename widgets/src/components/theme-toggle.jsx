import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// index.html sets the initial class before paint; this just reads it back.
const current = () => (document.documentElement.classList.contains("dark") ? "dark" : "light")

export function ThemeToggle({ className }) {
  const [theme, setTheme] = useState(current)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    try {
      localStorage.setItem("theme", theme)
    } catch {
      // storage blocked: theme still works for this visit
    }
  }, [theme])

  const next = theme === "dark" ? "light" : "dark"
  return (
    <Button
      variant="outline"
      size="icon-lg"
      className={cn("rounded-full", className)}
      aria-label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  )
}
