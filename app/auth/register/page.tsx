'use client';

import * as React from 'react';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { auth } from '@/firebase'; // Ensure this points to your Firebase initialization file
import { onAuthStateChanged } from 'firebase/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        localStorage.setItem('token', idToken); // Save token for persistence
        router.push('/notes'); // Redirect if logged in
      } else {
        localStorage.removeItem('token'); // Clear token if logged out
        setLoading(false); // Allow the registration form to render
      }
    });

    return () => unsubscribe(); // Cleanup the observer on component unmount
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setSuccess(null);
      return;
    }

    try {
      // Register the user with Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential?.user;

      if (user) {
        const idToken = await user.getIdToken();

        localStorage.setItem('token', idToken); // Save token for persistence
        localStorage.setItem('email', email);
        setSuccess(`User registered successfully! Welcome, ${user.email}`);
        setError(null);

        router.push('/notes'); // Redirect to notes or dashboard
      } else {
        setError('Registration failed. Please try again.');
        setSuccess(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message); // Safely access the error message
      } else {
        setError('An unknown error occurred.');
      }
      setSuccess(null);
    }
  }

  if (loading) {
    return <p>Loading...</p>; // Prevent flickering during auth state check
  }

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="registerForm" onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex flex-col">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push('/login')}>
          Cancel
        </Button>
        <Button type="submit" form="registerForm">
          Register
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm">Have an account?</span>
          <Button variant="link" onClick={() => router.push('/auth/login')}>
            Login
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
