import React, { useState } from "react"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/layout/Footer"
import { SEO } from "../components/shared/Seo"
import { Button } from "../components/ui/button"
import { toast } from "sonner"
import { ArrowRight01Icon, Mail01Icon } from "hugeicons-react"

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setIsSuccess(true)
      toast.success("Thank you! Your message has been sent.")
      setFormData({ name: "", email: "", company: "", message: "" })
    } catch (_error) {
      toast.error("Could not send your message. Please try again or email support@samueltuoyo.com")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <SEO
        title="Contact Sales & Support | Clud"
        description="Get in touch with the Clud team for sales inquiries, custom integrations, or questions."
        path="/contact"
      />
      <div className="bg-[#FAFAFA] border-b border-neutral-200/60">
        <Navbar />
      </div>

      <main className="flex-1 py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-950 tracking-tight mb-4">
              Talk to our team
            </h1>
            <p className="text-base text-neutral-600">
              Have questions about enterprise deployment, custom specs, or need help getting started? We would love to chat.
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-white border border-neutral-200 rounded-2xl p-8 sm:p-10">
            {isSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Mail01Icon size={24} />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">Message Received</h2>
                <p className="text-sm text-neutral-600 max-w-md mx-auto">
                  Thanks for reaching out! A member of our team will review your inquiry and get back to you shortly.
                </p>
                <Button
                  variant="light"
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 rounded-xl"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Work Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Company Name (Optional)
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    How can we help? *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your team and what you are looking to monitor..."
                    className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-colors resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full gap-2 rounded-xl"
                >
                  {isSubmitting ? "Sending..." : "Send message"}
                  <ArrowRight01Icon size={18} />
                </Button>

                <p className="text-xs text-neutral-400 text-center">
                  Direct support also available via <a href="mailto:support@samueltuoyo.com" className="underline hover:text-neutral-600">support@samueltuoyo.com</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
