"use client"
import { useState, useEffect } from "react"
import { 
  BarChart3, 
  ChevronDown, 
  ChevronLeft, 
  LayoutDashboard, 
  Globe, 
  CircleDot, 
  Settings, 
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  FileCheck,
  FilePlus
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(isCollapsed)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["services", "invoices"])
  const { user } = useAuth()

  // Extract name from user data
  const userName = user 
    ? (user.name ||
       user.user_metadata?.name ||
       user.user_metadata?.full_name ||
       user.user_metadata?.display_name ||
       (user.email ? user.email.split("@")[0] : "User"))
    : "User"

  const handleToggle = () => {
    const newState = !collapsed
    setCollapsed(newState)
    onToggle?.(newState)
  }

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(k => k !== menuKey)
        : [...prev, menuKey]
    )
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard", active: true },
    { icon: Globe, label: "Nexus", key: "nexus" },
    { icon: CircleDot, label: "Intake", key: "intake" },
    { 
      icon: Settings, 
      label: "Services", 
      key: "services",
      children: [
        { icon: Clock, label: "Pre-active", key: "pre-active" },
        { icon: Activity, label: "Active", key: "active" },
        { icon: XCircle, label: "Blocked", key: "blocked" },
        { icon: CheckCircle, label: "Closed", key: "closed" },
      ]
    },
    { 
      icon: FileText, 
      label: "Invoices", 
      key: "invoices",
      children: [
        { icon: FilePlus, label: "Proforma Invoices", key: "proforma", active: true },
        { icon: FileCheck, label: "Final Invoices", key: "final" },
      ]
    },
  ]

  return (
    <div
      className={`bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-[220px]"
      }`}
    >
      {/* Logo / User */}
      <div
        className={`border-b border-sidebar-border flex items-center transition-all duration-300 ${
          collapsed ? "p-3 justify-center" : "p-4 justify-between"
        }`}
      >
        {!collapsed && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-xs leading-tight">Vault</p>
                <p className="text-xs text-sidebar-accent-foreground">{userName}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-sidebar-accent-foreground" />
          </>
        )}
        {collapsed && <BarChart3 className="w-5 h-5 text-sidebar-primary" />}
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.key}>
            <button
              onClick={() => item.children && toggleMenu(item.key)}
              className={`w-full flex items-center gap-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${
                item.active ? "bg-sidebar-primary text-sidebar-primary-foreground" : ""
              } ${collapsed ? "justify-center p-2" : "justify-start px-3 py-2"}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="text-xs font-medium flex-1 text-left">{item.label}</span>
                  {item.children && (
                    <ChevronDown 
                      className={`w-3 h-3 transition-transform ${
                        expandedMenus.includes(item.key) ? "rotate-180" : ""
                      }`} 
                    />
                  )}
                </>
              )}
            </button>
            
            {/* Submenu */}
            {item.children && !collapsed && expandedMenus.includes(item.key) && (
              <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                {item.children.map((child) => (
                  <button
                    key={child.key}
                    className={`w-full flex items-center gap-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors px-3 py-1.5 ${
                      child.active ? "text-sidebar-primary-foreground font-medium" : ""
                    }`}
                  >
                    <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs">{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Collapse Button - Bottom center */}
      <div className="border-t border-sidebar-border p-3 flex justify-center">
        <button
          onClick={handleToggle}
          className="p-1.5 hover:bg-sidebar-accent rounded-md transition-colors"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  )
}
