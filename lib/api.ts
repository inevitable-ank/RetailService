// Ensure API_BASE_URL always ends with /api
const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  if (envUrl) {
    // If env var is set, ensure it ends with /api
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`
  }
  return "http://localhost:4000/api"
}

const API_BASE_URL = getApiBaseUrl()

// Debug log (remove in production)
if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL)
}

export interface Transaction {
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

export interface TransactionsResponse {
  transactions: Transaction[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export interface FilterOptions {
  regions: string[]
  genders: string[]
  categories: string[]
  paymentMethods: string[]
  ageRange: {
    min: number
    max: number
  }
  tags: string[]
}

export interface Stats {
  totalUnits: number
  totalAmount: number
  totalDiscount: number
}

export interface TransactionFilters {
  regions?: string[]
  genders?: string[]
  ageRange?: [number, number]
  categories?: string[]
  tags?: string[]
  paymentMethods?: string[]
  dateRange?: [Date, Date] | null
}

export interface TransactionQueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  filters?: TransactionFilters
}

/**
 * Build query string from filters
 */
function buildQueryString(params: TransactionQueryParams): string {
  const queryParams = new URLSearchParams()

  if (params.page) queryParams.append("page", params.page.toString())
  if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString())
  if (params.search) queryParams.append("search", params.search)
  if (params.sortBy) queryParams.append("sortBy", params.sortBy)
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder)

  if (params.filters) {
    if (params.filters.regions && params.filters.regions.length > 0) {
      params.filters.regions.forEach((r) => queryParams.append("regions", r))
    }
    if (params.filters.genders && params.filters.genders.length > 0) {
      params.filters.genders.forEach((g) => queryParams.append("genders", g))
    }
    if (params.filters.ageRange) {
      queryParams.append("ageMin", params.filters.ageRange[0].toString())
      queryParams.append("ageMax", params.filters.ageRange[1].toString())
    }
    if (params.filters.categories && params.filters.categories.length > 0) {
      params.filters.categories.forEach((c) => queryParams.append("categories", c))
    }
    if (params.filters.tags && params.filters.tags.length > 0) {
      params.filters.tags.forEach((t) => queryParams.append("tags", t))
    }
    if (params.filters.paymentMethods && params.filters.paymentMethods.length > 0) {
      params.filters.paymentMethods.forEach((p) => queryParams.append("paymentMethods", p))
    }
    if (params.filters.dateRange) {
      queryParams.append("dateFrom", params.filters.dateRange[0].toISOString().split("T")[0])
      queryParams.append("dateTo", params.filters.dateRange[1].toISOString().split("T")[0])
    }
  }

  return queryParams.toString()
}

/**
 * Get transactions with filters, search, sort, and pagination
 */
export async function getTransactions(params: TransactionQueryParams): Promise<TransactionsResponse> {
  const queryString = buildQueryString(params)
  const url = `${API_BASE_URL}/transactions?${queryString}`
  
  try {
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(errorData.message || `Failed to fetch transactions: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(`Network error: Unable to connect to backend at ${API_BASE_URL}. Please ensure the backend server is running.`)
    }
    throw error
  }
}

/**
 * Get filter options
 */
export async function getFilterOptions(): Promise<FilterOptions> {
  const response = await fetch(`${API_BASE_URL}/transactions/filters`)

  if (!response.ok) {
    throw new Error(`Failed to fetch filter options: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get statistics
 */
export async function getStats(filters?: TransactionFilters): Promise<Stats> {
  const params: TransactionQueryParams = { filters }
  const queryString = buildQueryString(params)
  const url = `${API_BASE_URL}/transactions/stats?${queryString}`
  
  try {
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(errorData.message || `Failed to fetch stats: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(`Network error: Unable to connect to backend at ${API_BASE_URL}. Please ensure the backend server is running.`)
    }
    throw error
  }
}

/**
 * Upload CSV file
 */
export async function uploadTransactions(file: File): Promise<{ message: string; totalRecords: number; imported: number; errors: number; uploadId?: string }> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/transactions/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to upload file")
  }

  return response.json()
}

export interface UploadHistory {
  id: string
  fileName: string
  fileSize: string
  totalRecords: number
  importedRecords: number
  failedRecords: number
  status: string
  errorMessage: string | null
  uploadedBy: string | null
  uploadedAt: string
}

/**
 * Get upload history
 */
export async function getUploadHistory(): Promise<{ uploads: UploadHistory[] }> {
  const response = await fetch(`${API_BASE_URL}/transactions/uploads`)

  if (!response.ok) {
    throw new Error(`Failed to fetch upload history: ${response.statusText}`)
  }

  return response.json()
}

