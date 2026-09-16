import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { SEO } from "../components/shared/Seo"
import { Navbar } from "../components/navbar"
import { Hero } from "../components/hero"
import { VisualIntegration } from "../components/landing/VisualIntegration"
import { TestimonialSection } from "../components/landing/TestimonialSection"
import { PricingSection } from "../components/landing/PricingSection"
import { Footer } from "../components/layout/Footer"

export const Home: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "")
      const el = document.getElementById(targetId)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" })
        }, 80)
      }
    }
  }, [location.hash])
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <SEO
        title="Clud | Real-time API Change Detection for Teams"
        description="Clud monitors your OpenAPI and Swagger specifications and sends instant Slack and Email alerts when breaking API changes occur."
        path="/"
      />
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
