import { useEffect, useState } from "react"
import { ChartPie } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { MoreButton, WidgetShell } from "./widget-shell"

const RADIUS = 66
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ActivityWidget({
  label = "Activity",
  title = "Daily Writing",
  goalMinutes = 30,
  remainingMinutes = 10,
  onComplete,
  onMore,
  className,
}) {
  const [left, setLeft] = useState(remainingMinutes * 60)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setLeft((s) => Math.max(s - 1, 0)), 1000)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    if (left > 0 || !running) return
    setRunning(false)
    onComplete?.()
  }, [left, running, onComplete])

  const status =
    left === 0 ? "Done!" : left >= 60 ? `${Math.ceil(left / 60)}m left` : `${left}s left`
  const progress = left / (goalMinutes * 60)

  return (
    <WidgetShell className={className ?? "w-[344px] h-[329px]"}>
      <CardContent className="relative h-full p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg">{label}</span>
          <MoreButton onClick={onMore} />
        </div>
        <h3 className="mt-6 text-2xl leading-tight font-bold">{title}</h3>
        <p className="text-lg text-blue-600" aria-live="polite">
          {status}
        </p>

        {/* Ring shows time remaining, drawn clockwise from 3 o'clock like the design. */}
        <div className="absolute right-6 bottom-6 size-28">
          <svg viewBox="0 0 152 152" className="absolute inset-0">
            <circle cx="76" cy="76" r={RADIUS} fill="none" strokeWidth="10" className="stroke-foreground/5" />
            <circle
              cx="76"
              cy="76"
              r={RADIUS}
              fill="none"
              stroke="#1a73f0"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${CIRCUMFERENCE * progress} ${CIRCUMFERENCE}`}
              className="transition-[stroke-dasharray] duration-700"
            />
          </svg>
          <button
            onClick={() => left > 0 && setRunning((v) => !v)}
            aria-label={running ? "Pause timer" : "Start timer"}
            className="absolute inset-4 grid place-items-center rounded-full bg-neutral-200 text-neutral-700 transition-transform active:scale-95 dark:bg-neutral-900 dark:text-white"
          >
            <ChartPie className={cn("size-10", running && "animate-pulse")} strokeWidth={2.5} />
          </button>
        </div>
      </CardContent>
    </WidgetShell>
  )
}
