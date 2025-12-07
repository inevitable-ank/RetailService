"use client"

import { useState } from "react"
import { ChevronDown, RotateCcw } from "lucide-react"

interface FilterPanelProps {
  filters: {
    regions: string[]
    genders: string[]
    ageRange: [number, number]
    categories: string[]
    tags: string[]
    paymentMethods: string[]
    dateRange: [Date, Date] | null
  }
  onFiltersChange: (filters: any) => void
  sortBy: string
  onSortByChange: (value: string) => void
  sortOrder: "asc" | "desc"
  onSortOrderChange: (value: "asc" | "desc") => void
}

const REGIONS = ["North", "South", "East", "West", "Central"]
const GENDERS = ["Male", "Female"]
const CATEGORIES = ["Clothing", "Electronics", "Home", "Sports", "Beauty"]
const PAYMENT_METHODS = ["Credit Card", "Debit Card", "UPI", "Net Banking", "Cash"]
const AGE_RANGES = ["18-25", "26-35", "36-45", "46-55", "56+"]
const TAGS = ["VIP", "New", "Regular"]

export function FilterPanel({
  filters,
  onFiltersChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: FilterPanelProps) {
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null)

  const handleFilterToggle = (filterKey: string, value: string) => {
    const currentValues = filters[filterKey as keyof typeof filters] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    onFiltersChange({ ...filters, [filterKey]: newValues })
  }

  const resetFilters = () => {
    onFiltersChange({
      regions: [],
      genders: [],
      ageRange: [0, 100],
      categories: [],
      tags: [],
      paymentMethods: [],
      dateRange: null,
    })
    setExpandedDropdown(null)
  }

  const DropdownFilter = ({ label, options, filterKey }: { label: string; options: string[]; filterKey: string }) => (
    <div className="relative">
      <button
        onClick={() => setExpandedDropdown(expandedDropdown === filterKey ? null : filterKey)}
        className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border border-border rounded text-xs hover:bg-secondary transition-colors whitespace-nowrap"
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-3 h-3 ml-2 transition-transform ${expandedDropdown === filterKey ? "rotate-180" : ""}`}
        />
      </button>
      {expandedDropdown === filterKey && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded shadow-lg z-20 p-1 min-w-[120px]">
          {options.map((option: string) => (
            <label
              key={option}
              className="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer hover:bg-secondary rounded whitespace-nowrap"
            >
              <input
                type="checkbox"
                checked={(filters[filterKey as keyof typeof filters] as string[]).includes(option)}
                onChange={() => handleFilterToggle(filterKey, option)}
                className="w-3 h-3 rounded cursor-pointer"
              />
              <span className="text-xs">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded p-3">
      {/* Refresh Button */}
      <button
        onClick={resetFilters}
        className="p-1.5 bg-muted/50 border border-border rounded text-xs hover:bg-secondary transition-colors"
        title="Reset filters"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
      
      <DropdownFilter label="Customer Region" options={REGIONS} filterKey="regions" />
      <DropdownFilter label="Gender" options={GENDERS} filterKey="genders" />
      <DropdownFilter label="Age Range" options={AGE_RANGES} filterKey="ageRanges" />
      <DropdownFilter label="Product Category" options={CATEGORIES} filterKey="categories" />
      <DropdownFilter label="Tags" options={TAGS} filterKey="tags" />
      <DropdownFilter label="Payment Method" options={PAYMENT_METHODS} filterKey="paymentMethods" />

      {/* Date Filter */}
      <div className="relative">
        <button className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border border-border rounded text-xs hover:bg-secondary transition-colors whitespace-nowrap">
          <span>Date</span>
          <ChevronDown className="w-3 h-3 ml-2" />
        </button>
      </div>

      {/* Sort Dropdown - positioned on right */}
      <div className="ml-auto">
        <div className="relative">
          <button
            onClick={() => setExpandedDropdown(expandedDropdown === "sort" ? null : "sort")}
            className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border border-border rounded text-xs hover:bg-secondary transition-colors whitespace-nowrap"
          >
            <span>
              Sort by: {sortBy === "customerName" ? "Customer Name (A-Z)" : sortBy === "date" ? "Date" : "Quantity"}
            </span>
            <ChevronDown
              className={`w-3 h-3 ml-2 transition-transform ${expandedDropdown === "sort" ? "rotate-180" : ""}`}
            />
          </button>
          {expandedDropdown === "sort" && (
            <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded shadow-lg z-20 w-48">
              {[
                { key: "customerName", label: "Customer Name (A-Z)" },
                { key: "date", label: "Date" },
                { key: "quantity", label: "Quantity" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    if (sortBy === option.key) {
                      onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
                    } else {
                      onSortByChange(option.key)
                      onSortOrderChange("asc")
                    }
                    setExpandedDropdown(null)
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {sortBy === option.key && (
                      <span className="text-xs text-primary">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
