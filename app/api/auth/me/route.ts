import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      console.log("No session found")
      return NextResponse.json({ error: "Unauthorized - No session" }, { status: 401 })
    }

    if (!session.id) {
      console.log("Session has no ID", session)
      return NextResponse.json({ error: "Unauthorized - Invalid session" }, { status: 401 })
    }

    console.log("Looking for user with ID:", session.id)

    // First check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: session.id as string },
    })

    if (!userExists) {
      console.log(`User with ID ${session.id} not found in database`)

      // Return 401 instead of 404 to be consistent with authentication errors
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    // If user exists, get the data with selected fields
    const user = await prisma.user.findUnique({
  where: { id: session.id as string },
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    position: true,
  },
})

if (!user) {
  console.log(`User with ID ${session.id} not found in database`)
  return NextResponse.json({ error: "User not found" }, { status: 401 })
}

return NextResponse.json({ user })


    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
      },
    })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
