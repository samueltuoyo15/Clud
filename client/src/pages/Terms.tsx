import React from "react"
import { Link } from "react-router-dom"

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-neutral-900 selection:bg-primary/20">
      <header className="h-[72px] px-8 border-b border-neutral-200/60 flex items-center justify-between shrink-0 bg-white">
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
          <img src="/favicon.svg" alt="Clud" className="h-5 w-5 object-contain" />
          <span className="font-heading font-bold text-sm tracking-wide text-neutral-900 uppercase">
            Clud
          </span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">2. Use License</h2>
            <p>Permission is granted to temporarily use the materials (information or software) on Clud's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">3. Service Description</h2>
            <p>Clud provides automated API drift detection and monitoring services. We do not guarantee uninterrupted access to the service and reserve the right to modify or discontinue the service at any time.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">4. Disclaimer</h2>
            <p>The materials on Clud's website are provided on an 'as is' basis. Clud makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
