"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { WordFadeIn } from "./WordFadeIn";
import styles from "../../page.module.css";

type SurfacesCopy = {
  number: string;
  label: string;
  title: string;
  lead: string;
  cards: { title: string; body: string }[];
};

export function DashboardPreview({
  id,
  copy,
}: {
  id: string;
  copy: SurfacesCopy;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const mockupScale = useTransform(scrollYProgress, [0, 0.2], [0.85, 1]);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const mockupY = useTransform(scrollYProgress, [0, 0.12], [24, 0]);

  if (isMobile) {
    return (
      <section id={id} className={styles.previewSection} ref={sectionRef}>
        <div className={styles.previewMobileInner}>
          <div className={`${styles.sectionHeader} ${styles.previewMobileHeader}`}>
            <FadeIn delay={0.01} distance={6} blur={2} duration={0.24}>
              <span className={styles.sectionNumber}>
                <span className={styles.sectionNumberDot} />
                {copy.number} — {copy.label}
              </span>
            </FadeIn>
            <h2 className={styles.sectionTitle}>
              <WordFadeIn
                text={copy.title}
                delay={0.04}
                stagger={0.045}
                duration={0.36}
              />
            </h2>
            <FadeIn
              delay={0.12}
              direction="none"
              blur={2}
              distance={0}
              duration={0.28}
            >
              <p className={styles.sectionLead}>{copy.lead}</p>
            </FadeIn>
          </div>
          <FadeIn
            delay={0.18}
            distance={16}
            blur={4}
            scale={0.992}
            duration={0.38}
          >
            <div className={`${styles.mockupContainer} ${styles.previewMobileMockup}`}>
              <Mockup />
            </div>
          </FadeIn>
          <div className={styles.previewMobileCards}>
            {copy.cards.map((card, i) => (
              <FadeIn
                key={card.title}
                delay={0.1 + i * 0.05}
                duration={0.3}
                distance={12}
                blur={2}
              >
                <div className={styles.featureCard}>
                  <span className={styles.featureCardNumber}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.featureCardTitle}>{card.title}</h3>
                  <p className={styles.featureCardBody}>{card.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={styles.previewSection} ref={sectionRef}>
      <div className={styles.previewInner}>
        {/* Left: sticky mockup with scroll-driven scale */}
        <div className={styles.previewLeft}>
          <div className={styles.previewSticky}>
            <div className={styles.previewStickyHeader}>
              <FadeIn delay={0.01} distance={6} blur={2} duration={0.24}>
                <span className={styles.sectionNumber}>
                  <span className={styles.sectionNumberDot} />
                  {copy.number} — {copy.label}
                </span>
              </FadeIn>
              <h2 className={styles.sectionTitle}>
                <WordFadeIn
                  text={copy.title}
                  delay={0.04}
                  stagger={0.045}
                  duration={0.36}
                />
              </h2>
              <FadeIn
                delay={0.14}
                direction="none"
                blur={2}
                distance={0}
                duration={0.28}
              >
                <p className={styles.sectionLead}>{copy.lead}</p>
              </FadeIn>
            </div>

            <motion.div
              className={styles.mockupContainer}
              style={{ scale: mockupScale, opacity: mockupOpacity, y: mockupY }}
            >
              <Mockup />
            </motion.div>
          </div>
        </div>

        {/* Right: feature cards that scroll */}
        <div className={styles.previewRight}>
          {copy.cards.map((card, i) => (
            <FeatureCard
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

function FeatureCard({
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
  const segment = 0.62 / Math.max(total, 1);
  const rangeStart = 0.14 + index * segment;
  const rangeEnd = Math.min(0.92, rangeStart + segment * 0.72);

  const scale = useTransform(
    scrollYProgress,
    [rangeStart, rangeEnd],
    [1, index < total - 1 ? 0.97 : 1],
  );
  const revealStart = Math.max(0, rangeStart - 0.08);
  const opacity = useTransform(
    scrollYProgress,
    [revealStart, rangeStart, rangeEnd],
    [0.65, 1, 1],
  );
  const y = useTransform(scrollYProgress, [revealStart, rangeStart], [16, 0]);

  return (
    <motion.div
      className={styles.featureCard}
      style={{
        scale,
        opacity,
        y,
        top: `calc(50vh - 80px + ${index * 8}px)`,
        position: "sticky",
        zIndex: index,
      }}
    >
      <span className={styles.featureCardNumber}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className={styles.featureCardTitle}>{card.title}</h3>
      <p className={styles.featureCardBody}>{card.body}</p>
    </motion.div>
  );
}

function Mockup() {
  return (
    <div className={styles.mockup}>
      <div className={styles.mockupBar}>
        <span className={styles.mockupDot} style={{ background: "#ff5f57" }} />
        <span className={styles.mockupDot} style={{ background: "#febc2e" }} />
        <span className={styles.mockupDot} style={{ background: "#28c840" }} />
        <span className={styles.mockupUrl}>localhost:6200</span>
      </div>
      <div className={styles.mockupBody}>
        <aside className={styles.mockupSidebar}>
          <div className={styles.mockupSidebarBrand}>
            <Image
              src="/logo-transparent.svg"
              alt="Seonic"
              width={22}
              height={22}
              className={styles.brandMark}
            />
            <span>Seonic</span>
          </div>
          <nav className={styles.mockupNav}>
            <div className={styles.mockupNavItem} style={{ opacity: 1 }}>Overview</div>
            <div className={styles.mockupNavItem}>Map</div>
            <div className={styles.mockupNavItem}>Sitemap</div>
            <div className={styles.mockupNavItem}>Feed</div>
          </nav>
          <div className={styles.mockupRouteTree}>
            <div className={styles.mockupRoute}>
              <span className={styles.mockupRouteDot} style={{ background: "#28c840" }} />
              /
            </div>
            <div className={styles.mockupRoute}>
              <span className={styles.mockupRouteDot} style={{ background: "#febc2e" }} />
              /pricing
            </div>
            <div className={styles.mockupRoute}>
              <span className={styles.mockupRouteDot} style={{ background: "#b7f522" }} />
              /blog/[slug]
            </div>
            <div className={styles.mockupRoute}>
              <span className={styles.mockupRouteDot} style={{ background: "#d4e522" }} />
              /docs
            </div>
          </div>
        </aside>
        <div className={styles.mockupContent}>
          <div className={styles.mockupCards}>
            <div className={styles.mockupCard}>
              <span className={styles.mockupCardLabel}>Total Routes</span>
              <span className={styles.mockupCardValue}>12</span>
            </div>
            <div className={styles.mockupCard}>
              <span className={styles.mockupCardLabel}>Avg Score</span>
              <span className={styles.mockupCardValue}>87</span>
            </div>
            <div className={styles.mockupCard}>
              <span className={styles.mockupCardLabel}>Warnings</span>
              <span className={styles.mockupCardValue}>3</span>
            </div>
            <div className={styles.mockupCard}>
              <span className={styles.mockupCardLabel}>Issues</span>
              <span className={styles.mockupCardValue}>1</span>
            </div>
          </div>
          <div className={styles.mockupRouteList}>
            <div className={styles.mockupRouteRow}>
              <span className={styles.mockupRoutePath}>/</span>
              <span className={styles.mockupScore}>
                <span className={styles.mockupScoreBar}>
                  <span className={styles.mockupScoreBarFill} style={{ width: "95%", background: "#28c840" }} />
                </span>
                95
              </span>
            </div>
            <div className={styles.mockupRouteRow}>
              <span className={styles.mockupRoutePath}>/pricing</span>
              <span className={styles.mockupScore}>
                <span className={styles.mockupScoreBar}>
                  <span className={styles.mockupScoreBarFill} style={{ width: "72%", background: "#febc2e" }} />
                </span>
                72
              </span>
            </div>
            <div className={styles.mockupRouteRow}>
              <span className={styles.mockupRoutePath}>/blog/[slug]</span>
              <span className={styles.mockupScore}>
                <span className={styles.mockupScoreBar}>
                  <span className={styles.mockupScoreBarFill} style={{ width: "88%", background: "#28c840" }} />
                </span>
                88
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
