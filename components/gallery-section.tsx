"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type GalleryImage = {
  id: string
  title: string
  description?: string
  imageUrl: string
  category: string
  author: {
    name: string
  }
  createdAt: string
}

export function GallerySection() {
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/gallery${filter !== "all" ? `?category=${filter}` : ""}`)

        if (!response.ok) {
          throw new Error("Failed to fetch gallery images")
        }

        const data = await response.json()
        setGalleryImages(data)
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

    fetchGalleryImages()
  }, [filter, toast])

  const categories = [
    { id: "all", name: "Semua" },
    { id: "MAINTENANCE", name: "Maintenance" },
    { id: "TEAM", name: "Tim" },
    { id: "INSTALLATION", name: "Instalasi" },
    { id: "TRAINING", name: "Pelatihan" },
  ]

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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Galeri Aktivitas</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dokumentasi kegiatan dan aktivitas Divisi Mekanik PT. Delta Rezeki Abadi.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category.id ? "bg-sky-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setFilter(category.id)}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-sky-600 mr-2" />
            <span>Memuat galeri...</span>
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Tidak ada gambar yang ditemukan untuk kategori ini.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {galleryImages.map((image) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={image.imageUrl || "/placeholder.svg?height=400&width=600"}
                    alt={`Gambar ${image.title}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-navy-800 font-medium">{image.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Oleh: {image.author.name} • {formatDate(image.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative max-w-4xl w-full h-auto max-h-[80vh] bg-white rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-[60vh]">
                  <Image
                    src={selectedImage.imageUrl || "/placeholder.svg?height=800&width=1200"}
                    alt={`Detail gambar: ${selectedImage.title}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-xl font-medium text-navy-800">{selectedImage.title}</h3>
                  {selectedImage.description && <p className="text-gray-600 mt-2">{selectedImage.description}</p>}
                  <p className="text-sm text-gray-500 mt-2">
                    Oleh: {selectedImage.author.name} • {formatDate(selectedImage.createdAt)}
                  </p>
                </div>
                <button
                  className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-6 w-6 text-gray-800" />
                  <span className="sr-only">Close</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
