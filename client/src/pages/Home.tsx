import React from 'react'
import { Navbar } from '../components/navbar'
import { Hero } from '../components/hero'

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  )
}

