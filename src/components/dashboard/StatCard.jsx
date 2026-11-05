import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
  onClick,
}) {
  const colorStyles = {
    blue: {
      iconBg: "bg-blue-600/10 text-blue-400 border-blue-500/20",
      borderGlow: "hover:border-blue-500/40",
      accent: "text-blue-400",
    },
    emerald: {
      iconBg: "bg-emerald-600/10 text-emerald-400 border-emerald-500/20",
      borderGlow: "hover:border-emerald-500/40",
      accent: "text-emerald-400",
    },
    violet: {
      iconBg: "bg-purple-600/10 text-purple-400 border-purple-500/20",
      borderGlow: "hover:border-purple-500/40",
      accent: "text-purple-400",
    },
    amber: {
      iconBg: "bg-amber-600/10 text-amber-400 border-amber-500/20",
      borderGlow: "hover:border-amber-500/40",
      accent: "text-amber-400",
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 sm:p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md transition-all duration-300 relative group overflow-hidden",
        style.borderGlow,
        onClick && "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40"
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center border",
            style.iconBg
          )}
        >
          <Icon className="w-5 h-5" />
        </div>

        {onClick && (
          <div className="text-slate-500 group-hover:text-slate-200 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3.5">
        <span className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          {value}
        </span>
        <h4 className="text-xs font-medium text-slate-400 mt-0.5">{title}</h4>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 truncate">{subtitle}</span>
        {trend && <span className={cn("font-medium shrink-0", style.accent)}>{trend}</span>}
      </div>
    </div>
  );
}
