"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, FileText, Home, LogOut, Settings, Users, X, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

type SidebarProps = {
  isOpen: boolean
  isMobile: boolean
  closeSidebar: () => void
  openSidebar: () => void
}

export function DashboardSidebar({ isOpen, isMobile, closeSidebar, openSidebar }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      closeSidebar()
    }
  }, [pathname])

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Laporan",
      icon: FileText,
      href: "/dashboard/reports",
    },
    {
      title: "Galeri",
      icon: ImageIcon,
      href: "/dashboard/gallery",
    },
  ]

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

  // Render collapsed sidebar button when sidebar is closed and not on mobile
  if (!isOpen && !isMobile) {
    return (
      <div className="fixed top-0 left-0 z-50 h-full w-[80px] bg-white border-r shadow-sm">
        <div className="flex h-14 items-center px-4 border-b justify-center">
          <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">DM</span>
          </div>
        </div>
        <div className="flex flex-col h-[calc(100%-56px)] justify-between py-2">
          <nav className="grid gap-1 px-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`group flex items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 ${
                      isActive ? "bg-gray-100 text-sky-600" : "text-gray-700"
                    } transition-colors`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "text-sky-600" : "text-gray-500"}`} />
                  </div>
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto p-2">
            <Separator className="my-2" />
            <Button variant="ghost" size="icon" className="w-full flex justify-center" onClick={openSidebar}>
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Open Sidebar</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="mt-2 flex justify-center text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={isMobile ? { x: "-100%" } : { width: "80px" }}
        animate={
          isMobile 
            ? { x: isOpen ? 0 : "-100%" } 
            : { width: isOpen ? "240px" : "80px" }
        }
        exit={isMobile ? { x: "-100%" } : { width: "80px" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r shadow-sm ${
          isMobile ? "w-[280px] max-w-[85vw]" : ""
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center px-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              {(!isMobile || isOpen) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-bold text-navy-800 overflow-hidden whitespace-nowrap"
                >
                  Divisi Mekanik
                </motion.span>
              )}
            </div>
            {isMobile ? (
              <Button variant="ghost" size="icon" className="ml-auto" onClick={closeSidebar}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="ml-auto" onClick={closeSidebar}>
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Toggle</span>
              </Button>
            )}
          </div>

          <ScrollArea className="flex-1 py-2">
            <nav className="grid gap-1 px-2">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 ${
                        isActive ? "bg-gray-100 text-sky-600" : "text-gray-700"
                      } transition-colors`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${isActive ? "text-sky-600" : "text-gray-500"} ${
                          (!isOpen && !isMobile) ? "mr-0" : "mr-3"
                        } flex-shrink-0`}
                      />
                      {(!isMobile || isOpen) && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          <div className="mt-auto p-2">
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className={`w-full flex items-center ${
                (!isOpen && !isMobile) ? "justify-center" : "justify-start"
              } text-red-600 hover:bg-red-50 hover:text-red-700`}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {(!isMobile || isOpen) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden whitespace-nowrap ml-3"
                >
                  Keluar
                </motion.span>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}