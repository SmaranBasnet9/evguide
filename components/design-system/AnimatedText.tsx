"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  mode?: "words" | "chars" | "lines";
}

const container = (stagger: number) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const wordVariant = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
};

const lineVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export default function AnimatedText({
  text,
  as: Tag = "p",
  className,
  delay = 0,
  stagger = 0.07,
  mode = "words",
}: AnimatedTextProps) {
  if (mode === "lines") {
    return (
      <motion.div
        variants={lineVariant}
        initial="hidden"
        animate="visible"
        transition={{ delay }}
      >
        <Tag className={className}>{text}</Tag>
      </motion.div>
    );
  }

  const items = mode === "words" ? text.split(" ") : text.split("");

  return (
    <Tag className={cn("overflow-hidden", className)}>
      <motion.span
        className="inline"
        variants={container(stagger)}
        initial="hidden"
        animate="visible"
        transition={{ delayChildren: delay }}
      >
        {items.map((item, i) => (
          <motion.span
            key={i}
            variants={wordVariant}
            className="inline-block"
            style={mode === "words" ? { marginRight: "0.25em" } : undefined}
          >
            {item}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
