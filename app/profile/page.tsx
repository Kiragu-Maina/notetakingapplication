'use client'
import * as React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch the profile data when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("/api/profile")
      const data = await response.json()

      if (response.ok) {
        setProfile(data)
      } else {
        alert("Error fetching profile data.")
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="max-w-3xl mx-auto my-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Name:</strong> {profile.name}
            </div>
            <div>
              <strong>Email:</strong> {profile.email}
            </div>
            {/* Add more profile fields as necessary */}
            <div className="mt-6 flex justify-end">
              <Button onClick={() => router.push("/profile/edit")}>Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
