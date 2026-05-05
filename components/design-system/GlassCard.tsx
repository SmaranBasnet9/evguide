import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "dark" | "light" | "brand";
  hover?: boolean;
  glow?: boolean;
}

export default function GlassCard({
  variant = "dark",
  hover = false,
  glow = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] transition-all duration-300",
        variant === "dark" && "glass",
        variant === "light" && "glass-light",
        variant === "brand" && [
          "glass border-brand/20",
          glow && "glow-brand-sm",
        ],
        hover && [
          "hover:-translate-y-1",
          "hover:border-brand/30",
          glow ? "hover:glow-brand" : "hover:shadow-[0_24px_60px_rgba(0,0,0,0.22)]",
        ],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
