"use client";

import { FadeIn } from "./FadeIn";
import { WordFadeIn } from "./WordFadeIn";
import styles from "../../page.module.css";

type RoadmapCopy = {
  number: string;
  label: string;
  title: string;
  lead: string;
  items: { phase: string; title: string; body: string }[];
};

export function FeatureSection({
  id,
  copy,
}: {
  id: string;
  copy: RoadmapCopy;
}) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.roadmapLayout}>
        <div className={styles.roadmapLeft}>
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
        <div className={styles.roadmapRight}>
          <div className={styles.roadmapTimeline}>
            {copy.items.map((item, i) => (
              <FadeIn
                key={item.title}
                delay={0.08 + i * 0.07}
                duration={0.3}
                distance={14}
                blur={2}
              >
                <div className={styles.roadmapItem}>
                  <div className={styles.roadmapCard}>
                    <span className={styles.roadmapPhase}>{item.phase}</span>
                    <h3 className={styles.roadmapTitle}>{item.title}</h3>
                    <p className={styles.roadmapBody}>{item.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
