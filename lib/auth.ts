import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "K_jeFcqDt1Zkyy394m3pS1CTOxIcnO5b"

export async function signJwtToken(payload: any) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d") // Token expires in 1 day
      .sign(new TextEncoder().encode(JWT_SECRET))

    return token
  } catch (error) {
    console.error("Error signing JWT token:", error)
    throw new Error("Failed to sign JWT token")
  }
}

// Update the verifyJwtToken function to handle errors better
export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload
  } catch (error) {
    console.error("Error verifying JWT token:", error)
    // Check if the error is due to an expired token
    if (error instanceof Error && error.message.includes("expired")) {
      console.log("Token has expired")
    }
    return null
  }
}

// Update the getSession function to provide better error handling and debugging
export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    console.log("No auth token found in cookies")
    return null
  }

  try {
    const payload = await verifyJwtToken(token)
    if (!payload) {
      console.log("Token verification failed")
      return null
    }
    return payload
  } catch (error) {
    console.error("Error in getSession:", error)
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) return null

  try {
    const payload = await verifyJwtToken(token)
    return payload
  } catch (error) {
    return null
  }
}

export async function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  })

  return response
}

export async function removeAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}
