"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-sky-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">DM</span>
              </div>
              <span className="text-white font-bold text-xl">Divisi Mekanik</span>
            </div>
            <p className="text-gray-300">
              Divisi Mekanik PT. Delta Rezeki Abadi berkomitmen untuk memastikan kelancaran produksi air mineral dalam
              kemasan melalui pemeliharaan dan inovasi teknis yang berkelanjutan.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-sky-400 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-white hover:text-sky-400 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-white hover:text-sky-400 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="#team" className="text-gray-300 hover:text-white transition-colors">
                  Tim Kami
                </Link>
              </li>
              <li>
                <Link href="#machines" className="text-gray-300 hover:text-white transition-colors">
                  Daftar Mesin
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="text-gray-300 hover:text-white transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="#reports" className="text-gray-300 hover:text-white transition-colors">
                  Laporan
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-sky-400 mt-0.5" />
                <span className="text-gray-300">
                  Jl. Industri Raya No. 123, Kawasan Industri Pulogadung, Jakarta Timur
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-sky-400" />
                <span className="text-gray-300">+62 21 1234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-sky-400" />
                <span className="text-gray-300">mekanik@deltarezekiabadi.com</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold">Jam Kerja</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-300">Senin - Jumat:</span>
                <span className="text-white">08:00 - 17:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Sabtu:</span>
                <span className="text-white">08:00 - 14:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Minggu:</span>
                <span className="text-white">Libur</span>
              </li>
            </ul>
            <div className="pt-4">
              <h4 className="text-sm font-semibold mb-2">Kontak Darurat 24 Jam:</h4>
              <p className="text-sky-400 font-bold">+62 812 3456 7890</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="border-t border-gray-700 mt-12 pt-8 text-center"
        >
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} PT. Delta Rezeki Abadi. Divisi Mekanik. Hak Cipta Dilindungi.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
