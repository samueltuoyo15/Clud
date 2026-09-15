import React, { useEffect } from "react"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/layout/Footer"

export const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-primary/20 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto py-16 px-6">
        <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">1. Terms</h2>
            <p>By accessing the website at clud.dev, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on Clud's website for personal, non-commercial transitory viewing only.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">3. Disclaimer</h2>
            <p>The materials on Clud's website are provided on an 'as is' basis. Clud makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">4. Limitations</h2>
            <p>In no event shall Clud or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Clud's website.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">5. Revisions and Errata</h2>
            <p>The materials appearing on Clud's website could include technical, typographical, or photographic errors. Clud does not warrant that any of the materials on its website are accurate, complete or current.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
