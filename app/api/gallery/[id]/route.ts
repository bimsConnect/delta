import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"
import { deleteImage } from "@/lib/cloudinary"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const image = await prisma.galleryImage.findUnique({
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

    if (!image) {
      return NextResponse.json({ error: "Gambar tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error("Error fetching gallery image:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data gambar" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, category } = await request.json()

    // Validate input
    if (!title || !category) {
      return NextResponse.json({ error: "Judul dan kategori diperlukan" }, { status: 400 })
    }

    // Check if user is authorized to update
    const image = await prisma.galleryImage.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    })

    if (!image) {
      return NextResponse.json({ error: "Gambar tidak ditemukan" }, { status: 404 })
    }

    // Only allow author or admin/manager to update
    if (image.authorId !== session.id && session.role !== "ADMIN" && session.role !== "MANAGER") {
      return NextResponse.json({ error: "Tidak memiliki izin untuk memperbarui gambar ini" }, { status: 403 })
    }

    // Update gallery image
    const updatedImage = await prisma.galleryImage.update({
      where: { id: params.id },
      data: {
        title,
        description,
        category: category as any,
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

    return NextResponse.json(updatedImage)
  } catch (error) {
    console.error("Error updating gallery image:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui gambar" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get image
    const image = await prisma.galleryImage.findUnique({
      where: { id: params.id },
      select: { publicId: true, authorId: true },
    })

    if (!image) {
      return NextResponse.json({ error: "Gambar tidak ditemukan" }, { status: 404 })
    }

    // Only allow author or admin/manager to delete
    if (image.authorId !== session.id && session.role !== "ADMIN" && session.role !== "MANAGER") {
      return NextResponse.json({ error: "Tidak memiliki izin untuk menghapus gambar ini" }, { status: 403 })
    }

    // Delete image from Cloudinary
    await deleteImage(image.publicId)

    // Delete image from database
    await prisma.galleryImage.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting gallery image:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat menghapus gambar" }, { status: 500 })
  }
}
