import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight01Icon } from "hugeicons-react"

export const Navbar: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken")

  return (
    <header className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between relative z-50">
      {/* Brand */}
      <div className="flex items-center">
        <a href="/" className="flex items-center gap-2 group">
          <img
            src="/favicon.svg"
            alt="Clud Logo"
            className="h-7 w-auto object-contain"
          />
          <span className="font-heading font-semibold text-xl text-neutral-950">
            Clud
          </span>
        </a>
      </div>

      {/* Nav Links (Centered absolute) */}
      <nav className="hidden md:flex items-center gap-8 text-[15px] text-neutral-600 font-medium absolute left-1/2 -translate-x-1/2">
        <a
          href="#features"
          className="hover:text-neutral-950 transition-colors"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className="hover:text-neutral-950 transition-colors"
        >
          How it works
        </a>
        <a
          href="#changelog"
          className="hover:text-neutral-950 transition-colors"
        >
          Changelog
        </a>
        <a href="#pricing" className="hover:text-neutral-950 transition-colors">
          Pricing
        </a>
      </nav>

      {/* Right CTA */}
      <div className="flex items-center gap-3">
        <a
          href="#contact"
          className="hidden sm:inline-flex items-center text-[15px] font-medium text-neutral-700 hover:text-neutral-950 px-4 py-2 rounded-full bg-black/5 transition-colors cursor-pointer"
        >
          Contact sales
        </a>
        <Link
          to={isLoggedIn ? "/dashboard" : "/signup"}
          className="inline-flex items-center gap-1.5 text-[15px] font-medium bg-primary text-white hover:bg-primary/90 px-5 py-2.5 rounded-full transition-colors cursor-pointer select-none"
        >
          <span>{isLoggedIn ? "Go to dashboard" : "Get started"}</span>
          <ArrowRight01Icon size={18} />
        </Link>
      </div>
    </header>
  )
}
