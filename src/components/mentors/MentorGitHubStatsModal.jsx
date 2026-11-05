"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Star, BookOpen, ExternalLink, Loader2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Badge } from "@/components/ui/Badge";

export function MentorGitHubStatsModal({ isOpen, onClose, mentor }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isOpen && mentor?.githubUsername) {
      setLoading(true);
      fetch(`/api/github?username=${encodeURIComponent(mentor.githubUsername)}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setData(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen, mentor]);

  if (!mentor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`GitHub Profile: @${mentor.githubUsername || mentor.name.toLowerCase().replace(/\s+/g, "")}`}
      description="Live public developer repositories and activity from GitHub REST API."
      maxWidth="max-w-md"
    >
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span>Fetching public repository data...</span>
        </div>
      ) : data ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <img
              src={data.avatar_url || mentor.avatarUrl}
              alt=""
              className="w-12 h-12 rounded-xl object-cover border border-slate-700"
            />
            <div>
              <h4 className="text-sm font-bold text-white">{data.name}</h4>
              <p className="text-xs text-slate-400">{data.bio}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                <span><strong>{data.public_repos}</strong> repos</span>
                <span>•</span>
                <span className="text-emerald-400"><strong>{data.followers}</strong> followers</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2">Featured Repositories</span>
            <div className="space-y-2">
              {(data.topRepos || []).slice(0, 3).map((repo, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                    <span className="text-amber-400 flex items-center gap-0.5 text-[10px]">
                      <Star className="w-3 h-3" />
                      {repo.stargazers_count}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{repo.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-6">
          Public GitHub profile information could not be retrieved.
        </p>
      )}
    </Modal>
  );
}
