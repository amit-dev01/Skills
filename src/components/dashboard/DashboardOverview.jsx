"use client";

import React from "react";
import {
  IdCard,
  Briefcase,
  GraduationCap,
  BookmarkCheck,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { StatCard } from "./StatCard";
import { SkillMatchChart } from "./SkillMatchChart";
import { QuickActionBanner } from "./QuickActionBanner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils";

export function DashboardOverview() {
  const {
    userProfile,
    setActiveTab,
    scoredRecruiters,
    scoredMentors,
    communities,
    savedConnections,
    saveConnection,
    isConnectionSaved,
    openMessageStudioWithRecipient,
    recentActivity,
  } = useApp();

  const topRecruiters = scoredRecruiters.slice(0, 3);
  const topMentors = scoredMentors.slice(0, 3);
  const topCommunities = communities.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Completion Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.fullName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0d1527]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {userProfile.fullName}
              </h2>
              <Badge variant="emerald" className="hidden sm:inline-flex">
                {userProfile.experienceLevel}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {userProfile.headline || userProfile.location} • {userProfile.location}
            </p>
          </div>
        </div>

        {/* Profile Strength Progress */}
        <div className="flex items-center gap-4 min-w-[240px] p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Passport Strength</span>
              <span className="text-emerald-400 font-bold">
                {userProfile.completionPercentage || 90}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2 rounded-full transition-all duration-700"
                style={{ width: `${userProfile.completionPercentage || 90}%` }}
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("passport")}
            className="text-xs shrink-0"
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Mission Banner */}
      <QuickActionBanner />

      {/* 4 Compact Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Skill Passport Score"
          value={`${userProfile.completionPercentage || 90}%`}
          subtitle="Ready for recruitment"
          icon={IdCard}
          trend="+12% this week"
          color="emerald"
          onClick={() => setActiveTab("passport")}
        />

        <StatCard
          title="Matched Recruiters"
          value={scoredRecruiters.length}
          subtitle="Targeting your skill set"
          icon={Briefcase}
          trend="8 high compatibility"
          color="blue"
          onClick={() => setActiveTab("recruiters")}
        />

        <StatCard
          title="Available Mentors"
          value={scoredMentors.length}
          subtitle="Ready to review & guide"
          icon={GraduationCap}
          trend="100% remote open"
          color="violet"
          onClick={() => setActiveTab("mentors")}
        />

        <StatCard
          title="Tracked Connections"
          value={savedConnections.length}
          subtitle="In your active pipeline"
          icon={BookmarkCheck}
          trend="View stages"
          color="amber"
          onClick={() => setActiveTab("connections")}
        />
      </div>

      {/* Main Grid: Left 2 Cols (Visuals & Top Matches), Right 1 Col (Communities & Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Compatibility Visualization */}
          <SkillMatchChart />

          {/* Top Recommended Recruiters Section */}
          <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  Top Recommended Recruiters
                </h3>
                <p className="text-xs text-slate-400">
                  Ranked by the 4-factor smart matching engine
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("recruiters")}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>View all ({scoredRecruiters.length})</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {topRecruiters.map((recruiter) => {
                const isSaved = isConnectionSaved(recruiter.id);
                return (
                  <div
                    key={recruiter.id}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={recruiter.avatarUrl}
                        alt={recruiter.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-white">
                            {recruiter.name}
                          </h4>
                          <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                            {recruiter.company}
                          </span>
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            {recruiter.matchScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {recruiter.designation} • {recruiter.location}
                        </p>
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-1 italic">
                          "{recruiter.matchReason}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Button
                        variant={isSaved ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => saveConnection(recruiter, "recruiter")}
                        className="text-xs"
                      >
                        <BookmarkCheck className={`w-3.5 h-3.5 ${isSaved ? "text-amber-400" : ""}`} />
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
                );
              })}
            </div>
          </div>

          {/* Top Recommended Mentors Section */}
          <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  Top Recommended Mentors
                </h3>
                <p className="text-xs text-slate-400">
                  Engineers ready to guide non-traditional & off-campus talent
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("mentors")}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <span>View all ({scoredMentors.length})</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {topMentors.map((mentor) => {
                const isSaved = isConnectionSaved(mentor.id);
                return (
                  <div
                    key={mentor.id}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={mentor.avatarUrl}
                        alt={mentor.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-white">
                            {mentor.name}
                          </h4>
                          <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                            {mentor.company}
                          </span>
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            {mentor.matchScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {mentor.role} • {mentor.location}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {(mentor.mentorshipTopics || []).slice(0, 2).map((topic, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Button
                        variant={isSaved ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => saveConnection(mentor, "mentor")}
                        className="text-xs"
                      >
                        <BookmarkCheck className={`w-3.5 h-3.5 ${isSaved ? "text-amber-400" : ""}`} />
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
                        <span>Request Advice</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Span 1): Communities + Activity + Checklist */}
        <div className="space-y-6">
          {/* Recommended Communities */}
          <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Recommended Communities
              </h3>
              <button
                onClick={() => setActiveTab("communities")}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Explore all
              </button>
            </div>

            <div className="space-y-3">
              {topCommunities.map((community) => (
                <div
                  key={community.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-slate-100">
                      {community.name}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 shrink-0">
                      {community.platform}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {community.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {community.memberCount} members
                    </span>
                    <a
                      href={community.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      <span>Join</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Completion Checklist */}
          <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Passport Next Steps
            </h3>
            <div className="space-y-2">
              {(userProfile.checklist || []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/40 text-xs"
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      item.completed
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "border border-slate-600 text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                  <span
                    className={
                      item.completed
                        ? "text-slate-400 line-through"
                        : "text-slate-200 font-medium"
                    }
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("passport")}
              className="w-full mt-3 text-xs"
            >
              Update Passport Details
            </Button>
          </div>

          {/* Recent Activity Log */}
          <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-400" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.slice(0, 4).map((activity) => (
                <div key={activity.id} className="text-xs border-l-2 border-slate-800 pl-3 py-0.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-medium text-slate-300">{activity.action}</span>
                    <span>{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{activity.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
