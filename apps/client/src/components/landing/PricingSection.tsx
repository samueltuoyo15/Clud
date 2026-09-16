import React from "react"
import { Link } from "react-router-dom"
import { CheckmarkBadge01Icon } from "hugeicons-react"

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-neutral-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-neutral-900 tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-neutral-500">
            Start for free, upgrade when you need more power and peace of mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-neutral-200 flex flex-col">
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Hobby</h3>
            <p className="text-sm text-neutral-500 mb-6 min-h-[40px]">
              Perfect for side projects and indie hackers testing the waters.
            </p>
            <div className="mb-8">
              <span className="text-4xl font-heading font-black text-neutral-900">$0</span>
              <span className="text-neutral-500 font-medium">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <CheckmarkBadge01Icon className="text-emerald-500 shrink-0" size={20} />
                <span className="text-sm text-neutral-700">1 OpenAPI Spec Project</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckmarkBadge01Icon className="text-emerald-500 shrink-0" size={20} />
                <span className="text-sm text-neutral-700">Email Alerts</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckmarkBadge01Icon className="text-emerald-500 shrink-0" size={20} />
                <span className="text-sm text-neutral-700">5-minute polling interval</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <CheckmarkBadge01Icon className="text-neutral-400 shrink-0" size={20} />
                <span className="text-sm text-neutral-500 line-through">Slack Integration</span>
              </li>
            </ul>

            <Link
              to="/signup"
              className="block w-full py-3 px-6 text-center rounded-xl font-semibold bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition-colors"
            >
              Start for free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-primary rounded-3xl p-8 md:p-10 flex flex-col relative overflow-hidden text-white shadow-xl">
            {/* Subtle glow effect inside the card */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 blur-3xl rounded-full pointer-events-none"></div>

            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-sm text-primary-200 mb-6 min-h-[40px]">
              For teams that need instant alerts and unlimited monitoring.
            </p>
            <div className="mb-8">
              <span className="text-4xl font-heading font-black">$10</span>
              <span className="text-primary-200 font-medium">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <CheckmarkBadge01Icon className="text-white shrink-0" size={20} />
                <span className="text-sm">Unlimited OpenAPI Projects</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckmarkBadge01Icon className="text-white shrink-0" size={20} />
                <span className="text-sm">Instant Slack &amp; Email Alerts</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckmarkBadge01Icon className="text-white shrink-0" size={20} />
                <span className="text-sm">Unlimited Team Members</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckmarkBadge01Icon className="text-white shrink-0" size={20} />
                <span className="text-sm">Priority Support</span>
              </li>
            </ul>

            <Link
              to="/dashboard/settings?tab=billing"
              className="block w-full py-3 px-6 text-center rounded-xl font-semibold bg-white text-primary hover:bg-neutral-50 transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
