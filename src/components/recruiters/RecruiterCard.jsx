"use client";

import React, { useState } from "react";
import {
  Briefcase,
  MapPin,
  ExternalLink,
  BookmarkCheck,
  Send,
  Info,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { MatchScoreModal } from "./MatchScoreModal";

export function RecruiterCard({ recruiter }) {
  const {
    saveConnection,
    isConnectionSaved,
    openMessageStudioWithRecipient,
  } = useApp();

  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const isSaved = isConnectionSaved(recruiter.id);

  return (
    <>
      <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 hover:border-blue-500/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between group">
        <div>
          {/* Header Row: Avatar + Info + Match % */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-start gap-3.5">
              <div className="relative">
                <img
                  src={recruiter.avatarUrl}
                  alt={recruiter.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm shrink-0"
                />
                {recruiter.isDemonstrationProfile && (
                  <span
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-[#0d1527]"
                    title="Curated Demonstration Profile"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                    {recruiter.name}
                  </h3>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                    Demo
                  </Badge>
                </div>

                <p className="text-xs font-medium text-slate-300 mt-0.5">
                  {recruiter.designation}
                </p>

                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <span className="font-semibold text-blue-400">{recruiter.company}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {recruiter.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Clickable Match Percentage Pill */}
            <button
              onClick={() => setIsScoreModalOpen(true)}
              className="flex flex-col items-end shrink-0 text-right group/match cursor-pointer"
              title="Click to view match explanation"
            >
              <span className="text-xs sm:text-sm font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-xl flex items-center gap-1 group-hover/match:bg-emerald-500/20 transition-all">
                <Sparkles className="w-3 h-3" />
                {recruiter.matchScore}% Match
              </span>
              <span className="text-[10px] text-slate-500 group-hover/match:text-slate-300 transition-colors mt-0.5 underline decoration-dotted">
                Why matched?
              </span>
            </button>
          </div>

          {/* Hiring Domain & Tip */}
          <div className="mb-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">
              <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[9px]">
                Active Focus
              </span>
              <span className="text-slate-200 font-medium">{recruiter.hiringDomain}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 italic">
              "{recruiter.matchReason}"
            </p>
          </div>

          {/* Skills Required */}
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Hiring For Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {recruiter.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Public links */}
          <div className="flex items-center gap-2">
            {recruiter.publicCompanyUrl && (
              <a
                href={recruiter.publicCompanyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Official Careers Page"
              >
                <span>Careers</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {recruiter.publicProfileUrl && (
              <a
                href={recruiter.publicProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Public Profile Link"
              >
                <span>Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isSaved ? "secondary" : "outline"}
              size="sm"
              onClick={() => saveConnection(recruiter, "recruiter")}
              className="text-xs"
            >
              <BookmarkCheck
                className={`w-3.5 h-3.5 ${isSaved ? "text-amber-400" : ""}`}
              />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                openMessageStudioWithRecipient(recruiter, "recruiter_intro")
              }
              className="text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reach Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Match Score Breakdown Modal */}
      <MatchScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        entityName={`${recruiter.name} (${recruiter.company})`}
        matchData={{
          score: recruiter.matchScore,
          reason: recruiter.matchReason,
          breakdown: recruiter.matchBreakdown,
          disclaimer: recruiter.matchDisclaimer,
        }}
      />
    </>
  );
}
