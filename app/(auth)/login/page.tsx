"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  })
  const [formError, setFormError] = useState("")
  const [touched, setTouched] = useState({
    email: false,
    password: false
  })

  const validateField = (name: string, value: string) => {
    if (name === "email") {
      if (!value) return "Please enter your email"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email"
      return ""
    }
    if (name === "password") {
      if (!value) return "Please enter your password"
      if (value.length < 6) return "Password must be at least 6 characters"
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
      password: validateField("password", formData.password)
    }
    setErrors(newErrors)
    setTouched({ email: true, password: true })

    if (newErrors.email || newErrors.password) return

    setIsLoading(true)
    setFormError("")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })

      const result = await res.json()

      if (!res.ok) {
        setFormError(result?.message || "Unable to sign in. Please try again.")
        setIsLoading(false)
        return
      }

      // Store minimal session in localStorage for the profile page
      const authData = {
        user: result?.data?.user,
        access_token: result?.data?.session?.access_token
      }
      localStorage.setItem("authUser", JSON.stringify(authData))

      router.push("/profile")
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
        </div>
        <p className="text-gray-500 text-sm ml-4">Enter your credentials to access your account</p>
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

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700 ml-1">Password</label>
          <div className={`relative flex items-center border-2 rounded-xl transition-all duration-200 shadow-sm ${
            errors.password && touched.password 
              ? "border-red-400 bg-red-50/50 shadow-red-100" 
              : "border-gray-200 bg-white hover:border-gray-300 focus-within:border-gray-900 focus-within:shadow-md focus-within:shadow-gray-200"
          }`}>
            <div className="pl-4 pr-2">
              <Lock className={`w-5 h-5 transition-colors ${
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
              placeholder="Enter your password"
              className="w-full px-2 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm font-medium pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && touched.password && (
            <p className="text-red-500 text-xs mt-1.5 ml-1.5 font-medium animate-in slide-in-from-top-1">{errors.password}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="text-right pt-1">
          <Link 
            href="/forgot-password" 
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors hover:underline inline-flex items-center gap-1"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>

        {formError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{formError}</span>
          </div>
        )}
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500 font-medium">New to Retail Service?</span>
        </div>
      </div>

      {/* Create Account Link */}
      <div className="text-center">
        <Link 
          href="/register" 
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-semibold transition-colors group"
        >
          <span>Create an account</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  )
}
