"use client";

import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { Globe, FileText, Zap, CheckCircle, Sparkles } from "lucide-react";

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
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-neutral-800 text-white hover:bg-neutral-700 px-4 py-2 rounded-md transition-colors font-medium">
                Mission Control
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
                  Start Applying for Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="h-14 px-8 text-lg font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-all hover:scale-105">
                  Mission Control
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

        {/* Features Deep Dive */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full border-t border-neutral-800/50 mt-12">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Everything you need to land your dream program.
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              We automate the busywork so you can focus on what matters. Save hundreds of hours on application writing and portal navigation.
            </p>
          </div>

          <div className="space-y-32">
            {/* Feature 1: AI CV Tailoring */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-3xl font-bold text-white">Stop sending generic resumes.</h3>
                <p className="text-lg text-neutral-400 leading-relaxed">
                  Our AI reads your existing PDF resume and intelligently extracts your timeline. It then dynamically rewrites and tailors every bullet point to specifically match the exact university program you are applying for.
                </p>
                <ul className="space-y-3 pt-4">
                  {[
                    "Maintains professional formatting automatically.",
                    "Highlights the most relevant skills for your program.",
                    "Exports directly to a clean, ATS-friendly PDF."
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-violet-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-800/80 shadow-2xl overflow-hidden flex flex-col">
                  {/* Mock Browser Header */}
                  <div className="h-12 border-b border-neutral-800/80 flex items-center px-4 gap-2 bg-neutral-900/50">
                    <div className="flex gap-1.5 shrink-0">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="w-full max-w-sm mx-auto h-6 bg-neutral-800/50 rounded-md flex items-center px-3 gap-2">
                      <div className="w-3 h-3 rounded-sm bg-neutral-700" />
                      <div className="w-24 h-2 bg-neutral-700 rounded-full" />
                    </div>
                  </div>
                  {/* Mock UI Content */}
                  <div className="flex-1 p-6 flex gap-6">
                    <div className="w-1/3 space-y-4">
                      <div className="h-4 w-20 bg-neutral-800 rounded-sm mb-2" />
                      <div className="h-10 w-full bg-neutral-800/50 rounded-md border border-neutral-700" />
                      <div className="h-10 w-full bg-neutral-800/50 rounded-md border border-neutral-700" />
                      <div className="h-10 w-full bg-violet-600/20 border border-violet-500/30 rounded-md mt-6" />
                    </div>
                    <div className="flex-1 bg-white/5 rounded-lg border border-white/10 p-6 space-y-6">
                      <div className="space-y-2">
                        <div className="h-6 w-48 bg-neutral-700 rounded-md" />
                        <div className="h-4 w-32 bg-neutral-800 rounded-md" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 w-full bg-neutral-800 rounded-full" />
                        <div className="h-3 w-[90%] bg-neutral-800 rounded-full" />
                        <div className="h-3 w-[75%] bg-neutral-800 rounded-full" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 w-full bg-neutral-800 rounded-full" />
                        <div className="h-3 w-[85%] bg-neutral-800 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Chrome Extension */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-white">Never type out your address again.</h3>
                <p className="text-lg text-neutral-400 leading-relaxed">
                  Store your Master Profile and secure documents in our Cloud Vault. When you land on a lengthy university application portal, our intelligent Chrome Extension auto-fills your entire history instantly.
                </p>
                <ul className="space-y-3 pt-4">
                  {[
                    "Maps complex portal inputs to your structured data.",
                    "Populates education history, addresses, and contacts.",
                    "Quick-copy capabilities for essays and secure PDFs."
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-orange-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-neutral-800 to-neutral-900 border border-neutral-800/80 shadow-2xl overflow-hidden flex items-center justify-center relative p-8">
                  {/* Mock Web Page */}
                  <div className="absolute inset-0 bg-neutral-950/50 flex flex-col px-10 pt-16 gap-6 opacity-30">
                    <div className="h-8 w-64 bg-neutral-700 rounded-md mb-4" />
                    <div className="space-y-2"><div className="h-4 w-24 bg-neutral-800 rounded-md" /><div className="h-12 w-full max-w-md bg-neutral-800 rounded-md" /></div>
                    <div className="space-y-2"><div className="h-4 w-32 bg-neutral-800 rounded-md" /><div className="h-12 w-full max-w-md bg-neutral-800 rounded-md" /></div>
                  </div>

                  {/* Mock Extension Popup overlying it */}
                  <div className="relative z-10 w-80 h-[400px] bg-neutral-900 rounded-xl border border-neutral-700 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden ml-auto mr-12 rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="h-14 bg-gradient-to-r from-orange-600/80 to-pink-600/80 flex items-center justify-between px-4">
                      <span className="font-bold text-white tracking-tight">AssistedApp</span>
                      <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="p-4 space-y-4 flex-1 bg-neutral-900">
                      <div className="w-full h-10 bg-orange-500/20 border border-orange-500/50 rounded-lg flex items-center justify-center text-orange-400 font-medium text-sm gap-2">
                        <Sparkles className="w-4 h-4" /> Auto-Fill Page
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Master Profile</div>
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-12 bg-neutral-800/80 rounded-md border border-neutral-700 border-dashed flex items-center px-3 gap-3">
                            <div className="w-6 h-6 rounded-sm bg-neutral-700" />
                            <div className="space-y-1.5 flex-1">
                              <div className="h-2 w-1/2 bg-neutral-600 rounded-full" />
                              <div className="h-1.5 w-1/3 bg-neutral-700 rounded-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Live Matching */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white">Know your chances before you apply.</h3>
                <p className="text-lg text-neutral-400 leading-relaxed">
                  Our Live Opportunity Feed actively scrapes the web for fully funded scholarships and open university positions. AI evaluates your Master Profile against the requirements to generate an instant Fit Score.
                </p>
                <ul className="space-y-3 pt-4">
                  {[
                    "Real-time scholarship scraping engine.",
                    "Personalized 'Evaluate Fit' AI analysis.",
                    "Save top opportunities to your Application Tracker."
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-bl from-neutral-800 to-neutral-900 border border-neutral-800/80 shadow-2xl overflow-hidden flex flex-col p-6 gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-6 w-32 bg-neutral-700 rounded-md" />
                    <div className="h-8 w-8 bg-neutral-800 rounded-full" />
                  </div>

                  {[1, 2].map(i => (
                    <div key={i} className="flex-1 bg-neutral-950/40 border border-neutral-800 rounded-xl p-5 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2 flex-1">
                          <div className="h-5 w-3/4 bg-neutral-600 rounded-md" />
                          <div className="h-4 w-1/2 bg-neutral-700/50 rounded-md" />
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 flex items-center justify-center shrink-0 ml-4">
                          <span className="text-blue-400 font-bold text-sm">9{i}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <div className="h-8 w-24 bg-blue-600/20 rounded-md border border-blue-500/30" />
                        <div className="h-8 w-24 bg-neutral-800 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 py-8 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AssistedApp. All rights reserved.</p>
      </footer>
    </div>
  );
}
