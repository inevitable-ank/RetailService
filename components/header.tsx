"use client"
import { Search } from "lucide-react"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border min-h-[44px] flex items-center">
      <div className="px-5 w-full">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-sm font-semibold">Sales Management System</h1>
          <div className="flex items-center gap-4 bg-background border border-border rounded px-4 w-full max-w-[400px] h-8">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Name, Phone no."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
