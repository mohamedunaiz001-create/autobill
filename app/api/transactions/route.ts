import { type NextRequest, NextResponse } from "next/server"
import { TransactionStore } from "@/lib/store"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const regionId = searchParams.get("regionId")

  const transactions = TransactionStore.getAll(regionId || undefined)
  const stats = regionId ? TransactionStore.getStats(regionId) : null

  return NextResponse.json({ transactions, stats })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, paymentMethod, customerName, customerEmail, regionId } = body

    if (!items || !paymentMethod || !regionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const subtotal = items.reduce(
      (sum: number, item: { product: { price: number }; quantity: number }) => sum + item.product.price * item.quantity,
      0,
    )
    const tax = items.reduce(
      (sum: number, item: { product: { price: number; taxRate: number }; quantity: number }) =>
        sum + (item.product.price * item.quantity * item.product.taxRate) / 100,
      0,
    )

    const transaction = TransactionStore.add({
      items,
      subtotal,
      tax,
      total: subtotal + tax,
      paymentMethod,
      customerName,
      customerEmail,
      regionId,
    })

    return NextResponse.json({ success: true, transaction })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
