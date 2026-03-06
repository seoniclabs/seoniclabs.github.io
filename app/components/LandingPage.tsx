"use client";

import { getSiteCopy } from "../site-copy";
import type { Locale } from "../site-copy";
import { Header } from "./landing/Header";
import { Hero } from "./landing/Hero";
import { DashboardPreview } from "./landing/DashboardPreview";
import { FeatureSection } from "./landing/FeatureSection";
import { OpenSource } from "./landing/OpenSource";
import { FinalCta } from "./landing/FinalCta";
import { Footer } from "./landing/Footer";
import styles from "../page.module.css";

export function LandingPage({ locale }: { locale: string }) {
  const copy = getSiteCopy(locale);

  return (
    <div className={styles.page} lang={copy.lang}>
      <Header locale={locale as Locale} copy={copy} />
      <main className={styles.main}>
        <Hero locale={locale as Locale} copy={copy.hero} />
        <DashboardPreview id="preview" copy={copy.surfaces} />
        <OpenSource id="open-source" copy={copy.openSource} />
        <FeatureSection id="roadmap" copy={copy.roadmap} />
        <FinalCta locale={locale as Locale} copy={copy.finalCta} />
      </main>
      <Footer locale={locale as Locale} copy={copy.footer} />
    </div>
  );
}
