// page.tsx
'use client'
import React from "react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NotesPage() {
  const router = useRouter()

  // Example notes data (this can be fetched dynamically)
  const notes = [
    { id: 1, title: "Note 1", content: "This is the first note." },
    { id: 2, title: "Note 2", content: "This is the second note." },
 
  ]

  // Redirect to the edit page
  const handleEdit = (noteId: number) => {
    router.push(`/notes/${noteId}/edit`)
  }

  // Handle deleting a note
  const handleDelete = (noteId: number) => {
    alert(`Deleting note with ID: ${noteId}`)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto my-8">
      {notes.map((note) => (
        <Card key={note.id} className="w-full">
          <CardHeader>
            <CardTitle>{note.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{note.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleEdit(note.id)}>Edit</Button>
            <Button variant="destructive" onClick={() => handleDelete(note.id)}>Delete</Button>
          </CardFooter>
        </Card>
      ))}
      
      {/* Button to create a new note */}
      <Button onClick={() => router.push('/notes/create')} className="w-full">
        Create New Note
      </Button>
    </div>
  )
}
