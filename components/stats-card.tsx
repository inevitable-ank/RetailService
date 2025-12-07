import { Package, DollarSign, BarChart3 } from "lucide-react"

interface StatsProps {
  stats: {
    totalUnits: number
    totalAmount: number
    totalDiscount: number
  }
}

export function StatsCards({ stats }: StatsProps) {
  const cards = [
    {
      icon: Package,
      label: "Total units sold",
      value: stats.totalUnits,
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: DollarSign,
      label: "Total Amount",
      value: `₹${(stats.totalAmount / 100000).toFixed(2)}K`,
      color: "bg-green-100 text-green-700",
    },
    {
      icon: BarChart3,
      label: "Total Discount",
      value: `₹${(stats.totalDiscount / 100000).toFixed(2)}K`,
      color: "bg-purple-100 text-purple-700",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-card border border-border rounded p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
              <h3 className="text-base font-semibold">{card.value}</h3>
            </div>
            <div className={`${card.color} p-2 rounded-lg flex-shrink-0`}>
              <card.icon className="w-4 h-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
