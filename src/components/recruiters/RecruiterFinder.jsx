"use client";

import React, { useState, useMemo } from "react";
import {
  Briefcase,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { RecruiterCard } from "./RecruiterCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function RecruiterFinder() {
  const { scoredRecruiters, searchQuery, setSearchQuery } = useApp();

  const [selectedDomain, setSelectedDomain] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState("match"); // 'match' | 'company' | 'roles'

  const domains = [
    { id: "all", label: "All Hiring Domains" },
    { id: "frontend", label: "Frontend & Full-Stack" },
    { id: "early", label: "Early Career & Interns" },
    { id: "backend", label: "Backend & Cloud" },
  ];

  const filteredRecruiters = useMemo(() => {
    return scoredRecruiters.filter((recruiter) => {
      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = recruiter.name.toLowerCase().includes(query);
        const matchesCompany = recruiter.company.toLowerCase().includes(query);
        const matchesDomain = recruiter.hiringDomain.toLowerCase().includes(query);
        const matchesSkills = recruiter.skills.some((s) => s.toLowerCase().includes(query));
        if (!matchesName && !matchesCompany && !matchesDomain && !matchesSkills) {
          return false;
        }
      }

      // Domain filter check
      if (selectedDomain === "frontend") {
        if (!recruiter.hiringDomain.toLowerCase().includes("front") && !recruiter.hiringDomain.toLowerCase().includes("full-stack")) {
          return false;
        }
      } else if (selectedDomain === "early") {
        if (!recruiter.hiringDomain.toLowerCase().includes("early") && !recruiter.hiringDomain.toLowerCase().includes("associate") && !recruiter.targetExperience.toLowerCase().includes("fresh")) {
          return false;
        }
      } else if (selectedDomain === "backend") {
        if (!recruiter.hiringDomain.toLowerCase().includes("back") && !recruiter.hiringDomain.toLowerCase().includes("cloud")) {
          return false;
        }
      }

      // Remote filter check
      if (remoteOnly && !recruiter.isRemote) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "roles") return (b.activeRolesCount || 0) - (a.activeRolesCount || 0);
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return 0;
    });
  }, [scoredRecruiters, searchQuery, selectedDomain, remoteOnly, sortBy]);

  const resetFilters = () => {
    setSelectedDomain("all");
    setRemoteOnly(false);
    setSearchQuery("");
    setSortBy("match");
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              Recruiter Discovery
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Discover verified technical talent partners hiring developers based on skills, not pedigree.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-400">
              Showing <strong>{filteredRecruiters.length}</strong> of {scoredRecruiters.length} recruiters
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          {/* Domain tabs */}
          <div className="flex flex-wrap gap-1.5">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedDomain === domain.id
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {domain.label}
              </button>
            ))}
          </div>

          {/* Right filters: Remote toggle & Sort */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>Remote Worldwide Only</span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="match">Highest Match %</option>
              <option value="roles">Most Active Roles</option>
              <option value="company">Company Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Recruiter Cards */}
      {filteredRecruiters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecruiters.map((recruiter) => (
            <RecruiterCard key={recruiter.id} recruiter={recruiter} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#0d1527]/60 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No recruiters matched your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms, turning off the remote filter, or clearing domain restrictions.
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
