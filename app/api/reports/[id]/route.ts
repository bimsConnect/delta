import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"
import { deleteFile } from "@/lib/cloudinary"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
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

    if (!report) {
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error fetching report:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data laporan" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status, comment } = await request.json()

    // Validate input
    if (!status) {
      return NextResponse.json({ error: "Status laporan diperlukan" }, { status: 400 })
    }

    // Update report
    const report = await prisma.report.update({
      where: { id: params.id },
      data: {
        status: status as any,
        comment,
      },
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

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui laporan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the report to check if it has a file
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      select: { publicId: true, authorId: true },
    })

    if (!report) {
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 })
    }

    // Only allow author or admin to delete
    if (report.authorId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Tidak memiliki izin untuk menghapus laporan ini" }, { status: 403 })
    }

    // Delete file from Cloudinary if exists
    if (report.publicId) {
      await deleteFile(report.publicId)
    }

    // Delete report
    await prisma.report.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting report:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat menghapus laporan" }, { status: 500 })
  }
}
