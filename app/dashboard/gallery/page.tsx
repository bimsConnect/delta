"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Upload, Filter, Search, Trash2, Plus, ImageIcon, Loader2, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { GalleryStats } from "./stats"

type GalleryImage = {
  id: string
  title: string
  description?: string
  imageUrl: string
  publicId: string
  category: string
  author: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

export default function GalleryPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // New image form state
  const [newImage, setNewImage] = useState({
    title: "",
    description: "",
    category: "MAINTENANCE",
    file: null as File | null,
  })

  // Edit image form state
  const [editImage, setEditImage] = useState({
    title: "",
    description: "",
    category: "",
  })

  // Fetch gallery images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/gallery${categoryFilter !== "all" ? `?category=${categoryFilter}` : ""}`)

        if (!response.ok) {
          throw new Error("Failed to fetch gallery images")
        }

        const data = await response.json()
        setImages(data)
      } catch (error) {
        console.error("Error fetching gallery images:", error)
        toast({
          title: "Error",
          description: "Gagal mengambil data galeri",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [categoryFilter, toast])

  // Filter images based on search term
  const filteredImages = images.filter((image) => {
    return (
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      image.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setNewImage({ ...newImage, file })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle new image submission
  const handleSubmitImage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      if (!newImage.file) {
        throw new Error("Please select an image")
      }

      // Create form data
      const formData = new FormData()
      formData.append("title", newImage.title)
      formData.append("description", newImage.description)
      formData.append("category", newImage.category)
      formData.append("image", newImage.file)

      // Send to API
      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      })

      if (response.status === 401) {
        toast({
          title: "Error",
          description: "Anda harus login terlebih dahulu untuk mengupload gambar",
          variant: "destructive",
        })
        return
      }

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const createdImage = await response.json()

      // Add new image to state
      setImages([createdImage, ...images])

      toast({
        title: "Gambar berhasil diunggah",
        description: `Gambar "${newImage.title}" telah berhasil diunggah`,
      })

      // Reset form
      setNewImage({
        title: "",
        description: "",
        category: "MAINTENANCE",
        file: null,
      })
      setPreviewImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      setIsUploadDialogOpen(false)
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: error.message || "Gagal mengunggah gambar",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle edit image
  const handleEditImage = (image: GalleryImage) => {
    setSelectedImage(image)
    setEditImage({
      title: image.title,
      description: image.description || "",
      category: image.category,
    })
    setIsEditDialogOpen(true)
  }

  // Handle update image submission
  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage) return

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/gallery/${selectedImage.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editImage.title,
          description: editImage.description,
          category: editImage.category,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update image")
      }

      const updatedImage = await response.json()

      // Update image in state
      setImages(
        images.map((img) => {
          if (img.id === selectedImage.id) {
            return updatedImage
          }
          return img
        }),
      )

      toast({
        title: "Gambar berhasil diperbarui",
        description: `Gambar "${updatedImage.title}" telah berhasil diperbarui`,
      })

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating image:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui gambar",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle delete confirmation
  const handleDeleteConfirmation = (image: GalleryImage) => {
    setSelectedImage(image)
    setIsDeleteDialogOpen(true)
  }

  // Handle image deletion
  const handleDeleteImage = async () => {
    if (!selectedImage) return

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/gallery/${selectedImage.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete image")
      }

      // Remove image from state
      setImages(images.filter((image) => image.id !== selectedImage.id))

      toast({
        title: "Gambar berhasil dihapus",
        description: `Gambar "${selectedImage.title}" telah berhasil dihapus`,
      })

      setIsDeleteDialogOpen(false)
      setSelectedImage(null)
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus gambar",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "MAINTENANCE":
        return "Maintenance"
      case "TEAM":
        return "Tim"
      case "INSTALLATION":
        return "Instalasi"
      case "TRAINING":
        return "Pelatihan"
      default:
        return category
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "MAINTENANCE":
        return <Badge className="bg-blue-100 text-blue-800">Maintenance</Badge>
      case "TEAM":
        return <Badge className="bg-green-100 text-green-800">Tim</Badge>
      case "INSTALLATION":
        return <Badge className="bg-purple-100 text-purple-800">Instalasi</Badge>
      case "TRAINING":
        return <Badge className="bg-orange-100 text-orange-800">Pelatihan</Badge>
      default:
        return <Badge>{category}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Galeri</h1>
        <p className="text-muted-foreground">Kelola gambar dan dokumentasi aktivitas Divisi Mekanik</p>
      </div>

      <GalleryStats />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
        >
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari gambar..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="TEAM">Tim</SelectItem>
                  <SelectItem value="INSTALLATION">Instalasi</SelectItem>
                  <SelectItem value="TRAINING">Pelatihan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" /> Upload Gambar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Upload Gambar Baru</DialogTitle>
                  <DialogDescription>Upload gambar untuk dokumentasi aktivitas Divisi Mekanik</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitImage} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-title">Judul Gambar</Label>
                    <Input
                      id="image-title"
                      placeholder="Masukkan judul gambar"
                      value={newImage.title}
                      onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-category">Kategori</Label>
                    <Select
                      value={newImage.category}
                      onValueChange={(value) => setNewImage({ ...newImage, category: value as any })}
                    >
                      <SelectTrigger id="image-category">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="TEAM">Tim</SelectItem>
                        <SelectItem value="INSTALLATION">Instalasi</SelectItem>
                        <SelectItem value="TRAINING">Pelatihan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-description">Deskripsi (opsional)</Label>
                    <Textarea
                      id="image-description"
                      placeholder="Masukkan deskripsi gambar"
                      value={newImage.description}
                      onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-file">Pilih Gambar</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <input
                        id="image-file"
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="image-file" className="cursor-pointer">
                        {previewImage ? (
                          <div className="relative h-40 w-full">
                            <Image
                              src={previewImage || "/placeholder.svg"}
                              alt="Preview gambar yang dipilih"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <>
                            <Plus className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-1">Klik untuk memilih gambar atau drag & drop</p>
                            <p className="text-xs text-gray-500">Mendukung JPG, PNG, GIF (Maks. 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsUploadDialogOpen(false)
                        setPreviewImage(null)
                      }}
                      disabled={isProcessing}
                    >
                      Batal
                    </Button>
                    <Button type="submit" disabled={isProcessing || !newImage.file}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" /> Upload Gambar
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Galeri Gambar</CardTitle>
              <CardDescription>Dokumentasi kegiatan dan aktivitas Divisi Mekanik</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 text-sky-600 mr-2" />
                  <span>Memuat gambar...</span>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Tidak ada gambar</h3>
                  <p>Belum ada gambar yang diunggah atau sesuai dengan filter yang dipilih.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredImages.map((image) => (
                    <motion.div
                      key={image.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03 }}
                      className="overflow-hidden rounded-lg shadow-md"
                    >
                      <div className="relative h-64 w-full">
                        <Image
                          src={image.imageUrl || "/placeholder.svg?height=400&width=600"}
                          alt={`Gambar ${image.title}`}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                          onClick={() => setSelectedImage(image)}
                        />
                      </div>
                      <div className="p-4 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-navy-800 font-medium">{image.title}</h3>
                          {getCategoryBadge(image.category)}
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          Oleh: {image.author.name} • {formatDate(image.createdAt)}
                        </p>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditImage(image)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteConfirmation(image)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Image Detail Dialog */}
      <Dialog
        open={!!selectedImage && !isEditDialogOpen && !isDeleteDialogOpen}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedImage.title}</DialogTitle>
                <DialogDescription>
                  {getCategoryLabel(selectedImage.category)} • {formatDate(selectedImage.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="relative w-full h-[400px] my-4">
                <Image
                  src={selectedImage.imageUrl || "/placeholder.svg?height=800&width=1200"}
                  alt={`Detail gambar: ${selectedImage.title}`}
                  fill
                  className="object-contain"
                />
              </div>

              {selectedImage.description && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-1">Deskripsi</h4>
                  <p className="text-sm text-gray-600">{selectedImage.description}</p>
                </div>
              )}

              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Informasi</h4>
                <p className="text-sm text-gray-600">
                  Diunggah oleh {selectedImage.author.name} pada {formatDate(selectedImage.createdAt)}
                </p>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => handleEditImage(selectedImage)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit Gambar
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteConfirmation(selectedImage)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Hapus Gambar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Gambar</DialogTitle>
            <DialogDescription>Perbarui informasi gambar</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateImage} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Judul Gambar</Label>
              <Input
                id="edit-title"
                placeholder="Masukkan judul gambar"
                value={editImage.title}
                onChange={(e) => setEditImage({ ...editImage, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Kategori</Label>
              <Select
                value={editImage.category}
                onValueChange={(value) => setEditImage({ ...editImage, category: value as any })}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="TEAM">Tim</SelectItem>
                  <SelectItem value="INSTALLATION">Instalasi</SelectItem>
                  <SelectItem value="TRAINING">Pelatihan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi (opsional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Masukkan deskripsi gambar"
                value={editImage.description}
                onChange={(e) => setEditImage({ ...editImage, description: e.target.value })}
                rows={3}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isProcessing}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus gambar ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isProcessing}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteImage} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}