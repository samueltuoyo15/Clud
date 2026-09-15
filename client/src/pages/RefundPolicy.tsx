import React from "react"
import { Link } from "react-router-dom"

export const RefundPolicy: React.FC = () => {
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
        <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-8">Refund Policy</h1>
        
        <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">1. Subscriptions & Refunds</h2>
            <p>If you are not entirely satisfied with your subscription, we're here to help. We offer a 14-day money-back guarantee on all our paid plans.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">2. Eligibility</h2>
            <p>To be eligible for a refund, you must request it within 14 days of your initial purchase. Refunds are only applicable to the first billing cycle of a new subscription. Renewals and subsequent charges are non-refundable.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">3. Process</h2>
            <p>To request a refund, please contact our support team at billing@clud.dev with your account details. We will process your refund to the original method of payment within 5-10 business days.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
