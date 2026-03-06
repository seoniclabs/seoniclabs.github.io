"use client";

import Link from "next/link";
import { GITHUB_URL } from "../../config";
import { getLocaleHref, type Locale } from "../../site-copy";
import { WordFadeIn } from "./WordFadeIn";
import { FadeIn } from "./FadeIn";
import styles from "../../page.module.css";

type HeroCopy = {
  kicker: string;
  title: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export function Hero({ locale, copy }: { locale: Locale; copy: HeroCopy }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} />

      <div className={styles.heroContent}>
        <FadeIn delay={0.02} distance={6} blur={2} duration={0.28}>
          <span className={styles.kicker}>{copy.kicker}</span>
        </FadeIn>

        <h1 className={styles.heroTitle}>
          <WordFadeIn
            text={copy.title}
            delay={0.08}
            stagger={0.11}
            duration={0.7}
            distance={18}
            blur={8}
          />
        </h1>

        <FadeIn delay={0.42} distance={12} blur={3} duration={0.34}>
          <p className={styles.heroLead}>{copy.lead}</p>
        </FadeIn>

        <FadeIn
          delay={0.54}
          distance={14}
          blur={4}
          scale={0.99}
          duration={0.34}
        >
          <div className={styles.heroCtas}>
            <Link
              href={getLocaleHref(locale, "/docs")}
              className={styles.btnPrimary}
            >
              {copy.ctaPrimary}
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              {copy.ctaSecondary}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
