import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Pager, WidgetShell } from "./widget-shell"

const DESCRIPTION = "Figma ipsum component variant main layer. Prototype pixel flows hand vertical."

const DEFAULT_SLIDES = [72, 89, 64].map((value) => ({
  value,
  title: "Figma ipsum component",
  description: DESCRIPTION,
}))

export function StatWidget({ slides = DEFAULT_SLIDES, defaultIndex = 1, interval, className }) {
  const [active, setActive] = useState(defaultIndex)
  const slide = slides[active] ?? slides[0]

  return (
    <WidgetShell className={className ?? "w-[324px] h-[246px]"}>
      <CardContent className="relative flex h-full overflow-hidden rounded-[28px] p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-10 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(59_130_246/0.14),transparent)] dark:bg-[radial-gradient(closest-side,rgb(37_99_235/0.22),transparent)]"
        />

        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="flex items-start gap-1">
            <span className="text-[56px] leading-none tracking-tight text-blue-600 tabular-nums dark:text-blue-500">
              {slide.value}%
            </span>
            <TrendingUp className="size-7 text-blue-500" strokeWidth={1.5} />
          </div>

          <h3 className="mt-auto text-base font-medium">{slide.title}</h3>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">{slide.description}</p>
        </div>

        <div className="relative ml-6 self-center">
          <Pager vertical count={slides.length} active={active} onChange={setActive} interval={interval} />
        </div>
      </CardContent>
    </WidgetShell>
  )
}
