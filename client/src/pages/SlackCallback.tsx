import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { fetchApi } from "../lib/fetch"

export const SlackCallback: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("Connecting to Slack...")
  const hasAttempted = useRef(false)

  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      toast.error(`Slack connection failed: ${error}`)
      navigate("/dashboard")
      return
    }

    if (!code) {
      navigate("/dashboard")
      return
    }

    if (hasAttempted.current) return
    hasAttempted.current = true

    const exchangeCode = async () => {
      try {
        const redirectUri = `${window.location.origin}/dashboard/integrations/slack/callback`
        
        await fetchApi("/integrations/slack", {
          method: "POST",
          data: {
            code,
            redirect_uri: redirectUri,
          },
        })
        
        toast.success("Slack connected successfully!")
        navigate("/dashboard")
      } catch (err: any) {
        toast.error(err.message || "Failed to connect Slack")
        setStatus("Failed to connect")
        setTimeout(() => navigate("/dashboard"), 2000)
      }
    }

    exchangeCode()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFC] font-sans">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-xs flex flex-col items-center">
        <svg
          className="animate-spin mb-4 h-8 w-8 text-primary shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-neutral-700 font-medium">{status}</p>
      </div>
    </div>
  )
}
