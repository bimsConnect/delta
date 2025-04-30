import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Build filter
    const filter: any = {}

    if (category && category !== "all") {
      filter.category = category
    }

    // Get gallery images
    const images = await prisma.galleryImage.findMany({
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
        createdAt: "desc",
      },
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data galeri" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    // Check if we have a valid session
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 })
    }

    // Verify the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found. Please log in again." }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const imageFile = formData.get("image") as File | null

    // Validate input
    if (!title || !category || !imageFile) {
      return NextResponse.json({ error: "Judul, gambar, dan kategori diperlukan" }, { status: 400 })
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`

    // Upload image to Cloudinary
    const uploadResult = await uploadImage(base64Image)

    // Create gallery image
    const galleryImage = await prisma.galleryImage.create({
      data: {
        title,
        description,
        imageUrl: uploadResult.url,
        publicId: uploadResult.publicId,
        category: category as any,
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

    return NextResponse.json(galleryImage, { status: 201 })
  } catch (error) {
    console.error("Error creating gallery image:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengunggah gambar" }, { status: 500 })
  }
}