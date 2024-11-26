'use client'
import * as React from "react"
import { FormEvent, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function EditNotePage() {
  const router = useRouter()
  const params = useParams();
  const id= params.id  // Getting the ID from the URL
  const [note, setNote] = useState<{ title: string, content: string }>({
    title: "",
    content: ""
  })
  const [loading, setLoading] = useState(false)

  // Fetch the note details based on the ID
  useEffect(() => {
    if (!id) return
    const fetchNote = async () => {
      setLoading(true)
      const response = await fetch(`/api/notes/${id}`)
      const data = await response.json()
      if (response.ok) {
        setNote(data)
      } else {
        alert("Error fetching note data")
      }
      setLoading(false)
    }
    fetchNote()
  }, [id])

  // Handle form submission to update the note
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!note.title || !note.content) {
      alert("Please fill in both fields!")
      return
    }

    setLoading(true)

    const response = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    })

    if (response.ok) {
      router.push("/notes")  // Redirect back to the notes list
    } else {
      alert("Error updating note. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto my-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div className="flex flex-col">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                  placeholder="Enter the title of your note"
                  required
                />
              </div>

              {/* Content Textarea */}
              <div className="flex flex-col">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                  placeholder="Write your note here..."
                  required
                  rows={6}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Note"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
