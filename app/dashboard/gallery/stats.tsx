"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Image from "next/image"

type GalleryStats = {
  categories: {
    maintenance: number
    team: number
    installation: number
    training: number
    total: number
  }
  recentImages: Array<{
    id: string
    title: string
    imageUrl: string
    category: string
    createdAt: string
    author: {
      name: string
    }
  }>
}

export function GalleryStats() {
  const [stats, setStats] = useState<GalleryStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/gallery/stats")

        if (!response.ok) {
          throw new Error("Failed to fetch gallery stats")
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching gallery stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600 mr-2" />
        <span>Memuat statistik galeri...</span>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Gagal memuat statistik galeri.</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Statistik Kategori</CardTitle>
          <CardDescription>Distribusi gambar berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Maintenance</p>
                <p className="text-2xl font-bold">{stats.categories.maintenance}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800 font-medium">Tim</p>
                <p className="text-2xl font-bold">{stats.categories.team}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-800 font-medium">Instalasi</p>
                <p className="text-2xl font-bold">{stats.categories.installation}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800 font-medium">Pelatihan</p>
                <p className="text-2xl font-bold">{stats.categories.training}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-800 font-medium">Total Gambar</p>
              <p className="text-3xl font-bold">{stats.categories.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gambar Terbaru</CardTitle>
          <CardDescription>Gambar yang baru diunggah</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentImages.length === 0 ? (
              <p className="text-center text-muted-foreground">Belum ada gambar yang diunggah.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {stats.recentImages.slice(0, 6).map((image) => (
                  <div key={image.id} className="relative overflow-hidden rounded-md group">
                    <div className="relative h-24 w-full">
                      <Image
                        src={image.imageUrl || "/placeholder.svg"}
                        alt={image.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-2">
                      <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 truncate">
                        {image.title}
                      </p>
                      <p className="text-white text-[10px] opacity-0 group-hover:opacity-100">
                        {formatDate(image.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
