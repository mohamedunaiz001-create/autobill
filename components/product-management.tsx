"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRegion } from "@/lib/region-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Package, Loader2 } from "lucide-react"
import type { Product } from "@/lib/types"

export function ProductManagement() {
  const { region, formatPrice } = useRegion()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formName, setFormName] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formTaxRate, setFormTaxRate] = useState("")
  const [formImage, setFormImage] = useState("")
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active")

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?regionId=${region.id}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [region.id])

  const resetForm = () => {
    setFormName("")
    setFormCategory("")
    setFormPrice("")
    setFormTaxRate(region.defaultTaxRate.toString())
    setFormImage("")
    setFormStatus("active")
    setEditingProduct(null)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormName(product.name)
    setFormCategory(product.category)
    setFormPrice(product.price.toString())
    setFormTaxRate(product.taxRate.toString())
    setFormImage(product.image)
    setFormStatus(product.status)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (editingProduct) {
        // Update existing product
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            category: formCategory,
            price: Number.parseFloat(formPrice),
            taxRate: Number.parseFloat(formTaxRate),
            image: formImage || `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(formName)}`,
            status: formStatus,
          }),
        })
      } else {
        // Create new product
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            category: formCategory,
            price: Number.parseFloat(formPrice),
            taxRate: Number.parseFloat(formTaxRate),
            image: formImage || `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(formName)}`,
            status: formStatus,
            regionId: region.id,
          }),
        })
      }

      await fetchProducts()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to save product:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await fetch(`/api/products/${productId}`, { method: "DELETE" })
      await fetchProducts()
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  const handleToggleStatus = async (product: Product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: product.status === "active" ? "inactive" : "active",
        }),
      })
      await fetchProducts()
    } catch (error) {
      console.error("Failed to toggle status:", error)
    }
  }

  const categories = ["Snacks", "Beverages", "Dairy", "Grocery", "Electronics", "Household", "Other"]

  return (
    <Card className="glass neon-border-purple">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-accent" />
          <h2 className="font-semibold text-foreground">Product Management</h2>
          <span className="text-sm text-muted-foreground">({products.length} products)</span>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="neon-glow-cyan">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="glass neon-border-cyan">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter product name"
                  required
                  className="mt-1 bg-secondary/30"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formCategory} onValueChange={setFormCategory} required>
                  <SelectTrigger className="mt-1 bg-secondary/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ({region.currencySymbol})</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="0.00"
                    required
                    className="mt-1 bg-secondary/30"
                  />
                </div>

                <div>
                  <Label htmlFor="taxRate">{region.taxName} Rate (%)</Label>
                  <Select value={formTaxRate} onValueChange={setFormTaxRate} required>
                    <SelectTrigger className="mt-1 bg-secondary/30">
                      <SelectValue placeholder="Select rate" />
                    </SelectTrigger>
                    <SelectContent className="glass">
                      {region.taxRates.map((rate:any) => (
                        <SelectItem key={rate} value={rate.toString()}>
                          {rate}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="image">Image URL (Optional)</Label>
                <Input
                  id="image"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 bg-secondary/30"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="status">Active Status</Label>
                <Switch
                  id="status"
                  checked={formStatus === "active"}
                  onCheckedChange={(checked) => setFormStatus(checked ? "active" : "inactive")}
                />
              </div>

              <Button type="submit" className="w-full neon-glow-cyan" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[500px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Package className="h-12 w-12 mb-2 opacity-50" />
            <p>No products found for {region.name}</p>
            <p className="text-sm">Add your first product to get started</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className={`flex items-center gap-4 p-4 rounded-xl bg-secondary/30 ${
                  product.status === "inactive" ? "opacity-50" : ""
                }`}
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{formatPrice(product.price)}</p>
                  <p className="text-xs text-muted-foreground">
                    {region.taxName}: {product.taxRate}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={product.status === "active"} onCheckedChange={() => handleToggleStatus(product)} />
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}
