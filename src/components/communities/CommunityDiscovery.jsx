"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Sparkles,
  RotateCcw,
  Globe,
  MessageSquare,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CommunityCard } from "./CommunityCard";
import { Button } from "@/components/ui/Button";

export function CommunityDiscovery() {
  const { communities, searchQuery, setSearchQuery } = useApp();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const categories = [
    { id: "all", label: "All Communities" },
    { id: "frontend", label: "Frontend & Web" },
    { id: "opensource", label: "Open Source" },
    { id: "hackathon", label: "Hackathons & Students" },
    { id: "ai", label: "AI & ML" },
    { id: "selftaught", label: "Self-Taught Networks" },
  ];

  const filteredCommunities = useMemo(() => {
    return communities.filter((comm) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = comm.name.toLowerCase().includes(query);
        const matchesDesc = comm.description.toLowerCase().includes(query);
        const matchesTags = comm.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory === "frontend") {
        if (!comm.category.toLowerCase().includes("frontend")) return false;
      } else if (selectedCategory === "opensource") {
        if (!comm.category.toLowerCase().includes("open-source") && !comm.tags.includes("Open Source")) return false;
      } else if (selectedCategory === "hackathon") {
        if (!comm.category.toLowerCase().includes("hackathon") && !comm.tags.includes("Students")) return false;
      } else if (selectedCategory === "ai") {
        if (!comm.category.toLowerCase().includes("ai") && !comm.tags.includes("AI/ML")) return false;
      } else if (selectedCategory === "selftaught") {
        if (!comm.tags.includes("Self-Taught") && !comm.tags.includes("Non-CS")) return false;
      }

      // Platform filter
      if (selectedPlatform !== "all") {
        if (!comm.platform.toLowerCase().includes(selectedPlatform)) return false;
      }

      return true;
    });
  }, [communities, searchQuery, selectedCategory, selectedPlatform]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedPlatform("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Professional Community Discovery
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Break out of isolation. Join active Discord servers, hackathon squads, and open-source programs.
            </p>
          </div>

          <span className="text-xs text-slate-400">
            Showing <strong>{filteredCommunities.length}</strong> of {communities.length} communities
          </span>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-cyan-600 text-white font-semibold shadow-sm"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="text-xs bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="discord">Discord</option>
              <option value="slack">Slack</option>
              <option value="discourse">Discourse / Web</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Community Cards */}
      {filteredCommunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#0d1527]/60 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No communities matched your search</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your category or platform filter.
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
