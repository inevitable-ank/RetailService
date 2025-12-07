"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [touched, setTouched] = useState(false)

  const validateEmail = (value: string) => {
    if (!value) return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email"
    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (touched) {
      setError(validateEmail(value))
    }
  }

  const handleBlur = () => {
    setTouched(true)
    setError(validateEmail(email))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateEmail(email)
    setError(validationError)
    setTouched(true)

    if (validationError) return

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm mb-6">
            We&apos;ve sent a password reset link to<br />
            <span className="font-medium text-gray-700">{email}</span>
          </p>
          <p className="text-gray-400 text-xs">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-gray-900 hover:underline font-medium"
            >
              try again
            </button>
          </p>
        </div>

        <Link 
          href="/login"
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to login</span>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Forgot Password?</h1>
        <p className="text-gray-500 text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className={`relative flex items-center border rounded-lg transition-colors ${
            error && touched 
              ? "border-red-300" 
              : "border-gray-200 focus-within:border-gray-400"
          }`}>
            <Mail className="w-4 h-4 text-gray-400 ml-3" />
            <input
              type="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              className="w-full px-3 py-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
            />
          </div>
          {error && touched && (
            <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      <Link 
        href="/login"
        className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 mt-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to login</span>
      </Link>
    </div>
  )
}
