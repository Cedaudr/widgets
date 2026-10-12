import { useEffect, useState } from "react"
import { Ellipsis } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Gray bezel around a shadcn Card. Each widget passes its fixed outer size via className.
// Colors follow the `.dark` class on <html>.
export function WidgetShell({ className, children, ...props }) {
  return (
    <div
      className={cn("shrink-0 rounded-[36px] bg-neutral-200 p-2 dark:bg-neutral-800", className)}
      {...props}
    >
      <Card className="relative h-full gap-0 rounded-[28px] border-0 py-0 ring-0 shadow-[0_6px_10px_-4px_rgba(0,0,0,0.45)] dark:bg-[#111]">
        {children}
      </Card>
    </div>
  )
}

export function MoreButton({ onClick }) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="shrink-0 rounded-full"
      aria-label="More options"
      onClick={onClick}
    >
      <Ellipsis />
    </Button>
  )
}

// Clickable dash pager. Auto-advances every `interval` ms (0 disables); a click restarts the timer.
export function Pager({ count, active, onChange, interval = 4000, vertical = false }) {
  useEffect(() => {
    if (!interval || count < 2) return
    const id = setTimeout(() => onChange((active + 1) % count), interval)
    return () => clearTimeout(id)
  }, [active, count, interval, onChange])

  return (
    <div className={vertical ? "flex flex-col items-center gap-2.5" : "flex gap-5"}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          aria-label={`Slide ${i + 1}`}
          aria-current={i === active}
          onClick={() => onChange(i)}
          className={cn(
            "rounded-full transition-all",
            vertical
              ? i === active
                ? "h-11 w-2.5 bg-foreground"
                : "size-2.5 bg-foreground/30"
              : cn("h-1 flex-1", i === active ? "bg-foreground" : "bg-foreground/15")
          )}
        />
      ))}
    </div>
  )
}

export function useCountUp(target, ms = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / ms, 1)
      setValue(Math.round(target * (1 - (1 - t) ** 3)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return value
}

export const formatNumber = (n) => (typeof n === "number" ? n.toLocaleString("en-US") : n)

export const LOREM =
  "Figma ipsum component variant main layer. Prototype pixel flows hand vertical. Layer blur pixel pencil content."
