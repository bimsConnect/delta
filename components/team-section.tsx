"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Mail, Phone } from "lucide-react"

type TeamMember = {
  id: number
  name: string
  position: string
  image: string
  email: string
  phone: string
  linkedin: string
}

export function TeamSection() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Budi Santoso",
      position: "Kepala Divisi Mekanik",
      image: "/placeholder.svg?height=400&width=400",
      email: "budi.santoso@example.com",
      phone: "+62812345678",
      linkedin: "https://linkedin.com/in/example",
    },
    {
      id: 2,
      name: "Dewi Lestari",
      position: "Supervisor Mekanik",
      image: "/placeholder.svg?height=400&width=400",
      email: "dewi.lestari@example.com",
      phone: "+62812345679",
      linkedin: "https://linkedin.com/in/example",
    },
    {
      id: 3,
      name: "Agus Wijaya",
      position: "Teknisi Senior",
      image: "/placeholder.svg?height=400&width=400",
      email: "agus.wijaya@example.com",
      phone: "+62812345680",
      linkedin: "https://linkedin.com/in/example",
    },
    {
      id: 4,
      name: "Siti Rahayu",
      position: "Teknisi Mesin",
      image: "/placeholder.svg?height=400&width=400",
      email: "siti.rahayu@example.com",
      phone: "+62812345681",
      linkedin: "https://linkedin.com/in/example",
    },
    {
      id: 5,
      name: "Hendra Gunawan",
      position: "Teknisi Mesin",
      image: "/placeholder.svg?height=400&width=400",
      email: "hendra.gunawan@example.com",
      phone: "+62812345682",
      linkedin: "https://linkedin.com/in/example",
    },
    {
      id: 6,
      name: "Rina Wati",
      position: "Teknisi Mesin",
      image: "/placeholder.svg?height=400&width=400",
      email: "rina.wati@example.com",
      phone: "+62812345683",
      linkedin: "https://linkedin.com/in/example",
    },
  ]

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
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Tim Divisi Mekanik</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kenali para profesional yang memastikan kelancaran operasional mesin produksi air mineral kami.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
                <div className="relative h-80 w-full">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-bold text-navy-800 mb-1"
                  >
                    {member.name}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-sky-600 font-medium mb-4"
                  >
                    {member.position}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredMember === member.id ? 1 : 0,
                      height: hoveredMember === member.id ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col space-y-2 overflow-hidden"
                  >
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">{member.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Linkedin className="h-4 w-4 mr-2" />
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-sky-600 hover:underline"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
