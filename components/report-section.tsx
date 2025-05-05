"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Download, FileText, Upload, User, FileUp, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

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

export function ReportSection() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [reportType, setReportType] = useState<string>("DAILY")
  const [reportTitle, setReportTitle] = useState<string>("")
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [reportDescription, setReportDescription] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true)
        // Only fetch approved reports for public display
        const response = await fetch("/api/reports?status=APPROVED")

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
  }, [toast])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Update the handleUpload function to handle authentication errors better
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reportType || !reportTitle) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("title", reportTitle)
      formData.append("type", reportType)
      formData.append("date", reportDate)
      formData.append("description", reportDescription)

      if (selectedFile) {
        formData.append("file", selectedFile)
      }

      // Send to API
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      })

      // Handle authentication errors
      if (response.status === 401) {
        const errorData = await response.json()
        console.error("Authentication error:", errorData)

        toast({
          title: "Authentication Error",
          description: "Anda harus login terlebih dahulu untuk mengupload laporan",
          variant: "destructive",
        })

        // Optionally redirect to login page
        // window.location.href = "/login";
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Upload error:", errorData)
        throw new Error(errorData.error || "Failed to upload report")
      }

      toast({
        title: "Berhasil",
        description: "Laporan berhasil diupload dan menunggu persetujuan",
      })

      // Reset form
      setReportTitle("")
      setReportType("DAILY")
      setReportDate(new Date().toISOString().split("T")[0])
      setReportDescription("")
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Switch to list tab to show the user their report is in the system
      setActiveTab("list")

      // Refresh reports list
      const updatedResponse = await fetch("/api/reports?status=APPROVED")
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json()
        setReports(updatedData)
      }
    } catch (error) {
      console.error("Error uploading report:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengupload laporan",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Improved direct download function
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
      // Create a hidden iframe to handle the download
      // This approach allows direct download without page navigation
      const downloadFrame = document.createElement("iframe")
      downloadFrame.style.display = "none"
      document.body.appendChild(downloadFrame)

      // Set the iframe source to our download API endpoint
      downloadFrame.src = `/api/reports/download/${report.id}`

      // Show success message after a short delay
      setTimeout(() => {
        toast({
          title: "Berhasil",
          description: "File sedang diunduh",
        })

        // Clean up the iframe after download has started
        setTimeout(() => {
          document.body.removeChild(downloadFrame)
        }, 2000)
      }, 1000)
    } catch (error) {
      console.error("Error downloading file:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengunduh file",
        variant: "destructive",
      })
    } finally {
      // Set a timeout to reset the downloading state
      // This gives users visual feedback that something happened
      setTimeout(() => {
        setIsDownloading(null)
      }, 2000)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Disetujui
          </span>
        )
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Menunggu
          </span>
        )
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Ditolak
          </span>
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

  return (
    <section id="reports" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Sistem Laporan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload dan akses laporan harian, mingguan, dan bulanan Divisi Mekanik.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upload" className="text-base">
                <Upload className="h-4 w-4 mr-2" /> Upload Laporan
              </TabsTrigger>
              <TabsTrigger value="list" className="text-base">
                <FileText className="h-4 w-4 mr-2" /> Daftar Laporan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Laporan Baru</CardTitle>
                  <CardDescription>
                    Upload laporan harian, mingguan, atau bulanan untuk dokumentasi dan review.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="report-type" className="text-sm font-medium">
                        Jenis Laporan
                      </label>
                      <Select value={reportType} onValueChange={setReportType}>
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
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
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
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
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
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
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
                            {selectedFile ? selectedFile.name : "Klik untuk memilih file atau drag & drop"}
                          </p>
                          <p className="text-xs text-gray-500">Mendukung PDF, DOC, DOCX, XLS, XLSX (Maks. 10MB)</p>
                        </label>
                      </div>
                    </div>

                    <Button type="submit" disabled={isUploading || !reportType || !reportTitle} className="w-full mt-4">
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" /> Upload Laporan
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Laporan</CardTitle>
                  <CardDescription>Akses dan unduh laporan yang telah disetujui.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-sky-600 mr-2" />
                      <span>Memuat laporan...</span>
                    </div>
                  ) : reports.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Belum ada laporan yang disetujui.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Judul</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Penulis</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">{report.title}</TableCell>
                              <TableCell>{getReportTypeLabel(report.type)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                                  {formatDate(report.date)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <User className="h-3.5 w-3.5 mr-1 text-gray-500" />
                                  {report.author.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
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
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}