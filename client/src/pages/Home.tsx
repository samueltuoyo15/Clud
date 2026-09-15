import React from "react"
import { Navbar } from "../components/navbar"
import { Hero } from "../components/hero"
import { VisualIntegration } from "../components/landing/VisualIntegration"
import { TestimonialSection } from "../components/landing/TestimonialSection"
import { PricingSection } from "../components/landing/PricingSection"
import { Footer } from "../components/layout/Footer"

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <div className="bg-[#FAFAFA] border-b border-neutral-200/60">
        <Navbar />
        <Hero />
      </div>
      <main className="flex-1">
        <VisualIntegration />
        <TestimonialSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
