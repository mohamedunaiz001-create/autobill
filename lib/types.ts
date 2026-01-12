export interface Region {
  id: string
  name: string
  currency: string
  currencySymbol: string
  taxName: string
  taxRates: number[]
  defaultTaxRate: number
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  taxRate: number
  image: string
  status: "active" | "inactive"
  regionId: string
  createdAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Transaction {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: "cash" | "upi" | "card"
  customerName?: string
  customerEmail?: string
  regionId: string
  createdAt: Date
}

export interface Admin {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
}

export interface AIDetection {
  id: string
  productId: string
  confidence: number
  timestamp: Date
}
