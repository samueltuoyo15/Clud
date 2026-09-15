import React from "react"
import { Navbar } from "../components/navbar"
import { Hero } from "../components/hero"
import { VisualIntegration } from "../components/landing/VisualIntegration"
import { TestimonialSection } from "../components/landing/TestimonialSection"
import { Footer } from "../components/layout/Footer"

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <VisualIntegration />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  )
}
