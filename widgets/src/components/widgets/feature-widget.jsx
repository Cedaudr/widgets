import { useId, useState } from "react"
import { CardContent } from "@/components/ui/card"
import { LOREM, Pager, WidgetShell } from "./widget-shell"

export function FlameIcon() {
  const id = useId()
  return (
    <svg viewBox="0 0 140 160" className="size-36 drop-shadow-[0_12px_24px_rgba(26,115,240,0.55)]">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a73f0" />
          <stop offset="100%" stopColor="#7fb2ff" />
        </linearGradient>
      </defs>
      <path
        d="M78 8c34 22 54 52 54 86 0 34-28 60-62 60S8 128 8 94c0-22 10-40 26-52 2 14 8 24 18 28 4-26 12-46 26-62Z"
        fill={`url(#${id})`}
        stroke="#a9cbff"
        strokeOpacity="0.5"
        strokeWidth="2"
      />
      <path
        d="M76 92c14 10 22 22 22 34 0 15-12 26-27 26s-27-11-27-26c0-9 4-17 11-22 1 6 4 10 8 12 2-10 6-18 13-24Z"
        fill="#0b5fe0"
      />
    </svg>
  )
}

const DEFAULT_SLIDES = Array.from({ length: 5 }, () => ({
  title: "Figma ipsum component",
  description: LOREM,
}))

export function FeatureWidget({
  icon = <FlameIcon />,
  slides = DEFAULT_SLIDES,
  defaultIndex = 1,
  interval,
  className,
}) {
  const [active, setActive] = useState(defaultIndex)
  const slide = slides[active] ?? slides[0]

  return (
    <WidgetShell className={className ?? "max-w-106"}>
      <div className="grid h-55.5 place-items-center border-b border-foreground/10 bg-[linear-gradient(to_right,rgb(59_130_246/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(59_130_246/0.08)_1px,transparent_1px)] bg-size-[22px_22px]">
        {icon}
      </div>
      <CardContent className="px-11 pt-12 pb-11">
        <h3 className="text-2xl font-medium">{slide.title}</h3>
        <p className="mt-6 text-xl leading-tight text-muted-foreground">{slide.description}</p>
        <div className="mt-12">
          <Pager count={slides.length} active={active} onChange={setActive} interval={interval} />
        </div>
      </CardContent>
    </WidgetShell>
  )
}
