import { useState } from "react"
import { TrendingUp, Zap } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LOREM, MoreButton, Pager, WidgetShell } from "./widget-shell"

const DEFAULT_SLIDES = [72, 89, 64, 91, 78].map((value) => ({
  value,
  title: "Figma ipsum component",
  description: LOREM,
}))

export function InsightWidget({
  label = "Insight",
  location = "Palo Alto",
  slides = DEFAULT_SLIDES,
  defaultIndex = 1,
  interval,
  onMore,
  className,
}) {
  const [active, setActive] = useState(defaultIndex)
  const slide = slides[active] ?? slides[0]

  return (
    <WidgetShell className={className ?? "max-w-114"}>
      <CardContent className="flex flex-col p-11">
        <div className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-white">
            <Zap className="size-4 fill-current" />
          </span>
          <span className="text-lg">{label}</span>
          <Badge variant="outline" className="ml-auto h-10 rounded-full px-5 text-lg font-normal">
            {location}
          </Badge>
          <MoreButton onClick={onMore} />
        </div>

        <div className="mt-14 flex items-start gap-1">
          <span className="text-[112px] leading-none font-extralight tracking-tight tabular-nums">
            {slide.value}%
          </span>
          <TrendingUp className="mt-2 size-10 text-blue-500" strokeWidth={1.5} />
        </div>

        <h3 className="mt-20 text-2xl font-medium">{slide.title}</h3>
        <p className="mt-6 text-xl leading-tight text-muted-foreground">{slide.description}</p>

        <div className="mt-16">
          <Pager count={slides.length} active={active} onChange={setActive} interval={interval} />
        </div>
      </CardContent>
    </WidgetShell>
  )
}
