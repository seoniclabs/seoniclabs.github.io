"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  fullWidth?: boolean;
  fillHeight?: boolean;
  className?: string;
  distance?: number;
  duration?: number;
  blur?: number;
  scale?: number;
  once?: boolean;
  amount?: number;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  fullWidth = false,
  fillHeight = false,
  className = "",
  distance = 12,
  duration = 0.46,
  blur = 3,
  scale = 0.992,
  once = true,
  amount = 0.16,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  const offset = shouldReduceMotion ? 0 : distance;
  const blurValue = shouldReduceMotion ? 0 : blur;
  const scaleValue = shouldReduceMotion ? 1 : scale;
  const directions = {
    up: { y: offset, x: 0 },
    down: { y: -offset, x: 0 },
    left: { x: offset, y: 0 },
    right: { x: -offset, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: shouldReduceMotion ? 1 : 0,
        scale: scaleValue,
        filter: `blur(${blurValue}px)`,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{ once, margin: "-40px", amount }}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        ease: [0.21, 0.47, 0.32, 0.98],
        delay: shouldReduceMotion ? 0 : delay,
      }}
      style={{
        width: fullWidth ? "100%" : undefined,
        height: fillHeight ? "100%" : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}
