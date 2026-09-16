import React from "react"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/layout/Footer"
import { SEO } from "../components/shared/Seo"
import { CheckmarkBadge01Icon } from "hugeicons-react"

const RELEASES = [
  {
    version: "v1.2.0",
    date: "September 2026",
    title: "PWA Support & Real-Time Push Notifications",
    changes: [
      "Installable Progressive Web App (PWA) support for desktop and mobile devices.",
      "Real-time push notification alerts for immediate contract shift notifications.",
      "Enhanced responsive layouts and faster dashboard navigation.",
      "Optimized spec scanning and live alert delivery.",
    ],
  },
  {
    version: "v1.1.0",
    date: "September 2026",
    title: "Automated Slack Alerts & Team Workspaces",
    changes: [
      "Slack integration with automated channel notifications on schema drift.",
      "Instant email notifications for breaking and non-breaking contract changes.",
      "Team collaboration with workspace member invites and role management.",
      "Project health indicators and polling frequency controls.",
    ],
  },
  {
    version: "v1.0.0",
    date: "August 2026",
    title: "Clud Initial Release",
    changes: [
      "Continuous automated polling for OpenAPI 3.0 and Swagger 2.0 specifications.",
      "Automated breaking vs non-breaking change detection engine.",
      "Support for public and authenticated API endpoints via Basic Auth and Custom Headers.",
      "Interactive change timeline and visual contract diff summaries.",
    ],
  },
]

export const Changelog: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <SEO
        title="Changelog | Clud"
        description="Follow the latest product updates, performance enhancements, and features in Clud."
        path="/changelog"
      />
      <div className="bg-[#FAFAFA] border-b border-neutral-200/60">
        <Navbar />
      </div>

      <main className="flex-1 py-16 sm:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-neutral-950 tracking-tight mb-4">
              Changelog
            </h1>
            <p className="text-base sm:text-lg text-neutral-600">
              Recent updates, improvements, and new capabilities shipped to Clud.
            </p>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:left-3 sm:before:left-4 before:w-0.5 before:bg-neutral-200">
            {RELEASES.map((release) => (
              <div key={release.version} className="relative pl-10 sm:pl-12">
                <div className="absolute left-1.5 sm:left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white ring-2 ring-primary/20" />
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                    {release.version}
                  </span>
                  <span className="text-xs font-medium text-neutral-400">
                    {release.date}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 mb-4">
                  {release.title}
                </h2>
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
                  <ul className="space-y-2.5">
                    {release.changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                        <CheckmarkBadge01Icon size={18} className="text-primary shrink-0 mt-0.5" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
