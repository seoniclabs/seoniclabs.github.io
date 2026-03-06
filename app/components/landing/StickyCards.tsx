"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "./FadeIn";
import styles from "../../page.module.css";

type SurfacesCopy = {
  number: string;
  label: string;
  title: string;
  lead: string;
  cards: { title: string; body: string }[];
};

export function StickyCards({ id, copy }: { id: string; copy: SurfacesCopy }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  if (isMobile) {
    return (
      <section id={id} className={styles.section}>
        <FadeIn>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>
              <span className={styles.sectionNumberDot} />
              {copy.number} — {copy.label}
            </span>
            <h2 className={styles.sectionTitle}>{copy.title}</h2>
            <p className={styles.sectionLead}>{copy.lead}</p>
          </div>
        </FadeIn>
        {copy.cards.map((card, i) => (
          <FadeIn key={card.title} delay={i * 0.1}>
            <div className={styles.stickyCard} style={{ position: "relative" }}>
              <span className={styles.stickyCardNumber}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.stickyCardTitle}>{card.title}</h3>
              <p className={styles.stickyCardBody}>{card.body}</p>
            </div>
          </FadeIn>
        ))}
      </section>
    );
  }

  return (
    <section id={id} className={styles.section} ref={containerRef}>
      <div className={styles.stickyContainer}>
        <div className={styles.stickyLeft}>
          <FadeIn>
            <span className={styles.sectionNumber}>
              <span className={styles.sectionNumberDot} />
              {copy.number} — {copy.label}
            </span>
            <h2 className={styles.sectionTitle}>{copy.title}</h2>
            <p className={styles.sectionLead}>{copy.lead}</p>
          </FadeIn>
        </div>

        <div className={styles.stickyRight}>
          {copy.cards.map((card, i) => (
            <StickyCard
              key={card.title}
              card={card}
              index={i}
              total={copy.cards.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StickyCard({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: { title: string; body: string };
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const rangeStart = (index + 0.5) / total;
  const rangeEnd = (index + 1) / total;

  const scale = useTransform(
    scrollYProgress,
    [rangeStart, rangeEnd],
    [1, index < total - 1 ? 0.97 : 1],
  );

  return (
    <motion.div
      className={styles.stickyCard}
      style={{
        scale,
        top: `calc(50vh - 100px + ${index * 8}px)`,
        position: "sticky",
        zIndex: index,
      }}
    >
      <span className={styles.stickyCardNumber}>{String(index + 1).padStart(2, "0")}</span>
      <h3 className={styles.stickyCardTitle}>{card.title}</h3>
      <p className={styles.stickyCardBody}>{card.body}</p>
    </motion.div>
  );
}
