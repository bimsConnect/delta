"use client"
import { Calendar, Check, Clock, Download, FileText, X, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

type Report = {
  id: string
  title: string
  type: string
  date: string
  author: {
    name: string
  }
  status: string
  fileUrl?: string
  fileName?: string
}

export function DashboardRecentReports() {
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [recentReports, setRecentReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch recent reports from API
  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/reports/stats")

        if (!response.ok) {
          throw new Error("Failed to fetch report stats")
        }

        const data = await response.json()
        setRecentReports(data.recentReports || [])
      } catch (error) {
        console.error("Error fetching recent reports:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentReports()
  }, [])

  const handleDownload = async (report: Report) => {
    if (!report.fileUrl) {
      toast({
        title: "Error",
        description: "File tidak tersedia untuk diunduh",
        variant: "destructive",
      })
      return
    }

    setIsDownloading(report.id)

    try {
      // Get download info from API
      const response = await fetch(`/api/reports/download/${report.id}`)

      if (!response.ok) {
        throw new Error("Failed to download file")
      }

      const data = await response.json()

      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = data.fileUrl
      link.target = "_blank"
      link.download = data.fileName || `${report.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Berhasil",
        description: "File berhasil diunduh",
      })
    } catch (error) {
      console.error("Error downloading file:", error)
      toast({
        title: "Error",
        description: "Gagal mengunduh file",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <Check className="h-3 w-3 mr-1" /> Disetujui
          </Badge>
        )
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> Menunggu
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <X className="h-3 w-3 mr-1" /> Ditolak
          </Badge>
        )
      default:
        return null
    }
  }

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "DAILY":
        return "Harian"
      case "WEEKLY":
        return "Mingguan"
      case "MONTHLY":
        return "Bulanan"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600 mr-2" />
        <span>Memuat laporan terbaru...</span>
      </div>
    )
  }

  if (recentReports.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Tidak ada laporan terbaru yang menunggu persetujuan.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Judul</TableHead>
            <TableHead className="whitespace-nowrap">Tipe</TableHead>
            <TableHead className="whitespace-nowrap">Tanggal</TableHead>
            <TableHead className="whitespace-nowrap">Penulis</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
            <TableHead className="text-right whitespace-nowrap">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium max-w-[200px] truncate">{report.title}</TableCell>
              <TableCell className="whitespace-nowrap">{getReportTypeLabel(report.type)}</TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                  {formatDate(report.date)}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">{report.author.name}</TableCell>
              <TableCell>{getStatusBadge(report.status)}</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  {report.fileUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDownload(report)}
                      disabled={isDownloading === report.id}
                    >
                      {isDownloading === report.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span className="sr-only">Download</span>
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Tinjau
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
