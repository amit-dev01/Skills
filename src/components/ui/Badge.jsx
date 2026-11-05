import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, variant = "default", className, ...props }) {
  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-700/60",
    primary: "bg-blue-950/70 text-blue-300 border-blue-500/30",
    violet: "bg-purple-950/70 text-purple-300 border-purple-500/30",
    cyan: "bg-cyan-950/70 text-cyan-300 border-cyan-500/30",
    emerald: "bg-emerald-950/70 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-950/70 text-amber-300 border-amber-500/30",
    rose: "bg-rose-950/70 text-rose-300 border-rose-500/30",
    outline: "bg-transparent text-slate-400 border-slate-700/80 hover:text-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
