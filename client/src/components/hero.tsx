import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { ArrowRight01Icon } from 'hugeicons-react'

export const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 pb-16 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-semibold text-neutral-950 leading-[1.1] mb-6 max-w-4xl">
          Catch breaking API changes before they crash your frontend.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed mb-9 font-normal">
          Clud constantly polls your OpenAPI spec and instantly alerts your team's chat when the backend shifts. Keep everyone perfectly in sync, save hours of manual debugging, and protect your company from thousands of dollars in downtime.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full sm:w-auto">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full min-w-[180px] gap-2">
              Start free monitoring
              <ArrowRight01Icon size={18} />
            </Button>
          </Link>
          <Button variant="light" size="lg" className="w-full sm:w-auto min-w-[150px] gap-2 text-neutral-900 font-medium">
            See how it works
            <ArrowRight01Icon size={18} className="text-neutral-500" />
          </Button>
        </div>

      </div>
    </section>
  )
}
