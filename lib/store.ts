// This file serves as a simple store to share data between components
// In a real application, you might want to use a more robust state management solution like Redux or Zustand

// Machine data store
export type Machine = {
  id: number
  name: string
  type: string
  status: "operational" | "maintenance" | "offline"
  lastMaintenance: string
  nextMaintenance: string
  location: string
  serialNumber: string
  installationDate: string
}

// Create predefined machine data
export const machineData: Machine[] = [
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

// Report data store
export type Report = {
  id: string
  title: string
  type: "DAILY" | "WEEKLY" | "MONTHLY"
  date: string
  author: {
    id: string
    name: string
    email: string
  }
  status: "PENDING" | "APPROVED" | "REJECTED"
  fileUrl?: string
  description?: string
  comment?: string
  createdAt: string
  updatedAt: string
}

// Create predefined report data
export const reportData: Report[] = [
  {
    id: "1",
    title: "Laporan Harian Mesin Filling Line A",
    type: "DAILY",
    date: "2023-05-01",
    author: {
      id: "1",
      name: "Budi Santoso",
      email: "budi.santoso@example.com",
    },
    status: "PENDING",
    fileUrl: "/reports/laporan-harian-filling-line-a.pdf",
    description: "Laporan harian untuk mesin filling di Line A",
    createdAt: "2023-05-01T08:00:00Z",
    updatedAt: "2023-05-01T08:00:00Z",
  },
  {
    id: "2",
    title: "Laporan Mingguan Kinerja Mesin",
    type: "WEEKLY",
    date: "2023-04-30",
    author: {
      id: "2",
      name: "Dewi Lestari",
      email: "dewi.lestari@example.com",
    },
    status: "APPROVED",
    fileUrl: "/reports/laporan-mingguan-kinerja-mesin.pdf",
    description: "Laporan mingguan kinerja seluruh mesin produksi",
    comment: "Laporan sudah lengkap dan sesuai standar",
    createdAt: "2023-04-30T15:30:00Z",
    updatedAt: "2023-05-01T10:15:00Z",
  },
  {
    id: "3",
    title: "Laporan Bulanan Kinerja Mesin",
    type: "MONTHLY",
    date: "2023-04-30",
    author: {
      id: "3",
      name: "Agus Wijaya",
      email: "agus.wijaya@example.com",
    },
    status: "PENDING",
    fileUrl: "/reports/laporan-bulanan-kinerja-mesin.pdf",
    description: "Laporan bulanan kinerja seluruh mesin produksi bulan April",
    createdAt: "2023-04-30T16:45:00Z",
    updatedAt: "2023-04-30T16:45:00Z",
  },
  {
    id: "4",
    title: "Laporan Harian Mesin Capping",
    type: "DAILY",
    date: "2023-05-01",
    author: {
      id: "4",
      name: "Siti Rahayu",
      email: "siti.rahayu@example.com",
    },
    status: "PENDING",
    fileUrl: "/reports/laporan-harian-mesin-capping.pdf",
    description: "Laporan harian untuk mesin capping di semua line",
    createdAt: "2023-05-01T08:30:00Z",
    updatedAt: "2023-05-01T08:30:00Z",
  },
  {
    id: "5",
    title: "Laporan Maintenance Bulanan",
    type: "MONTHLY",
    date: "2023-04-29",
    author: {
      id: "5",
      name: "Hendra Gunawan",
      email: "hendra.gunawan@example.com",
    },
    status: "APPROVED",
    fileUrl: "/reports/laporan-maintenance-bulanan.pdf",
    description: "Laporan maintenance bulanan untuk semua mesin",
    comment: "Laporan diterima dengan catatan untuk meningkatkan frekuensi maintenance pada mesin filling",
    createdAt: "2023-04-29T14:20:00Z",
    updatedAt: "2023-05-01T11:10:00Z",
  },
  {
    id: "6",
    title: "Laporan Harian Mesin Labeling",
    type: "DAILY",
    date: "2023-05-01",
    author: {
      id: "6",
      name: "Rina Wati",
      email: "rina.wati@example.com",
    },
    status: "PENDING",
    fileUrl: "/reports/laporan-harian-mesin-labeling.pdf",
    description: "Laporan harian untuk mesin labeling di semua line",
    createdAt: "2023-05-01T09:15:00Z",
    updatedAt: "2023-05-01T09:15:00Z",
  },
  {
    id: "7",
    title: "Laporan Mingguan Efisiensi Produksi",
    type: "WEEKLY",
    date: "2023-04-30",
    author: {
      id: "1",
      name: "Budi Santoso",
      email: "budi.santoso@example.com",
    },
    status: "REJECTED",
    fileUrl: "/reports/laporan-mingguan-efisiensi-produksi.pdf",
    description: "Laporan mingguan efisiensi produksi untuk semua line",
    comment: "Data tidak lengkap, mohon dilengkapi data efisiensi untuk Line C dan D",
    createdAt: "2023-04-30T17:00:00Z",
    updatedAt: "2023-05-01T13:45:00Z",
  },
  {
    id: "8",
    title: "Laporan Harian Quality Control",
    type: "DAILY",
    date: "2023-05-01",
    author: {
      id: "2",
      name: "Dewi Lestari",
      email: "dewi.lestari@example.com",
    },
    status: "APPROVED",
    fileUrl: "/reports/laporan-harian-quality-control.pdf",
    description: "Laporan harian quality control untuk semua produk",
    comment: "Laporan diterima dengan baik",
    createdAt: "2023-05-01T10:00:00Z",
    updatedAt: "2023-05-01T14:30:00Z",
  },
  {
    id: "9",
    title: "Laporan Bulanan Konsumsi Energi",
    type: "MONTHLY",
    date: "2023-04-30",
    author: {
      id: "3",
      name: "Agus Wijaya",
      email: "agus.wijaya@example.com",
    },
    status: "APPROVED",
    fileUrl: "/reports/laporan-bulanan-konsumsi-energi.pdf",
    description: "Laporan bulanan konsumsi energi untuk seluruh fasilitas",
    comment: "Laporan diterima, mohon untuk bulan depan sertakan juga analisis efisiensi energi",
    createdAt: "2023-04-30T18:15:00Z",
    updatedAt: "2023-05-01T15:20:00Z",
  },
  {
    id: "10",
    title: "Laporan Harian Produksi Line B",
    type: "DAILY",
    date: "2023-05-01",
    author: {
      id: "4",
      name: "Siti Rahayu",
      email: "siti.rahayu@example.com",
    },
    status: "PENDING",
    fileUrl: "/reports/laporan-harian-produksi-line-b.pdf",
    description: "Laporan harian produksi untuk Line B",
    createdAt: "2023-05-01T11:30:00Z",
    updatedAt: "2023-05-01T11:30:00Z",
  },
]

// Function to update machine status
export function updateMachineStatus(id: number, newStatus: "operational" | "maintenance" | "offline"): void {
  const index = machineData.findIndex((machine) => machine.id === id)
  if (index !== -1) {
    machineData[index].status = newStatus
  }
}

// Function to get machine statistics
export function getMachineStats() {
  const operational = machineData.filter((m) => m.status === "operational").length
  const maintenance = machineData.filter((m) => m.status === "maintenance").length
  const offline = machineData.filter((m) => m.status === "offline").length
  const total = machineData.length

  return {
    operational,
    maintenance,
    offline,
    total,
  }
}

// Function to get report statistics
export function getReportStats() {
  const total = reportData.length
  const pending = reportData.filter((r) => r.status === "PENDING").length
  const approved = reportData.filter((r) => r.status === "APPROVED").length
  const rejected = reportData.filter((r) => r.status === "REJECTED").length

  return {
    total,
    pending,
    approved,
    rejected,
  }
}

// Function to get recent reports (pending ones)
export function getRecentReports() {
  return reportData
    .filter((r) => r.status === "PENDING")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
}

// Function to get all reports
export function getAllReports() {
  return [...reportData]
}

// Function to get reports by status
export function getReportsByStatus(status: "PENDING" | "APPROVED" | "REJECTED" | "all") {
  if (status === "all") {
    return getAllReports()
  }
  return reportData.filter((r) => r.status === status)
}

// Function to get reports by type
export function getReportsByType(type: "DAILY" | "WEEKLY" | "MONTHLY" | "all") {
  if (type === "all") {
    return getAllReports()
  }
  return reportData.filter((r) => r.type === type)
}

// Function to get a report by ID
export function getReportById(id: string) {
  return reportData.find((r) => r.id === id)
}

// Function to update report status
export function updateReportStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED", comment?: string) {
  const index = reportData.findIndex((r) => r.id === id)
  if (index !== -1) {
    reportData[index].status = status
    if (comment) {
      reportData[index].comment = comment
    }
    reportData[index].updatedAt = new Date().toISOString()
  }
}

// Function to add a new report
export function addReport(report: Omit<Report, "id" | "createdAt" | "updatedAt">) {
  const newReport: Report = {
    ...report,
    id: (reportData.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  reportData.push(newReport)
  return newReport
}
