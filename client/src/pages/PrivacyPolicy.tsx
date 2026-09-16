import React, { useEffect } from "react"
import { SEO } from "../components/shared/Seo"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/layout/Footer"

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-primary/20 flex flex-col">
      <SEO
        title="Privacy Policy | Clud"
        description="Read the Clud privacy policy to understand how your personal data and API configurations are protected."
        path="/privacy"
      />
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto py-16 px-6">
        <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">1. Introduction</h2>
            <p>Welcome to Clud. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you, including Identity Data (first name, last name), Contact Data (email address), and Technical Data (IP address, browser type and version).</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide our API monitoring services, to manage our relationship with you, and to improve our website and services.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">5. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@clud.samueltuoyo.com.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
