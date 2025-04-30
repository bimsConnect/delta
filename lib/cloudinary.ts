import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadFile(file: string, folder = "reports") {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto", // Auto-detect file type (image, pdf, etc.)
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    }
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error)
    throw new Error("Failed to upload file")
  }
}

export async function deleteFile(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error)
    throw new Error("Failed to delete file")
  }
}

export async function uploadImage(file: string, folder = "gallery") {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "image",
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error)
    throw new Error("Failed to upload image")
  }
}

export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    throw new Error("Failed to delete image")
  }
}

export default cloudinary
