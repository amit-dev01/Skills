"use client";

import React, { useState } from "react";
import { RefreshCw, Star, GitFork, BookOpen, CheckCircle, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/context/ToastContext";

export function GitHubSyncCard({ username = "priyasharma-dev", onSyncComplete }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [gitHubData, setGitHubData] = useState(null);

  const fetchGitHubStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/github?username=${encodeURIComponent(username)}`);
      const result = await res.json();
      if (result.success && result.data) {
        setGitHubData(result.data);
        addToast(
          result.fallback
            ? "Synced demo developer stats from GitHub engine"
            : `Synced live public GitHub data for @${username}`,
          "success"
        );
        if (onSyncComplete) onSyncComplete(result.data);
      } else {
        addToast("Could not retrieve GitHub details", "error");
      }
    } catch (err) {
      addToast("Network error syncing GitHub", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700">
            <GithubIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              GitHub Developer Profile
              <Badge variant="emerald" className="text-[10px] py-0">
                Verified Public
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Synced with GitHub REST API • @{username}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          isLoading={loading}
          onClick={fetchGitHubStats}
          className="text-xs shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{gitHubData ? "Re-sync Stats" : "Fetch Public GitHub Stats"}</span>
        </Button>
      </div>

      {gitHubData ? (
        <div className="space-y-4 animate-in fade-in">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div>
              <p className="text-lg font-bold text-white">{gitHubData.public_repos}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Repositories</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-400">{gitHubData.followers}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Followers</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-400">{gitHubData.following}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Following</p>
            </div>
          </div>

          {/* Top Repositories */}
          {gitHubData.topRepos && gitHubData.topRepos.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-300 mb-2">Featured Repositories</p>
              <div className="space-y-2">
                {gitHubData.topRepos.slice(0, 3).map((repo, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{repo.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {repo.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {repo.language}
                      </span>
                      <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                        <Star className="w-3 h-3" />
                        {repo.stargazers_count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Click <strong>"Fetch Public GitHub Stats"</strong> to verify public repositories and commit activity via GitHub's official REST API.
          </p>
        </div>
      )}
    </div>
  );
}
