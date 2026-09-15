import React from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"

export const IntegrationsTab: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl overflow-y-auto">
      <h2 className="text-lg font-bold text-neutral-900 mb-1">
        Integrations & Alert Channels
      </h2>
      <p className="text-xs text-neutral-500 mb-8">
        Connect external services to receive instant alerts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center font-bold text-neutral-700 text-sm border border-neutral-200">
              #
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Slack Workspace
              </h3>
              <p className="text-[11px] text-neutral-500">
                Connect your workspace to post alerts
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="light"
            className="w-full rounded-md shadow-xs text-xs"
            onClick={() => {
              const clientId = import.meta.env.VITE_SLACK_CLIENT_ID
              if (!clientId) {
                toast.error("Slack Client ID is missing in environment variables")
                return
              }
              const redirectUri = `${window.location.origin}/dashboard/integrations/slack/callback`
              const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=incoming-webhook,chat:write&redirect_uri=${encodeURIComponent(redirectUri)}`
              window.location.href = slackAuthUrl
            }}
          >
            Connect Slack
          </Button>
        </div>
      </div>
    </div>
  )
}
