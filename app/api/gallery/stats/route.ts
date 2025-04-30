import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    // Get counts by category
    const [maintenance, team, installation, training, total] = await Promise.all([
      prisma.galleryImage.count({ where: { category: "MAINTENANCE" } }),
      prisma.galleryImage.count({ where: { category: "TEAM" } }),
      prisma.galleryImage.count({ where: { category: "INSTALLATION" } }),
      prisma.galleryImage.count({ where: { category: "TRAINING" } }),
      prisma.galleryImage.count(),
    ])

    // Get recent images
    const recentImages = await prisma.galleryImage.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      categories: {
        maintenance,
        team,
        installation,
        training,
        total,
      },
      recentImages,
    })
  } catch (error) {
    console.error("Error fetching gallery stats:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil statistik galeri" }, { status: 500 })
  }
}
