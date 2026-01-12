import { type NextRequest, NextResponse } from "next/server"
import { AdminStore } from "@/lib/store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if admin already exists
    const existing = AdminStore.getByEmail(email)
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // In production, password should be hashed with bcrypt
    // For demo purposes, we store it as-is
    const admin = AdminStore.create({ name, email, password })

    // Don't return password
    const { password: _, ...safeAdmin } = admin

    return NextResponse.json({ success: true, admin: safeAdmin })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
