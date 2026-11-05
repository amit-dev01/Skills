import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  isLoading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 border border-blue-400/30 active:scale-[0.98]",
    secondary:
      "bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 active:scale-[0.98]",
    violet:
      "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 border border-purple-400/30 active:scale-[0.98]",
    outline:
      "bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600 active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-100 border border-transparent",
    danger:
      "bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 active:scale-[0.98]",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5",
    icon: "p-2 aspect-square",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
