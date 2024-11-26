import * as React from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Hey...</CardTitle>
        </CardHeader>

        <CardContent className="flex-grow container mx-auto p-6">
          {children}
        </CardContent>

        <CardFooter className="bg-gray-800 text-white p-4">
          <div className="container mx-auto text-center">
            <p>Fill in your details in the inputs provided.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
