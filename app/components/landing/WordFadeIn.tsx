"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";

interface WordFadeInProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  distance?: number;
  blur?: number;
  once?: boolean;
}

export function WordFadeIn({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  duration = 0.42,
  distance = 8,
  blur = 3,
  once = true,
}: WordFadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  const lines = text.split("\n");

  const container: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : stagger,
        delayChildren: shouldReduceMotion ? 0 : delay,
      },
    },
  };

  const item: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : distance,
      filter: `blur(${shouldReduceMotion ? 0 : blur}px)`,
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <motion.span
      variants={container}
      initial={shouldReduceMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once, margin: "-40px" }}
      className={className}
      style={{ display: "inline-block" }}
    >
      {lines.map((line, lineIndex) => (
        <span key={`${line}-${lineIndex}`} style={{ display: "block" }}>
          {line.split(/\s+/).map((word, wordIndex, words) => (
            <motion.span
              key={`${word}-${lineIndex}-${wordIndex}`}
              variants={item}
              style={{
                display: "inline-block",
                paddingRight: wordIndex < words.length - 1 ? "0.25em" : 0,
              }}
            >
              {word}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}
