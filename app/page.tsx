"use client"

import { useState, useCallback, useEffect } from "react"
import { CameraScanner } from "@/components/camera-scanner"
import { CartDisplay } from "@/components/cart-display"
import { PaymentSection } from "@/components/payment-section"
import { RegionSelector } from "@/components/region-selector"
import { Button } from "@/components/ui/button"
import { useRegion } from "@/lib/region-context"
import { Settings, Cpu } from "lucide-react"
import Link from "next/link"
import type { Product, CartItem } from "@/lib/types"

export default function CustomerCheckout() {
  const { region } = useRegion()
  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])

  // Fetch products for current region
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?regionId=${region.id}`)
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }
    fetchProducts()
  }, [region.id])

  const handleProductDetected = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const handleUpdateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const handleRemove = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const handlePaymentComplete = useCallback(
    async (method: "cash" | "upi" | "card", customerName?: string, customerEmail?: string) => {
      // Record transaction
      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            paymentMethod: method,
            customerName,
            customerEmail,
            regionId: region.id,
          }),
        })
      } catch (error) {
        console.error("Failed to record transaction:", error)
      }
      setCart([])
    },
    [cart, region.id],
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-cyan">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">AI Billing</h1>
              <p className="text-xs text-muted-foreground">Touchless Checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RegionSelector />
            <Link href="/admin">
              <Button variant="outline" size="icon" className="glass neon-border-purple bg-transparent">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Scanner - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <CameraScanner onProductDetected={handleProductDetected} products={products} />
          </div>

          {/* Cart & Payment - Stacked in 1 column */}
          <div className="space-y-6">
            <CartDisplay items={cart} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemove} />
            <PaymentSection items={cart} onPaymentComplete={handlePaymentComplete} />
          </div>
        </div>
      </main>
    </div>
  )
}
