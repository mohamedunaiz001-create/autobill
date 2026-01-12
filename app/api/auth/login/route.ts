import { type NextRequest, NextResponse } from "next/server"
import { AdminStore } from "@/lib/store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const admin = AdminStore.validateCredentials(email, password)

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Don't return password
    const { password: _, ...safeAdmin } = admin

    return NextResponse.json({ success: true, admin: safeAdmin })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
