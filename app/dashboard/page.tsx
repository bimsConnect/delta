"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Clock, FileText, Settings, Users, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardChart } from "@/components/dashboard/chart"
import { DashboardRecentReports } from "@/components/dashboard/recent-reports"

type ReportStats = {
  total: number
  pending: number
  approved: number
  rejected: number
}

type MachineStats = {
  operational: number
  maintenance: number
  offline: number
  total: number
}

export default function DashboardPage() {
  const [machineStats, setMachineStats] = useState<MachineStats>({
    operational: 0,
    maintenance: 0,
    offline: 0,
    total: 0,
  })

  const [reportStats, setReportStats] = useState<ReportStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  // Fetch stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)

        // Fetch report stats
        const reportResponse = await fetch("/api/reports/stats")
        if (!reportResponse.ok) {
          throw new Error("Failed to fetch report stats")
        }
        const reportData = await reportResponse.json()

        setReportStats({
          total: reportData.total || 0,
          pending: reportData.pending || 0,
          approved: reportData.approved || 0,
          rejected: reportData.rejected || 0,
        })

        // Fetch machine stats (assuming you have an API endpoint for this)
        // For now, we'll use dummy data
        setMachineStats({
          operational: 24,
          maintenance: 3,
          offline: 2,
          total: 29,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600 mr-2" />
        <span>Memuat data dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di Sistem Internal Divisi Mekanik PT. Delta Rezeki Abadi</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {reportStats.approved} disetujui, {reportStats.rejected} ditolak
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Laporan Tertunda</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportStats.pending}</div>
              <p className="text-xs text-muted-foreground">
                {reportStats.total > 0
                  ? `${Math.round((reportStats.pending / reportStats.total) * 100)}% dari total laporan`
                  : "Tidak ada laporan"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mesin Aktif</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{machineStats.operational}</div>
              <p className="text-xs text-muted-foreground">{machineStats.maintenance} dalam maintenance</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tim Mekanik</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">2 sedang cuti</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 grid-cols-1 lg:grid-cols-7"
      >
        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Aktivitas Mesin</CardTitle>
              <CardDescription>Performa mesin dalam 30 hari terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardChart />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Status Mesin</CardTitle>
              <CardDescription>Ringkasan status mesin saat ini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Operational</span>
                  </div>
                  <span className="text-sm font-medium">{machineStats.operational}</span>
                </div>
                <Progress
                  value={machineStats.total ? (machineStats.operational / machineStats.total) * 100 : 0}
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-green-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Maintenance</span>
                  </div>
                  <span className="text-sm font-medium">{machineStats.maintenance}</span>
                </div>
                <Progress
                  value={machineStats.total ? (machineStats.maintenance / machineStats.total) * 100 : 0}
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Offline</span>
                  </div>
                  <span className="text-sm font-medium">{machineStats.offline}</span>
                </div>
                <Progress
                  value={machineStats.total ? (machineStats.offline / machineStats.total) * 100 : 0}
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-red-500"
                />
              </div>

              <div className="pt-4">
                <Tabs defaultValue="line-a">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="line-a">Line A</TabsTrigger>
                    <TabsTrigger value="line-b">Line B</TabsTrigger>
                    <TabsTrigger value="line-c">Line C</TabsTrigger>
                    <TabsTrigger value="line-d">Line D</TabsTrigger>
                  </TabsList>
                  <TabsContent value="line-a" className="pt-4">
                    <div className="grid grid-cols-2 gap-2">
                      {machineStats.total > 0 &&
                        Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="rounded-md border p-2">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                              <span className="text-xs font-medium truncate">Machine {index + 1}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="line-b" className="pt-4">
                    <div className="grid grid-cols-2 gap-2">
                      {machineStats.total > 0 &&
                        Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="rounded-md border p-2">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                              <span className="text-xs font-medium truncate">Machine {index + 5}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="line-c" className="pt-4">
                    <div className="grid grid-cols-2 gap-2">
                      {machineStats.total > 0 &&
                        Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="rounded-md border p-2">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                              <span className="text-xs font-medium truncate">Machine {index + 9}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="line-d" className="pt-4">
                    <div className="grid grid-cols-2 gap-2">
                      {machineStats.total > 0 &&
                        Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="rounded-md border p-2">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                              <span className="text-xs font-medium truncate">Machine {index + 13}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Terbaru</CardTitle>
            <CardDescription>Laporan yang baru diupload dan menunggu persetujuan</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <DashboardRecentReports />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
