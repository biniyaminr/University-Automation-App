"use client";

import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { Globe, FileText, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-violet-500/30">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          AssistedApp
        </div>
        <nav>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="text-neutral-300 hover:text-white hover:bg-neutral-800 px-4 py-2 rounded-md transition-colors font-medium">
                Sign In
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-neutral-800 text-white hover:bg-neutral-700 px-4 py-2 rounded-md transition-colors font-medium">
                Go to Dashboard
              </button>
            </Link>
          </SignedIn>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center z-10 space-y-8 mt-24 mb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-500">
            Automate Your <br className="hidden md:block" /> University Applications.
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Discover fully funded scholarships, instantly tailor your CV with AI, and auto-fill complex university portals in one click.
          </p>

          <div className="pt-8 flex items-center justify-center gap-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="h-14 px-8 text-lg font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-all hover:scale-105">
                  Get Started for Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="h-14 px-8 text-lg font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-all hover:scale-105">
                  Go to Dashboard
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>

        {/* Features Grid */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-32 z-10">
          <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl hover:bg-neutral-900 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Live Opportunity Feed</h3>
            <p className="text-neutral-400 leading-relaxed">
              Sync with global university scholarships and check your AI Fit Score.
            </p>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl hover:bg-neutral-900 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI CV Maker</h3>
            <p className="text-neutral-400 leading-relaxed">
              Upload your existing resume and let AI tailor it perfectly to your target program.
            </p>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl hover:bg-neutral-900 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Chrome Auto-Fill</h3>
            <p className="text-neutral-400 leading-relaxed">
              Store your documents in the Cloud Vault and auto-fill university portals instantly.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 py-8 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AssistedApp. All rights reserved.</p>
      </footer>
    </div>
  );
}
