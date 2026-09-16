import React from "react"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/layout/Footer"
import { SEO } from "../components/shared/Seo"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight01Icon, ZapIcon, Shield01Icon, CheckmarkBadge01Icon } from "hugeicons-react"

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <SEO
        title="About Clud | Real-time API Monitoring"
        description="Learn why we created Clud to protect modern engineering teams from silent API contract breakages."
        path="/about"
      />
      <div className="bg-[#FAFAFA] border-b border-neutral-200/60">
        <Navbar />
      </div>

      <main className="flex-1 py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-neutral-950 tracking-tight mb-4">
              Why we created Clud
            </h1>
            <p className="text-base sm:text-lg text-neutral-600">
              Modern development moves fast. Microservices change, schemas update, and mobile or web clients break unexpectedly. We created Clud to make contract drift visible before production fails.
            </p>
          </div>

          {/* Core Values / Features */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <ZapIcon size={20} />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 mb-2">Continuous Polling</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                We periodically poll your live Swagger and OpenAPI specs, calculating structural AST diffs with zero manual work.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Shield01Icon size={20} />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 mb-2">Breaking Detection</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Removed endpoints, modified parameters, and altered response schemas trigger instant high-priority alerts.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckmarkBadge01Icon size={20} />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 mb-2">Instant Channels</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Alerts route immediately to your designated Slack channels and developer inboxes so fixes take minutes, not days.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-4">
              Ready to safeguard your API surface?
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-lg mx-auto mb-8">
              Set up your first OpenAPI monitor in under 60 seconds with no code changes or SDKs required.
            </p>
            <Link to="/signup">
              <Button variant="primary" size="lg" className="rounded-full px-8 gap-2">
                Start free monitoring
                <ArrowRight01Icon size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
