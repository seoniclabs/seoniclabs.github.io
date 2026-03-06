"use client";

import Link from "next/link";
import { GITHUB_URL } from "../../config";
import { getLocaleHref, type Locale } from "../../site-copy";
import { FadeIn } from "./FadeIn";
import { WordFadeIn } from "./WordFadeIn";
import styles from "../../page.module.css";

type FinalCtaCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  primary: string;
  secondary: string;
  points: {
    title: string;
    body: string;
  }[];
};

export function FinalCta({
  locale,
  copy,
}: {
  locale: Locale;
  copy: FinalCtaCopy;
}) {
  return (
    <section className={styles.finalCtaSection}>
      <div className={styles.finalCtaCard}>
        <div className={styles.finalCtaGrid}>
          <div className={styles.finalCtaCopy}>
            <FadeIn delay={0.02} distance={6} blur={2} duration={0.24}>
              <span className={styles.finalCtaEyebrow}>{copy.eyebrow}</span>
            </FadeIn>
            <h2 className={styles.finalCtaTitle}>
              <WordFadeIn
                text={copy.title}
                delay={0.06}
                stagger={0.045}
                duration={0.38}
              />
            </h2>
            <FadeIn
              delay={0.16}
              direction="none"
              blur={2}
              distance={0}
              duration={0.28}
            >
              <p className={styles.finalCtaLead}>{copy.lead}</p>
            </FadeIn>

            <FadeIn
              delay={0.26}
              distance={12}
              blur={2}
              scale={0.995}
              duration={0.3}
            >
              <div className={styles.finalCtaActions}>
                <Link
                  href={getLocaleHref(locale, "/docs")}
                  className={styles.btnPrimary}
                >
                  {copy.primary}
                </Link>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnSecondary}
                >
                  {copy.secondary}
                </a>
              </div>
            </FadeIn>
          </div>

          <div className={styles.finalCtaPoints}>
            {copy.points.map((point, index) => (
              <FadeIn
                key={point.title}
                delay={0.12 + index * 0.06}
                duration={0.28}
                distance={12}
                blur={2}
                scale={0.995}
              >
                <div className={styles.finalCtaPoint}>
                  <h3 className={styles.finalCtaPointTitle}>{point.title}</h3>
                  <p className={styles.finalCtaPointBody}>{point.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
