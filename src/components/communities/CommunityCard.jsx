"use client";

import React from "react";
import {
  Users,
  ExternalLink,
  BookmarkCheck,
  Sparkles,
  MessageSquare,
  Globe,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";

export function CommunityCard({ community }) {
  const { saveConnection, isConnectionSaved } = useApp();
  const isSaved = isConnectionSaved(community.id);

  return (
    <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="cyan" className="text-[10px]">
            {community.category}
          </Badge>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              {community.platform}
            </span>
            {community.isBeginnerFriendly && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-medium">
                Beginner Friendly
              </span>
            )}
          </div>
        </div>

        {/* Title & Members */}
        <div className="mb-2.5">
          <h3 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
            {community.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{community.memberCount} members active</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          {community.description}
        </p>

        {/* Why Join Insight */}
        {community.whyJoin && (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-3 text-[11px] text-slate-400">
            <span className="text-cyan-400 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
              Why Join
            </span>
            <span className="italic text-slate-300">"{community.whyJoin}"</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {community.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/80 text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <Button
          variant={isSaved ? "secondary" : "outline"}
          size="sm"
          onClick={() => saveConnection(community, "community")}
          className="text-xs"
        >
          <BookmarkCheck
            className={`w-3.5 h-3.5 ${isSaved ? "text-amber-400" : ""}`}
          />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </Button>

        <a
          href={community.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/20 transition-all cursor-pointer"
        >
          <span>Join Community</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
