"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Clock, Filter, Search, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { machineData, updateMachineStatus, type Machine } from "@/lib/store"

export const globalMachines = machineData

export function MachineSection() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const [paginatedMachines, setPaginatedMachines] = useState<Machine[]>([])
  const [totalPages, setTotalPages] = useState(1)

  // Load machine data
  useEffect(() => {
    setMachines([...machineData])
    setFilteredMachines([...machineData])
  }, [])

  // Filter machines based on search term and filters
  useEffect(() => {
    let result = [...machineData]

    if (searchTerm) {
      result = result.filter(
        (machine) =>
          machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      result = result.filter((machine) => machine.type === typeFilter)
    }

    if (statusFilter !== "all") {
      result = result.filter((machine) => machine.status === statusFilter)
    }

    setFilteredMachines(result)

    // Calculate total pages
    const calculatedTotalPages = Math.ceil(result.length / itemsPerPage)
    setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1)

    // Reset to first page when filters change
    setCurrentPage(1)
  }, [searchTerm, typeFilter, statusFilter])

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedMachines(filteredMachines.slice(startIndex, endIndex))
  }, [filteredMachines, currentPage, itemsPerPage])

  // Get unique machine types for filter
  const machineTypes = Array.from(new Set(machines.map((machine) => machine.type)))

  // Update machine status
  const handleUpdateMachineStatus = (id: number, newStatus: "operational" | "maintenance" | "offline") => {
    // Update the global store
    updateMachineStatus(id, newStatus)

    // Update local state
    setMachines([...machineData])

    // Update selected machine if it's the one being modified
    if (selectedMachine && selectedMachine.id === id) {
      setSelectedMachine({ ...selectedMachine, status: newStatus })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Operational
          </Badge>
        )
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Settings className="h-3 w-3 mr-1" /> Maintenance
          </Badge>
        )
      case "offline":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Offline
          </Badge>
        )
      default:
        return null
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPaginationItems = () => {
    const items = []

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue // Skip first and last as they're always shown
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
    <section id="machines" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Daftar Mesin</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pantau status dan informasi mesin produksi air mineral dalam kemasan kami.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari mesin..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipe Mesin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  {machineTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status Mesin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {paginatedMachines.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">Tidak ada mesin yang ditemukan</h3>
            <p className="text-gray-500 mt-2">Coba ubah filter pencarian Anda</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {paginatedMachines.map((machine) => (
              <motion.div key={machine.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{machine.name}</CardTitle>
                    <CardDescription>{machine.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Status:</span>
                        {getStatusBadge(machine.status)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Lokasi:</span>
                        <span className="text-sm font-medium">{machine.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Maintenance: {machine.nextMaintenance}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" onClick={() => setSelectedMachine(machine)}>
                          Detail
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Detail Mesin</DialogTitle>
                          <DialogDescription>Informasi lengkap dan pengaturan status mesin</DialogDescription>
                        </DialogHeader>
                        {selectedMachine && (
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Nama Mesin</h4>
                                <p className="text-sm font-medium">{selectedMachine.name}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Tipe</h4>
                                <p className="text-sm font-medium">{selectedMachine.type}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                <div className="mt-1">{getStatusBadge(selectedMachine.status)}</div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Lokasi</h4>
                                <p className="text-sm font-medium">{selectedMachine.location}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Serial Number</h4>
                                <p className="text-sm font-medium">{selectedMachine.serialNumber}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Tanggal Instalasi</h4>
                                <p className="text-sm font-medium">{selectedMachine.installationDate}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Maintenance Terakhir</h4>
                                <p className="text-sm font-medium">{selectedMachine.lastMaintenance}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Maintenance Berikutnya</h4>
                                <p className="text-sm font-medium">{selectedMachine.nextMaintenance}</p>
                              </div>
                            </div>

                            <div className="mt-6">
                              <h4 className="text-sm font-medium mb-2">Ubah Status</h4>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant={selectedMachine.status === "operational" ? "default" : "outline"}
                                  className={
                                    selectedMachine.status === "operational" ? "bg-green-600 hover:bg-green-700" : ""
                                  }
                                  onClick={() => handleUpdateMachineStatus(selectedMachine.id, "operational")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" /> Operational
                                </Button>
                                <Button
                                  size="sm"
                                  variant={selectedMachine.status === "maintenance" ? "default" : "outline"}
                                  className={
                                    selectedMachine.status === "maintenance" ? "bg-yellow-600 hover:bg-yellow-700" : ""
                                  }
                                  onClick={() => handleUpdateMachineStatus(selectedMachine.id, "maintenance")}
                                >
                                  <Settings className="h-4 w-4 mr-1" /> Maintenance
                                </Button>
                                <Button
                                  size="sm"
                                  variant={selectedMachine.status === "offline" ? "default" : "outline"}
                                  className={selectedMachine.status === "offline" ? "bg-red-600 hover:bg-red-700" : ""}
                                  onClick={() => handleUpdateMachineStatus(selectedMachine.id, "offline")}
                                >
                                  <AlertCircle className="h-4 w-4 mr-1" /> Offline
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button type="button" variant="outline">
                            Riwayat Maintenance
                          </Button>
                          <Button type="button">Jadwalkan Maintenance</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {filteredMachines.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Stats summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 bg-gray-50 p-6 rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-medium mb-4">Ringkasan Status Mesin</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Operational</p>
                  <p className="text-xl font-bold">{machines.filter((m) => m.status === "operational").length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <Settings className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Maintenance</p>
                  <p className="text-xl font-bold">{machines.filter((m) => m.status === "maintenance").length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Offline</p>
                  <p className="text-xl font-bold">{machines.filter((m) => m.status === "offline").length}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
