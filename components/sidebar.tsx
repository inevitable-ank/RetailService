"use client"
import { useState } from "react"
import { BarChart3, ChevronLeft, ChevronRight, LayoutDashboard, Package, Settings, Users } from "lucide-react"

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(isCollapsed)

  const handleToggle = () => {
    const newState = !collapsed
    setCollapsed(newState)
    onToggle?.(newState)
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Package, label: "Nexus" },
    { icon: Users, label: "Intake" },
    { icon: Settings, label: "Services" },
  ]

  return (
    <div
      className={`bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo */}
      <div
        className={`border-b border-sidebar-border flex items-center gap-2 transition-all duration-300 ${
          collapsed ? "p-3 justify-center" : "p-4"
        }`}
      >
        {!collapsed && (
          <>
            <div className="w-8 h-8 rounded bg-sidebar-primary flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-xs leading-tight">Vault</p>
              <p className="text-xs text-sidebar-accent-foreground">Aniruag Yadav</p>
            </div>
          </>
        )}
        {collapsed && <BarChart3 className="w-5 h-5 text-sidebar-primary" />}
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={`w-full flex items-center gap-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${
              item.active ? "bg-sidebar-primary text-sidebar-primary-foreground" : ""
            } ${collapsed ? "justify-center p-2" : "justify-start px-3 py-2"}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-xs font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse Button */}
      <div className={`border-t border-sidebar-border p-2 flex ${collapsed ? "justify-center" : "justify-end"}`}>
        <button
          onClick={handleToggle}
          className="p-1.5 hover:bg-sidebar-accent rounded-md transition-colors"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
