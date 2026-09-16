import React, { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowRight01Icon, ArrowLeft01Icon } from "hugeicons-react"
import { toast } from "sonner"
import { Button } from "../components/ui/button"
import { AuthLayout } from "../components/auth/AuthLayout"
import { SignUpStep1 } from "../components/auth/SignUpStep1"
import { SignUpStep2 } from "../components/auth/SignUpStep2"
import { SignUpStep3 } from "../components/auth/SignUpStep3"
import { OtpInput } from "../components/ui/OtpInput"
import { SignUpStepRole } from "../components/auth/SignUpStepRole"
import { SEO } from "../components/shared/Seo"
import { signupApi, verifyOtpApi, resendOtpApi } from "../api/auth"

const titles = [
  { title: "Create your account", desc: "Let's start with the basics." },
  {
    title: "What sounds like you right now?",
    desc: "Help us tailor Clud to your team.",
  },
  {
    title: "What's your role on the team?",
    desc: "Who is the autonomous agent reporting to?",
  },
  {
    title: "Where are you based?",
    desc: "Select your country to complete setup.",
  },
  { title: "Check your email", desc: "We sent a 6-digit code to your email" },
]

export const SignUp: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const step = parseInt(searchParams.get("step") || "1", 10)
  const setStep = (newStep: number) =>
    setSearchParams({ step: newStep.toString() })

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("clud_signup_form")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        // ignore JSON parse errors
      }
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      challenge: "backend-changes",
      role: "frontend",
      country: "",
      otp: "",
    }
  })

  useEffect(() => {
    localStorage.setItem("clud_signup_form", JSON.stringify(formData))
  }, [formData])

  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const navigate = useNavigate()

  const handleNext = async (e?: React.FormEvent, overrideOtp?: string) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    try {
      if (step === 1) {
        if (!formData.firstName || !formData.lastName || !formData.email)
          throw new Error("Please fill all fields")
        setStep(2)
      } else if (step === 2) {
        if (!formData.challenge) throw new Error("Please select an option")
        setStep(3)
      } else if (step === 3) {
        if (!formData.role) throw new Error("Please select a role")
        setStep(4)
      } else if (step === 4) {
        if (!formData.country) throw new Error("Please select a country")
        await signupApi(
          formData.email,
          formData.firstName,
          formData.lastName,
          formData.country,
          formData.role,
          formData.challenge
        )
        setStep(5)
        toast.success("Verification code sent!")
      } else {
        const codeToVerify = overrideOtp || formData.otp
        const data = await verifyOtpApi(formData.email, codeToVerify)
        if (data?.accessToken)
          localStorage.setItem("accessToken", data.accessToken)
        localStorage.removeItem("clud_signup_form")
        toast.success("Welcome to Clud!")
        navigate("/dashboard")
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await resendOtpApi(formData.email)
      toast.success("A new verification code has been sent!")
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout>
      <SEO
        title="Get Started | Clud"
        description="Create your Clud account to start monitoring OpenAPI and Swagger endpoints for real-time drift detection."
        path="/signup"
      />
      <div className="mb-8">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer mb-3"
          >
            <ArrowLeft01Icon size={16} />
            <span>Back</span>
          </button>
        )}
        <h1 className="text-3xl font-heading font-semibold text-neutral-900 mb-2">
          {titles[step - 1]?.title}
        </h1>
        <p className="text-neutral-500 text-base">{titles[step - 1]?.desc}</p>
      </div>

      <form className="space-y-5" onSubmit={handleNext}>
        {step === 1 && (
          <SignUpStep1
            firstName={formData.firstName}
            lastName={formData.lastName}
            email={formData.email}
            onChange={(f) => setFormData({ ...formData, ...f })}
          />
        )}
        {step === 2 && (
          <SignUpStep2
            challenge={formData.challenge}
            onSelect={(challenge) => setFormData({ ...formData, challenge })}
          />
        )}
        {step === 3 && (
          <SignUpStepRole
            role={formData.role}
            onSelect={(role) => setFormData({ ...formData, role })}
          />
        )}
        {step === 4 && (
          <SignUpStep3
            country={formData.country}
            onChange={(country) => setFormData({ ...formData, country })}
          />
        )}
        {step === 5 && (
          <OtpInput
            value={formData.otp}
            onChange={(otp) => setFormData({ ...formData, otp })}
            onAutoSubmit={(pastedOtp) => handleNext(undefined, pastedOtp)}
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
          {step === 5 ? "Verify & Continue" : "Continue"}
          {!isLoading && step !== 5 && (
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
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium text-[#006FEE] hover:underline"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  )
}
