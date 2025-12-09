"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, User, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: ""
  })
  const [touched, setTouched] = useState({
    email: false,
    name: false,
    password: false,
    confirmPassword: false
  })

  const validateField = (name: string, value: string) => {
    if (name === "email") {
      if (!value) return "Email is required"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email"
      return ""
    }
    if (name === "name") {
      if (!value) return "Name is required"
      if (value.length < 2) return "Name must be at least 2 characters"
      return ""
    }
    if (name === "password") {
      if (!value) return "Password is required"
      if (value.length < 8) return "Password must be at least 8 characters"
      return ""
    }
    if (name === "confirmPassword") {
      if (!value) return "Please confirm your password"
      if (value !== formData.password) return "Passwords do not match"
      return ""
    }
    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }
    if (name === "password" && touched.confirmPassword) {
      setErrors(prev => ({ 
        ...prev, 
        confirmPassword: formData.confirmPassword !== value && formData.confirmPassword 
          ? "Passwords do not match" 
          : ""
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = {
      email: validateField("email", formData.email),
      name: validateField("name", formData.name),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword)
    }
    setErrors(newErrors)
    setTouched({ email: true, name: true, password: true, confirmPassword: true })

    if (Object.values(newErrors).some(error => error)) return

    setIsLoading(true)
    setFormError("")
    setSuccessMessage("")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password, name: formData.name })
      })

      const result = await res.json()

      if (!res.ok) {
        setFormError(result?.message || "Unable to create account. Please try again.")
        setIsLoading(false)
        return
      }

      setSuccessMessage("Account created. Please check your email to verify, then log in.")
      router.push("/login")
    } catch (error) {
      setFormError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-gradient-to-b from-gray-900 to-gray-700 rounded-full"></div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create your account</h1>
        </div>
        <p className="text-gray-500 text-sm ml-4">Start your journey with us today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700 ml-1">Email Address</label>
          <div className={`relative flex items-center border-2 rounded-xl transition-all duration-200 shadow-sm ${
            errors.email && touched.email 
              ? "border-red-400 bg-red-50/50 shadow-red-100" 
              : "border-gray-200 bg-white hover:border-gray-300 focus-within:border-gray-900 focus-within:shadow-md focus-within:shadow-gray-200"
          }`}>
            <div className="pl-4 pr-2">
              <Mail className={`w-5 h-5 transition-colors ${
                errors.email && touched.email ? "text-red-400" : "text-gray-400"
              }`} />
            </div>
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className="w-full px-2 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm font-medium"
                />
          </div>
          {errors.email && touched.email && (
            <p className="text-red-500 text-xs mt-1.5 ml-1.5 font-medium animate-in slide-in-from-top-1">{errors.email}</p>
          )}
        </div>

        {/* Name Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700 ml-1">Full Name</label>
          <div className={`relative flex items-center border-2 rounded-xl transition-all duration-200 shadow-sm ${
            errors.name && touched.name 
              ? "border-red-400 bg-red-50/50 shadow-red-100" 
              : "border-gray-200 bg-white hover:border-gray-300 focus-within:border-gray-900 focus-within:shadow-md focus-within:shadow-gray-200"
          }`}>
            <div className="pl-4 pr-2">
              <User className={`w-5 h-5 transition-colors ${
                errors.name && touched.name ? "text-red-400" : "text-gray-400"
              }`} />
            </div>
                <input
                  type="text"
              name="name"
                  autoComplete="off"
              value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
              placeholder="Your name"
                  className="w-full px-2 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm font-medium"
                />
          </div>
          {errors.name && touched.name && (
            <p className="text-red-500 text-xs mt-1.5 ml-1.5 font-medium animate-in slide-in-from-top-1">{errors.name}</p>
          )}
        </div>

        {/* Password Fields - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700 ml-1">Password</label>
            <div className={`relative flex items-center border-2 rounded-xl transition-all duration-200 shadow-sm ${
              errors.password && touched.password 
                ? "border-red-400 bg-red-50/50 shadow-red-100" 
                : "border-gray-200 bg-white hover:border-gray-300 focus-within:border-gray-900 focus-within:shadow-md focus-within:shadow-gray-200"
            }`}>
              <div className="pl-3 pr-1.5">
                <Lock className={`w-4 h-4 transition-colors ${
                  errors.password && touched.password ? "text-red-400" : "text-gray-400"
                }`} />
              </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                    className="w-full px-1.5 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm font-medium pr-10"
                  />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-red-500 text-xs mt-1.5 ml-1.5 font-medium animate-in slide-in-from-top-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700 ml-1">Confirm Password</label>
            <div className={`relative flex items-center border-2 rounded-xl transition-all duration-200 shadow-sm ${
              errors.confirmPassword && touched.confirmPassword 
                ? "border-red-400 bg-red-50/50 shadow-red-100" 
                : "border-gray-200 bg-white hover:border-gray-300 focus-within:border-gray-900 focus-within:shadow-md focus-within:shadow-gray-200"
            }`}>
              <div className="pl-3 pr-1.5">
                <Lock className={`w-4 h-4 transition-colors ${
                  errors.confirmPassword && touched.confirmPassword ? "text-red-400" : "text-gray-400"
                }`} />
              </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm"
                    className="w-full px-1.5 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm font-medium pr-10"
                  />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 p-1 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
              >
                {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 ml-1.5 font-medium animate-in slide-in-from-top-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>

        {formError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{formError}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500 font-medium">Already have an account?</span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-semibold transition-colors group"
        >
          <span>Login here</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  )
}
