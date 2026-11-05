"use client";

import React, { useState } from "react";
import {
  Settings,
  Sliders,
  Database,
  Key,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Code,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DEFAULT_WEIGHTS } from "@/lib/matchingEngine";
import { SAMPLE_PERSONAS } from "@/data/samplePersonas";
import { SUPABASE_SCHEMA_SQL, isSupabaseConfigured } from "@/lib/supabaseClient";

export function SettingsView() {
  const {
    weights,
    updateMatchingWeights,
    activePersonaId,
    switchPersona,
    userProfile,
  } = useApp();

  const { addToast } = useToast();

  const [localWeights, setLocalWeights] = useState({
    skills: Math.round((weights.skills || 0.50) * 100),
    role: Math.round((weights.role || 0.25) * 100),
    location: Math.round((weights.location || 0.15) * 100),
    experience: Math.round((weights.experience || 0.10) * 100),
  });

  const [sqlCopied, setSqlCopied] = useState(false);
  const [envCopied, setEnvCopied] = useState(false);

  const handleSaveWeights = (e) => {
    e.preventDefault();
    const sum = localWeights.skills + localWeights.role + localWeights.location + localWeights.experience;
    const normalized = {
      skills: Number((localWeights.skills / sum).toFixed(2)),
      role: Number((localWeights.role / sum).toFixed(2)),
      location: Number((localWeights.location / sum).toFixed(2)),
      experience: Number((localWeights.experience / sum).toFixed(2)),
    };
    updateMatchingWeights(normalized);
    addToast("Matching engine weights updated and normalized!", "success");
  };

  const handleResetWeights = () => {
    updateMatchingWeights(DEFAULT_WEIGHTS);
    setLocalWeights({
      skills: 50,
      role: 25,
      location: 15,
      experience: 10,
    });
    addToast("Weights reset to system defaults", "info");
  };

  const handleCopySql = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setSqlCopied(true);
      addToast("Supabase SQL Schema copied to clipboard!", "success");
      setTimeout(() => setSqlCopied(false), 2000);
    }
  };

  const envSnippet = `# SkillBridge Environment Variables
# Copy these into your .env.local file

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here
GITHUB_TOKEN=your-optional-github-personal-access-token
`;

  const handleCopyEnv = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(envSnippet);
      setEnvCopied(true);
      addToast(".env.local snippet copied to clipboard!", "success");
      setTimeout(() => setEnvCopied(false), 2000);
    }
  };

  const handleClearDemoData = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      addToast("Demo state reset. Reloading page...", "info");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          Settings & Architecture Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize matching engine weights, test diverse student/developer personas, and view Supabase PostgreSQL credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Matching Engine Tuning */}
        <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">
                Matching Algorithm Factor Weights
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetWeights}
              className="text-xs text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Defaults</span>
            </Button>
          </div>

          <p className="text-xs text-slate-400">
            Adjust how much emphasis the smart matching engine places on each category when ranking recruiters and mentors.
          </p>

          <form onSubmit={handleSaveWeights} className="space-y-4 pt-1">
            {/* Skills Weight */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Skill Compatibility Overlap</span>
                <span className="text-blue-400 font-bold">{localWeights.skills}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={localWeights.skills}
                onChange={(e) =>
                  setLocalWeights({ ...localWeights, skills: Number(e.target.value) })
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Role Relevance */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Target Role & Title Match</span>
                <span className="text-purple-400 font-bold">{localWeights.role}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={localWeights.role}
                onChange={(e) =>
                  setLocalWeights({ ...localWeights, role: Number(e.target.value) })
                }
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Location / Remote */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Location & Remote Compatibility</span>
                <span className="text-emerald-400 font-bold">{localWeights.location}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={localWeights.location}
                onChange={(e) =>
                  setLocalWeights({ ...localWeights, location: Number(e.target.value) })
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Experience */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Experience Level Match</span>
                <span className="text-amber-400 font-bold">{localWeights.experience}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={localWeights.experience}
                onChange={(e) =>
                  setLocalWeights({ ...localWeights, experience: Number(e.target.value) })
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <Button variant="primary" size="sm" type="submit" className="w-full text-xs">
              Apply & Re-score Recommendations
            </Button>
          </form>
        </div>

        {/* Section 2: Persona Switcher */}
        <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Demonstration Personas
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            Switch between representative profiles to test how the system personalizes recommendations for different journeys:
          </p>

          <div className="space-y-3">
            {SAMPLE_PERSONAS.map((persona) => {
              const isCurrent = activePersonaId === persona.id;
              return (
                <div
                  key={persona.id}
                  onClick={() => switchPersona(persona.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isCurrent
                      ? "bg-slate-800/90 border-blue-500/60 shadow-lg"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={persona.avatarUrl}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white">{persona.fullName}</h4>
                          {isCurrent && (
                            <Badge variant="emerald" className="text-[9px] py-0">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-blue-400">{persona.headline}</p>
                        <p className="text-[10px] text-slate-400">
                          {persona.location} • {persona.experienceLevel}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Supabase PostgreSQL Architecture */}
        <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md space-y-4 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">
                Supabase PostgreSQL & Row Level Security (RLS)
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={isSupabaseConfigured ? "emerald" : "outline"}>
                {isSupabaseConfigured ? "Supabase Connected" : "Local Storage Demo Mode"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySql}
                className="text-xs"
              >
                {sqlCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied SQL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Supabase Schema SQL</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            SkillBridge is architected for Supabase PostgreSQL with strict Row Level Security (RLS) so candidates can only access and modify their private profile and saved connections. When environment variables are not supplied, SkillBridge automatically operates in <strong>Client Local Mode</strong> without crashing or interrupting evaluation.
          </p>

          {/* Code Viewer */}
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/80 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto">
            <pre>{SUPABASE_SCHEMA_SQL}</pre>
          </div>

          {/* Environment Snippet */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-white">Environment Configuration (.env.local)</p>
              <p className="text-[11px] text-slate-400">
                Supply your Supabase and Google Gemini credentials to enable cloud persistence and real-time LLM inference.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyEnv}
              className="text-xs shrink-0"
            >
              {envCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy .env Template</span>
                </>
              )}
            </Button>
          </div>

          {/* Danger zone */}
          <div className="pt-2 flex justify-end">
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearDemoData}
              className="text-xs"
            >
              Reset All Local Demo Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
