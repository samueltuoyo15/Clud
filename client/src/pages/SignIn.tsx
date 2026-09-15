import React, { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight01Icon, ArrowLeft01Icon } from "hugeicons-react"
import { toast } from "sonner"
import { Button } from "../components/ui/button"
import { AuthLayout } from "../components/auth/AuthLayout"
import { OtpInput } from "../components/ui/OtpInput"
import { loginApi, verifyOtpApi, resendOtpApi } from "../api/auth"

export const SignIn: React.FC = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const navigate = useNavigate()

  // Guard against double-fire from onAutoSubmit + form submit
  const isSubmittingRef = useRef(false)

  const doVerify = async (codeToVerify: string) => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setIsLoading(true)
    try {
      const data = await verifyOtpApi(email, codeToVerify)
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken)
      }
      toast.success("Welcome back to Clud!")
      navigate("/dashboard")
    } catch (err: any) {
      toast.error(err.message || "Invalid or expired code.")
      isSubmittingRef.current = false
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setIsLoading(true)
      try {
        await loginApi(email)
        setOtp("")
        isSubmittingRef.current = false
        setStep(2)
        toast.success("Verification code sent!")
      } catch (err: any) {
        toast.error(err.message || "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    } else {
      await doVerify(otp)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await resendOtpApi(email)
      toast.success("A new code has been sent!")
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8 relative">
        {step === 2 && (
          <button
            type="button"
            onClick={() => { setStep(1); setOtp(""); isSubmittingRef.current = false }}
            className="absolute -left-10 top-1 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft01Icon size={24} />
          </button>
        )}
        <h1 className="text-3xl font-heading font-semibold text-neutral-900 mb-2">
          {step === 1 ? "Welcome back" : "Check your email"}
        </h1>
        <p className="text-neutral-500 text-base">
          {step === 1
            ? "Sign in to your workspace."
            : `We sent a 6-digit code to ${email}`}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleNext}>
        {step === 1 ? (
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-1.5"
            >
              Work email
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="samuel@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-neutral-900"
            />
          </div>
        ) : (
          <OtpInput
            value={otp}
            onChange={setOtp}
            onAutoSubmit={doVerify}
            onResend={handleResend}
            isLoadingResend={isResending}
          />
        )}

        <Button
          type="submit"
          className="w-full mt-8"
          size="lg"
          isLoading={isLoading}
        >
          {step === 2 ? "Verify & Continue" : "Continue"}
          {!isLoading && step !== 2 && (
            <ArrowRight01Icon
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          )}
        </Button>
      </form>

      {step === 1 && (
        <div className="mt-8 text-center border-t border-neutral-100 pt-6">
          <p className="text-sm text-neutral-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  )
}
