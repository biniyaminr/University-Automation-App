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
      <main className="flex-1 flex flex-col items-center px-4 relative overflow-hidden pt-24">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center z-10 space-y-8 mb-16 relative">
          <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-violet-600/20 blur-[100px] rounded-full -translate-x-1/2 pointer-events-none -z-10" />

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

        {/* Hero Image / Video Placeholder */}
        <div className="w-full max-w-5xl mx-auto px-4 z-10 mb-32">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 flex items-center justify-center border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Student working on laptop"
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none" />
            </div>
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

        {/* The Problem Statement (Empathy Section) */}
        <section className="w-full bg-zinc-900/50 border-y border-white/5 py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 text-center z-10 relative">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              The old way is broken.
            </h2>
            <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed font-light">
              Applying to universities takes hundreds of hours. From rewriting CVs for every single program to manually typing your address 50 times across archaic portals, the entire process is exhausting and prone to error.
              <br /><br />
              <span className="text-violet-400 font-medium">We built AssistedApp to fix that.</span>
            </p>
          </div>
        </section>

        {/* How It Works (Step-by-Step Journey) */}
        <section className="py-24 max-w-5xl mx-auto px-4 relative z-10 w-full">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                    Your Journey to Acceptance
                </h2>
                <p className="text-xl text-neutral-400">Three simple steps to automate your applications.</p>
            </div>

            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                
                {/* Step 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-neutral-950 bg-neutral-900 text-blue-400 group-hover:bg-blue-900/50 group-hover:text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center mb-1">
                            <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase">Step 1</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Set Up Your Vault</h3>
                        <p className="text-neutral-400 leading-relaxed">Upload your transcripts, passport, and CV once. We store them absolutely securely.</p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-neutral-950 bg-neutral-900 text-violet-400 group-hover:bg-violet-900/50 group-hover:text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center mb-1">
                            <span className="text-sm font-semibold text-violet-400 tracking-wider uppercase">Step 2</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Find &amp; Tailor</h3>
                        <p className="text-neutral-400 leading-relaxed">Browse live scholarships and let our AI instantly rewrite your CV to match the exact requirements of the university.</p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-neutral-950 bg-neutral-900 text-orange-400 group-hover:bg-orange-900/50 group-hover:text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center mb-1">
                            <span className="text-sm font-semibold text-orange-400 tracking-wider uppercase">Step 3</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Auto-Fill &amp; Submit</h3>
                        <p className="text-neutral-400 leading-relaxed">Navigate to the university's portal and click the Chrome Extension to fill out the 10-page application in 3 seconds.</p>
                    </div>
                </div>

            </div>
        </section>

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

        {/* Final Bottom CTA */}
        <section className="w-full py-32 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/30 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto px-4 text-center z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Ready to land your dream program?
            </h2>
            <div className="pt-4 flex items-center justify-center gap-4">
            <SignedOut>
                <SignUpButton mode="modal">
                <button className="h-16 px-10 text-xl font-bold bg-white hover:bg-neutral-200 text-neutral-950 rounded-full shadow-[0_0_50px_-10px_rgba(255,255,255,0.5)] transition-all hover:scale-105">
                    Start Applying for Free
                </button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                <Link href="/dashboard">
                <button className="h-16 px-10 text-xl font-bold bg-white hover:bg-neutral-200 text-neutral-950 rounded-full shadow-[0_0_50px_-10px_rgba(255,255,255,0.5)] transition-all hover:scale-105">
                    Enter Mission Control
                </button>
                </Link>
            </SignedIn>
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
