'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import config from '@/apiconfig';
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  userId: string; // Add this if you are using the userId property
}


export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const backendUrl = config.backendUrl
  console.log(backendUrl)

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token'); // Get the token from local storage
      const email = localStorage.getItem('email');
      
      if (!token) {
        router.push('/auth/login'); // Redirect to login if not authenticated
        
        return;
      }
      setEmail(email);

      try {
        const response = await fetch(`${backendUrl}/api/notes`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse the error response
          if (errorData.error === 'Invalid token') {
           
            router.push('auth/login'); // Redirect to the login page
            return; // Stop further execution
          }
          throw new Error('Failed to fetch notes');
        }

        const data = await response.json();
        console.log(data);
        setNotes(data.notes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setError('Failed to load notes. Please try again later.');
      }
    };

    fetchNotes();
  }, [router, backendUrl]);

  const handleEdit = (noteId: string) => {
    router.push(`/notes/${noteId}/edit`);
  };

  const handleDelete = async (noteId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete a note.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      // Update the UI by removing the deleted note
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      alert('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete the note.');
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (

    <>
    <div className="text-sm text-gray-600 font-medium">
                {email ? `Logged in as: ${email}` : "Welcome, Guest!"}
              </div>

    <div className="space-y-6 max-w-3xl mx-auto my-8">

      {/* Button to create a new note */}
      <Button onClick={() => router.push('/notes/create')} className="w-full">
        Create New Note
      </Button>
      {notes
      .slice() // Create a copy to avoid mutating the original array
      .sort((a, b) => b.createdAt._seconds - a.createdAt._seconds) // Sort by createdAt in descending order
     
      .map((note) => (
        <Card key={note.id} className="w-full">
          <CardHeader>
            <CardTitle>{note.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{note.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleEdit(note.id)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(note.id)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}

    </div>
    </>
  );
}
