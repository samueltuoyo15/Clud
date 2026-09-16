import React from "react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { ArrowRight01Icon } from "hugeicons-react"
import { BentoGrid } from "./landing/BentoGrid"

export const Hero: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken")

  return (
    <section className="min-h-screen flex flex-col items-center text-center px-6 pt-20 sm:pt-24 pb-16 bg-transparent relative overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        {/* Social Proof Badge */}
        <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-full py-1.5 px-2 pr-4 mb-6 w-fit">
          <div className="flex -space-x-2">
            <img
              src="https://i.pravatar.cc/150?u=a"
              alt="User 1"
              className="w-8 h-8 rounded-full border-2 border-white object-cover bg-neutral-100 grayscale"
            />
            <img
              src="https://i.pravatar.cc/150?u=b"
              alt="User 2"
              className="w-8 h-8 rounded-full border-2 border-white object-cover bg-neutral-100 grayscale"
            />
            <img
              src="https://i.pravatar.cc/150?u=c"
              alt="User 3"
              className="w-8 h-8 rounded-full border-2 border-white object-cover bg-neutral-100 grayscale"
            />
            <img
              src="https://i.pravatar.cc/150?u=d"
              alt="User 4"
              className="w-8 h-8 rounded-full border-2 border-white object-cover bg-neutral-100 grayscale"
            />
          </div>
          <span className="text-sm text-neutral-600 font-medium">
            Built for teams tired of silent API breakages
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-950 leading-snug mb-8 max-w-4xl tracking-tight">
          Clud monitors your OpenAPI specs and instantly alerts your team when
          the API shifts.
        </h1>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto">
          <Link
            to={isLoggedIn ? "/dashboard" : "/signup"}
            className="w-full sm:w-auto"
          >
            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2 rounded-full px-6"
            >
              {isLoggedIn ? "Go to dashboard" : "Start free monitoring"}
              <ArrowRight01Icon size={18} />
            </Button>
          </Link>
          <Button
            variant="light"
            size="lg"
            className="w-full sm:w-auto gap-2 text-neutral-900 font-medium rounded-full px-6"
          >
            See how it works
            <ArrowRight01Icon size={18} className="text-neutral-500" />
          </Button>
        </div>

        {/* Hero Screenshot */}
        <div className="w-full max-w-4xl mx-auto mb-20 relative">
          <div className="w-full bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <img
              src="/images/SlackScreenshot.png"
              alt="Clud automated Slack notification and API drift detection"
              className="w-full h-auto object-cover block"
            />
          </div>
        </div>

        {/* Bento Grid */}
        <BentoGrid />
      </div>
    </section>
  )
}
