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
    <WidgetShell className={className ?? "w-[324px] h-[424px]"}>
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-blue-600 text-white">
            <Zap className="size-3.5 fill-current" />
          </span>
          <span className="text-base">{label}</span>
          <Badge variant="outline" className="ml-auto h-8 rounded-full px-3 text-sm font-normal">
            {location}
          </Badge>
          <MoreButton onClick={onMore} />
        </div>

        <div className="mt-8 flex items-start gap-1">
          <span className="text-[72px] leading-none font-extralight tracking-tight tabular-nums">
            {slide.value}%
          </span>
          <TrendingUp className="mt-1 size-7 text-blue-500" strokeWidth={1.5} />
        </div>

        <h3 className="mt-auto text-lg font-medium">{slide.title}</h3>
        <p className="mt-2 text-sm leading-5 text-muted-foreground">{slide.description}</p>

        <div className="mt-8">
          <Pager count={slides.length} active={active} onChange={setActive} interval={interval} />
        </div>
      </CardContent>
    </WidgetShell>
  )
}
