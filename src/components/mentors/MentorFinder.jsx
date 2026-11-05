"use client";

import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  Search,
  Filter,
  Sparkles,
  RotateCcw,
  Users,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { MentorCard } from "./MentorCard";
import { Button } from "@/components/ui/Button";

export function MentorFinder() {
  const { scoredMentors, searchQuery, setSearchQuery } = useApp();

  const [selectedTopic, setSelectedTopic] = useState("all");
  const [sortBy, setSortBy] = useState("match");

  const topics = [
    { id: "all", label: "All Topics" },
    { id: "college", label: "Tier-3 / Off-Campus Career" },
    { id: "review", label: "Portfolio & Code Review" },
    { id: "opensource", label: "Open Source & First PR" },
  ];

  const filteredMentors = useMemo(() => {
    return scoredMentors.filter((mentor) => {
      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = mentor.name.toLowerCase().includes(query);
        const matchesCompany = mentor.company.toLowerCase().includes(query);
        const matchesRole = mentor.role.toLowerCase().includes(query);
        const matchesExpertise = mentor.expertise.some((s) => s.toLowerCase().includes(query));
        const matchesTopics = (mentor.mentorshipTopics || []).some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesCompany && !matchesRole && !matchesExpertise && !matchesTopics) {
          return false;
        }
      }

      // Topic filter check
      if (selectedTopic === "college") {
        const hasCollege = (mentor.mentorshipTopics || []).some(
          (t) => t.toLowerCase().includes("college") || t.toLowerCase().includes("job") || mentor.bio.toLowerCase().includes("tier-3")
        );
        if (!hasCollege) return false;
      } else if (selectedTopic === "review") {
        const hasReview = (mentor.mentorshipTopics || []).some(
          (t) => t.toLowerCase().includes("review") || t.toLowerCase().includes("portfolio") || t.toLowerCase().includes("resume")
        );
        if (!hasReview) return false;
      } else if (selectedTopic === "opensource") {
        const hasOS = (mentor.mentorshipTopics || []).some(
          (t) => t.toLowerCase().includes("open") || t.toLowerCase().includes("source") || t.toLowerCase().includes("git")
        );
        if (!hasOS) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "slots") return (b.availableSlots || 0) - (a.availableSlots || 0);
      return 0;
    });
  }, [scoredMentors, searchQuery, selectedTopic, sortBy]);

  const resetFilters = () => {
    setSelectedTopic("all");
    setSearchQuery("");
    setSortBy("match");
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              Mentor Discovery
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Connect with experienced engineers who provide direct guidance, resume roasts, and code reviews for non-traditional builders.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-400">
              Showing <strong>{filteredMentors.length}</strong> of {scoredMentors.length} mentors
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedTopic === topic.id
                    ? "bg-purple-600 text-white font-semibold shadow-sm"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="match">Highest Match %</option>
              <option value="slots">Most Open Slots</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Mentor Cards */}
      {filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#0d1527]/60 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No mentors matched your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your topic filter or broadening your search terms.
          </p>
          <Button variant="secondary" size="sm" onClick={resetFilters} className="text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}
