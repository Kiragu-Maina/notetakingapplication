import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Header with Navigation Menu */}
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-3">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>Notes</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      <Link href="/notes">My Notes</Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link href="/notes/create">Create New Note</Link>
                    </MenubarItem>
                    {/* <MenubarItem>
                      <Link href="/notes/favorites">Favorites</Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link href="/notes/search">Search</Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link href="/notes/trash">Trash</Link>
                    </MenubarItem> */}
                  </MenubarContent>
                </MenubarMenu>

                <MenubarMenu>
                  <MenubarTrigger>Settings</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      <Link href="/profile">Profile</Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>

                <MenubarMenu>
                  <MenubarTrigger>Account</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      <Link href="/auth/login">Log In</Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link href="/auth/register">Register</Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link href="/logout">Log Out</Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex-grow p-6">{children}</main>

          {/* Footer */}
          <footer className="bg-white shadow-t-sm mt-4 p-4 text-center text-sm">
            © {new Date().getFullYear()} NoteTaking App. Built with ❤️ and Next.js.
          </footer>
        </div>
      </body>
    </html>
  );
}