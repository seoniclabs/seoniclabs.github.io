import Image from "next/image";
import Link from "next/link";
import { getLocaleHref, type Locale } from "../../site-copy";
import styles from "../../page.module.css";

type FooterCopy = {
  eyebrow: string;
  summary: string;
  stamp: string;
  links: {
    name: string;
    href: string;
    note: string;
  }[];
};

function getHostLabel(href: string) {
  return new URL(href).hostname.replace(/^www\./, "");
}

export function Footer({
  locale,
  copy,
}: {
  locale: Locale;
  copy: FooterCopy;
}) {
  const homeHref = getLocaleHref(locale);
  const docsHref = getLocaleHref(locale, "/docs");
  const labels =
    locale === "ko"
      ? {
          home: "홈",
          docs: "문서",
          explore: "둘러보기",
          network: "관련 서비스",
        }
      : {
          home: "Home",
          docs: "Docs",
          explore: "Explore",
          network: "From MSUB",
        };

  const siteLinks = [
    { label: labels.home, href: homeHref },
    { label: labels.docs, href: docsHref },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerIntro}>
          <Image
            src="/logo-transparent.svg"
            alt="Seonic"
            width={36}
            height={36}
            className={styles.footerLogo}
          />
          <span className={styles.footerEyebrow}>{copy.eyebrow}</span>
          <p className={styles.footerSummary}>{copy.summary}</p>
          <p className={styles.footerStamp}>{copy.stamp}</p>
        </div>

        <div className={styles.footerColumns}>
          <div className={styles.footerColumn}>
            <span className={styles.footerSectionTitle}>{labels.explore}</span>
            <nav
              className={styles.footerNavList}
              aria-label={labels.explore}
            >
              {siteLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.footerNavLink}
                >
                  <span className={styles.footerNavLabel}>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className={styles.footerColumn}>
            <span className={styles.footerSectionTitle}>{labels.network}</span>
            <div className={styles.footerExternalList}>
              {copy.links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerExternalLink}
                >
                  <div className={styles.footerExternalCopy}>
                    <span className={styles.footerExternalName}>
                      {link.name}
                    </span>
                    <span className={styles.footerExternalNote}>
                      {link.note}
                    </span>
                  </div>
                  <span className={styles.footerExternalHost}>
                    {getHostLabel(link.href)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
