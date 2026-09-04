import React, { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight01Icon, ArrowLeft01Icon } from 'hugeicons-react'
import Select from 'react-select'
import countryList from 'country-list'
import { toast } from 'sonner'

export const SignUp: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const step = parseInt(searchParams.get('step') || '1', 10)
  const setStep = (newStep: number) => setSearchParams({ step: newStep.toString() })

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    otp: ''
  })
  
  const navigate = useNavigate()

  // Prepare countries array for react-select
  const countryOptions = useMemo(() => {
    return countryList.getData().map(c => ({
      value: c.code,
      label: c.name
    }))
  }, [])

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (step === 1) {
        setStep(2)
      } else if (step === 2) {
        if (!formData.country) {
          toast.error("Please select a country")
          return
        }
        
        const res = await fetch('http://localhost:8080/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            country: formData.country,
          }),
        })
        
        if (!res.ok) {
          const text = await res.text()
          let errorMessage = 'Signup failed'
          try {
            const parsed = JSON.parse(text)
            errorMessage = parsed.message || errorMessage
          } catch {
            errorMessage = text || errorMessage
          }
          throw new Error(errorMessage)
        }
        
        setStep(3)
        toast.success("Verification code sent!")
      } else {
        const res = await fetch('http://localhost:8080/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            code: formData.otp,
          }),
        })
        
        if (!res.ok) {
          const text = await res.text()
          let errorMessage = 'Invalid code'
          try {
            const parsed = JSON.parse(text)
            errorMessage = parsed.message || errorMessage
          } catch {
            errorMessage = text || errorMessage
          }
          throw new Error(errorMessage)
        }
        
        toast.success("Welcome to Clud!")
        navigate('/dashboard')
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    }
  }

  // Custom styles for react-select to match the existing tailwind design
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      padding: '0.3rem',
      borderRadius: '0.75rem', // rounded-xl
      borderColor: state.isFocused ? '#006FEE' : '#e5e7eb', // neutral-200
      boxShadow: state.isFocused ? '0 0 0 4px rgba(0, 111, 254, 0.1)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#006FEE' : '#e5e7eb'
      },
      transition: 'all 0.2s ease',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#006FEE' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#111827',
      '&:active': {
        backgroundColor: '#006FEE',
        color: 'white'
      }
    })
  }

  return (
    <div className="min-h-screen flex w-full bg-white font-sans">
      
      {/* Left Pane - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 pt-28 pb-12 relative z-10 bg-white min-h-screen overflow-y-auto">
        
        {/* Absolute Logo Top Left (Aligned with form) */}
        <div className="absolute top-8 left-0 right-0 px-8 sm:px-16 lg:px-24">
          <div className="max-w-md mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/favicon.svg" 
                alt="Clud Logo" 
                className="w-10 h-10 rounded-xl shadow-sm border border-neutral-100"
              />
              <span className="font-heading font-bold text-lg text-neutral-900 hidden sm:block">Clud</span>
            </Link>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto">
          
          {/* Header Section */}
          <div className="mb-8 relative">
            {step === 1 && (
              <div>
                <h1 className="text-3xl font-heading font-semibold text-neutral-900 mb-2">Create your account</h1>
                <p className="text-neutral-500 text-base">Let's start with the basics.</p>
              </div>
            )}
            {step === 2 && (
              <div>
                <button type="button" onClick={() => setStep(1)} className="absolute -left-10 top-1 text-neutral-400 hover:text-neutral-900 transition-colors">
                  <ArrowLeft01Icon size={24} />
                </button>
                <h1 className="text-3xl font-heading font-semibold text-neutral-900 mb-2">Where are you based?</h1>
                <p className="text-neutral-500 text-base">This helps us route alerts to the nearest data center.</p>
              </div>
            )}
            {step === 3 && (
              <div>
                <button type="button" onClick={() => setStep(2)} className="absolute -left-10 top-1 text-neutral-400 hover:text-neutral-900 transition-colors">
                  <ArrowLeft01Icon size={24} />
                </button>
                <h1 className="text-3xl font-heading font-semibold text-neutral-900 mb-2">Check your email</h1>
                <p className="text-neutral-500 text-base">We sent a 6-digit code to {formData.email || 'your email'}</p>
              </div>
            )}
          </div>

          {/* Form Section */}
          <form className="space-y-5" onSubmit={handleNext}>
            
            {step === 1 && (
              <>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1.5">First name</label>
                    <input 
                      type="text" id="firstName" required
                      value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-[#006FEE]/10 focus:border-[#006FEE] outline-none transition-all text-neutral-900"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1.5">Last name</label>
                    <input 
                      type="text" id="lastName" required
                      value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-[#006FEE]/10 focus:border-[#006FEE] outline-none transition-all text-neutral-900"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">Work email</label>
                  <input 
                    type="email" id="email" required placeholder="samuel@company.com"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-[#006FEE]/10 focus:border-[#006FEE] outline-none transition-all text-neutral-900"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1.5">Country</label>
                <Select
                  options={countryOptions}
                  styles={selectStyles}
                  placeholder="Search your country..."
                  value={countryOptions.find(c => c.value === formData.country)}
                  onChange={(val: any) => setFormData({...formData, country: val?.value || ''})}
                  isSearchable={true}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-1.5">6-Digit Code</label>
                <input 
                  type="text" id="otp" required placeholder="000000" maxLength={6}
                  value={formData.otp} onChange={(e) => setFormData({...formData, otp: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-[#006FEE]/10 focus:border-[#006FEE] outline-none transition-all text-neutral-900 text-center tracking-[0.5em] font-mono text-xl"
                />
              </div>
            )}

            <button type="submit" className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group mt-8 cursor-pointer">
              {step === 3 ? 'Verify & Continue' : 'Continue'}
              {step !== 3 && <ArrowRight01Icon size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
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
                  Already have an account?{' '}
                  <Link to="/signin" className="font-medium text-[#006FEE] hover:underline">Sign in instead</Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Pane - Image Background */}
      <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        />
        <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-[1px]" />
      </div>

    </div>
  )
}
