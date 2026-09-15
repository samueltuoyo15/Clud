import React from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"

export const IntegrationsTab: React.FC = () => {
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
        <div className="p-6 rounded-2xl border border-neutral-200 bg-white hover:shadow-md transition-shadow flex flex-col justify-between group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#4A154B]/5 flex items-center justify-center font-bold text-[#4A154B] text-xl border border-[#4A154B]/10 group-hover:scale-105 transition-transform">
              #
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-neutral-900">
                Slack
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Post instant alerts and daily drift summaries directly to your team's channels.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
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
        </div>

        {/* Discord */}
        <div className="p-6 rounded-2xl border border-neutral-200 bg-white hover:shadow-md transition-shadow flex flex-col justify-between group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#5865F2]/5 flex items-center justify-center font-bold text-[#5865F2] text-xl border border-[#5865F2]/10 group-hover:scale-105 transition-transform">
              D
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
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={() => toast("Discord integration coming soon!")}
          >
            Connect
          </Button>
        </div>

        {/* MS Teams */}
        <div className="p-6 rounded-2xl border border-neutral-200 bg-white hover:shadow-md transition-shadow flex flex-col justify-between group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#5059C9]/5 flex items-center justify-center font-bold text-[#5059C9] text-xl border border-[#5059C9]/10 group-hover:scale-105 transition-transform">
              T
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
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={() => toast("MS Teams integration coming soon!")}
          >
            Connect
          </Button>
        </div>

        {/* Webhooks */}
        <div className="p-6 rounded-2xl border border-neutral-200 bg-white hover:shadow-md transition-shadow flex flex-col justify-between group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-neutral-900/5 flex items-center justify-center font-bold text-neutral-900 text-xl border border-neutral-900/10 group-hover:scale-105 transition-transform">
              {'{ }'}
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
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={() => toast("Webhooks coming soon!")}
          >
            Configure
          </Button>
        </div>
      </div>
    </div>
  )
}
