import Link from "next/link";
import { DocsCodeBlock } from "./docs/DocsCodeBlock";
import { Footer } from "./landing/Footer";
import { Header } from "./landing/Header";
import {
  getLocaleHref,
  getSiteCopy,
  type Locale,
} from "../site-copy";
import {
  getDocsUiCopy,
  type DocsAction,
  type DocsContentBlock,
  type DocsDocument,
  type DocsNavigationGroup,
  type DocsSection,
} from "../docs-source";
import styles from "../docs.module.css";

type TocChildItem = {
  id: string;
  title: string;
  level: 3 | 4;
};

type TocItem = {
  id: string;
  title: string;
  children: TocChildItem[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getHeadingId(sectionId: string, title: string, id?: string) {
  return id ?? `${sectionId}-${slugify(title)}`;
}

function getTocItems(sections: DocsSection[]): TocItem[] {
  return sections.map((section) => {
    const children = section.blocks.flatMap((block) => {
      if (block.type !== "heading") {
        return [];
      }

      return {
        id: getHeadingId(section.id, block.title, block.id),
        title: block.title,
        level: block.level,
      } satisfies TocChildItem;
    });

    return {
      id: section.id,
      title: section.title,
      children,
    } satisfies TocItem;
  });
}

function isExternalHref(href: string) {
  return /^[a-z][a-z0-9+.-]*:/.test(href);
}

function resolveActionHref(locale: Locale, href: string) {
  if (href.startsWith("#") || isExternalHref(href)) {
    return href;
  }

  return getLocaleHref(locale, href.startsWith("/") ? href : `/${href}`);
}

function ActionLink({
  action,
  locale,
  className,
}: {
  action: DocsAction;
  locale: Locale;
  className: string;
}) {
  const href = resolveActionHref(locale, action.href);
  const external = action.external ?? isExternalHref(action.href);

  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {action.label}
      </a>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {action.label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {action.label}
    </Link>
  );
}

function RichText({
  as: Tag = "p",
  className,
  html,
}: {
  as?: "p" | "div" | "li";
  className: string;
  html: string;
}) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function DocsBlock({
  block,
  sectionId,
  activeLocale,
}: {
  block: DocsContentBlock;
  sectionId: string;
  activeLocale: Locale;
}) {
  switch (block.type) {
    case "paragraph":
      return <RichText className={styles.paragraph} html={block.content} />;
    case "heading": {
      const headingId = getHeadingId(sectionId, block.title, block.id);
      if (block.level === 4) {
        return (
          <h4 id={headingId} className={styles.subheadingMinor}>
            {block.title}
          </h4>
        );
      }

      return (
        <h3 id={headingId} className={styles.subheading}>
          {block.title}
        </h3>
      );
    }
    case "code":
      return (
        <DocsCodeBlock
          content={block.content}
          filename={block.filename}
          language={block.language}
          locale={activeLocale}
        />
      );
    case "list": {
      const ListTag = block.style === "ordered" ? "ol" : "ul";
      return (
        <ListTag
          className={
            block.style === "ordered"
              ? styles.orderedList
              : styles.unorderedList
          }
        >
          {block.items.map((item) => (
            <RichText
              key={item}
              as="li"
              className={styles.listItem}
              html={item}
            />
          ))}
        </ListTag>
      );
    }
    case "divider":
      return <hr className={styles.divider} />;
    case "callout":
      return (
        <section
          className={`${styles.callout} ${block.variant === "tip"
            ? styles.calloutTip
            : block.variant === "warning"
              ? styles.calloutWarning
              : styles.calloutInfo
            }`}
        >
          {block.title ? <h3>{block.title}</h3> : null}
          <RichText as="div" className={styles.calloutBody} html={block.content} />
        </section>
      );
    case "image":
      return (
        <figure className={styles.imageBlock}>
          <img src={block.src} alt={block.alt} className={styles.image} />
          {block.caption ? (
            <figcaption className={styles.imageCaption}>
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "steps":
      return (
        <div className={styles.stepGrid}>
          {block.items.map((item, index) => (
            <article key={`${item.title}-${index}`} className={styles.stepCard}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
              </div>
              <RichText as="div" className={styles.stepBody} html={item.body} />
              {item.code ? <DocsCodeBlock content={item.code} locale={activeLocale} /> : null}
            </article>
          ))}
        </div>
      );
    case "cardGrid":
      return (
        <div className={styles.cardGrid}>
          {block.items.map((item) => (
            <article key={item.title} className={styles.infoCard}>
              <h3>{item.title}</h3>
              <RichText as="div" className={styles.cardBody} html={item.body} />
            </article>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export function DocsPage({
  locale,
  doc,
  navigation,
}: {
  locale: string;
  doc: DocsDocument;
  navigation: DocsNavigationGroup[];
}) {
  const siteCopy = getSiteCopy(locale);
  const docsUiCopy = getDocsUiCopy(locale);
  const activeLocale = locale as Locale;
  const tocItems = getTocItems(doc.sections);

  return (
    <div className={styles.page} lang={doc.lang}>
      <Header locale={activeLocale} copy={siteCopy} />

      <main className={styles.main}>
        <div className={styles.shell}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarViewport}>
              <div className={styles.sidebarInner}>
                <div className={styles.sidebarIntro}>
                  <span className={styles.sidebarEyebrow}>
                    {docsUiCopy.sidebarEyebrow}
                  </span>
                  <h2>{docsUiCopy.sidebarTitle}</h2>
                  <p className={styles.sidebarSummaryText}>{docsUiCopy.sidebarSummary}</p>
                </div>

                <details className={styles.mobileNav} open>
                  <summary className={styles.mobileNavSummary}>
                    <span className={styles.mobileNavMenuText}>{docsUiCopy.sidebarTitle}</span>
                    <svg
                      className={styles.mobileNavIcon}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </summary>

                  <nav className={styles.sidebarNav}>
                    {navigation.map((group) => (
                      <section key={group.title} className={styles.navGroup}>
                        <span className={styles.navGroupLabel}>{group.title}</span>
                        <div className={styles.navItems}>
                          {group.items.map((item) => {
                            const isActive = item.slug === doc.slug;
                            const hasActiveChild = item.children.some(
                              (child) => child.slug === doc.slug
                            );
                            return (
                              <div key={item.slug} className={styles.navItemStack}>
                                <Link
                                  href={item.href}
                                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""
                                    } ${hasActiveChild ? styles.navItemBranchActive : ""
                                    }`}
                                >
                                  <span className={styles.navItemTitle}>
                                    {item.title}
                                  </span>
                                  {item.description ? (
                                    <span className={styles.navItemDescription}>
                                      {item.description}
                                    </span>
                                  ) : null}
                                </Link>

                                {item.children.length ? (
                                  <div className={styles.navChildren}>
                                    {item.children.map((child) => {
                                      const isChildActive = child.slug === doc.slug;

                                      return (
                                        <Link
                                          key={child.slug}
                                          href={child.href}
                                          className={`${styles.navChild} ${isChildActive ? styles.navChildActive : ""
                                            }`}
                                        >
                                          <span className={styles.navChildTitle}>
                                            {child.title}
                                          </span>
                                          {child.description ? (
                                            <span className={styles.navChildDescription}>
                                              {child.description}
                                            </span>
                                          ) : null}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    ))}
                  </nav>
                </details>
              </div>
            </div>
          </aside>

          <div className={styles.contentViewport}>
            <article className={styles.content}>
              <header className={styles.pageHeader}>
                <div className={styles.pageHeaderInner}>
                  <div className={styles.headerMeta}>
                    <span className={styles.eyebrow}>{doc.hero.eyebrow}</span>
                    <span className={styles.headerGroup}>{doc.navigation.group}</span>
                  </div>
                  <h1 className={styles.pageTitle}>{doc.hero.title}</h1>
                  <p className={styles.pageLead}>{doc.hero.lead}</p>

                  {doc.hero.actions?.length ? (
                    <div className={styles.headerLinks}>
                      {doc.hero.actions.map((action) => (
                        <ActionLink
                          key={`${action.label}-${action.href}`}
                          action={action}
                          locale={activeLocale}
                          className={
                            action.variant === "secondary"
                              ? styles.secondaryLink
                              : styles.primaryLink
                          }
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </header>

              {doc.sections.map((section) => (
                <section key={section.id} id={section.id} className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2>{section.title}</h2>
                    {section.lead ? <p>{section.lead}</p> : null}
                  </div>

                  <div className={styles.sectionBody}>
                    {section.blocks.map((block, index) => (
                      <DocsBlock
                        key={`${section.id}-${index}`}
                        block={block}
                        sectionId={section.id}
                        activeLocale={activeLocale}
                      />
                    ))}
                  </div>
                </section>
              ))}

              {doc.cta ? (
                <section className={styles.ctaPanel}>
                  <div className={styles.ctaCopy}>
                    <h2>{doc.cta.title}</h2>
                    <p>{doc.cta.lead}</p>
                  </div>

                  <div className={styles.ctaLinks}>
                    {doc.cta.actions.map((action) => (
                      <ActionLink
                        key={`${action.label}-${action.href}`}
                        action={action}
                        locale={activeLocale}
                        className={
                          action.variant === "secondary"
                            ? styles.secondaryLink
                            : styles.primaryLink
                        }
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </article>
          </div>

          <aside className={styles.toc}>
            <div className={styles.tocViewport}>
              <div className={styles.tocInner}>
                <span className={styles.tocLabel}>{docsUiCopy.tocLabel}</span>
                <nav className={styles.tocNav}>
                  {tocItems.map((item) => (
                    <div key={item.id} className={styles.tocBranch}>
                      <a
                        href={`#${item.id}`}
                        className={styles.tocPrimaryItem}
                      >
                        {item.title}
                      </a>

                      {item.children.length ? (
                        <div className={styles.tocChildren}>
                          {item.children.map((child) => (
                            <a
                              key={child.id}
                              href={`#${child.id}`}
                              className={
                                child.level === 4
                                  ? `${styles.tocNestedItem} ${styles.tocNestedMinor}`
                                  : styles.tocNestedItem
                              }
                            >
                              {child.title}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer locale={activeLocale} copy={siteCopy.footer} />
    </div>
  );
}
