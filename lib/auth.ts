import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"

// Use a strong JWT secret - in production, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "K_jeFcqDt1Zkyy394m3pS1CTOxIcnO5b"

export async function signJwtToken(payload: any) {
  try {
    console.log("Creating JWT token for payload:", JSON.stringify(payload))

    // Ensure the payload has an ID
    if (!payload.id) {
      console.error("Payload missing ID:", payload)
      throw new Error("User ID is required for JWT token")
    }

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d") // Token expires in 1 day
      .sign(new TextEncoder().encode(JWT_SECRET))

    console.log("JWT token created successfully")
    return token
  } catch (error) {
    console.error("Error signing JWT token:", error)
    throw new Error("Failed to sign JWT token")
  }
}

export async function verifyJwtToken(token: string) {
  try {
    console.log("Verifying JWT token")
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    console.log("JWT token verified successfully, payload:", JSON.stringify(payload))
    return payload
  } catch (error) {
    console.error("Error verifying JWT token:", error)
    // Check if the error is due to an expired token
    if (error instanceof Error) {
      if (error.message.includes("expired")) {
        console.log("Token has expired")
      } else {
        console.log("Token verification failed:", error.message)
      }
    }
    return null
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      console.log("No auth token found in cookies")
      return null
    }

    console.log("Auth token found in cookies, verifying...")
    const payload = await verifyJwtToken(token)

    if (!payload) {
      console.log("Token verification failed")
      return null
    }

    if (!payload.id) {
      console.log("Token payload missing ID:", payload)
      return null
    }

    console.log("Session retrieved successfully for user ID:", payload.id)
    return payload
  } catch (error) {
    console.error("Error in getSession:", error)
    return null
  }
}

export async function updateSession(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      console.log("No auth token found in request cookies")
      return null
    }

    console.log("Auth token found in request cookies, verifying...")
    const payload = await verifyJwtToken(token)

    if (!payload) {
      console.log("Token verification failed in updateSession")
      return null
    }

    console.log("Session updated successfully for user ID:", payload.id)
    return payload
  } catch (error) {
    console.error("Error in updateSession:", error)
    return null
  }
}

export async function setAuthCookie(response: NextResponse, token: string) {
  console.log("Setting auth cookie")

  response.cookies.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  })

  console.log("Auth cookie set successfully")
  return response
}

export async function removeAuthCookie(response: NextResponse) {
  console.log("Removing auth cookie")

  response.cookies.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  console.log("Auth cookie removed successfully")
  return response
}

export async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    throw new Error("unauthorized")
  }

  try {
    const verified = await verifyJwtToken(token)
    if (!verified) {
      throw new Error("unauthorized")
    }
    return verified as { id: string }
  } catch (error) {
    throw new Error("unauthorized")
  }
}