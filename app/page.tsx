import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { TeamSection } from "@/components/team-section"
import { MachineSection } from "@/components/machine-section"
import { GallerySection } from "@/components/gallery-section"
import { ReportSection } from "@/components/report-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TeamSection />
      <MachineSection />
      <GallerySection />
      <ReportSection />
      <Footer />
    </main>
  )
}
