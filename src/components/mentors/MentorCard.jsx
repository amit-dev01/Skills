"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  MapPin,
  ExternalLink,
  BookmarkCheck,
  Send,
  Globe,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { MatchScoreModal } from "@/components/recruiters/MatchScoreModal";
import { MentorGitHubStatsModal } from "./MentorGitHubStatsModal";

export function MentorCard({ mentor }) {
  const {
    saveConnection,
    isConnectionSaved,
    openMessageStudioWithRecipient,
  } = useApp();

  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const isSaved = isConnectionSaved(mentor.id);

  return (
    <>
      <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 hover:border-purple-500/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between group">
        <div>
          {/* Header Row: Avatar + Info + Match % */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-start gap-3.5">
              <div className="relative">
                <img
                  src={mentor.avatarUrl}
                  alt={mentor.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm shrink-0"
                />
                <span
                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-[#0d1527]"
                  title="Verified Mentor"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                    {mentor.name}
                  </h3>
                  <Badge variant="violet" className="text-[10px] py-0 px-1.5">
                    {mentor.companyBadge || "Mentor"}
                  </Badge>
                </div>

                <p className="text-xs font-medium text-slate-300 mt-0.5">
                  {mentor.role}
                </p>

                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <span className="font-semibold text-purple-400">{mentor.company}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {mentor.location}
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
                {mentor.matchScore}% Match
              </span>
              <span className="text-[10px] text-slate-500 group-hover/match:text-slate-300 transition-colors mt-0.5 underline decoration-dotted">
                Why matched?
              </span>
            </button>
          </div>

          {/* Experience & Story Bio */}
          <div className="mb-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="font-semibold text-purple-300">{mentor.experienceLevel}</span>
              <span className="text-emerald-400 font-medium">{mentor.availableSlots} slots open this month</span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
              "{mentor.bio}"
            </p>
          </div>

          {/* Mentorship Focus Topics */}
          <div className="mb-3">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Mentorship Focus
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(mentor.mentorshipTopics || []).map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-purple-950/60 text-purple-200 border border-purple-500/30"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {(mentor.expertise || []).slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* GitHub / Portfolio Triggers */}
          <div className="flex items-center gap-1.5">
            {mentor.githubUsername && (
              <button
                onClick={() => setIsGitHubModalOpen(true)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="View Public GitHub Data"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </button>
            )}
            {mentor.portfolioUrl && (
              <a
                href={mentor.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Portfolio Website"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isSaved ? "secondary" : "outline"}
              size="sm"
              onClick={() => saveConnection(mentor, "mentor")}
              className="text-xs"
            >
              <BookmarkCheck
                className={`w-3.5 h-3.5 ${isSaved ? "text-amber-400" : ""}`}
              />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </Button>

            <Button
              variant="violet"
              size="sm"
              onClick={() =>
                openMessageStudioWithRecipient(mentor, "mentor_request")
              }
              className="text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Advice</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Match Score Breakdown Modal */}
      <MatchScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        entityName={`${mentor.name} (${mentor.role})`}
        matchData={{
          score: mentor.matchScore,
          reason: mentor.matchReason,
          breakdown: mentor.matchBreakdown,
          disclaimer: mentor.matchDisclaimer,
        }}
      />

      {/* GitHub Profile Modal */}
      <MentorGitHubStatsModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        mentor={mentor}
      />
    </>
  );
}
