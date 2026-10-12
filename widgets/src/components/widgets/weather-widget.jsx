import { useId, useState } from "react"
import { Navigation } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { WidgetShell } from "./widget-shell"

export function Cloud() {
  const id = useId()
  return (
    <svg viewBox="0 0 300 170" className="mx-auto w-full max-w-50">
      <defs>
        <linearGradient id={`${id}fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="[stop-color:#fafafa] dark:[stop-color:#2a2a2a]" />
          <stop offset="100%" className="[stop-color:#d4d4d4] dark:[stop-color:#3a3a3a]" />
        </linearGradient>
        <clipPath id={`${id}shape`}>
          <circle cx="62" cy="110" r="55" />
          <circle cx="150" cy="80" r="78" />
          <circle cx="238" cy="114" r="52" />
          <rect x="62" y="110" width="176" height="56" rx="10" />
        </clipPath>
      </defs>
      <rect width="300" height="170" fill={`url(#${id}fill)`} clipPath={`url(#${id}shape)`} />
    </svg>
  )
}

export function WeatherWidget({
  location = "Palo Alto",
  forecast = [
    { time: "Now", temp: 12 },
    { time: "14:00", temp: 15 },
    { time: "15:00", temp: 16 },
    { time: "16:00", temp: 17 },
  ],
  icon = <Cloud />,
  onLocationClick,
  className,
}) {
  const [selected, setSelected] = useState(0)
  return (
    <WidgetShell className={className ?? "w-[344px] h-[333px]"}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="text-5xl leading-none">{forecast[selected]?.temp}°</span>
          <Button
            onClick={onLocationClick}
            className="h-10 gap-2 rounded-full bg-blue-600 px-4 text-sm font-normal text-white hover:bg-blue-700"
          >
            <span className="grid size-6 place-items-center rounded-md bg-white text-blue-600">
              <Navigation className="size-3.5 fill-current" />
            </span>
            {location}
          </Button>
        </div>

        <div className="my-6">{icon}</div>

        <div className="flex h-11 items-stretch">
          {forecast.map(({ time, temp }, i) => (
            <div key={time} className="flex flex-1 items-stretch">
              {i > 0 && <Separator orientation="vertical" className="mr-3" />}
              <button
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
                className="flex flex-col text-left text-base leading-tight"
              >
                <span className="text-muted-foreground">{time}</span>
                <span className={cn(selected === i && "text-blue-600")}>{temp}°</span>
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </WidgetShell>
  )
}
