import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"
import { uploadFile } from "@/lib/cloudinary"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    // Build filter
    const filter: any = {}

    if (type && type !== "all") {
      filter.type = type
    }

    if (status && status !== "all") {
      filter.status = status
    }

    // Get reports
    const reports = await prisma.report.findMany({
      where: filter,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data laporan" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    // Check if we have a valid session
    if (!session) {
      console.log("No session found when uploading report")
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 })
    }

    if (!session.id) {
      console.log("Session has no ID", session)
      return NextResponse.json({ error: "Invalid session. Please log in again." }, { status: 401 })
    }

    // Verify the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
    })

    if (!user) {
      console.log(`User with ID ${session.id} not found in database during report upload`)
      return NextResponse.json({ error: "User not found. Please log in again." }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const type = formData.get("type") as string
    const date = formData.get("date") as string
    const description = formData.get("description") as string
    const file = formData.get("file") as File | null

    // Validate input
    if (!title || !type || !date) {
      return NextResponse.json({ error: "Judul, tipe, dan tanggal laporan diperlukan" }, { status: 400 })
    }

    let fileUrl = null
    let publicId = null
    let fileName = null
    let fileType = null

    // Upload file if provided
    if (file) {
      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

      // Upload to Cloudinary
      const uploadResult = await uploadFile(base64)
      fileUrl = uploadResult.url
      publicId = uploadResult.publicId
      fileName = file.name
      fileType = file.type
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        title,
        type: type as any,
        date: new Date(date),
        fileUrl,
        publicId,
        fileName,
        fileType,
        description,
        authorId: user.id,
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

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat laporan" }, { status: 500 })
  }
}
