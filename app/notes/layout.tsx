// layout.tsx
'use client'
import * as React from "react"


export default function NotesLayout({ children }: { children: React.ReactNode }) {
 

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
    
      {/* Render children (any nested page content) */}
      <main className="flex-grow container mx-auto p-6">{children}</main>
    </div>
  )
}
