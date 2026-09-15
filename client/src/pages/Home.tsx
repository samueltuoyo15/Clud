import React from "react"
import { Navbar } from "../components/navbar"
import { Hero } from "../components/hero"
import { Footer } from "../components/layout/Footer"

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  )
}
