import React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md text-slate-100 shadow-sm",
        hover &&
          "transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-900/85 hover:shadow-xl hover:shadow-blue-950/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("p-6 pb-4 flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold text-slate-100 leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn("p-6 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
