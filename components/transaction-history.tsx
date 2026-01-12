"use client"

import { useState, useEffect } from "react"
import { useRegion } from "@/lib/region-context"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Receipt, Loader2, CreditCard, Banknote, Smartphone } from "lucide-react"
import type { Transaction } from "@/lib/types"

export function TransactionHistory() {
  const { region, formatPrice } = useRegion()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions?regionId=${region.id}`)
        const data = await response.json()
        setTransactions(data.transactions || [])
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [region.id])

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4" />
      case "upi":
        return <Smartphone className="h-4 w-4" />
      case "card":
        return <CreditCard className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  return (
    <Card className="glass neon-border-cyan">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <Receipt className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground">Transaction History</h2>
        <span className="text-sm text-muted-foreground">({transactions.length} transactions)</span>
      </div>

      <ScrollArea className="h-[500px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Receipt className="h-12 w-12 mb-2 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Transactions will appear here after customer checkout</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      {getPaymentIcon(transaction.paymentMethod)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.customerName || "Guest Customer"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{formatPrice(transaction.total)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{transaction.paymentMethod}</p>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Items: {transaction.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    <span>Subtotal: {formatPrice(transaction.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      {region.taxName}: {formatPrice(transaction.tax)}
                    </span>
                    {transaction.customerEmail && (
                      <span className="truncate max-w-[150px]">{transaction.customerEmail}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}
