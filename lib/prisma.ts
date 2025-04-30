import { PrismaClient } from "@prisma/client"

// Add better error handling for Prisma connection
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Add a test function to check database connection
export async function testDatabaseConnection() {
  try {
    // Try a simple query to test the connection
    await prisma.$queryRaw`SELECT 1`
    console.log("Database connection successful")
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

export default prisma
