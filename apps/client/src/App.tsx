import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { Home } from "./pages/Home"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"
import { Dashboard } from "./pages/Dashboard"
import { SlackCallback } from "./pages/SlackCallback"
import { PrivacyPolicy } from "./pages/PrivacyPolicy"
import { Terms } from "./pages/Terms"
import { RefundPolicy } from "./pages/RefundPolicy"

export const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Analytics />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refunds" element={<RefundPolicy />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard/integrations/slack/callback" element={<SlackCallback />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
