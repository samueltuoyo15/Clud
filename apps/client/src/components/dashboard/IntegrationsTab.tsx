import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { EmailIntegrationModal } from "./EmailIntegrationModal"
import { DisconnectSlackModal } from "./DisconnectSlackModal"
import { fetchApi } from "../../lib/fetch"

interface SlackIntegration {
  connected: boolean
  metadata?: {
    channel?: string
    channel_id?: string
    team_name?: string
  }
}

interface IntegrationsTabProps {
  workspacePlan?: string
  onGoToBilling?: () => void
}

type CategoryType = "all" | "alerting" | "devtools" | "tracking"

export const IntegrationsTab: React.FC<IntegrationsTabProps> = ({
  workspacePlan = "free",
  onGoToBilling,
}) => {
  const isPro = workspacePlan === "pro"
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showDisconnectSlack, setShowDisconnectSlack] = useState(false)
  const [configuredEmails, setConfiguredEmails] = useState<string[]>([])
  const [slack, setSlack] = useState<SlackIntegration>({ connected: false })
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDisconnectingSlack, setIsDisconnectingSlack] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApi("/integrations")
        setSlack(data?.slack || { connected: false })
        setConfiguredEmails(Array.isArray(data?.emails) ? data.emails : [])
      } catch {
        toast.error("Failed to load integrations")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSaveEmails = async (emails: string[]) => {
    try {
      await fetchApi("/integrations/emails", {
        method: "POST",
        data: { emails },
      })
      setConfiguredEmails(emails)
      setShowEmailModal(false)
      toast.success("Email configuration saved!")
    } catch (err: any) {
      toast.error(err.message || "Failed to save emails")
    }
  }

  const handleDisconnectSlack = async () => {
    setIsDisconnectingSlack(true)
    try {
      await fetchApi("/integrations/slack", { method: "DELETE" })
      setSlack({ connected: false })
      setShowDisconnectSlack(false)
      toast.success("Slack disconnected")
    } catch (err: any) {
      toast.error(err.message || "Failed to disconnect Slack")
    } finally {
      setIsDisconnectingSlack(false)
    }
  }

  const categories = [
    { id: "all", label: "All Integrations" },
    { id: "alerting", label: "Alerting & Comms" },
    { id: "devtools", label: "Developer Tools" },
    { id: "tracking", label: "Issue Tracking" },
  ] as const

  const items = [
    {
      id: "slack",
      category: "alerting" as CategoryType,
      name: "Slack",
      badge: slack.connected ? "Active" : undefined,
      tag: "Alerting",
      description: slack.connected
        ? `Streaming contract drift events to #${slack.metadata?.channel || "channel"}.`
        : "Broadcast live breaking schema diffs to your engineering Slack channels.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24.5 24.5" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.3 15.3c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4v-2.4H5.3zm1.2-1.2c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4V8.9c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v5.2z" fill="#E01E5A"/>
          <path d="M9.1 5.3c0-1.3-1.1-2.4-2.4-2.4S4.3 4 4.3 5.3s1.1 2.4 2.4 2.4h2.4V5.3zm1.2 1.2c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.2c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4h-5.2z" fill="#36C5F0"/>
          <path d="M19.1 9.1c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4-2.4 1.1-2.4 2.4v2.4h2.4zm-1.2 1.2c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v5.2c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4v-5.2z" fill="#2EB67D"/>
          <path d="M15.3 19.1c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4h-2.4v2.4zm-1.2-1.2c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4H8.9c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.2z" fill="#ECB22E"/>
        </svg>
      ),
      action: slack.connected ? (
        <Button
          size="sm"
          variant="light"
          className="w-full text-xs rounded-lg border-neutral-200 hover:bg-neutral-50"
          onClick={() => setShowDisconnectSlack(true)}
        >
          Disconnect
        </Button>
      ) : !isPro ? (
        <Button
          size="sm"
          className="w-full text-xs rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 border-transparent cursor-pointer flex items-center justify-center gap-1.5"
          onClick={() => {
            toast.info("Slack integration is a Pro feature. Please upgrade to Pro.")
            if (onGoToBilling) onGoToBilling()
          }}
        >
          <span>Upgrade to Connect</span>
        </Button>
      ) : (
        <Button
          size="sm"
          className="w-full text-xs rounded-lg bg-primary text-white hover:bg-primary/90 border-transparent cursor-pointer"
          onClick={() => {
            const clientId = import.meta.env.VITE_SLACK_CLIENT_ID
            if (!clientId) {
              toast.error("Slack Client ID missing")
              return
            }
            const redirectUri = `${window.location.origin}/dashboard/integrations/slack/callback`
            window.location.href = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=incoming-webhook,chat:write&redirect_uri=${encodeURIComponent(redirectUri)}`
          }}
        >
          Connect Slack
        </Button>
      ),
    },
    {
      id: "email",
      category: "alerting" as CategoryType,
      name: "Email Alerts",
      badge: configuredEmails.length > 0 ? `${configuredEmails.length} Configured` : undefined,
      tag: "Alerting",
      description: configuredEmails.length > 0
        ? `${configuredEmails.length} recipient(s) subscribed to drift changelog digests.`
        : "Send detailed markdown changelog digests to specific team inboxes.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#611F69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m2 7 10 7 10-7"/>
        </svg>
      ),
      action: (
        <Button
          size="sm"
          className="w-full text-xs rounded-lg bg-primary text-white hover:bg-primary/90 border-transparent cursor-pointer"
          onClick={() => setShowEmailModal(true)}
        >
          {configuredEmails.length > 0 ? "Manage Email Recipients" : "Configure Emails"}
        </Button>
      ),
    },
    {
      id: "discord",
      category: "alerting" as CategoryType,
      name: "Discord",
      tag: "Comms",
      description: "Stream real-time API changes directly to a developer Discord channel.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 127.14 96.36" xmlns="http://www.w3.org/2000/svg">
          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-19.32-72.1M42.02,65.22c-5.36,0-9.82-4.95-9.82-11s4.38-11,9.82-11,9.91,4.95,9.82,11-4.46,11-9.82,11m43.1,0c-5.36,0-9.82-4.95-9.82-11s4.38-11,9.82-11,9.91,4.95,9.82,11-4.46,11-9.82,11" fill="#5865F2"/>
        </svg>
      ),
      action: (
        <button
          disabled
          className="w-full py-2 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200/60 transition-colors cursor-default"
        >
          Coming Soon
        </button>
      ),
    },
    {
      id: "teams",
      category: "alerting" as CategoryType,
      name: "Microsoft Teams",
      tag: "Comms",
      description: "Send webhook adaptive cards to your Microsoft Teams workspace.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 12c1.38 0 2.5-1.12 2.5-2.5S17.88 7 16.5 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zm-9 0c1.38 0 2.5-1.12 2.5-2.5S8.88 7 7.5 7 5 8.12 5 9.5 6.12 12 7.5 12zm0 1c-1.83 0-5.5.92-5.5 2.75V19h11v-3.25c0-1.83-3.67-2.75-5.5-2.75zm9 0c-.29 0-.62.02-.97.05.89.69 1.47 1.6 1.47 2.7V19h5v-3.25c0-1.83-3.67-2.75-5.5-2.75z" fill="#5059C9"/>
        </svg>
      ),
      action: (
        <button
          disabled
          className="w-full py-2 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200/60 transition-colors cursor-default"
        >
          Coming Soon
        </button>
      ),
    },
    {
      id: "webhooks",
      category: "devtools" as CategoryType,
      name: "Custom Webhooks",
      tag: "DevTools",
      description: "Send HTTP POST payloads with the full diff report to your internal endpoints.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 9v-4M12 19v-4M9 12H5M19 12h-4"/>
        </svg>
      ),
      action: (
        <button
          disabled
          className="w-full py-2 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200/60 transition-colors cursor-default"
        >
          Coming Soon
        </button>
      ),
    },
    {
      id: "linear",
      category: "tracking" as CategoryType,
      name: "Linear",
      tag: "Tracking",
      description: "Automatically create Linear issues when breaking contract changes are detected.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5E6AD2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      action: (
        <button
          disabled
          className="w-full py-2 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200/60 transition-colors cursor-default"
        >
          Coming Soon
        </button>
      ),
    },
    {
      id: "github",
      category: "devtools" as CategoryType,
      name: "GitHub Actions",
      tag: "DevTools",
      description: "Fail pull request CI builds when OpenAPI drift violates production contracts.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-900">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      ),
      action: (
        <button
          disabled
          className="w-full py-2 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200/60 transition-colors cursor-default"
        >
          Coming Soon
        </button>
      ),
    },
  ]

  const filteredItems = items.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory,
  )

  if (isLoading) {
    return (
      <div className="p-8 w-full max-w-5xl mx-auto flex justify-center">
        <div className="animate-spin h-5 w-5 border-2 border-neutral-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto overflow-y-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-semibold text-neutral-900 mb-1">
            Apps &amp; Integrations
          </h2>
          <p className="text-sm text-neutral-500">
            Connect channels to broadcast schema drift changelogs and breaking contract alerts.
          </p>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 border-b border-neutral-200/80 pb-4 mb-8 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat.id
                ? "bg-neutral-900 text-white font-semibold"
                : "bg-white text-neutral-600 border border-neutral-200/80 hover:border-neutral-300 hover:text-neutral-900"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-neutral-200 bg-white flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-neutral-200 bg-white shrink-0">
                  {item.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">
                    {item.tag}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                {item.name}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100">
              {item.action}
            </div>
          </div>
        ))}
      </div>

      <EmailIntegrationModal
        isOpen={showEmailModal}
        initialEmails={configuredEmails}
        onClose={() => setShowEmailModal(false)}
        onSave={handleSaveEmails}
      />
      <DisconnectSlackModal
        isOpen={showDisconnectSlack}
        onClose={() => setShowDisconnectSlack(false)}
        onConfirm={handleDisconnectSlack}
        isDisconnecting={isDisconnectingSlack}
      />
    </div>
  )
}
