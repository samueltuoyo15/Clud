import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight01Icon, ArrowLeft01Icon } from "hugeicons-react";
import Select from "react-select";
import countryList from "country-list";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { AuthLayout } from "../components/auth/AuthLayout";
import { signupApi, verifyOtpApi } from "../api/auth";

const challengeOptions = [
  {
    id: "backend-changes",
    title: "Backend devs change APIs without notifying anyone",
    description: "Endpoints, parameters, or payloads shift silently and break our frontend.",
  },
  {
    id: "outages-bugs",
    title: "We've had outages caused by undocumented API shifts",
    description: "Breaking changes slipped into production without alerts or proper diffs.",
  },
  {
    id: "third-party",
    title: "Tracking 3rd-party API dependencies is a headache",
    description: "Stripe, Twilio, or external partner APIs change and disrupt our integrations.",
  },
  {
    id: "changelogs",
    title: "I want automated changelogs and instant diff alerts",
    description: "Continuous OpenAPI monitoring with alerts delivered straight to our team.",
  },
];

export const SignUp: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const step = parseInt(searchParams.get("step") || "1", 10);
  const setStep = (newStep: number) => setSearchParams({ step: newStep.toString() });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    challenge: "backend-changes",
    country: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // No useMemo as requested, new React compiler handles it!
  const countryOptions = countryList.getData().map((country) => ({
    value: country.code,
    label: country.name,
  }));

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (step === 1) {
        if (!formData.firstName || !formData.lastName || !formData.email) {
          throw new Error("Please fill all fields");
        }
        setStep(2);
      } else if (step === 2) {
        if (!formData.challenge) {
          throw new Error("Please select an option to continue");
        }
        setStep(3);
      } else if (step === 3) {
        if (!formData.country) {
          throw new Error("Please select a country");
        }
        await signupApi(formData.email, formData.firstName, formData.lastName, formData.country);
        setStep(4);
        toast.success("Verification code sent!");
      } else {
        const data = await verifyOtpApi(formData.email, formData.otp);
        if (data && data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
        toast.success("Welcome to Clud!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      padding: "2px",
      borderRadius: "0.75rem",
      borderColor: state.isFocused ? "#006FEE" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(0, 111, 238, 0.1)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#006FEE" : "#e5e7eb",
      },
      transition: "all 0.2s ease",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#006FEE" : state.isFocused ? "#f3f4f6" : "white",
      color: state.isSelected ? "white" : "#111827",
      "&:active": {
        backgroundColor: "#006FEE",
        color: "white",
      },
    }),
  };

  return (
    <AuthLayout>
      <div className="mb-8 relative">
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-heading font-semibold text-neutral-900 mb-2">Create your account</h1>
            <p className="text-neutral-500 text-base">Let's start with the basics.</p>
          </div>
        )}
        {step === 2 && (
          <div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="absolute -left-10 top-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <ArrowLeft01Icon size={24} />
            </button>
            <h1 className="text-3xl font-heading font-semibold text-neutral-900 mb-2">What sounds like you right now?</h1>
            <p className="text-neutral-500 text-base">Help us tailor Clud to your team's workflow.</p>
          </div>
        )}
        {step === 3 && (
          <div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="absolute -left-10 top-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <ArrowLeft01Icon size={24} />
            </button>
            <h1 className="text-3xl font-heading font-semibold text-neutral-900 mb-2">Where are you based?</h1>
            <p className="text-neutral-500 text-base">Select your country to complete your account setup and preferences.</p>
          </div>
        )}
        {step === 4 && (
          <div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="absolute -left-10 top-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <ArrowLeft01Icon size={24} />
            </button>
            <h1 className="text-3xl font-heading font-semibold text-neutral-900 mb-2">Check your email</h1>
            <p className="text-neutral-500 text-base">We sent a 6-digit code to {formData.email || "your email"}</p>
          </div>
        )}
      </div>

      <form className="space-y-5" onSubmit={handleNext}>
        {step === 1 && (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1.5">First name</label>
                <input
                  type="text"
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-[#006FEE]/10 focus:border-[#006FEE] outline-none transition-all text-neutral-900"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1.5">Last name</label>
                <input
                  type="text"
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-[#006FEE]/10 focus:border-[#006FEE] outline-none transition-all text-neutral-900"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">Work email</label>
              <input
                type="email"
                id="email"
                required
                placeholder="samuel@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-[#006FEE]/10 focus:border-[#006FEE] outline-none transition-all text-neutral-900"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {challengeOptions.map((opt) => {
              const isSelected = formData.challenge === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, challenge: opt.id })}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? "border-[#006FEE] bg-[#006FEE]/5 ring-1 ring-[#006FEE]"
                      : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50 bg-white"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-[#006FEE] bg-[#006FEE]"
                        : "border-neutral-300 bg-white"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-900 leading-snug">
                      {opt.title}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {step === 3 && (
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1.5">Country</label>
            <Select
              options={countryOptions}
              styles={selectStyles}
              placeholder="Search your country..."
              value={countryOptions.find((c) => c.value === formData.country)}
              onChange={(val: any) => setFormData({ ...formData, country: val?.value || "" })}
              isSearchable={true}
            />
          </div>
        )}

        {step === 4 && (
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-1.5">6-Digit Code</label>
            <input
              type="text"
              id="otp"
              required
              placeholder="000000"
              maxLength={6}
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-[#006FEE]/10 focus:border-[#006FEE] outline-none transition-all text-neutral-900 text-center tracking-[0.5em] font-mono text-xl"
            />
          </div>
        )}

        <Button type="submit" className="w-full mt-8" size="lg" isLoading={isLoading}>
          {step === 4 ? "Verify & Continue" : "Continue"}
          {!isLoading && step !== 4 && (
            <ArrowRight01Icon size={18} className="group-hover:translate-x-1 transition-transform" />
          )}
        </Button>
      </form>

      {step === 1 && (
        <>
          <div className="flex items-center my-8 text-neutral-300">
            <div className="flex-1 border-t border-neutral-100"></div>
            <span className="px-4 text-xs font-medium uppercase tracking-wider text-neutral-400">or</span>
            <div className="flex-1 border-t border-neutral-100"></div>
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{" "}
              <Link to="/signin" className="font-medium text-[#006FEE] hover:underline">Sign in instead</Link>
            </p>
          </div>
        </>
      )}
    </AuthLayout>
  );
};
