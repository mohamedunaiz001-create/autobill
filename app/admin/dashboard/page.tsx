"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRegion } from "@/lib/region-context"
import { RegionSelector } from "@/components/region-selector"
import { ProductManagement } from "@/components/product-management"
import { TransactionHistory } from "@/components/transaction-history"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cpu, LogOut, Package, Receipt, BarChart3, Settings, TrendingUp, DollarSign, ShoppingCart } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"

export default function AdminDashboard() {
  const { admin, isAuthenticated, logout } = useAuth()
  const { region, formatPrice } = useRegion()
  const [stats, setStats] = useState({ totalRevenue: 0, totalTransactions: 0, totalTax: 0 })

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/admin")
    }
  }, [isAuthenticated])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/transactions?regionId=${region.id}`)
        const data = await response.json()
        if (data.stats) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }
    fetchStats()
  }, [region.id])

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    redirect("/admin")
  }

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
              <h1 className="font-bold text-lg text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Welcome, {admin?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RegionSelector />
            <Link href="/">
              <Button variant="outline" className="glass bg-transparent">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Checkout
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="glass text-destructive bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="glass neon-border-cyan p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </Card>

          <Card className="glass neon-border-purple p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalTransactions}</p>
              </div>
            </div>
          </Card>

          <Card className="glass neon-border-cyan p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-neon-green/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-neon-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{region.taxName} Collected</p>
                <p className="text-2xl font-bold text-foreground">{formatPrice(stats.totalTax)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="glass mb-6">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <Receipt className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionHistory />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="glass neon-border-cyan p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">System Settings</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="font-medium text-foreground">Current Region</p>
                  <p className="text-sm text-muted-foreground">
                    {region.name} ({region.currency})
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="font-medium text-foreground">Tax System</p>
                  <p className="text-sm text-muted-foreground">
                    {region.taxName} - Available rates: {region.taxRates.join("%, ")}%
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <p className="font-medium text-foreground">AI Scanning</p>
                  <p className="text-sm text-neon-green">Active and running</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
