import { Eye } from "lucide-react"

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
  const columns = [
    { key: "transactionId", label: "Transaction ID", width: 100 },
    { key: "date", label: "Date", width: 90 },
    { key: "customerId", label: "Customer ID", width: 100 },
    { key: "customerName", label: "Customer name", width: 110 },
    { key: "phoneNumber", label: "Phone Number", width: 130 },
    { key: "gender", label: "Gender", width: 75 },
    { key: "age", label: "Age", width: 60 },
    { key: "productCategory", label: "Product Category", width: 120 },
    { key: "quantity", label: "Quantity", width: 75 },
    { key: "totalAmount", label: "Total Amount", width: 100 },
    { key: "customerRegion", label: "Customer region", width: 110 },
    { key: "productId", label: "Product ID", width: 100 },
    { key: "employeeName", label: "Employee name", width: 110 },
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

  return (
    <div className="bg-card border border-border rounded overflow-hidden">
      <div className="horizontal-scroll">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className="px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap" style={{ width: 50 }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-6 text-center text-muted-foreground text-xs">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-secondary transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ width: col.width }}
                      className="px-3 py-2 text-foreground whitespace-nowrap"
                    >
                      {formatValue(col.key, row[col.key as keyof Transaction])}
                    </td>
                  ))}
                  <td className="px-3 py-2" style={{ width: 50 }}>
                    <button className="text-primary hover:text-primary/80 transition-colors">
                      <Eye className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
