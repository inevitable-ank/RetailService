"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface Transaction {
  transactionId: string
  date: string
  customerId: string
  customerName: string
  phoneNumber: string
  gender: string
  age: number
  productCategory: string
  quantity: number
  totalAmount: number
  customerRegion: string
  productId: string
  employeeName: string
}

interface TransactionTableProps {
  data: Transaction[]
}

export function TransactionTable({ data }: TransactionTableProps) {
  // Column widths from Figma design
  const allColumns = [
    { key: "transactionId", label: "Transaction ID", minWidth: 156 },
    { key: "date", label: "Date", minWidth: 120 },
    { key: "customerId", label: "Customer ID", minWidth: 156 },
    { key: "customerName", label: "Customer name", minWidth: 168 },
    { key: "phoneNumber", label: "Phone Number", minWidth: 156 },
    { key: "gender", label: "Gender", minWidth: 120 },
    { key: "age", label: "Age", minWidth: 120 },
    { key: "productCategory", label: "Product Category", minWidth: 125 },
    { key: "quantity", label: "Quantity", minWidth: 156 },
    // Columns after horizontal scroll
    { key: "totalAmount", label: "Total Amount", minWidth: 156 },
    { key: "customerRegion", label: "Customer region", minWidth: 156 },
    { key: "productId", label: "Product ID", minWidth: 156 },
    { key: "employeeName", label: "Employee name", minWidth: 156 },
  ]

  const formatValue = (key: string, value: any) => {
    if (key === "date") {
      return new Date(value).toISOString().split("T")[0]
    }
    if (key === "totalAmount") {
      return `₹${value.toLocaleString()}`
    }
    return value
  }

  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500) // Reset after 1.5s
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Calculate total min width for the table
  const totalMinWidth = allColumns.reduce((sum, col) => sum + col.minWidth, 0)

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: totalMinWidth }}>
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {allColumns.map((col) => (
                <th
                  key={col.key}
                  style={{ minWidth: col.minWidth }}
                  className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={allColumns.length} className="px-4 py-8 text-center text-muted-foreground text-sm">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                  {allColumns.map((col) => (
                    <td
                      key={col.key}
                      style={{ minWidth: col.minWidth }}
                      className="px-4 py-3 text-foreground whitespace-nowrap"
                    >
                      {col.key === "phoneNumber" ? (
                        <span className="inline-flex items-center gap-2">
                          {row.phoneNumber}
                          <button
                            onClick={() => copyToClipboard(row.phoneNumber, row.transactionId)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title="Copy phone number"
                          >
                            {copiedId === row.transactionId ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </span>
                      ) : col.key === "productCategory" ? (
                        <span className="text-primary font-medium">
                          {row.productCategory}
                        </span>
                      ) : (
                        formatValue(col.key, row[col.key as keyof Transaction])
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
