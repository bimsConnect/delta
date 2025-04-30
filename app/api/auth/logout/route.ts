import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 })

    // Remove auth cookie
    await removeAuthCookie(response)

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat logout" }, { status: 500 })
  }
}
