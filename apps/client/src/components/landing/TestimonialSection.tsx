import React, { useState } from "react"
import { NewTwitterIcon, ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react"

const TESTIMONIALS = [
  {
    quote: "Clud has completely changed how our frontend and backend teams communicate. We catch breaking changes instantly before they hit production.",
    name: "Sarah Jenkins",
    handle: "@sarahjenkins",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    quote: "I used to spend hours debugging silent failures. Now Clud just pings our Slack channel the second an API spec drifts. Unbelievably good.",
    name: "Marcus Chen",
    handle: "@marcuschen_dev",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    quote: "The easiest setup I have ever experienced. Dropped our OpenAPI spec URL in and it immediately started protecting our mobile team from unexpected breaks.",
    name: "Elena Rodriguez",
    handle: "@elena_codes",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
]

export const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState(TESTIMONIALS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const testimonialSpace = import.meta.env.VITE_TESTIMONIAL_SPACE || "clud"
  const testimonialApiKey = import.meta.env.VITE_TESTIMONIAL_API_KEY

  React.useEffect(() => {
    if (!testimonialApiKey) return
    fetch(`https://api.testimonial.to/api/v1/reviews?key=${testimonialApiKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any) => ({
            quote: item.text || item.message || item.quote,
            name: item.name || "Happy Customer",
            handle: item.handle || (item.twitter_username ? `@${item.twitter_username}` : ""),
            avatar: item.avatar || item.photo_url || "https://i.pravatar.cc/150?img=47",
          }))
          setTestimonials(mapped)
        }
      })
      .catch(() => {})
  }, [testimonialApiKey])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentIndex] || TESTIMONIALS[0]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-neutral-900 tracking-tight">
            Proof in Practice
          </h2>
        </div>

        {/* Pink Grid Box */}
        <div 
          className="relative rounded-3xl p-10 md:p-16 min-h-[400px] flex flex-col justify-between"
          style={{ 
            backgroundColor: "#fff0f6", 
            backgroundImage: "linear-gradient(#fbcfe8 1px, transparent 1px), linear-gradient(90deg, #fbcfe8 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        >
          <blockquote className="text-3xl md:text-4xl font-heading font-semibold text-neutral-900 leading-tight max-w-3xl">
            "{current.quote}"
          </blockquote>

          <div className="flex items-center justify-between mt-12">
            <div className="flex items-center gap-4">
              <img
                src={current.avatar}
                alt={current.name}
                width={48}
                height={48}
                loading="lazy"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-neutral-900">{current.name}</div>
                <div className="text-sm text-neutral-500">{current.handle}</div>
              </div>
            </div>
            
            <div className="text-neutral-900" aria-hidden="true">
              <NewTwitterIcon size={24} />
            </div>
          </div>

          <div className="absolute bottom-10 left-10 flex items-center gap-4">
            <button 
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft01Icon size={20} />
            </button>
            <button 
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <ArrowRight01Icon size={20} />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          <p className="text-sm font-medium text-neutral-900">
            See what more of our amazing customers have to say!
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`https://testimonial.to/${testimonialSpace}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              Leave a testimonial →
            </a>
            <a
              href={`https://testimonial.to/${testimonialSpace}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:opacity-80"
            >
              Visit wall of love
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}

