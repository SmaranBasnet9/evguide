"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BatteryCharging, Zap, PoundSterling, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EVSpotlightStat {
  label: string;
  value: string;
  icon: React.ElementType;
}

export interface EVSpotlightCardProps {
  brand: string;
  model: string;
  tagline: string;
  backgroundImage?: string;
  accentColor?: string;
  stats: EVSpotlightStat[];
  className?: string;
}

const DEFAULT_STATS: EVSpotlightStat[] = [
  { label: "Real-world range", value: "350 km", icon: Gauge },
  { label: "Rapid charge", value: "22 min", icon: Zap },
  { label: "Monthly est.", value: "£389/mo", icon: PoundSterling },
  { label: "Battery", value: "77 kWh", icon: BatteryCharging },
];

export function GlassmorphismStatisticsCard({
  brand,
  model,
  tagline,
  backgroundImage,
  accentColor = "#1FBF9F",
  stats = DEFAULT_STATS,
  className,
}: EVSpotlightCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "group relative aspect-[3/4] w-full cursor-default overflow-hidden rounded-[2rem] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_60px_rgba(0,0,0,0.5)] transition-shadow duration-500 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_32px_80px_rgba(0,0,0,0.7)]",
        className,
      )}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={false}
    >
      {/* Background */}
      {backgroundImage ? (
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt={`${brand} ${model}`}
            className="h-full w-full object-cover"
          />
        </motion.div>
      ) : (
        /* Gradient placeholder when no image */
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 60% 40%, ${accentColor}30 0%, #0A0A0A 70%)`,
          }}
        >
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      )}

      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Corner glows */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-90"
        style={{ backgroundColor: `${accentColor}35` }}
      />
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full blur-2xl opacity-30 transition-opacity duration-500 group-hover:opacity-60"
        style={{ backgroundColor: `${accentColor}20` }}
      />

      {/* Top label */}
      <div className="absolute left-5 top-5 z-10">
        <span
          className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide"
          style={{
            borderColor: `${accentColor}40`,
            backgroundColor: `${accentColor}18`,
            color: accentColor,
          }}
        >
          <Zap className="mr-1.5 h-3 w-3" />
          EV Spotlight
        </span>
      </div>

      {/* Default state — model name */}
      <AnimatePresence>
        {!hovered && (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 left-5 right-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
              {brand}
            </p>
            <h3 className="mt-1.5 text-3xl font-semibold text-white">{model}</h3>
            <p className="mt-2 text-sm text-white/50">{tagline}</p>
            <p
              className="mt-4 text-xs font-medium"
              style={{ color: accentColor }}
            >
              Hover to see specs →
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover state — glassmorphism stats overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-x-4 bottom-4 z-10 rounded-[1.5rem] border border-white/12 bg-black/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl"
          >
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
              {brand} {model}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="rounded-xl border border-white/10 bg-white/[0.08] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className="h-3.5 w-3.5"
                        style={{ color: accentColor }}
                      />
                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                        {stat.label}
                      </p>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {stat.value}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
