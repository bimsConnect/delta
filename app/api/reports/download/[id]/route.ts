import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Safely extract the ID first to avoid the Next.js dynamic API error
  const reportId = params.id

  try {
    // Attempt to verify auth but don't block download if it fails
    let userId = "guest"
    try {
      const authResult = await verifyAuth(request)
      userId = authResult.userId || "guest"
    } catch (authError) {
      console.log("Auth verification failed, proceeding as guest:", authError)
      // Continue as guest user
    }

    // Find the report
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: { fileUrl: true, fileName: true, fileType: true },
    })

    if (!report || !report.fileUrl) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 })
    }

    // Log download activity
    console.log(`File download initiated: ${report.fileName || "unknown"} (${reportId}) by user ${userId}`)

    try {
      // Fetch the file from Cloudinary
      const fileResponse = await fetch(report.fileUrl)

      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file from storage: ${fileResponse.status} ${fileResponse.statusText}`)
      }

      // Get the file data as an array buffer
      const fileData = await fileResponse.arrayBuffer()

      // Create response with appropriate headers to trigger download
      const response = new NextResponse(fileData, {
        status: 200,
        headers: new Headers({
          "Content-Type": report.fileType || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${report.fileName || `report-${reportId}.pdf`}"`,
          "Content-Length": fileData.byteLength.toString(),
        }),
      })

      return response
    } catch (fetchError) {
      console.error("Error fetching file from storage:", fetchError)

      // If direct download fails, fall back to returning the URL
      return NextResponse.json({
        fileUrl: report.fileUrl,
        fileName: report.fileName || `report-${reportId}.pdf`,
        fileType: report.fileType || "application/pdf",
        directDownloadFailed: true,
        message: "Direct download failed, using fallback method",
      })
    }
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat mengunduh file",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 },
    )
  }
}