"use client";

import React, { useState } from "react";
import {
  IdCard,
  Edit3,
  Share2,
  ExternalLink,
  MapPin,
  GraduationCap,
  Briefcase,
  Globe,
  CheckCircle2,
  Sparkles,
  Copy,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SkillPassportEditModal } from "./SkillPassportEditModal";
import { GitHubSyncCard } from "./GitHubSyncCard";

export function SkillPassportView() {
  const { userProfile, scoredRecruiters, setActiveTab } = useApp();
  const { addToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCopyPassportLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/#passport-${userProfile.fullName.toLowerCase().replace(/\s+/g, "-")}`);
      addToast("Public Skill Passport link copied to clipboard!", "success");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <IdCard className="w-5 h-5 text-blue-400" />
              Verified Skill Passport
            </h2>
            <Badge variant="emerald">Active & Searchable</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized proof-of-work identity for students, self-taught devs, and regional talent.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyPassportLink}
            className="text-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Passport</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* Main Passport Card (Digital Credential Style) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111c38] via-[#0d162a] to-[#090f1d] border border-blue-500/25 p-6 sm:p-8 shadow-2xl">
        {/* Glowing holographic watermarks */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Passport Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-5 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                SKILLBRIDGE CREDENTIAL IDENTIFIER
              </span>
              <p className="text-xs text-slate-400">PASSPORT-ID: SB-{userProfile.fullName.slice(0, 3).toUpperCase()}-2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Readiness Rating</span>
              <span className="text-sm font-bold text-emerald-400">{userProfile.completionPercentage || 92}% / 100</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* User Identity Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-400/50 shadow-xl"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow">
                PRO
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {userProfile.fullName}
              </h1>
              <p className="text-sm text-blue-300 font-medium mt-0.5">
                {userProfile.headline || userProfile.preferredRoles?.[0]}
              </p>

              <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {userProfile.location}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">
                  {userProfile.remotePreference}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  {userProfile.education}
                </span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {userProfile.portfolioUrl && (
              <a
                href={userProfile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 transition-colors"
                title="Portfolio Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {userProfile.githubUrl && (
              <a
                href={userProfile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 transition-colors"
                title="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {userProfile.linkedinUrl && (
              <a
                href={userProfile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 transition-colors"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Bio & Professional Story */}
        <div className="py-6 border-b border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Candidate Introduction & Background Story
          </h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            "{userProfile.bio}"
          </p>
        </div>

        {/* Technical Skills & Specializations */}
        <div className="py-6 border-b border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Verified Technical Competencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {(userProfile.skills || []).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-950/60 text-blue-200 border border-blue-500/30 hover:border-blue-400 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Target Roles & Interests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Preferred Roles
            </h3>
            <div className="flex flex-wrap gap-2">
              {(userProfile.preferredRoles || []).map((role, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-950/60 text-purple-200 border border-purple-500/30"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Career Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {(userProfile.careerInterests || []).map((interest, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunity Match Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-slate-300">
              This passport currently has <strong className="text-white">{scoredRecruiters.length} active recruiter matches</strong> and <strong className="text-white">6 mentor recommendations</strong>.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab("recruiters")}
            className="text-xs shrink-0"
          >
            Explore Matches
          </Button>
        </div>
      </div>

      {/* GitHub Sync Section */}
      <GitHubSyncCard
        username={userProfile.githubUsername || "priyasharma-dev"}
        onSyncComplete={(data) => {
          // Optional callback
        }}
      />

      {/* Edit Modal */}
      <SkillPassportEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
