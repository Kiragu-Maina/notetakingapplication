"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase"; // Ensure this is the Firebase initialization file

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Firebase sign out
      await signOut(auth);

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("email");

      // Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="w-full text-left">
      Log Out
    </button>
  );
}
