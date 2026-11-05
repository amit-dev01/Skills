"use client";

import React, { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useApp } from "@/context/AppContext";
import { Sparkles, BarChart2 } from "lucide-react";

export function SkillMatchChart() {
  const { userProfile } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Map user skills to chart metrics
  const skills = userProfile.skills || ["React", "JavaScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Next.js"];

  const chartData = [
    { subject: skills[0] || "React", userScore: 92, benchmark: 95, fullMark: 100 },
    { subject: skills[1] || "JavaScript", userScore: 88, benchmark: 90, fullMark: 100 },
    { subject: skills[2] || "Next.js", userScore: 85, benchmark: 85, fullMark: 100 },
    { subject: skills[3] || "Tailwind", userScore: 95, benchmark: 80, fullMark: 100 },
    { subject: skills[4] || "Node.js", userScore: 78, benchmark: 88, fullMark: 100 },
    { subject: skills[5] || "PostgreSQL", userScore: 72, benchmark: 82, fullMark: 100 },
  ];

  if (!mounted) {
    return (
      <div className="h-64 rounded-2xl bg-[#0d1527]/60 border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
        Loading skill compatibility analytics...
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Skill Compatibility Index</h3>
            <p className="text-[11px] text-slate-400">Your proficiency vs. active market demand</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-300">Your Skills</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500/60" />
            <span className="text-slate-400">Target Benchmark</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64 my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#1e2c4d" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="#1e2c4d"
              tick={{ fill: "#64748b", fontSize: 9 }}
            />
            <Radar
              name="Your Skills"
              dataKey="userScore"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.45}
            />
            <Radar
              name="Target Benchmark"
              dataKey="benchmark"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0d1527",
                borderColor: "#1e2c4d",
                borderRadius: "12px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>Target Role: <strong className="text-slate-200">{userProfile.preferredRoles?.[0] || "Frontend Engineer"}</strong></span>
        <span className="text-emerald-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> 89% Competitive Match
        </span>
      </div>
    </div>
  );
}
