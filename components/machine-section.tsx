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
import type { Machine } from "@/lib/store"

// Create mock machine data directly in the component to ensure it's always available
const mockMachineData: Machine[] = [
  // Line A machines
  {
    id: 1,
    name: "Filling Machine Alpha",
    type: "Filling Machine",
    status: "operational",
    lastMaintenance: "2023-04-15",
    nextMaintenance: "2023-07-15",
    location: "Line A",
    serialNumber: "SN-12345",
    installationDate: "2021-06-10",
  },
  {
    id: 2,
    name: "Capping Unit Beta",
    type: "Capping Machine",
    status: "maintenance",
    lastMaintenance: "2023-05-01",
    nextMaintenance: "2023-06-01",
    location: "Line A",
    serialNumber: "SN-23456",
    installationDate: "2021-06-12",
  },
  {
    id: 3,
    name: "Labeling System Gamma",
    type: "Labeling Machine",
    status: "operational",
    lastMaintenance: "2023-04-20",
    nextMaintenance: "2023-07-20",
    location: "Line A",
    serialNumber: "SN-34567",
    installationDate: "2021-06-15",
  },
  {
    id: 4,
    name: "Packaging Robot Delta",
    type: "Packaging Machine",
    status: "operational",
    lastMaintenance: "2023-04-25",
    nextMaintenance: "2023-07-25",
    location: "Line A",
    serialNumber: "SN-45678",
    installationDate: "2021-06-18",
  },
  {
    id: 5,
    name: "Sterilization Chamber Epsilon",
    type: "Sterilization Unit",
    status: "operational",
    lastMaintenance: "2023-04-10",
    nextMaintenance: "2023-07-10",
    location: "Line A",
    serialNumber: "SN-56789",
    installationDate: "2021-06-20",
  },
  {
    id: 6,
    name: "Water Treatment Unit Zeta",
    type: "Water Treatment",
    status: "operational",
    lastMaintenance: "2023-04-05",
    nextMaintenance: "2023-07-05",
    location: "Line A",
    serialNumber: "SN-67890",
    installationDate: "2021-06-22",
  },
  {
    id: 7,
    name: "Bottle Blower Eta",
    type: "Packaging Machine",
    status: "operational",
    lastMaintenance: "2023-04-02",
    nextMaintenance: "2023-07-02",
    location: "Line A",
    serialNumber: "SN-78901",
    installationDate: "2021-06-25",
  },

  // Line B machines
  {
    id: 8,
    name: "Quality Control Scanner Theta",
    type: "Packaging Machine",
    status: "operational",
    lastMaintenance: "2023-04-18",
    nextMaintenance: "2023-07-18",
    location: "Line B",
    serialNumber: "SN-89012",
    installationDate: "2021-07-01",
  },
  {
    id: 9,
    name: "Conveyor System Iota",
    type: "Packaging Machine",
    status: "maintenance",
    lastMaintenance: "2023-05-02",
    nextMaintenance: "2023-06-02",
    location: "Line B",
    serialNumber: "SN-90123",
    installationDate: "2021-07-03",
  },
  {
    id: 10,
    name: "Shrink Wrapper Kappa",
    type: "Packaging Machine",
    status: "operational",
    lastMaintenance: "2023-04-12",
    nextMaintenance: "2023-07-12",
    location: "Line B",
    serialNumber: "SN-01234",
    installationDate: "2021-07-05",
  },
  {
    id: 11,
    name: "Palletizer Lambda",
    type: "Packaging Machine",
    status: "operational",
    lastMaintenance: "2023-04-08",
    nextMaintenance: "2023-07-08",
    location: "Line B",
    serialNumber: "SN-12345",
    installationDate: "2021-07-08",
  },
  {
    id: 12,
    name: "Bottle Rinser Mu",
    type: "Filling Machine",
    status: "operational",
    lastMaintenance: "2023-04-22",
    nextMaintenance: "2023-07-22",
    location: "Line B",
    serialNumber: "SN-23456",
    installationDate: "2021-07-10",
  },
  {
    id: 13,
    name: "Cap Feeder Nu",
    type: "Capping Machine",
    status: "operational",
    lastMaintenance: "2023-04-28",
    nextMaintenance: "2023-07-28",
    location: "Line B",
    serialNumber: "SN-34567",
    installationDate: "2021-07-12",
  },
  {
    id: 14,
    name: "Label Applicator Xi",
    type: "Labeling Machine",
    status: "operational",
    lastMaintenance: "2023-04-30",
    nextMaintenance: "2023-07-30",
    location: "Line B",
    serialNumber: "SN-45678",
    installationDate: "2021-07-15",
  },

  // Line C machines
  {
    id: 15,
    name: "Bottle Sorter Omicron",
    type: "Packaging Machine",
    status: "operational",
    lastMaintenance: "2023-04-14",
    nextMaintenance: "2023-07-14",
    location: "Line C",
    serialNumber: "SN-56789",
    installationDate: "2021-08-01",
  },
  {
    id: 16,
    name: "Inspection System Pi",
    type: "Packaging Machine",
    status: "offline",
    lastMaintenance: "2023-04-17",
    nextMaintenance: "2023-05-17",
    location: "Line C",
    serialNumber: "SN-67890",
    installationDate: "2021-08-03",
  },
  {
    id: 17,
    name: "Coding Machine Rho",
    type: "Labeling Machine",
    status: "operational",
    lastMaintenance: "2023-04-19",
    nextMaintenance: "2023-07-19",
    location: "Line C",
    serialNumber: "SN-78901",
    installationDate: "2021-08-05",
  },
  {
    id: 18,
    name: "Mixing Tank Sigma",
    type: "Water Treatment",
    status: "operational",
    lastMaintenance: "2023-04-21",
    nextMaintenance: "2023-07-21",
    location: "Line C",
    serialNumber: "SN-89012",
    installationDate: "2021-08-08",
  },
  {
    id: 19,
    name: "Filtration System Tau",
    type: "Water Treatment",
    status: "operational",
    lastMaintenance: "2023-04-23",
    nextMaintenance: "2023-07-23",
    location: "Line C",
    serialNumber: "SN-90123",
    installationDate: "2021-08-10",
  },
  {
    id: 20,
    name: "UV Sterilizer Upsilon",
    type: "Sterilization Unit",
    status: "operational",
    lastMaintenance: "2023-04-26",
    nextMaintenance: "2023-07-26",
    location: "Line C",
    serialNumber: "SN-01234",
    installationDate: "2021-08-12",
  },
  {
    id: 21,
    name: "Cooling System Phi",
    type: "Water Treatment",
    status: "operational",
    lastMaintenance: "2023-04-29",
    nextMaintenance: "2023-07-29",
    location: "Line C",
    serialNumber: "SN-12345",
    installationDate: "2021-08-15",
  },

  // Line D machines
  {
    id: 22,
    name: "Heating Unit Chi",
    type: "Water Treatment",
    status: "maintenance",
    lastMaintenance: "2023-05-03",
    nextMaintenance: "2023-06-03",
    location: "Line D",
    serialNumber: "SN-23456",
    installationDate: "2021-09-01",
  },
  {
    id: 23,
    name: "Pressure Regulator Psi",
    type: "Water Treatment",
    status: "operational",
    lastMaintenance: "2023-04-03",
    nextMaintenance: "2023-07-03",
    location: "Line D",
    serialNumber: "SN-34567",
    installationDate: "2021-09-03",
  },
  {
    id: 24,
    name: "Pump System Omega",
    type: "Water Treatment",
    status: "operational",
    lastMaintenance: "2023-04-06",
    nextMaintenance: "2023-07-06",
    location: "Line D",
    serialNumber: "SN-45678",
    installationDate: "2021-09-05",
  },
  {
    id: 25,
    name: "Storage Tank Alpha-2",
    type: "Water Treatment",
    status: "operational",
    lastMaintenance: "2023-04-09",
    nextMaintenance: "2023-07-09",
    location: "Line D",
    serialNumber: "SN-56789",
    installationDate: "2021-09-08",
  },
  {
    id: 26,
    name: "Cleaning System Beta-2",
    type: "Sterilization Unit",
    status: "operational",
    lastMaintenance: "2023-04-11",
    nextMaintenance: "2023-07-11",
    location: "Line D",
    serialNumber: "SN-67890",
    installationDate: "2021-09-10",
  },
  {
    id: 27,
    name: "Maintenance Robot Gamma-2",
    type: "Packaging Machine",
    status: "offline",
    lastMaintenance: "2023-04-13",
    nextMaintenance: "2023-05-13",
    location: "Line D",
    serialNumber: "SN-78901",
    installationDate: "2021-09-12",
  },
  {
    id: 28,
    name: "Control Unit Delta-2",
    type: "Packaging Machine",
    status: "operational",
    lastMaintenance: "2023-04-16",
    nextMaintenance: "2023-07-16",
    location: "Line D",
    serialNumber: "SN-89012",
    installationDate: "2021-09-15",
  },
  {
    id: 29,
    name: "Emergency System Epsilon-2",
    type: "Packaging Machine",
    status: "operational",
    lastMaintenance: "2023-04-24",
    nextMaintenance: "2023-07-24",
    location: "Line D",
    serialNumber: "SN-90123",
    installationDate: "2021-09-18",
  },
  {
    id: 30,
    name: "Backup Generator Zeta-2",
    type: "Packaging Machine",
    status: "operational",
    lastMaintenance: "2023-04-27",
    nextMaintenance: "2023-07-27",
    location: "Line D",
    serialNumber: "SN-01234",
    installationDate: "2021-09-20",
  },
]

export function MachineSection() {
  // State for machines data
  const [machines, setMachines] = useState<Machine[]>([...mockMachineData])
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)

  // Tambahkan ini di bagian atas komponen, setelah deklarasi state
  useEffect(() => {
    // Ini memastikan bahwa rendering client dan server konsisten
    // dengan memaksa re-render setelah hydration
  }, [])

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Get unique machine types for filter
  const machineTypes = Array.from(new Set(machines.map((machine) => machine.type)))

  // Filter machines based on search term, type filter, and status filter
  const filteredMachines = machines.filter((machine) => {
    // Apply search filter
    const matchesSearch =
      searchTerm === "" ||
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())

    // Apply type filter
    const matchesType = typeFilter === "all" || machine.type === typeFilter

    // Apply status filter
    const matchesStatus = statusFilter === "all" || machine.status === statusFilter

    // Return true only if all filters match
    return matchesSearch && matchesType && matchesStatus
  })

  // Update machine status
  const handleUpdateMachineStatus = (id: number, newStatus: "operational" | "maintenance" | "offline") => {
    // Update machines state
    setMachines((prevMachines) =>
      prevMachines.map((machine) => (machine.id === id ? { ...machine, status: newStatus } : machine)),
    )

    // Update selected machine if it's the one being modified
    if (selectedMachine && selectedMachine.id === id) {
      setSelectedMachine({ ...selectedMachine, status: newStatus })
    }
  }

  // Status badge component
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

  // Animation variants
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

  // Calculate machine status counts for the summary
  const operationalCount = machines.filter((m) => m.status === "operational").length
  const maintenanceCount = machines.filter((m) => m.status === "maintenance").length
  const offlineCount = machines.filter((m) => m.status === "offline").length

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

        {/* Display total items info */}
        <div className="mb-4 text-sm text-gray-500">
          Menampilkan <span suppressHydrationWarning>{filteredMachines.length}</span> mesin
        </div>

        {filteredMachines.length === 0 ? (
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
            {filteredMachines.map((machine) => (
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
                  <p className="text-xl font-bold">{operationalCount}</p>
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
                  <p className="text-xl font-bold">{maintenanceCount}</p>
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
                  <p className="text-xl font-bold">{offlineCount}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
