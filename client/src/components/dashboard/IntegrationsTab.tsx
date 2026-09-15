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

export const IntegrationsTab: React.FC = () => {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showDisconnectSlack, setShowDisconnectSlack] = useState(false)
  const [configuredEmails, setConfiguredEmails] = useState<string[]>([])
  const [slack, setSlack] = useState<SlackIntegration>({ connected: false })
  const [isLoading, setIsLoading] = useState(true)
  const [isDisconnectingSlack, setIsDisconnectingSlack] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApi("/integrations")
        setSlack(data.slack)
        setConfiguredEmails(data.emails)
      } catch (err: any) {
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

  if (isLoading) {
    return (
      <div className="p-8 w-full max-w-5xl mx-auto flex justify-center">
        <div className="animate-spin h-5 w-5 border-2 border-neutral-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto overflow-y-auto">
      <h2 className="text-xl font-heading font-semibold text-neutral-900 mb-1">
        Integrations
      </h2>
      <p className="text-sm text-neutral-500 mb-8">
        Connect external services to receive instant drift alerts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Slack */}
        <div className="p-6 rounded-2xl border-2 border-neutral-100 bg-white transition-all flex flex-col justify-between group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-neutral-100 bg-neutral-50 group-hover:scale-105 transition-transform shrink-0">
              <svg width="24" height="24" viewBox="0 0 24.5 24.5" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.3 15.3c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4v-2.4H5.3zm1.2-1.2c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4V8.9c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v5.2z" fill="#E01E5A"/>
                <path d="M9.1 5.3c0-1.3-1.1-2.4-2.4-2.4S4.3 4 4.3 5.3s1.1 2.4 2.4 2.4h2.4V5.3zm1.2 1.2c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.2c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4h-5.2z" fill="#36C5F0"/>
                <path d="M19.1 9.1c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4-2.4 1.1-2.4 2.4v2.4h2.4zm-1.2 1.2c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v5.2c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4v-5.2z" fill="#2EB67D"/>
                <path d="M15.3 19.1c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4h-2.4v2.4zm-1.2-1.2c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4H8.9c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.2z" fill="#ECB22E"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-neutral-900">
                Slack
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                {slack.connected 
                  ? `Connected to #${slack.metadata?.channel || "channel"}.` 
                  : "Post instant alerts and daily drift summaries directly to your team's channels."}
              </p>
            </div>
          </div>
          {slack.connected ? (
            <Button
              size="sm"
              variant="light"
              className="w-full text-xs rounded-lg border-neutral-200"
              onClick={() => setShowDisconnectSlack(true)}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full text-xs rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 border-transparent"
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
              Connect
            </Button>
          )}
        </div>

        {/* Email */}
        <div className="p-6 rounded-2xl border-2 border-neutral-100 bg-white transition-all flex flex-col justify-between group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-neutral-100 bg-neutral-50 group-hover:scale-105 transition-transform shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#611F69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m2 7 10 7 10-7"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-neutral-900">
                Email Alerts
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                {configuredEmails.length > 0 
                  ? `${configuredEmails.length} email(s) configured to receive drift alerts.`
                  : "Send drift alerts to specific team members via email."}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="w-full text-xs rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 border-transparent"
            onClick={() => setShowEmailModal(true)}
          >
            {configuredEmails.length > 0 ? "Manage Emails" : "Connect"}
          </Button>
        </div>

        {/* Discord */}
        <div className="p-6 rounded-2xl border-2 border-neutral-100 bg-neutral-50/50 transition-all flex flex-col justify-between group opacity-70">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-neutral-200 bg-white shrink-0">
              <svg width="24" height="24" viewBox="0 0 127.14 96.36" xmlns="http://www.w3.org/2000/svg" className="grayscale opacity-60">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-19.32-72.1M42.02,65.22c-5.36,0-9.82-4.95-9.82-11s4.38-11,9.82-11,9.91,4.95,9.82,11-4.46,11-9.82,11m43.1,0c-5.36,0-9.82-4.95-9.82-11s4.38-11,9.82-11,9.91,4.95,9.82,11-4.46,11-9.82,11" fill="#5865F2"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-neutral-900">
                Discord
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Stream real-time API changes to a dedicated server text channel.
              </p>
            </div>
          </div>
          <Button size="sm" variant="light" className="w-full text-xs rounded-lg opacity-50 cursor-not-allowed" disabled>
            Coming Soon
          </Button>
        </div>

        {/* MS Teams */}
        <div className="p-6 rounded-2xl border-2 border-neutral-100 bg-neutral-50/50 transition-all flex flex-col justify-between group opacity-70">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-neutral-200 bg-white shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="grayscale opacity-60">
                <path d="M16.5 12c1.38 0 2.5-1.12 2.5-2.5S17.88 7 16.5 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zm-9 0c1.38 0 2.5-1.12 2.5-2.5S8.88 7 7.5 7 5 8.12 5 9.5 6.12 12 7.5 12zm0 1c-1.83 0-5.5.92-5.5 2.75V19h11v-3.25c0-1.83-3.67-2.75-5.5-2.75zm9 0c-.29 0-.62.02-.97.05.89.69 1.47 1.6 1.47 2.7V19h5v-3.25c0-1.83-3.67-2.75-5.5-2.75z" fill="#5059C9"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-neutral-900">
                Microsoft Teams
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Send rich webhook cards to your engineering team's channel.
              </p>
            </div>
          </div>
          <Button size="sm" variant="light" className="w-full text-xs rounded-lg opacity-50 cursor-not-allowed" disabled>
            Coming Soon
          </Button>
        </div>

        {/* Webhooks */}
        <div className="p-6 rounded-2xl border-2 border-neutral-100 bg-neutral-50/50 transition-all flex flex-col justify-between group opacity-70">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-neutral-200 bg-white shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 9v-4M12 19v-4M9 12H5M19 12h-4"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-neutral-900">
                Custom Webhooks
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Send a POST request with the JSON diff to any custom endpoint.
              </p>
            </div>
          </div>
          <Button size="sm" variant="light" className="w-full text-xs rounded-lg opacity-50 cursor-not-allowed" disabled>
            Coming Soon
          </Button>
        </div>
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
