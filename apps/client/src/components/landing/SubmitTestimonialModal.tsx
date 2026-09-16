import React, { useState } from "react"
import { Cancel01Icon, StarIcon } from "hugeicons-react"
import { Button } from "../ui/button"
import { toast } from "sonner"

interface SubmitTestimonialModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SubmitTestimonialModal: React.FC<SubmitTestimonialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    quote: "",
    role: "",
    company: "",
    rating: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.quote.trim()) {
      toast.error("Please fill in your name and review")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/testimonials`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      toast.success("Thank you! Your review has been submitted for review.")
      onClose()
    } catch (_err) {
      toast.error("Could not submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 text-left">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <Cancel01Icon size={20} />
        </button>

        <h3 className="text-xl font-bold text-neutral-900 mb-1">
          Leave a Review
        </h3>
        <p className="text-xs text-neutral-500 mb-6">
          Share how Clud is helping your engineering team catch API drift.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Sarah Jenkins"
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Twitter / X Handle
              </label>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="@sarahjenkins"
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Frontend Lead"
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Inc"
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <StarIcon
                    size={22}
                    fill={star <= formData.rating ? "#f59e0b" : "none"}
                    color={star <= formData.rating ? "#f59e0b" : "#d1d5db"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Your Review *
            </label>
            <textarea
              rows={3}
              required
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="How has Clud helped protect your team from breaking changes?"
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="light"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="rounded-xl"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
