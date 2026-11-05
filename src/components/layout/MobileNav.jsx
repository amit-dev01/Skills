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
  X,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const {
    activeTab,
    setActiveTab,
    mobileMenuOpen,
    setMobileMenuOpen,
    savedConnections,
    userProfile,
  } = useApp();

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "passport", label: "Skill Passport", icon: IdCard },
    { id: "recruiters", label: "Recruiters", icon: Briefcase },
    { id: "mentors", label: "Mentors", icon: GraduationCap },
    { id: "communities", label: "Communities", icon: Users },
    {
      id: "connections",
      label: "Connections",
      icon: BookmarkCheck,
      badge: savedConnections.length,
    },
    { id: "message-studio", label: "Message Studio", icon: Wand2 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const bottomNavItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "passport", label: "Passport", icon: IdCard },
    { id: "recruiters", label: "Recruiters", icon: Briefcase },
    { id: "mentors", label: "Mentors", icon: GraduationCap },
    { id: "connections", label: "Saved", icon: BookmarkCheck },
  ];

  return (
    <>
      {/* Sliding Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-[#090f1d] border-r border-slate-800 h-full flex flex-col p-4 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-base">SkillBridge</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-slate-300 hover:bg-slate-800/60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <img
                src={userProfile.avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-100 truncate">
                  {userProfile.fullName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {userProfile.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#090f1d]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 flex items-center justify-around">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors relative",
                isActive ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-blue-400 absolute -bottom-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
