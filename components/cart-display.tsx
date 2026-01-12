"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { useRegion } from "@/lib/region-context"
import type { CartItem } from "@/lib/types"

interface CartDisplayProps {
  items: CartItem[]
  onUpdateQuantity: (productId: string, delta: number) => void
  onRemove: (productId: string) => void
}

export function CartDisplay({ items, onUpdateQuantity, onRemove }: CartDisplayProps) {
  const { formatPrice, region } = useRegion()

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = items.reduce((sum, item) => sum + (item.product.price * item.quantity * item.product.taxRate) / 100, 0)
  const total = subtotal + tax

  return (
    <Card className="glass neon-border-purple flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <ShoppingCart className="h-5 w-5 text-accent" />
        <h2 className="font-semibold text-foreground">Shopping Cart</h2>
        <span className="ml-auto text-sm text-muted-foreground">
          {items.reduce((sum, item) => sum + item.quantity, 0)} items
        </span>
      </div>

      <ScrollArea className="flex-1 p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-2 opacity-50" />
            <p>Cart is empty</p>
            <p className="text-sm">Scan products to add them</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <img
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-foreground">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.product.price)} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-foreground">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => onRemove(item.product.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{region.taxName}</span>
          <span className="text-foreground">{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
          <span className="text-foreground">Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </Card>
  )
}
