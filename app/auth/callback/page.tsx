"use client"

import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Email confirmed</h1>
          <p className="text-gray-600 text-sm">
            Your email is verified. You can now sign in to your account.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white px-5 py-3 text-sm font-semibold hover:bg-gray-800"
        >
          Go to login
        </Link>
      </div>
    </div>
  )
}



