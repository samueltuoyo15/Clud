import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight01Icon } from "hugeicons-react"

export const Navbar: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken")

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-neutral-200 rounded-full px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2 group">
            <img 
              src="/favicon.svg" 
              alt="Clud Logo" 
              className="h-7 w-auto object-contain"
            />
            <span className="font-heading font-semibold text-lg text-neutral-950">
              Clud
            </span>
          </a>
        </div>

        {/* Nav Links (Centered absolute) */}
        <nav className="hidden md:flex items-center gap-7 text-sm text-neutral-600 font-medium absolute left-1/2 -translate-x-1/2">
          <a href="#features" className="hover:text-neutral-950 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-neutral-950 transition-colors">
            How it works
          </a>
          <a href="#changelog" className="hover:text-neutral-950 transition-colors">
            Changelog
          </a>
          <a href="#pricing" className="hover:text-neutral-950 transition-colors">
            Pricing
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center text-sm font-medium text-neutral-700 hover:text-neutral-950 px-3.5 py-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Contact sales
          </a>
          <Link
            to={isLoggedIn ? "/dashboard" : "/signup"}
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-[#3902FF] text-white hover:bg-[#3902FF]/90 px-4 py-1.5 rounded-full transition-colors cursor-pointer select-none"
          >
            <span>{isLoggedIn ? "Go to dashboard" : "Get started"}</span>
            <ArrowRight01Icon size={16} />
          </Link>
        </div>
      </div>
    </header>
  )
}

