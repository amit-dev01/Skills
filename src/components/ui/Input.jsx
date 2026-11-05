import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(
  ({ className, type = "text", error, icon: Icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm px-3.5 py-2.5 transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed",
            Icon && "pl-10",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm p-3.5 transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[90px]",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
