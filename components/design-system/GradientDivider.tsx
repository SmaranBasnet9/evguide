import { cn } from "@/lib/utils";

interface GradientDividerProps {
  className?: string;
  color?: "brand" | "white" | "muted";
}

export default function GradientDivider({ className, color = "brand" }: GradientDividerProps) {
  const gradient = {
    brand: "from-transparent via-brand/60 to-transparent",
    white: "from-transparent via-gray-300 to-transparent",
    muted:  "from-transparent via-gray-200 to-transparent",
  }[color];

  return (
    <div
      className={cn("h-px w-full bg-gradient-to-r", gradient, className)}
      aria-hidden
    />
  );
}
