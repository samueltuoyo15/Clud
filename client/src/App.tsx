import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { Home } from "./pages/Home"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"
import { Dashboard } from "./pages/Dashboard"
import { SlackCallback } from "./pages/SlackCallback"

export const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/integrations/slack/callback" element={<SlackCallback />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
