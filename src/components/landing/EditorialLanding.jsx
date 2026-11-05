"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, Compass, Users, Briefcase, Award } from "lucide-react";

export function EditorialLanding({ onEnterApp, onSelectTab }) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div
      className="min-h-screen text-[#0f172a] font-body flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "hsl(201, 100%, 13%)" }}
    >
      {/* Background Cinematic Video with Crisp Visibility */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            videoLoaded ? "opacity-85" : "opacity-0"
          }`}
          src="https://designerstephen.github.io/public-assets/videos/serene-art-hero.mp4"
        />
        {/* Soft, non-blurry contrast overlay for readability */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/20"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"
          aria-hidden="true"
        />
      </div>

      {/* Editorial Navigation Bar */}
      <header className="relative z-20 w-full border-b border-white/10 px-6 sm:px-10 lg:px-16 py-5 flex items-center justify-between backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-2xl sm:text-3xl text-white tracking-tight">
              SkillBridge
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium px-2 py-0.5 border border-slate-700/60 rounded-full">
              Editorial Edition
            </span>
          </div>
        </div>

        {/* Desktop Nav Items (14px Inter, 500 weight) */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-300">
          <button
            onClick={() => onSelectTab ? onSelectTab("mentors") : onEnterApp()}
            className="hover:text-white transition-colors"
          >
            Mentors
          </button>
          <button
            onClick={() => onSelectTab ? onSelectTab("recruiters") : onEnterApp()}
            className="hover:text-white transition-colors"
          >
            Recruiters
          </button>
          <button
            onClick={() => onSelectTab ? onSelectTab("communities") : onEnterApp()}
            className="hover:text-white transition-colors"
          >
            Communities
          </button>
          <button
            onClick={() => onSelectTab ? onSelectTab("passport") : onEnterApp()}
            className="hover:text-white transition-colors"
          >
            Skill Passport
          </button>
        </nav>

        {/* Primary Action Button (#000000 with #ffffff, 14px, hover scale 1.03) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onEnterApp}
            className="hover-scale-btn bg-black text-white px-5 py-2.5 rounded-full text-[14px] font-medium border border-white/20 shadow-xl flex items-center gap-2 group"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full py-16 sm:py-24">
        <div className="max-w-4xl space-y-8">
          {/* Issue/Category Tag */}
          <div className="animate-fade-rise flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p
              className="text-xs uppercase tracking-[0.25em] font-medium text-slate-300"
            >
              Curated Career Discovery &middot; Issue N&ordm; 01
            </p>
          </div>

          {/* H1 Display Heading (Instrument Serif, 400 weight, 80px / mobile 48px, line-height 0.95, tight tracking) */}
          <h1
            className="animate-fade-rise font-editorial text-white text-[48px] sm:text-[68px] lg:text-[80px] font-normal leading-[0.95] tracking-[-2.46px] drop-shadow-md"
          >
            Your Network, <br />
            <span className="italic text-slate-100">Your Opportunity.</span>
          </h1>

          {/* Sub-header (Inter 18px, 400 weight, staggered delay 200ms) */}
          <p
            className="animate-fade-rise delay-200 text-slate-200 text-[18px] font-normal leading-relaxed max-w-2xl drop-shadow-sm"
          >
            Bridging ambitious self-taught developers, fresh graduates, and non-traditional engineers with verified mentors, tech communities, and hiring partners.
          </p>

          {/* Staggered Actions (staggered delay 400ms, #000000 with #ffffff, scale-1.03 hover) */}
          <div className="animate-fade-rise delay-400 flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onEnterApp}
              className="hover-scale-btn bg-black text-white text-[14px] font-medium px-8 py-4 rounded-full border border-white/20 shadow-2xl flex items-center gap-3 group"
            >
              <span>Enter SkillBridge</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onSelectTab ? onSelectTab("mentors") : onEnterApp()}
              className="hover-scale-btn bg-white/10 hover:bg-white/15 text-white text-[14px] font-medium px-6 py-4 rounded-full border border-white/15 backdrop-blur-md transition-colors"
            >
              Explore Verified Mentors
            </button>
          </div>
        </div>

        {/* Minimalist Editorial Metrics Bar */}
        <div className="animate-fade-rise delay-400 mt-20 pt-10 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="font-editorial text-3xl sm:text-4xl text-white font-normal">94%</p>
            <p className="text-[14px] text-slate-400 mt-1 font-medium">Smart Match Accuracy</p>
          </div>
          <div>
            <p className="font-editorial text-3xl sm:text-4xl text-white font-normal">500+</p>
            <p className="text-[14px] text-slate-400 mt-1 font-medium">Verified Mentors</p>
          </div>
          <div>
            <p className="font-editorial text-3xl sm:text-4xl text-white font-normal">1.8k</p>
            <p className="text-[14px] text-slate-400 mt-1 font-medium">Curated Opportunities</p>
          </div>
          <div>
            <p className="font-editorial text-3xl sm:text-4xl text-white font-normal">100%</p>
            <p className="text-[14px] text-slate-400 mt-1 font-medium">Free For Developers</p>
          </div>
        </div>
      </main>

      {/* Editorial Footer Note */}
      <footer className="relative z-10 w-full border-t border-white/10 px-6 sm:px-10 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} SkillBridge. Designed with Editorial Cinematic aesthetic.</p>
        <p className="mt-2 sm:mt-0">Powered by Next.js &middot; Google Gemini AI &middot; Supabase</p>
      </footer>
    </div>
  );
}

