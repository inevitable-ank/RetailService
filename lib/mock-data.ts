export interface SalesTransaction {
    transactionId: string
    date: string
    customerId: string
    customerName: string
    phoneNumber: string
    gender: string
    age: number
    productCategory: string
    quantity: number
    pricePerUnit: number
    discount: number
    totalAmount: number
    finalAmount: number
    customerRegion: string
    productId: string
    employeeName: string
    paymentMethod: string
    tags?: string[]
  }
  
  const CUSTOMERS = [
    "Nisha Yadav",
    "Rahul Singh",
    "Priya Sharma",
    "Vikram Patel",
    "Anjali Gupta",
    "Arjun Kumar",
    "Neha Desai",
    "Rohit Verma",
    "Sneha Iyer",
    "Aditya Chopra",
  ]
  
  const REGIONS = ["North", "South", "East", "West", "Central"]
  const CATEGORIES = ["Clothing", "Electronics", "Home", "Sports", "Beauty"]
  const PAYMENT_METHODS = ["Credit Card", "Debit Card", "UPI", "Net Banking", "Cash"]
  const EMPLOYEES = ["Anil Singh", "Ravi Kumar", "Priya Patel", "Sahil Reddy", "Meera Nair"]
  
  export function generateSalesData(count: number): SalesTransaction[] {
    const data: SalesTransaction[] = []
    const today = new Date()
  
    for (let i = 0; i < count; i++) {
      const transactionId = `${1234567 + i}`
      const date = new Date(today.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)
      const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)]
      const region = REGIONS[Math.floor(Math.random() * REGIONS.length)]
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
      const quantity = Math.floor(Math.random() * 5) + 1
      const pricePerUnit = Math.floor(Math.random() * 5000) + 500
      const discount = Math.floor(Math.random() * 20)
      const totalAmount = quantity * pricePerUnit
      const discountAmount = Math.floor((totalAmount * discount) / 100)
      const finalAmount = totalAmount - discountAmount
  
      data.push({
        transactionId,
        date: date.toISOString().split("T")[0],
        customerId: `CUST${String(1001 + i).padStart(5, "0")}`,
        customerName: customer,
        phoneNumber: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        gender: Math.random() > 0.5 ? "Male" : "Female",
        age: Math.floor(Math.random() * 50) + 18,
        productCategory: category,
        quantity,
        pricePerUnit,
        discount,
        totalAmount,
        finalAmount,
        customerRegion: region,
        productId: `PROD${String(2016 + Math.floor(Math.random() * 1000)).padStart(5, "0")}`,
        employeeName: EMPLOYEES[Math.floor(Math.random() * EMPLOYEES.length)],
        paymentMethod: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
        tags: Math.random() > 0.5 ? ["VIP"] : undefined,
      })
    }
  
    return data
  }
  