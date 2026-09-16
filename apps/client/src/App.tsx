import React, { lazy, Suspense, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { Home } from "./pages/Home"

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

const SignIn = lazy(() => import("./pages/SignIn").then((m) => ({ default: m.SignIn })))
const SignUp = lazy(() => import("./pages/SignUp").then((m) => ({ default: m.SignUp })))
const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })))
const SlackCallback = lazy(() => import("./pages/SlackCallback").then((m) => ({ default: m.SlackCallback })))
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy })))
const Terms = lazy(() => import("./pages/Terms").then((m) => ({ default: m.Terms })))
const RefundPolicy = lazy(() => import("./pages/RefundPolicy").then((m) => ({ default: m.RefundPolicy })))
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })))
const Careers = lazy(() => import("./pages/Careers").then((m) => ({ default: m.Careers })))
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })))
const Changelog = lazy(() => import("./pages/Changelog").then((m) => ({ default: m.Changelog })))

export const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Analytics />
      <Router>
        <ScrollToTop />
        <Suspense>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refunds" element={<RefundPolicy />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard/integrations/slack/callback" element={<SlackCallback />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  )
}

export default App

