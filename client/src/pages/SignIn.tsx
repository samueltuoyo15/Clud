import React, { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowRight01Icon, ArrowLeft01Icon } from "hugeicons-react"
import { toast } from "sonner"
import { Button } from "../components/ui/button"
import { AuthLayout } from "../components/auth/AuthLayout"
import { SignInOtpStep } from "../components/auth/SignInOtpStep"
import { loginApi, verifyOtpApi } from "../api/auth"

export const SignIn: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const step = parseInt(searchParams.get("step") || "1", 10)
  const setStep = (newStep: number) =>
    setSearchParams({ step: newStep.toString() })

  const [formData, setFormData] = useState({ email: "", otp: "" })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (step === 1) {
        await loginApi(formData.email)
        setStep(2)
        toast.success("Verification code sent!")
      } else {
        const data = await verifyOtpApi(formData.email, formData.otp)
        if (data && data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken)
        }
        toast.success("Welcome back to Clud!")
        navigate("/dashboard")
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8 relative">
        {step === 1 ? (
          <div>
            <h1 className="text-3xl font-heading font-semibold text-neutral-900 mb-2">
              Welcome back
            </h1>
            <p className="text-neutral-500 text-base">
              Sign in to your workspace.
            </p>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="absolute -left-10 top-1 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft01Icon size={24} />
            </button>
            <h1 className="text-3xl font-heading font-semibold text-neutral-900 mb-2">
              Check your email
            </h1>
            <p className="text-neutral-500 text-base">
              We sent a 6-digit code to {formData.email || "your email"}
            </p>
          </div>
        )}
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
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-neutral-900"
            />
          </div>
        ) : (
          <SignInOtpStep
            otp={formData.otp}
            onChange={(otp) => setFormData({ ...formData, otp })}
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
            <Link
              to="/signup"
              className="font-medium text-[#006FEE] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  )
}
