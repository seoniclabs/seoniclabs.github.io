import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { Metadata } from "next";
import {
  defaultLocale,
  getLocaleHref,
  supportedLocales,
  type Locale,
} from "./site-copy";

export type DocsAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

type DocsHeadingBlock = {
  type: "heading";
  level: 3 | 4;
  title: string;
  id?: string;
};

type DocsParagraphBlock = {
  type: "paragraph";
  content: string;
};

type DocsCodeBlock = {
  type: "code";
  language?: string;
  filename?: string;
  content: string;
};

type DocsListBlock = {
  type: "list";
  style?: "ordered" | "unordered";
  items: string[];
};

type DocsDividerBlock = {
  type: "divider";
};

type DocsCalloutBlock = {
  type: "callout";
  variant?: "info" | "tip" | "warning";
  title?: string;
  content: string;
};

type DocsImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
};

type DocsStepsBlock = {
  type: "steps";
  items: Array<{
    title: string;
    body: string;
    code?: string;
  }>;
};

type DocsCardGridBlock = {
  type: "cardGrid";
  items: Array<{
    title: string;
    body: string;
  }>;
};

export type DocsContentBlock =
  | DocsHeadingBlock
  | DocsParagraphBlock
  | DocsCodeBlock
  | DocsListBlock
  | DocsDividerBlock
  | DocsCalloutBlock
  | DocsImageBlock
  | DocsStepsBlock
  | DocsCardGridBlock;

export type DocsSection = {
  id: string;
  title: string;
  lead?: string;
  blocks: DocsContentBlock[];
};

type DocsNavigation = {
  group: string;
  groupOrder?: number;
  title: string;
  description?: string;
  order: number;
  isIndex?: boolean;
  parentSlug?: string;
};

export type DocsDocument = {
  slug: string;
  lang: string;
  navigation: DocsNavigation;
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    actions?: DocsAction[];
  };
  sections: DocsSection[];
  cta?: {
    title: string;
    lead: string;
    actions: DocsAction[];
  };
};

export type DocsNavigationItem = {
  slug: string;
  href: string;
  title: string;
  description?: string;
  order: number;
  isIndex: boolean;
  parentSlug?: string;
  children: DocsNavigationItem[];
};

export type DocsNavigationGroup = {
  title: string;
  order: number;
  items: DocsNavigationItem[];
};

const DOCS_DIR = path.join(process.cwd(), "app/docs-content");

const docsUiCopy = {
  en: {
    sidebarEyebrow: "Documentation",
    sidebarTitle: "Browse docs",
    sidebarSummary:
      "Guides and product notes for running Seonic locally and understanding its inspection model.",
    tocLabel: "On this page",
  },
  ko: {
    sidebarEyebrow: "문서",
    sidebarTitle: "문서 탐색",
    sidebarSummary:
      "Seonic을 로컬에서 실행하고 점검 흐름을 이해하기 위한 가이드와 제품 문서를 모아둔 공간입니다.",
    tocLabel: "이 페이지에서",
  },
} satisfies Record<
  Locale,
  {
    sidebarEyebrow: string;
    sidebarTitle: string;
    sidebarSummary: string;
    tocLabel: string;
  }
>;

function toLocale(locale: string): Locale {
  return (supportedLocales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : defaultLocale;
}

const getAllDocSlugs = cache((): string[] => {
  if (!fs.existsSync(DOCS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
});

const readDocFile = cache(
  (slug: string, locale: string): DocsDocument | null => {
    const requestedLocale = toLocale(locale);
    const localeCandidates = [
      requestedLocale,
      defaultLocale,
      ...supportedLocales.filter((candidate) => candidate !== requestedLocale),
    ];

    for (const candidate of localeCandidates) {
      const filePath = path.join(DOCS_DIR, slug, `${candidate}.json`);

      if (!fs.existsSync(filePath)) {
        continue;
      }

      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(raw) as Omit<DocsDocument, "slug">;
      return {
        ...parsed,
        slug,
      };
    }

    return null;
  }
);

const readAnyDocFile = cache((slug: string): DocsDocument | null => {
  for (const locale of supportedLocales) {
    const doc = readDocFile(slug, locale);
    if (doc) {
      return doc;
    }
  }

  return null;
});

const getIndexDocSlug = cache((): string | null => {
  const slugs = getAllDocSlugs();

  for (const slug of slugs) {
    const doc = readAnyDocFile(slug);
    if (doc?.navigation.isIndex) {
      return slug;
    }
  }

  return slugs[0] ?? null;
});

export const getDocsDocument = cache(
  (locale: string = defaultLocale, slug?: string): DocsDocument | null => {
    const resolvedSlug = slug ?? getIndexDocSlug();

    if (!resolvedSlug) {
      return null;
    }

    return readDocFile(resolvedSlug, locale);
  }
);

export function getDocsPath(slug?: string): string {
  const indexSlug = getIndexDocSlug();
  if (!slug || slug === indexSlug) {
    return "/docs";
  }

  return `/docs/${slug}`;
}

export function getDocsHref(locale: string, slug?: string): string {
  return getLocaleHref(toLocale(locale), getDocsPath(slug));
}

export function getDocsNavigation(
  locale: string = defaultLocale
): DocsNavigationGroup[] {
  const groups = new Map<
    string,
    {
      title: string;
      order: number;
      items: DocsNavigationItem[];
    }
  >();

  for (const slug of getAllDocSlugs()) {
    const doc = getDocsDocument(locale, slug);
    if (!doc) {
      continue;
    }

    const groupOrder = doc.navigation.groupOrder ?? 999;
    const groupKey = `${groupOrder}:${doc.navigation.group}`;
    const existing = groups.get(groupKey);
    const item: DocsNavigationItem = {
      slug: doc.slug,
      href: getDocsHref(locale, doc.slug),
      title: doc.navigation.title,
      description: doc.navigation.description,
      order: doc.navigation.order,
      isIndex: doc.navigation.isIndex ?? false,
      parentSlug: doc.navigation.parentSlug,
      children: [],
    };

    if (existing) {
      existing.items.push(item);
      continue;
    }

    groups.set(groupKey, {
      title: doc.navigation.group,
      order: groupOrder,
      items: [item],
    });
  }

  return Array.from(groups.values())
    .sort((left, right) => left.order - right.order)
    .map((group) => {
      const sortedItems = group.items.sort((left, right) => left.order - right.order);
      const itemBySlug = new Map(sortedItems.map((item) => [item.slug, item]));
      const topLevelItems: DocsNavigationItem[] = [];

      for (const item of sortedItems) {
        if (!item.parentSlug) {
          topLevelItems.push(item);
          continue;
        }

        const parent = itemBySlug.get(item.parentSlug);

        // Support docs trees up to 2 levels in the sidebar.
        if (!parent || parent.parentSlug) {
          topLevelItems.push(item);
          continue;
        }

        parent.children.push(item);
      }

      return {
        title: group.title,
        order: group.order,
        items: topLevelItems.map((item) => ({
          ...item,
          children: item.children.sort((left, right) => left.order - right.order),
        })),
      };
    });
}

export function getDocsStaticParams(): { slug: string }[] {
  const indexSlug = getIndexDocSlug();
  return getAllDocSlugs()
    .filter((slug) => slug !== indexSlug)
    .map((slug) => ({ slug }));
}

export function getDocsMetadata(
  locale: string = defaultLocale,
  slug?: string
): Metadata {
  const doc = getDocsDocument(locale, slug);

  if (!doc) {
    return {
      title: "Docs",
      description: "Documentation for Seonic.",
    };
  }

  const docPath = getDocsPath(doc.slug);

  return {
    title: doc.metadata.title,
    description: doc.metadata.description,
    alternates: {
      languages: Object.fromEntries(
        supportedLocales.map((candidate) => [
          candidate,
          getLocaleHref(candidate, docPath),
        ])
      ),
    },
  };
}

export function getDocsUiCopy(locale: string = defaultLocale) {
  return docsUiCopy[toLocale(locale)];
}
