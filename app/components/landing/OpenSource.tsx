"use client";

import { FadeIn } from "./FadeIn";
import { WordFadeIn } from "./WordFadeIn";
import styles from "../../page.module.css";

type OpenSourceCopy = {
  number: string;
  label: string;
  title: string;
  lead: string;
  principles: { text: string }[];
};

export function OpenSource({ id, copy }: { id: string; copy: OpenSourceCopy }) {
  return (
    <section id={id} className={styles.ctaSection}>
      <div className={styles.ctaCard}>
        <div className={styles.sectionHeader}>
          <FadeIn delay={0.01} distance={6} blur={2} duration={0.24}>
            <span className={styles.sectionNumber}>
              <span className={styles.sectionNumberDot} />
              {copy.number} — {copy.label}
            </span>
          </FadeIn>
          <h2 className={styles.ctaTitle}>
            <WordFadeIn
              text={copy.title}
              delay={0.05}
              stagger={0.045}
              duration={0.38}
            />
          </h2>
          <FadeIn
            delay={0.14}
            direction="none"
            blur={2}
            distance={0}
            duration={0.28}
          >
            <p className={styles.ctaLead}>{copy.lead}</p>
          </FadeIn>
        </div>

        <div className={styles.principleList}>
          {copy.principles.map((p, i) => (
            <FadeIn
              key={i}
              delay={0.14 + i * 0.05}
              duration={0.3}
              distance={12}
              blur={2}
            >
              <div className={styles.principleItem}>
                <span className={styles.principleNumber}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.principleText}>{p.text}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
