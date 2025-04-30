"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Calendar, Check, Clock, Download, FileText, Filter, Search, X, Upload, Loader2, FileUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { useToast } from "@/hooks/use-toast"

type Report = {
  id: string
  title: string
  type: string
  date: string
  author: {
    id: string
    name: string
    email: string
  }
  status: string
  fileUrl?: string
  fileName?: string
  description?: string
  comment?: string
  createdAt: string
  updatedAt: string
}

export default function ReportsPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [reviewComment, setReviewComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reports, setReports] = useState<Report[]>([])

  // New report form state
  const [newReport, setNewReport] = useState({
    title: "",
    type: "DAILY",
    date: new Date().toISOString().split("T")[0],
    description: "",
    file: null as File | null,
  })

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true)

        // Build query string
        let queryString = "?"
        if (typeFilter !== "all") queryString += `type=${typeFilter}&`
        if (statusFilter !== "all") queryString += `status=${statusFilter}&`

        const response = await fetch(`/api/reports${queryString}`)

        if (!response.ok) {
          throw new Error("Failed to fetch reports")
        }

        const data = await response.json()
        setReports(data)
      } catch (error) {
        console.error("Error fetching reports:", error)
        toast({
          title: "Error",
          description: "Gagal mengambil data laporan",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [typeFilter, statusFilter, toast])

  // Filter reports based on search term
  const filteredReports = reports.filter((report) => {
    return (
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Group reports by status for tabs
  const pendingReports = filteredReports.filter((report) => report.status === "PENDING")
  const approvedReports = filteredReports.filter((report) => report.status === "APPROVED")
  const rejectedReports = filteredReports.filter((report) => report.status === "REJECTED")

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewReport({ ...newReport, file: e.target.files[0] })
    }
  }

  // Handle report approval or rejection
  const handleReviewReport = async (action: "APPROVED" | "REJECTED") => {
    if (!selectedReport) return

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/reports/${selectedReport.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action,
          comment: reviewComment,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update report status")
      }

      // Refresh reports list
      const updatedResponse = await fetch(`/api/reports?type=${typeFilter}&status=${statusFilter}`)
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json()
        setReports(updatedData)
      }

      toast({
        title: action === "APPROVED" ? "Laporan disetujui" : "Laporan ditolak",
        description: `Laporan "${selectedReport.title}" telah ${action === "APPROVED" ? "disetujui" : "ditolak"}`,
      })

      setIsReviewDialogOpen(false)
      setReviewComment("")
    } catch (error) {
      console.error("Error updating report:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui status laporan",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle new report submission
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("title", newReport.title)
      formData.append("type", newReport.type)
      formData.append("date", newReport.date)
      formData.append("description", newReport.description)

      if (newReport.file) {
        formData.append("file", newReport.file)
      }

      // Send to API
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to create report")
      }

      // Refresh reports list
      const updatedResponse = await fetch(`/api/reports?type=${typeFilter}&status=${statusFilter}`)
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json()
        setReports(updatedData)
      }

      toast({
        title: "Laporan berhasil dibuat",
        description: `Laporan "${newReport.title}" telah berhasil dibuat`,
      })

      // Reset form
      setNewReport({
        title: "",
        type: "DAILY",
        date: new Date().toISOString().split("T")[0],
        description: "",
        file: null,
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      setIsUploadDialogOpen(false)
    } catch (error) {
      console.error("Error creating report:", error)
      toast({
        title: "Error",
        description: "Gagal membuat laporan",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle report download
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
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Laporan</h1>
        <p className="text-muted-foreground">Kelola dan tinjau laporan harian, mingguan, dan bulanan</p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
        >
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari laporan..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Tipe Laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="DAILY">Harian</SelectItem>
                  <SelectItem value="WEEKLY">Mingguan</SelectItem>
                  <SelectItem value="MONTHLY">Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status Laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="PENDING">Menunggu</SelectItem>
                  <SelectItem value="APPROVED">Disetujui</SelectItem>
                  <SelectItem value="REJECTED">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" /> Upload Laporan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Upload Laporan Baru</DialogTitle>
                  <DialogDescription>
                    Upload laporan harian, mingguan, atau bulanan untuk dokumentasi dan review.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitReport} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="report-type" className="text-sm font-medium">
                      Jenis Laporan
                    </label>
                    <Select
                      value={newReport.type}
                      onValueChange={(value) => setNewReport({ ...newReport, type: value as any })}
                    >
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Pilih jenis laporan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAILY">Laporan Harian</SelectItem>
                        <SelectItem value="WEEKLY">Laporan Mingguan</SelectItem>
                        <SelectItem value="MONTHLY">Laporan Bulanan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="report-title" className="text-sm font-medium">
                      Judul Laporan
                    </label>
                    <Input
                      id="report-title"
                      placeholder="Masukkan judul laporan"
                      value={newReport.title}
                      onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="report-date" className="text-sm font-medium">
                      Tanggal Laporan
                    </label>
                    <Input
                      id="report-date"
                      type="date"
                      value={newReport.date}
                      onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="report-description" className="text-sm font-medium">
                      Deskripsi
                    </label>
                    <Textarea
                      id="report-description"
                      placeholder="Masukkan deskripsi laporan"
                      value={newReport.description}
                      onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="file" className="text-sm font-medium">
                      File Laporan
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <input
                        id="file"
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file" className="cursor-pointer">
                        <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          {newReport.file ? newReport.file.name : "Klik untuk memilih file atau drag & drop"}
                        </p>
                        <p className="text-xs text-gray-500">Mendukung PDF, DOC, DOCX, XLS, XLSX (Maks. 10MB)</p>
                      </label>
                    </div>
                  </div>

                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsUploadDialogOpen(false)}
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
                        <>
                          <Upload className="h-4 w-4 mr-2" /> Upload Laporan
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
              <CardTitle>Daftar Laporan</CardTitle>
              <CardDescription>Tinjau dan kelola laporan yang telah diupload</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                  <TabsTrigger value="all">
                    Semua <span className="ml-1 text-xs">({filteredReports.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Menunggu <span className="ml-1 text-xs">({pendingReports.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="approved">
                    Disetujui <span className="ml-1 text-xs">({approvedReports.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Ditolak <span className="ml-1 text-xs">({rejectedReports.length})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <ReportTable
                    reports={filteredReports}
                    getStatusBadge={getStatusBadge}
                    getReportTypeLabel={getReportTypeLabel}
                    formatDate={formatDate}
                    onReviewClick={(report) => {
                      setSelectedReport(report)
                      setIsReviewDialogOpen(true)
                    }}
                    onDownloadClick={handleDownload}
                    isDownloading={isDownloading}
                    isLoading={isLoading}
                  />
                </TabsContent>

                <TabsContent value="pending" className="mt-4">
                  <ReportTable
                    reports={pendingReports}
                    getStatusBadge={getStatusBadge}
                    getReportTypeLabel={getReportTypeLabel}
                    formatDate={formatDate}
                    onReviewClick={(report) => {
                      setSelectedReport(report)
                      setIsReviewDialogOpen(true)
                    }}
                    onDownloadClick={handleDownload}
                    isDownloading={isDownloading}
                    isLoading={isLoading}
                  />
                </TabsContent>

                <TabsContent value="approved" className="mt-4">
                  <ReportTable
                    reports={approvedReports}
                    getStatusBadge={getStatusBadge}
                    getReportTypeLabel={getReportTypeLabel}
                    formatDate={formatDate}
                    onReviewClick={(report) => {
                      setSelectedReport(report)
                      setIsReviewDialogOpen(true)
                    }}
                    onDownloadClick={handleDownload}
                    isDownloading={isDownloading}
                    isLoading={isLoading}
                  />
                </TabsContent>

                <TabsContent value="rejected" className="mt-4">
                  <ReportTable
                    reports={rejectedReports}
                    getStatusBadge={getStatusBadge}
                    getReportTypeLabel={getReportTypeLabel}
                    formatDate={formatDate}
                    onReviewClick={(report) => {
                      setSelectedReport(report)
                      setIsReviewDialogOpen(true)
                    }}
                    onDownloadClick={handleDownload}
                    isDownloading={isDownloading}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tinjau Laporan</DialogTitle>
            <DialogDescription>Tinjau dan berikan keputusan untuk laporan ini</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Judul Laporan</h4>
                  <p className="text-sm font-medium">{selectedReport.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tipe</h4>
                  <p className="text-sm font-medium">{getReportTypeLabel(selectedReport.type)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tanggal</h4>
                  <p className="text-sm font-medium">{formatDate(selectedReport.date)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Penulis</h4>
                  <p className="text-sm font-medium">{selectedReport.author.name}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Deskripsi</h4>
                  <p className="text-sm">{selectedReport.description || "Tidak ada deskripsi"}</p>
                </div>
                {selectedReport.comment && (
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-gray-500">Komentar Sebelumnya</h4>
                    <p className="text-sm italic text-gray-600">{selectedReport.comment}</p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                {selectedReport.fileUrl && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDownload(selectedReport)}
                    disabled={isDownloading === selectedReport.id}
                  >
                    {isDownloading === selectedReport.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengunduh...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" /> Unduh Laporan
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Komentar Review</h4>
                <Textarea
                  placeholder="Tambahkan komentar atau catatan untuk laporan ini..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)} className="sm:w-auto w-full">
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleReviewReport("REJECTED")}
              disabled={isProcessing || selectedReport?.status === "REJECTED"}
              className="sm:w-auto w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Tolak Laporan"
              )}
            </Button>
            <Button
              onClick={() => handleReviewReport("APPROVED")}
              disabled={isProcessing || selectedReport?.status === "APPROVED"}
              className="bg-green-600 hover:bg-green-700 sm:w-auto w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Setujui Laporan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Report Table Component
function ReportTable({
  reports,
  getStatusBadge,
  getReportTypeLabel,
  formatDate,
  onReviewClick,
  onDownloadClick,
  isDownloading,
  isLoading,
}: {
  reports: any[]
  getStatusBadge: (status: string) => React.ReactNode
  getReportTypeLabel: (type: string) => string
  formatDate: (date: string) => string
  onReviewClick: (report: any) => void
  onDownloadClick: (report: any) => void
  isDownloading: string | null
  isLoading: boolean
}) {
  return (
    <div className="rounded-md border overflow-x-auto">
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-sky-600 mr-2" />
                  Memuat data...
                </div>
              </TableCell>
            </TableRow>
          ) : reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Tidak ada laporan yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{report.title}</TableCell>
                <TableCell className="whitespace-nowrap">{getReportTypeLabel(report.type)}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                    {formatDate(report.date)}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{report.author ? report.author.name : "Unknown"}</TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    {report.fileUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onDownloadClick(report)}
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
                    <Button variant="outline" size="sm" onClick={() => onReviewClick(report)}>
                      <FileText className="h-4 w-4 mr-1" />
                      Tinjau
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
