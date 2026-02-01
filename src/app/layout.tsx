import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Tenor_Sans } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack";
import "./globals.css";
import { NavBarWrapper } from "@/components/NavBarWrapper";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tenorSans = Tenor_Sans({
  variable: "--font-tenor-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Compass | Find Your Way Back",
  description: "Report found items, search for lost belongings, and connect with your school community. A modern lost-and-found system for students and staff.",
  keywords: ["compass", "lost and found", "school", "community", "found items", "lost items"],
};

function NavBarFallback() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-[#4F772D]/10">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-[#ECF39E]/50 rounded animate-pulse" />
          </div>
          <div className="hidden lg:flex items-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-20 bg-[#ECF39E]/30 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${tenorSans.variable} antialiased min-h-screen flex flex-col bg-white`}
      >
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Suspense fallback={<NavBarFallback />}>
              <NavBarWrapper />
            </Suspense>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
