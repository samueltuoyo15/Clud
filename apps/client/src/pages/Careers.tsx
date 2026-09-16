import React, { useEffect } from "react"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/layout/Footer"
import { SEO } from "../components/shared/Seo"
import { Button } from "../components/ui/button"
import { Mail01Icon } from "hugeicons-react"
import { Link } from "react-router-dom"

export const Careers: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [])
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <SEO
        title="Careers at Clud"
        description="Join us in building autonomous API contract monitoring for developers worldwide."
        path="/careers"
      />
      <div className="bg-[#FAFAFA] border-b border-neutral-200/60">
        <Navbar />
      </div>

      <main className="flex-1 py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
        

          <div className="max-w-2xl mx-auto bg-neutral-50 border border-neutral-200 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-xl font-bold text-neutral-900 mb-3">
              No Open Roles Right Now
            </h2>
            <p className="text-sm text-neutral-600 max-w-md mx-auto mb-8 leading-relaxed">
              We do not have active job openings at the moment, but we are always interested in meeting talented engineers and builders.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@samueltuoyo.com?subject=Careers%20Inquiry%20-%20Clud"
                className="w-full sm:w-auto"
              >
                <Button variant="primary" className="w-full gap-2 rounded-xl">
                  <Mail01Icon size={18} />
                  Send an open application
                </Button>
              </a>
              <Link to="/" className="w-full sm:w-auto">
                <Button variant="light" className="w-full rounded-xl">
                  Back to home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
