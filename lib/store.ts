import type { Product, Transaction, Admin, AIDetection } from "./types"

// Mock product database - simulating products for different regions
const mockProducts: Product[] = [
  // India products
  {
    id: "1",
    name: "Parle-G Biscuits",
    category: "Snacks",
    price: 10,
    taxRate: 5,
    image: "/parle-g-biscuits-packet.jpg",
    status: "active",
    regionId: "in",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Amul Butter",
    category: "Dairy",
    price: 56,
    taxRate: 12,
    image: "/amul-butter-yellow-packet.jpg",
    status: "active",
    regionId: "in",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Tata Salt",
    category: "Grocery",
    price: 28,
    taxRate: 5,
    image: "/tata-salt-packet.jpg",
    status: "active",
    regionId: "in",
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Maggi Noodles",
    category: "Snacks",
    price: 14,
    taxRate: 18,
    image: "/maggi-noodles-packet.jpg",
    status: "active",
    regionId: "in",
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "Coca Cola 500ml",
    category: "Beverages",
    price: 40,
    taxRate: 28,
    image: "/classic-coca-cola.png",
    status: "active",
    regionId: "in",
    createdAt: new Date(),
  },
  {
    id: "6",
    name: "Lays Chips",
    category: "Snacks",
    price: 20,
    taxRate: 12,
    image: "/lays-chips-packet.jpg",
    status: "active",
    regionId: "in",
    createdAt: new Date(),
  },
  // US products
  {
    id: "7",
    name: "Oreo Cookies",
    category: "Snacks",
    price: 4.99,
    taxRate: 8.25,
    image: "/oreo-cookies-pack.jpg",
    status: "active",
    regionId: "us",
    createdAt: new Date(),
  },
  {
    id: "8",
    name: "Milk Gallon",
    category: "Dairy",
    price: 3.49,
    taxRate: 0,
    image: "/milk-gallon-jug.jpg",
    status: "active",
    regionId: "us",
    createdAt: new Date(),
  },
  {
    id: "9",
    name: "Pepsi 2L",
    category: "Beverages",
    price: 2.99,
    taxRate: 8.25,
    image: "/pepsi-2-liter-bottle.jpg",
    status: "active",
    regionId: "us",
    createdAt: new Date(),
  },
  // UK products
  {
    id: "10",
    name: "Digestive Biscuits",
    category: "Snacks",
    price: 1.5,
    taxRate: 0,
    image: "/mcvities-digestive-biscuits.jpg",
    status: "active",
    regionId: "uk",
    createdAt: new Date(),
  },
  {
    id: "11",
    name: "PG Tips Tea",
    category: "Beverages",
    price: 3.0,
    taxRate: 0,
    image: "/pg-tips-tea-box.jpg",
    status: "active",
    regionId: "uk",
    createdAt: new Date(),
  },
  // EU products
  {
    id: "12",
    name: "Nutella 400g",
    category: "Snacks",
    price: 4.5,
    taxRate: 20,
    image: "/nutella-jar.jpg",
    status: "active",
    regionId: "eu",
    createdAt: new Date(),
  },
  {
    id: "13",
    name: "San Pellegrino",
    category: "Beverages",
    price: 2.2,
    taxRate: 20,
    image: "/san-pellegrino-bottle.jpg",
    status: "active",
    regionId: "eu",
    createdAt: new Date(),
  },
]

// In-memory stores (in production, this would be a database)
const products: Product[] = [...mockProducts]
const transactions: Transaction[] = []
const admins: Admin[] = []
const detections: AIDetection[] = []

export const ProductStore = {
  getAll: (regionId?: string): Product[] => {
    if (regionId) {
      return products.filter((p) => p.regionId === regionId)
    }
    return products
  },
  getActive: (regionId: string): Product[] => {
    return products.filter((p) => p.status === "active" && p.regionId === regionId)
  },
  getById: (id: string): Product | undefined => {
    return products.find((p) => p.id === id)
  },
  add: (product: Omit<Product, "id" | "createdAt">): Product => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    products.push(newProduct)
    return newProduct
  },
  update: (id: string, updates: Partial<Product>): Product | undefined => {
    const index = products.findIndex((p) => p.id === id)
    if (index !== -1) {
      products[index] = { ...products[index], ...updates }
      return products[index]
    }
    return undefined
  },
  delete: (id: string): boolean => {
    const index = products.findIndex((p) => p.id === id)
    if (index !== -1) {
      products.splice(index, 1)
      return true
    }
    return false
  },
}

export const TransactionStore = {
  getAll: (regionId?: string): Transaction[] => {
    if (regionId) {
      return transactions.filter((t) => t.regionId === regionId)
    }
    return transactions
  },
  add: (transaction: Omit<Transaction, "id" | "createdAt">): Transaction => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    transactions.push(newTransaction)
    return newTransaction
  },
  getStats: (regionId: string) => {
    const regionTransactions = transactions.filter((t) => t.regionId === regionId)
    return {
      totalRevenue: regionTransactions.reduce((sum, t) => sum + t.total, 0),
      totalTransactions: regionTransactions.length,
      totalTax: regionTransactions.reduce((sum, t) => sum + t.tax, 0),
    }
  },
}

export const AdminStore = {
  getByEmail: (email: string): Admin | undefined => {
    return admins.find((a) => a.email === email)
  },
  create: (admin: Omit<Admin, "id" | "createdAt">): Admin => {
    const newAdmin: Admin = {
      ...admin,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    admins.push(newAdmin)
    return newAdmin
  },
  validateCredentials: (email: string, password: string): Admin | null => {
    const admin = admins.find((a) => a.email === email && a.password === password)
    return admin || null
  },
}

export const DetectionStore = {
  add: (detection: Omit<AIDetection, "id">): AIDetection => {
    const newDetection: AIDetection = {
      ...detection,
      id: Date.now().toString(),
    }
    detections.push(newDetection)
    return newDetection
  },
  getRecent: (limit = 50): AIDetection[] => {
    return detections.slice(-limit).reverse()
  },
}
