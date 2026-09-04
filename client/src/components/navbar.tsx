import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-white/70 backdrop-blur-xl border border-neutral-200/60 rounded-full px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2 group">
            <img 
              src="https://api.dicebear.com/9.x/pixel-art/svg?seed=Clud&backgroundColor=ffffff" 
              alt="Logo" 
              className="w-8 h-8 rounded-md"
            />
            <span className="font-heading font-bold text-lg text-neutral-950">
              Clud
            </span>
          </a>
        </div>

        {/* Nav Links (Centered absolute) */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-600 font-medium absolute left-1/2 -translate-x-1/2">
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
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-neutral-700 rounded-full">
            Contact sales
          </Button>
          <Link to="/signup">
            <Button variant="primary" size="sm" className="shadow-xs rounded-full px-5 cursor-pointer">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

