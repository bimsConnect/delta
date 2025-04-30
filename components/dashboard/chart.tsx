"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function DashboardChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const data = [
    {
      name: "01/05",
      "Downtime (menit)": 12,
      "Produksi (ribu unit)": 24,
    },
    {
      name: "02/05",
      "Downtime (menit)": 18,
      "Produksi (ribu unit)": 22,
    },
    {
      name: "03/05",
      "Downtime (menit)": 8,
      "Produksi (ribu unit)": 25,
    },
    {
      name: "04/05",
      "Downtime (menit)": 10,
      "Produksi (ribu unit)": 24,
    },
    {
      name: "05/05",
      "Downtime (menit)": 5,
      "Produksi (ribu unit)": 26,
    },
    {
      name: "06/05",
      "Downtime (menit)": 20,
      "Produksi (ribu unit)": 21,
    },
    {
      name: "07/05",
      "Downtime (menit)": 15,
      "Produksi (ribu unit)": 23,
    },
  ]

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-md">
        <div className="animate-spin h-6 w-6 border-2 border-sky-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ fontSize: "12px" }} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
          <Bar yAxisId="left" dataKey="Downtime (menit)" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="Produksi (ribu unit)" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
