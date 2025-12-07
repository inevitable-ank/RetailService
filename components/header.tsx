"use client"
import { useState, useEffect } from "react"
import { Search, Maximize2, Minimize2 } from "lucide-react"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error("Fullscreen error:", err)
    }
  }

  return (
    <header className="bg-card border-b border-border min-h-[44px] flex items-center">
      <div className="px-5 w-full">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-sm font-semibold">Sales Management System</h1>
          <div className="flex items-center gap-3">
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
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-secondary rounded-md transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
