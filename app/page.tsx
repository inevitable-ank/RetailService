"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { FilterPanel } from "@/components/filter-panel"
import { TransactionTable } from "@/components/transaction-table"
import { Pagination } from "@/components/pagination"
import { generateSalesData } from "@/lib/mock-data"

export default function Dashboard() {
  const allData = useMemo(() => generateSalesData(100), [])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    regions: [] as string[],
    genders: [] as string[],
    ageRange: [0, 100] as [number, number],
    categories: [] as string[],
    tags: [] as string[],
    paymentMethods: [] as string[],
    dateRange: null as [Date, Date] | null,
  })
  const [sortBy, setSortBy] = useState("customerName")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const searchFiltered = useMemo(() => {
    if (!searchQuery) return allData
    const query = searchQuery.toLowerCase()
    return allData.filter((item) => item.customerName.toLowerCase().includes(query) || item.phoneNumber.includes(query))
  }, [allData, searchQuery])

  const filtered = useMemo(() => {
    return searchFiltered.filter((item) => {
      if (filters.regions.length > 0 && !filters.regions.includes(item.customerRegion)) return false
      if (filters.genders.length > 0 && !filters.genders.includes(item.gender)) return false
      if (item.age < filters.ageRange[0] || item.age > filters.ageRange[1]) return false
      if (filters.categories.length > 0 && !filters.categories.includes(item.productCategory)) return false
      if (filters.tags.length > 0 && !filters.tags.some((tag) => item.tags?.includes(tag))) return false
      if (filters.paymentMethods.length > 0 && !filters.paymentMethods.includes(item.paymentMethod)) return false
      if (filters.dateRange) {
        const itemDate = new Date(item.date)
        if (itemDate < filters.dateRange[0] || itemDate > filters.dateRange[1]) return false
      }
      return true
    })
  }, [searchFiltered, filters])

  const sorted = useMemo(() => {
    const data = [...filtered]
    data.sort((a, b) => {
      let aVal: any, bVal: any

      switch (sortBy) {
        case "date":
          aVal = new Date(a.date).getTime()
          bVal = new Date(b.date).getTime()
          break
        case "quantity":
          aVal = a.quantity
          bVal = b.quantity
          break
        case "customerName":
          aVal = a.customerName
          bVal = b.customerName
          break
        default:
          aVal = a.customerName
          bVal = b.customerName
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })
    return data
  }, [filtered, sortBy, sortOrder])

  const itemsPerPage = 15
  const totalPages = Math.ceil(sorted.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedData = sorted.slice(startIdx, startIdx + itemsPerPage)

  const stats = {
    totalUnits: sorted.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: sorted.reduce((sum, item) => sum + item.totalAmount, 0),
    totalDiscount: sorted.reduce((sum, item) => sum + (item.totalAmount - item.finalAmount), 0),
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            <StatsCards stats={stats} />
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
            <TransactionTable data={paginatedData} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  )
}
