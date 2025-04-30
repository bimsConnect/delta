import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      select: { fileUrl: true, fileName: true, fileType: true },
    })

    if (!report || !report.fileUrl) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 })
    }

    // Log download activity (optional)
    console.log(`File downloaded: ${report.fileName} (${params.id})`)

    // Redirect to the file URL
    return NextResponse.json({
      fileUrl: report.fileUrl,
      fileName: report.fileName,
      fileType: report.fileType,
    })
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengunduh file" }, { status: 500 })
  }
}
