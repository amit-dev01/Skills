"use client";

import React from "react";
import {
  LayoutDashboard,
  IdCard,
  Briefcase,
  GraduationCap,
  Users,
  BookmarkCheck,
  Wand2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    userProfile,
    savedConnections,
  } = useApp();

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "passport",
      label: "My Skill Passport",
      icon: IdCard,
      badge: `${userProfile.completionPercentage || 90}%`,
      badgeColor: "emerald",
    },
    {
      id: "recruiters",
      label: "Find Recruiters",
      icon: Briefcase,
      badge: "8 New",
      badgeColor: "blue",
    },
    {
      id: "mentors",
      label: "Find Mentors",
      icon: GraduationCap,
      badge: "6 Avail",
      badgeColor: "violet",
    },
    {
      id: "communities",
      label: "Communities",
      icon: Users,
      badge: null,
    },
    {
      id: "connections",
      label: "My Connections",
      icon: BookmarkCheck,
      badge: savedConnections.length > 0 ? savedConnections.length : null,
      badgeColor: "amber",
    },
    {
      id: "message-studio",
      label: "AI Message Studio",
      icon: Wand2,
      badge: "Gemini",
      badgeColor: "violet",
    },
    {
      id: "settings",
      label: "Settings & Setup",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-slate-800/80 bg-[#090f1d] z-30 transition-all duration-300 relative select-none",
        sidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div
          onClick={() => setActiveTab("overview")}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                SkillBridge
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  PRO
                </span>
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                Your Network, Your Opportunity
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors shrink-0"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-md shadow-blue-900/30 border border-blue-400/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-transform group-hover:scale-105",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                )}
              />

              {!sidebarCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!sidebarCollapsed && item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 border",
                    isActive
                      ? "bg-white/20 text-white border-white/20"
                      : item.badgeColor === "emerald"
                      ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/30"
                      : item.badgeColor === "violet"
                      ? "bg-purple-950/70 text-purple-300 border-purple-500/30"
                      : item.badgeColor === "amber"
                      ? "bg-amber-950/70 text-amber-300 border-amber-500/30"
                      : "bg-blue-950/70 text-blue-300 border-blue-500/30"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Collapsed active dot indicator */}
              {sidebarCollapsed && isActive && (
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* User Passport Mini Summary Footer */}
      {!sidebarCollapsed && (
        <div className="p-3 m-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
          <div className="flex items-center gap-3">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.fullName}
              className="w-9 h-9 rounded-full object-cover border border-blue-500/40 shrink-0"
            />
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-slate-100 truncate">
                {userProfile.fullName}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {userProfile.preferredRoles?.[0] || "Software Engineer"}
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
              <span>Passport Strength</span>
              <span className="text-emerald-400 font-semibold">
                {userProfile.completionPercentage || 90}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${userProfile.completionPercentage || 90}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
