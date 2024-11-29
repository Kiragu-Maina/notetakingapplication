'use client'
import * as React from "react"
import { FormEvent, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import config from '@/apiconfig';
export default function EditNotePage() {
  const router = useRouter()
  const { id } = useParams(); // Getting the ID from the URL
  const [note, setNote] = useState<{ title: string, content: string }>({
    title: "",
    content: ""
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const backendUrl = config.backendUrl
  // Helper function to get token from localStorage
  const getToken = (): string | null => localStorage.getItem("token");

  // Fetch the note details based on the ID
  useEffect(() => {
    if (!id) return;

    const token = getToken();
    if (!token) {
      alert("You must be logged in to view or edit a note.");
      return;
    }

    const fetchNote = async () => {
      setLoading(true)
      setError(null); // Clear previous errors
      try {
        const response = await fetch(`${backendUrl}/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        if (response.ok) {
          setNote({ title: data.title, content: data.content });
        } else {
          const errorData = await response.json(); // Parse the error response
          if (errorData.error === 'Invalid token') {
          
            router.push('auth/login'); // Redirect to the login page
            return; // Stop further execution
          }
        
          setError("Error fetching note data");
        }
      } catch (error) {
        setError(`Error fetching note data: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, backendUrl]);

  // Handle form submission to update the note
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!note.title || !note.content) {
      alert("Please fill in both fields!");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("You must be logged in to update a note.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:3002/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(note),
      });

      if (response.ok) {
        router.push("/notes"); // Redirect to notes list on success
      } else {
        alert("Error updating note. Please try again.");
      }
    } catch (error) {
      alert(`Error updating note. Please try again: ${error}`);
    } finally {
      setLoading(false);
    }
  };

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
            <>
              {error && <p className="text-red-500">{error}</p>}
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
