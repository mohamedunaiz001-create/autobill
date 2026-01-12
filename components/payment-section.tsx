"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Banknote, Smartphone, CheckCircle, Loader2 } from "lucide-react"
import { useRegion } from "@/lib/region-context"
import type { CartItem } from "@/lib/types"

interface PaymentSectionProps {
  items: CartItem[]
  onPaymentComplete: (method: "cash" | "upi" | "card", customerName?: string, customerEmail?: string) => void
}

export function PaymentSection({ items, onPaymentComplete }: PaymentSectionProps) {
  const { formatPrice, region } = useRegion()
  const [selectedMethod, setSelectedMethod] = useState<"cash" | "upi" | "card" | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = items.reduce((sum, item) => sum + (item.product.price * item.quantity * item.product.taxRate) / 100, 0)
  const total = subtotal + tax

  const handlePayment = async () => {
    if (!selectedMethod || items.length === 0) return

    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsComplete(true)

    setTimeout(() => {
      onPaymentComplete(selectedMethod, customerName || undefined, customerEmail || undefined)
      setIsComplete(false)
      setSelectedMethod(null)
      setCustomerName("")
      setCustomerEmail("")
    }, 2000)
  }

  const paymentMethods = [
    { id: "cash" as const, label: "Cash", icon: Banknote },
    { id: "upi" as const, label: "UPI", icon: Smartphone },
    { id: "card" as const, label: "Card", icon: CreditCard },
  ]

  if (isComplete) {
    return (
      <Card className="glass neon-border-cyan p-8 text-center neon-glow-cyan">
        <CheckCircle className="h-16 w-16 text-neon-green mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2 text-foreground">Payment Successful!</h3>
        <p className="text-muted-foreground">Thank you for your purchase</p>
        <p className="text-2xl font-bold text-primary mt-4">{formatPrice(total)}</p>
      </Card>
    )
  }

  return (
    <Card className="glass neon-border-cyan p-6">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Payment</h2>

      {/* Customer Details (Optional) */}
      <div className="space-y-3 mb-6">
        <div>
          <Label htmlFor="name" className="text-sm text-muted-foreground">
            Name (Optional)
          </Label>
          <Input
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your name"
            className="mt-1 bg-secondary/30"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm text-muted-foreground">
            Email (Optional)
          </Label>
          <Input
            id="email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-1 bg-secondary/30"
          />
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
              selectedMethod === method.id
                ? "border-primary bg-primary/20 neon-glow-cyan"
                : "border-border bg-secondary/20 hover:border-primary/50"
            }`}
          >
            <method.icon
              className={`h-6 w-6 ${selectedMethod === method.id ? "text-primary" : "text-muted-foreground"}`}
            />
            <span
              className={`text-sm font-medium ${selectedMethod === method.id ? "text-primary" : "text-foreground"}`}
            >
              {method.label}
            </span>
          </button>
        ))}
      </div>

      {/* Total & Pay Button */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-secondary/30">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{region.taxName}</span>
            <span className="text-foreground">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>

        <Button
          className="w-full h-14 text-lg font-semibold neon-glow-cyan"
          disabled={!selectedMethod || items.length === 0 || isProcessing}
          onClick={handlePayment}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${formatPrice(total)}`
          )}
        </Button>
      </div>
    </Card>
  )
}
