'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Note {
  id: string;
  title: string;
  content: string;
}
export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token'); // Get the token from local storage
      if (!token) {
        router.push('/login'); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await fetch('https://notesbackend-thealkennist5301-rtts62wp.leapcell.dev/api/notes', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }

        const data = await response.json();
        setNotes(data.notes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setError('Failed to load notes. Please try again later.');
      }
    };

    fetchNotes();
  }, [router]);

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
      const response = await fetch(`https://notesbackend-thealkennist5301-rtts62wp.leapcell.dev/api/notes/${noteId}`, {
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
    <div className="space-y-6 max-w-3xl mx-auto my-8">

      {/* Button to create a new note */}
      <Button onClick={() => router.push('/notes/create')} className="w-full">
        Create New Note
      </Button>
      {notes.map((note) => (
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
  );
}
