"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, Menu, Search, User, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

type HeaderProps = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export function DashboardHeader({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Fetch user data from session
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/me")

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Error response from /api/auth/me:", errorData)

          // If unauthorized, you might want to redirect to login
          if (response.status === 401) {
            toast({
              title: "Session expired",
              description: "Your session has expired. Please log in again.",
              variant: "destructive",
            })
            router.push("/login")
          }
          return
        }

        const data = await response.json()
        setUserData(data.user)
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please refresh or log in again.",
          variant: "destructive",
        })
      }
    }

    fetchUserData()
  }, [router, toast])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      })

      router.push("/login")
      router.refresh()
    } catch (error) {
      toast({
        title: "Logout gagal",
        description: "Terjadi kesalahan saat logout",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 sm:gap-4 border-b bg-white px-2 sm:px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="w-full flex items-center gap-1 sm:gap-2 md:gap-4">
        {isSearchOpen ? (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            className="flex items-center"
          >
            <Input placeholder="Cari..." className="h-9 w-full" autoFocus onBlur={() => setIsSearchOpen(false)} />
            <Button variant="ghost" size="icon" className="ml-1 sm:ml-2 h-9 w-9" onClick={() => setIsSearchOpen(false)}>
              <span className="sr-only">Close</span>
              <Search className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <Button variant="ghost" size="icon" className="h-9 w-9 md:flex" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        )}

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifikasi</SheetTitle>
                <SheetDescription>Notifikasi dan pemberitahuan terbaru</SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="relative flex h-2 w-2 mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">Laporan baru menunggu persetujuan</p>
                      <p className="text-sm text-gray-500">Laporan Harian Mesin Filling Line A</p>
                      <p className="text-xs text-gray-500">2 menit yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="relative flex h-2 w-2 mt-1">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-300"></span>
                    </span>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">Maintenance terjadwal</p>
                      <p className="text-sm text-gray-500">Mesin Capping Line B perlu maintenance</p>
                      <p className="text-xs text-gray-500">1 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="relative flex h-2 w-2 mt-1">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-300"></span>
                    </span>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">Stok sparepart menipis</p>
                      <p className="text-sm text-gray-500">Bearing 6204 tersisa 2 unit</p>
                      <p className="text-xs text-gray-500">3 jam yang lalu</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>{userData?.name?.substring(0, 2) || "U"}</AvatarFallback>
                </Avatar>
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{userData?.name || "Akun Saya"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
