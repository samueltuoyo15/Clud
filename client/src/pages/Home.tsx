import React from "react"
import { Navbar } from "../components/navbar"
import { Hero } from "../components/hero"

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-3 sm:p-6 text-neutral-900 flex flex-col">
      <div className="flex-1 bg-neutral-100 rounded-4xl sm:rounded-[3rem] overflow-hidden flex flex-col border border-neutral-200">
        <Navbar />
        <main className="flex-1">
          <Hero />
        </main>
      </div>
    </div>
  )
}

