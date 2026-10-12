import { useId } from "react"
import { ArrowUp, ChartPie, Grid2x2, SquarePlus } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatNumber, useCountUp, WidgetShell } from "./widget-shell"

// Two concentric arcs of dots, fading toward the ends.
function DotArc() {
  const id = useId()
  const rings = [
    { r: 150, n: 15 },
    { r: 112, n: 11 },
  ]
  const span = 205 // degrees covered by each arc
  return (
    <svg viewBox="-180 -175 360 230" className="mx-auto w-full max-w-50">
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="0" cy="-90" rx="180" ry="110" fill={`url(#${id})`} />
      {rings.map(({ r, n }) =>
        Array.from({ length: n }, (_, i) => {
          const deg = -span / 2 + (span / (n - 1)) * i
          const rad = (deg * Math.PI) / 180
          const fade = 1 - Math.abs(deg) / (span / 2) // 1 at top, 0 at ends
          return (
            <circle
              key={`${r}-${i}`}
              cx={Math.sin(rad) * r}
              cy={-Math.cos(rad) * r}
              r="11"
              fill="#1a73f0"
              opacity={0.12 + fade * 0.88}
            />
          )
        })
      )}
    </svg>
  )
}

function Stat({ icon: Icon, label, value, change, secondary, currency }) {
  const shown = useCountUp(value)
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5 text-blue-600" />
        {label}
      </div>
      <div className="mt-1 text-2xl leading-tight tabular-nums">
        {currency}
        {formatNumber(shown)}
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-0.5 text-blue-600">
          <ArrowUp className="size-3" />
          {change}
        </span>
        {secondary}
      </div>
    </div>
  )
}

export function SalesReportWidget({
  title = "Sales Report",
  summaryLabel = "Summary",
  summary = 22870,
  currency = "$",
  monthly = { value: 8097, change: "19.6%", secondary: "44.714 USD" },
  yearly = { value: 312134, change: "2.6%", secondary: "301.002 USD" },
  regions = [
    { name: "Los Angeles", value: "201,192" },
    { name: "New York", value: "192.054" },
    { name: "Canada", value: "166.401" },
  ],
  className,
}) {
  const shownSummary = useCountUp(summary)
  return (
    <WidgetShell className={className ?? "w-[344px] h-[461px]"}>
      <CardContent className="p-6">
        <h3 className="text-xl">{title}</h3>

        <div className="relative mt-2">
          <DotArc />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            <span className="mb-3 grid size-8 place-items-center rounded-full bg-black text-white ring-1 ring-white/10">
              <Grid2x2 className="size-4 rotate-45" />
            </span>
            <span className="text-xs text-muted-foreground">{summaryLabel}</span>
            <span className="text-[28px] leading-tight tabular-nums">{formatNumber(shownSummary)}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <Stat icon={SquarePlus} label="Monthly" currency={currency} {...monthly} />
          <Stat icon={ChartPie} label="Yearly" currency={currency} {...yearly} />
        </div>

        <div className="mt-6">
          {regions.map(({ name, value }, i) => (
            <div key={name}>
              {i > 0 && <Separator />}
              <div className="flex justify-between py-1.5 text-sm">
                <span>{name}</span>
                <span className="font-semibold tracking-tight">{formatNumber(value)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </WidgetShell>
  )
}
