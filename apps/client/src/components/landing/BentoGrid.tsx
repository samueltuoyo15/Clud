import React from "react"

export const BentoGrid: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
      <div className="md:col-span-2 bg-neutral-50 rounded-3xl p-8 border border-neutral-200 min-h-75 flex flex-col justify-between items-start text-left">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Real-time alerts
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Get instantly notified in Slack or Teams the second a backend
            developer ships a breaking change.
          </p>
        </div>
        <div className="w-full h-32 bg-white rounded-xl border border-neutral-100 mt-6" />
      </div>

      <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200 min-h-75 flex flex-col justify-between items-start text-left">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            No setup required
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Just paste your OpenAPI URL. We handle the rest.
          </p>
        </div>
        <div className="w-full h-24 bg-white rounded-xl border border-neutral-100 mt-6" />
      </div>

      <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200 min-h-75 flex flex-col justify-between items-start text-left">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Beautiful Changelogs
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Human-readable summaries of every change, automatically generated.
          </p>
        </div>
      </div>

      <div className="md:col-span-2 bg-neutral-50 rounded-3xl p-8 border border-neutral-200 min-h-75 flex flex-col justify-between items-start text-left">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Zero downtime
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Catch breaking changes before they reach your users and affect your
            revenue.
          </p>
        </div>
        <div className="w-full h-32 bg-white rounded-xl border border-neutral-100 mt-6" />
      </div>
    </div>
  )
}
