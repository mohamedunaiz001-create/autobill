import { type NextRequest, NextResponse } from "next/server"
import { ProductStore } from "@/lib/store"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const regionId = searchParams.get("regionId")

  if (regionId) {
    const products = ProductStore.getActive(regionId)
    return NextResponse.json({ products })
  }

  const products = ProductStore.getAll()
  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, price, taxRate, image, status, regionId } = body

    if (!name || !category || price === undefined || taxRate === undefined || !regionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = ProductStore.add({
      name,
      category,
      price: Number.parseFloat(price),
      taxRate: Number.parseFloat(taxRate),
      image: image || "/diverse-products-still-life.png",
      status: status || "active",
      regionId,
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
