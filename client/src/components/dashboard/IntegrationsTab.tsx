import React from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"

export const IntegrationsTab: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl overflow-y-auto">
      <h2 className="text-lg font-bold text-neutral-900 mb-1">Integrations & Alert Channels</h2>
      <p className="text-xs text-neutral-500 mb-8">
        Connect external services to receive instant alerts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center font-bold text-neutral-700 text-sm border border-neutral-200">
              #
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Slack Webhook</h3>
              <p className="text-[11px] text-neutral-500">Post diff alerts to your channel</p>
            </div>
          </div>
          <input
            type="url"
            placeholder="https://hooks.slack.com/services/..."
            className="w-full px-3 py-1.5 rounded-md border border-neutral-200 text-xs font-mono mb-3 outline-none focus:border-neutral-400"
          />
          <Button
            size="sm"
            variant="light"
            className="w-full rounded-md shadow-xs text-xs"
            onClick={() => toast.success("Slack webhook saved!")}
          >
            Save Slack Channel
          </Button>
        </div>
      </div>
    </div>
  )
}
