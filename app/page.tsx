"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { FilterPanel } from "@/components/filter-panel"
import { TransactionTable } from "@/components/transaction-table"
import { Pagination } from "@/components/pagination"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"
import { getTransactions, getStats, type Transaction, type TransactionFilters } from "@/lib/api"

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Data state
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState({ totalUnits: 0, totalAmount: 0, totalDiscount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Query state
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<TransactionFilters>({
    regions: undefined,
    genders: undefined,
    ageRange: undefined,
    categories: undefined,
    tags: undefined,
    paymentMethods: undefined,
    dateRange: null,
  })
  const [sortBy, setSortBy] = useState("customerName")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1) // Reset to first page on search
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch transactions and stats
  const fetchData = useCallback(async () => {
    if (authLoading || !user) return

    setLoading(true)
    setError(null)

    try {
      // Prepare filters for API
      const apiFilters: TransactionFilters = {
        ...filters,
        // Convert ageRanges to ageRange if needed
        ageRange: filters.ageRange || undefined,
      }

      const [transactionsData, statsData] = await Promise.all([
        getTransactions({
          page: currentPage,
          pageSize: 10, // As per requirements
          search: debouncedSearch,
          filters: apiFilters,
          sortBy,
          sortOrder,
        }),
        getStats(apiFilters),
      ])

      setTransactions(transactionsData.transactions)
      setTotalPages(transactionsData.pagination.totalPages)
      setStats(statsData)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }, [user, authLoading, currentPage, debouncedSearch, filters, sortBy, sortOrder])

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy, sortOrder])

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
                {error}
              </div>
            ) : (
              <>
                <StatsCards stats={stats} />
                <TransactionTable data={transactions} />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
