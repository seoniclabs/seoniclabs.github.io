"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GITHUB_URL } from "../../config";
import type { Locale } from "../../site-copy";
import {
  getLocaleHref,
  getLocaleSwitchHref,
  getLocalizedBasePath,
} from "../../site-copy";
import styles from "../../page.module.css";

type SiteCopy = ReturnType<typeof import("../../site-copy").getSiteCopy>;
const DETACH_THRESHOLD = 24;
const REATTACH_THRESHOLD = 8;

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={styles.githubIcon}
    >
      <path
        d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.52v-1.82c-2.94.64-3.56-1.24-3.56-1.24-.48-1.22-1.18-1.54-1.18-1.54-.96-.66.07-.64.07-.64 1.06.08 1.62 1.08 1.62 1.08.94 1.62 2.46 1.15 3.06.88.1-.68.37-1.15.66-1.41-2.35-.27-4.82-1.18-4.82-5.26 0-1.16.41-2.11 1.08-2.86-.11-.27-.47-1.36.1-2.83 0 0 .89-.28 2.91 1.09a9.96 9.96 0 0 1 5.29 0c2.02-1.37 2.91-1.09 2.91-1.09.57 1.47.21 2.56.1 2.83.68.75 1.08 1.7 1.08 2.86 0 4.09-2.48 4.98-4.84 5.24.38.33.72.99.72 2v2.96c0 .29.19.63.73.52A10.5 10.5 0 0 0 12 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Header({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  const [isDetached, setIsDetached] = useState(false);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    let frame = 0;

    const commitDetached = () => {
      frame = 0;
      const scrollTop = window.scrollY;

      setIsDetached((current) =>
        current
          ? scrollTop > REATTACH_THRESHOLD
          : scrollTop > DETACH_THRESHOLD
      );
    };

    const scheduleSync = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(commitDetached);
      }
    };

    commitDetached();

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, []);

  const headerStyle = {
    "--header-progress": isDetached ? "1" : "0",
  } as CSSProperties;
  const docsHref = getLocaleHref(locale, "/docs");
  const localizedBasePath = getLocalizedBasePath(pathname);
  const isDocsPage =
    localizedBasePath === "/docs" || localizedBasePath.startsWith("/docs/");
  const englishHref = getLocaleSwitchHref("en", pathname);
  const koreanHref = getLocaleSwitchHref("ko", pathname);

  return (
    <header className={styles.header} style={headerStyle}>
      <div className={styles.headerInner}>
        <Link href={getLocaleHref(locale)} className={styles.brand}>
          <Image src="/logo-transparent.svg" alt="Seonic" width={28} height={28} className={styles.brandMark} />
          <span className={styles.brandText}>Seonic</span>
        </Link>

        <div className={styles.headerRight}>
          <Link
            href={docsHref}
            className={`${styles.docsLink} ${isDocsPage ? styles.docsLinkActive : ""}`}
          >
            {copy.header.nav.docs}
          </Link>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            <GitHubIcon />
            <span className={styles.githubLabel}>GitHub</span>
          </a>

          <div
            className={styles.localeSwitch}
            role="group"
            aria-label={copy.header.language}
          >
            <Link
              href={englishHref}
              className={`${styles.localeLink} ${locale === "en" ? styles.localeActive : ""}`}
            >
              EN
            </Link>
            <Link
              href={koreanHref}
              className={`${styles.localeLink} ${locale === "ko" ? styles.localeActive : ""}`}
            >
              KO
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
