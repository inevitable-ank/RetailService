// Auth utility functions for cookie-based authentication

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important: include cookies
    body: JSON.stringify({ email, password })
  })

  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.message || "Login failed")
  }

  return data
}

export async function logout() {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include", // Important: include cookies
    headers: { "Content-Type": "application/json" }
  })

  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.message || "Logout failed")
  }

  return data
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include", // Important: include cookies
    headers: { "Content-Type": "application/json" }
  })

  if (!res.ok) {
    if (res.status === 401) {
      return null
    }
    throw new Error("Failed to fetch user")
  }

  const data = await res.json()
  return data.user
}

