import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article";
  inner?: string;
  tight?: boolean;
}

export default function SectionWrapper({
  as: Tag = "section",
  inner,
  tight = false,
  className,
  children,
  ...props
}: SectionWrapperProps) {
  return (
    <Tag
      className={cn(tight ? "py-16 lg:py-20" : "py-24 lg:py-32", className)}
      {...props}
    >
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", inner)}>
        {children}
      </div>
    </Tag>
  );
}
