import React from "react";
import { Sparkles, ArrowRight, Wand2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";

export function QuickActionBanner() {
  const { setActiveTab } = useApp();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-purple-950/70 border border-blue-500/20 p-5 sm:p-6 backdrop-blur-md">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -top-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Mission: Leveling the playing field</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Your opportunities shouldn't depend on who you already know.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            SkillBridge connects non-traditional developers, students from smaller cities, and self-taught builders directly with recruiters and mentors based on verified technical craft — not social pedigree.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab("recruiters")}
            className="flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Find Recruiters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveTab("message-studio")}
            className="flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span>AI Message Studio</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
