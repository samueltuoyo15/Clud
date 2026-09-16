import React, { useEffect } from "react"
import { SEO } from "../components/shared/Seo"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/layout/Footer"

export const RefundPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-primary/20 flex flex-col">
      <SEO
        title="Refund Policy | Clud"
        description="Learn about the Clud refund policy, money-back guarantee, and billing terms."
        path="/refunds"
      />
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto py-16 px-6">
        <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-8">Refund Policy</h1>
        
        <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">1. 3-Day Money-Back Guarantee</h2>
            <p>We want you to be completely satisfied with Clud. If you are not happy with our service within the first 3 days of your initial purchase, you are eligible for a full refund. No questions asked.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">2. How to Request a Refund</h2>
            <p>To request a refund, please contact us at billing@clud.samueltuoyo.com from the email address associated with your account. We will process your request within 24-48 hours.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">3. Exceptions</h2>
            <p>Refunds are not available after the initial 3-day period has passed. Monthly subscription renewals are non-refundable, but you can cancel your subscription at any time to prevent future charges.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">4. Processing Time</h2>
            <p>Once your refund is approved, it will be processed immediately. However, it may take 5-10 business days for the funds to appear on your original payment method, depending on your financial institution.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
