"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, LogOut, Upload, UserRound, ArrowLeft, Shield, Settings, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { uploadTransactions, getUploadHistory, type UploadHistory } from "@/lib/api"

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; imported?: number; totalRecords?: number } | null>(null)
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Fetch upload history
  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          setLoadingHistory(true)
          const data = await getUploadHistory()
          setUploadHistory(data.uploads)
        } catch (error) {
          console.error("Error fetching upload history:", error)
        } finally {
          setLoadingHistory(false)
        }
      }
      fetchHistory()
    }
  }, [user])

  // Refresh history after successful upload
  useEffect(() => {
    if (uploadResult?.success && user) {
      const fetchHistory = async () => {
        try {
          const data = await getUploadHistory()
          setUploadHistory(data.uploads)
        } catch (error) {
          console.error("Error fetching upload history:", error)
        }
      }
      fetchHistory()
    }
  }, [uploadResult, user])

  const handleSignOut = async () => {
    await logout()
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setUploadResult({
        success: false,
        message: "Please upload a CSV file",
      })
      return
    }

    setUploading(true)
    setUploadResult(null)

    try {
      const result = await uploadTransactions(file)
      setUploadResult({
        success: true,
        message: `Successfully imported ${result.imported} out of ${result.totalRecords} records`,
        imported: result.imported,
        totalRecords: result.totalRecords,
      })
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to upload file",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Extract name from various possible locations in the user object
  const getUserName = () => {
    if (!user) return "User"
    
    // Check database user name field first (if exists)
    // Then check user_metadata fields
    // Finally fallback to email username
    return (
      user.name ||
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.display_name ||
      (user.email ? user.email.split("@")[0] : "User")
    )
  }

  const name = getUserName()
  const email = user?.email || "—"
  
  // Generate initials from the name
  const initials = name
    .split(" ")
    .filter((n: string) => n.length > 0)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || name[0]?.toUpperCase() || "U"

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to dashboard
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Account Settings</p>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">Profile</h1>
              <p className="text-muted-foreground mt-2">Manage your account information and preferences</p>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        {/* Profile Hero Card */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/3 border border-border/50 shadow-lg overflow-hidden backdrop-blur-sm">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg ring-4 ring-background">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-background border-2 border-background flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm sm:text-base truncate">{email}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                    <Shield className="h-3 w-3" />
                    Verified Account
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <UserRound className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Personal Information</h3>
                    <p className="text-xs text-muted-foreground">Your account details</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <User className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Full Name</p>
                      <p className="text-lg font-semibold text-foreground">{name}</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border"></div>

                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Email Address</p>
                      <p className="text-lg font-semibold text-foreground break-all">{email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions Card */}
            <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Account Actions</h3>
                    <p className="text-xs text-muted-foreground">Manage your account</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/20 transition-all duration-200 text-left"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">View Documents</p>
                      <p className="text-xs text-muted-foreground">Access your files</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/20 transition-all duration-200 text-left"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Security</p>
                      <p className="text-xs text-muted-foreground">Privacy settings</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Upload Data Card */}
            <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Upload Data</h3>
                    <p className="text-xs text-muted-foreground">Upload your information</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Upload your sales data CSV file to import transactions into the system. The file will be processed in batches for optimal performance.
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Data
                    </>
                  )}
                </button>

                {uploadResult && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      uploadResult.success
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600"
                        : "bg-destructive/10 border border-destructive/20 text-destructive"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {uploadResult.success ? (
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{uploadResult.message}</p>
                        {uploadResult.success && uploadResult.imported !== undefined && uploadResult.totalRecords !== undefined && (
                          <p className="text-xs mt-1 opacity-80">
                            {uploadResult.totalRecords - uploadResult.imported > 0
                              ? `${uploadResult.totalRecords - uploadResult.imported} records were skipped (duplicates or errors)`
                              : "All records imported successfully"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload History Card */}
            {uploadHistory.length > 0 && (
              <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Upload History</h3>
                      <p className="text-xs text-muted-foreground">Recent CSV uploads</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {loadingHistory ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {uploadHistory.slice(0, 5).map((upload) => (
                        <div
                          key={upload.id}
                          className="p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">{upload.fileName}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span>{upload.importedRecords} / {upload.totalRecords} imported</span>
                                {upload.failedRecords > 0 && (
                                  <span className="text-destructive">{upload.failedRecords} failed</span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(upload.uploadedAt).toLocaleString()}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                upload.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : upload.status === "failed"
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-yellow-500/10 text-yellow-600"
                              }`}
                            >
                              {upload.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats Card */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/3 border border-border/50 p-6">
              <h3 className="font-semibold text-foreground mb-4 text-sm">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-medium text-foreground">2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

