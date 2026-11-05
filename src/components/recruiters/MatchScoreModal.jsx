"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Check, AlertCircle, HelpCircle } from "lucide-react";

export function MatchScoreModal({ isOpen, onClose, entityName, matchData }) {
  if (!matchData) return null;

  const { score, reason, breakdown, disclaimer } = matchData;

  const factors = [
    {
      title: "Skill Compatibility",
      weight: "50%",
      score: breakdown?.skills?.score || 0,
      contribution: breakdown?.skills?.contribution || 0,
      detail:
        breakdown?.skills?.matched?.length > 0
          ? `Matched: ${breakdown.skills.matched.join(", ")}`
          : "General technical skills overlap",
      subDetail:
        breakdown?.skills?.missing?.length > 0
          ? `Nice to have: ${breakdown.skills.missing.join(", ")}`
          : null,
      color: "blue",
    },
    {
      title: "Career & Role Relevance",
      weight: "25%",
      score: breakdown?.role?.score || 0,
      contribution: breakdown?.role?.contribution || 0,
      detail: `Matched with: ${breakdown?.role?.matchedRole || "Engineering"}`,
      color: "purple",
    },
    {
      title: "Location & Remote Policy",
      weight: "15%",
      score: breakdown?.location?.score || 0,
      contribution: breakdown?.location?.contribution || 0,
      detail: breakdown?.location?.reason || "Remote collaboration open",
      color: "emerald",
    },
    {
      title: "Experience Tier Alignment",
      weight: "10%",
      score: breakdown?.experience?.score || 0,
      contribution: breakdown?.experience?.contribution || 0,
      detail: breakdown?.experience?.reason || "Welcomes early career candidates",
      color: "amber",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Compatibility Breakdown: ${entityName}`}
      description="Transparent, mathematical scoring computed by the SkillBridge 4-Factor Matching Engine."
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Total Score Header */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Overall Match Rating</span>
            <span className="text-3xl font-extrabold text-white flex items-center gap-2">
              {score}%
              <Badge variant="emerald" className="text-xs">
                Strong Alignment
              </Badge>
            </span>
          </div>
          <div className="text-right max-w-[200px]">
            <p className="text-xs text-slate-300 font-medium leading-snug">
              "{reason}"
            </p>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-3">
          {factors.map((factor, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  {factor.title}{" "}
                  <span className="text-slate-500 text-[11px]">({factor.weight} weight)</span>
                </span>
                <span className="font-bold text-white">
                  {factor.score}% ({factor.contribution} pts)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${factor.score}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400">{factor.detail}</p>
              {factor.subDetail && (
                <p className="text-[10px] text-slate-500 italic">{factor.subDetail}</p>
              )}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            {disclaimer ||
              "These scores represent prototype compatibility estimates, not hiring probability or guaranteed mentor suitability."}
          </span>
        </div>
      </div>
    </Modal>
  );
}
