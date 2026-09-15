import React, { useState } from "react"
import { Link } from "react-router-dom"
import { NewTwitterIcon, Linkedin01Icon } from "hugeicons-react"
import { Select } from "../ui/Select"

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English (US)", icon: "🇺🇸" },
  { value: "fr", label: "Français", icon: "🇫🇷" },
  { value: "es", label: "Español", icon: "🇪🇸" },
  { value: "de", label: "Deutsch", icon: "🇩🇪" }
]

export const Footer: React.FC = () => {
  const [language, setLanguage] = useState("en")

  return (
    <footer className="mt-24 bg-transparent relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6 py-16 pb-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand & Description (Left Column) */}
          <div className="md:col-span-4 lg:col-span-5 flex flex-col items-start relative z-10">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <img src="/favicon-white.svg" alt="Clud" className="h-4 w-4 object-contain" />
              </div>
              <span className="font-heading font-bold text-lg text-neutral-900 group-hover:text-primary transition-colors">
                Clud
              </span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-xs">
              Autonomous API monitoring. We watch the unseen boundaries of your APIs, catching drift the moment it happens, protecting your team from silent breakages.
            </p>
            
            {/* Social Links & Language & Copyright */}
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex items-center gap-4">
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                  <NewTwitterIcon size={20} />
                </a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                  <Linkedin01Icon size={20} />
                </a>
                <div className="w-px h-4 bg-neutral-200"></div>
                <Select 
                  value={language} 
                  onChange={setLanguage} 
                  options={LANGUAGE_OPTIONS} 
                  className="w-[140px]"
                />
              </div>
              <p className="text-xs text-neutral-400">© {new Date().getFullYear()} Clud Inc. All rights reserved.</p>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 relative z-10">
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-neutral-500 hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-neutral-500 hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="text-sm text-neutral-500 hover:text-primary transition-colors">How it works</a></li>
                <li><Link to="/signin" className="text-sm text-neutral-500 hover:text-primary transition-colors">Sign in</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
                Support
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">System Status</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-primary transition-colors">Discord Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li><Link to="/terms" className="text-sm text-neutral-500 hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-sm text-neutral-500 hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/refunds" className="text-sm text-neutral-500 hover:text-primary transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Massive Brand Text Background */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center overflow-hidden select-none translate-y-[24%]">
        <span className="font-heading font-black text-[35vw] leading-none whitespace-nowrap text-neutral-200 tracking-tighter">
          CLUD
        </span>
      </div>
    </footer>
  )
}
