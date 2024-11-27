'use client';

import * as React from 'react';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { auth } from '@/firebase'; // Ensure this points to your Firebase initialization file
import { onAuthStateChanged } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(); // Safely use user only if it's not null
          localStorage.setItem('token', idToken); // Save token for persistence
          router.push('/notes'); // Redirect if logged in
        } catch (err) {
          console.error('Failed to get ID token:', err);
        }
      } else {
        localStorage.removeItem('token'); // Clear token if logged out
        setLoading(false); // Allow the login form to render
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) { // Ensure user is not null
        const idToken = await user.getIdToken();
        localStorage.setItem('token', idToken); // Save token for persistence
        router.push('/notes'); // Redirect to notes page upon successful login
      } else {
        throw new Error('User is null after login.'); // Additional safeguard
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message); // Display the error message
      } else {
        setError('An unknown error occurred.');
      }
    }
  }

  if (loading) {
    return <p>Loading...</p>; // Prevent flickering during auth state check
  }

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="loginForm" onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push('/')}>
          Cancel
        </Button>
        <Button type="submit" form="loginForm">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
