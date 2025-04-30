import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    // Get total counts
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.report.count({ where: { status: "APPROVED" } }),
      prisma.report.count({ where: { status: "REJECTED" } }),
    ])

    // Get recent reports
    const recentReports = await prisma.report.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      total,
      pending,
      approved,
      rejected,
      recentReports,
    })
  } catch (error) {
    console.error("Error fetching report stats:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil statistik laporan" }, { status: 500 })
  }
}
