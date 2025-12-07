"use client"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Designed Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col p-12 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 border border-gray-400 rounded-full"></div>
          <div className="absolute bottom-32 left-16 w-48 h-48 border border-gray-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-gray-400 rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col gap-10 max-w-md">
          {/* Header Section */}
          <div>
            <div className="w-12 h-1 bg-gray-900 mb-3"></div>
            <h2 className="text-3xl font-semibold text-gray-900">Retail Service</h2>
            <p className="text-gray-600 text-sm mt-1">Business Management Platform</p>
          </div>

          {/* Main Content Section */}
          <div className="space-y-5">
            <div>
              <h3 className="text-2xl font-medium text-gray-900 mb-3">Welcome</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                Streamline your operations and manage your business with ease. 
                Get started by signing in to your account.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-1 h-10 bg-gray-900 mt-1"></div>
                <div>
                  <p className="text-gray-900 font-medium mb-1">Secure & Protected</p>
                  <p className="text-gray-500 text-sm">Your data is safe with enterprise-grade security</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-10 bg-gray-900 mt-1"></div>
                <div>
                  <p className="text-gray-900 font-medium mb-1">Easy to Use</p>
                  <p className="text-gray-500 text-sm">Intuitive interface designed for efficiency</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-10 bg-gray-900 mt-1"></div>
                <div>
                  <p className="text-gray-900 font-medium mb-1">Always Available</p>
                  <p className="text-gray-500 text-sm">Access your dashboard anytime, anywhere</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8">
            <p className="text-xs text-gray-400">© 2024 Retail Service. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
