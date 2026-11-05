"use client";

import React, { useState } from "react";
import {
  Search,
  Menu,
  Sparkles,
  Database,
  Bot,
  UserCheck,
  ChevronDown,
  Bell,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { SAMPLE_PERSONAS } from "@/data/samplePersonas";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export function Header() {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    mobileMenuOpen,
    setMobileMenuOpen,
    userProfile,
    activePersonaId,
    switchPersona,
    savedConnections,
  } = useApp();

  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const tabTitles = {
    overview: {
      title: "Dashboard Overview",
      subtitle: `Welcome back, ${userProfile.fullName.split(" ")[0]}! Discover your network matches today.`,
    },
    passport: {
      title: "My Skill Passport",
      subtitle: "Your digital career passport: verified skills, portfolio, and aspirations.",
    },
    recruiters: {
      title: "Find Recruiters",
      subtitle: "Connect with talent partners actively seeking developers with your skillset.",
    },
    mentors: {
      title: "Find Mentors",
      subtitle: "Guidance, code reviews, and career coaching from seasoned engineers.",
    },
    communities: {
      title: "Community Discovery",
      subtitle: "High-impact tech circles, open-source projects, and student groups.",
    },
    connections: {
      title: "My Connections Tracker",
      subtitle: "Manage your outreach pipeline, track conversation stages, and store notes.",
    },
    "message-studio": {
      title: "AI Message Studio",
      subtitle: "Generate high-converting, respectful cold outreach using Google Gemini.",
    },
    settings: {
      title: "Settings & Platform Config",
      subtitle: "Fine-tune matching weights, inspect Supabase schema, and configure API keys.",
    },
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.overview;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Mobile Menu Button + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-tight">
            {currentTabInfo.title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-400 leading-snug">
            {currentTabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Search Bar */}
        <div className="relative w-40 sm:w-64 md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recruiters, skills..."
            className="w-full rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 pl-9 pr-3 py-1.5 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              ×
            </button>
          )}
        </div>

        {/* Persona Switcher Quick Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
            title="Switch demo persona"
          >
            <img
              src={userProfile.avatarUrl}
              alt=""
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="hidden lg:inline font-medium truncate max-w-[100px]">
              {userProfile.fullName.split(" ")[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {personaDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setPersonaDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0e1628] border border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <p className="text-xs font-semibold text-slate-200">Switch Demo Persona</p>
                  <p className="text-[10px] text-slate-400">
                    Test how recommendations adjust for different backgrounds
                  </p>
                </div>
                {SAMPLE_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchPersona(p.id);
                      setPersonaDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                      activePersonaId === p.id
                        ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                        : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <img
                      src={p.avatarUrl}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <div className="overflow-hidden flex-1">
                      <p className="font-medium text-slate-100 truncate">{p.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{p.experienceLevel}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Live System Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">Smart Match Engine Online</span>
        </div>
      </div>
    </header>
  );
}
