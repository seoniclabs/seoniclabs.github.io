import type { Metadata } from "next";

export const defaultLocale = "en";
export const supportedLocales = ["en", "ko"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];
export type Locale = typeof defaultLocale | SupportedLocale;

export const localeNames: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
};

type HeroCopy = {
  kicker: string;
  title: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

type SurfaceCard = {
  title: string;
  body: string;
};

type SurfacesCopy = {
  number: string;
  label: string;
  title: string;
  lead: string;
  cards: SurfaceCard[];
};

type RoadmapItem = {
  phase: string;
  title: string;
  body: string;
};

type RoadmapCopy = {
  number: string;
  label: string;
  title: string;
  lead: string;
  items: RoadmapItem[];
};

type PrincipleItem = {
  text: string;
};

type OpenSourceCopy = {
  number: string;
  label: string;
  title: string;
  lead: string;
  principles: PrincipleItem[];
};

type FinalCtaPoint = {
  title: string;
  body: string;
};

type FinalCtaCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  primary: string;
  secondary: string;
  points: FinalCtaPoint[];
};

type FooterLink = {
  name: string;
  href: string;
  note: string;
};

type SiteCopy = {
  lang: string;
  metadata: {
    title: string;
    description: string;
  };
  header: {
    nav: {
      overview: string;
      roadmap: string;
      openSource: string;
      docs: string;
    };
    badge: string;
    language: string;
  };
  hero: HeroCopy;
  surfaces: SurfacesCopy;
  roadmap: RoadmapCopy;
  openSource: OpenSourceCopy;
  finalCta: FinalCtaCopy;
  footer: {
    eyebrow: string;
    summary: string;
    stamp: string;
    links: FooterLink[];
  };
};

const siteCopy: Record<Locale, SiteCopy> = {
  en: {
    lang: "en",
    metadata: {
      title: "Seonic",
      description:
        "Seonic is an open-source local SEO inspector for Next.js. Review routes, warnings, and source trace before you ship.",
    },
    header: {
      nav: {
        overview: "Overview",
        roadmap: "Roadmap",
        openSource: "Local-first",
        docs: "Docs",
      },
      badge: "Open source",
      language: "Language",
    },
    hero: {
      kicker: "Open-source local SEO inspector",
      title: "Inspect Next.js SEO locally.",
      lead: "Scan routes, catch metadata issues, and trace values back to source before release.",
      ctaPrimary: "Get started",
      ctaSecondary: "View on GitHub",
    },
    surfaces: {
      number: "01",
      label: "Overview",
      title: "Routes, warnings, and source in one view.",
      lead: "Review the metadata that usually gets missed without digging through page files.",
      cards: [
        {
          title: "All routes",
          body: "See title, description, canonical, and OG data without opening page files.",
        },
        {
          title: "Warnings that matter",
          body: "Catch empty descriptions, duplicate titles, bad canonicals, and missing alternates before release.",
        },
        {
          title: "Source trace",
          body: "Jump from rendered output back to the line that produced it.",
        },
      ],
    },
    roadmap: {
      number: "03",
      label: "Roadmap",
      title: "Built in the right order.",
      lead: "Start with Next.js. Expand from the workflows teams use most.",
      items: [
        {
          phase: "Now",
          title: "App Router inspection",
          body: "Route scanning, metadata detection, warnings, and SERP or OG preview for Next.js projects.",
        },
        {
          phase: "Next",
          title: "Deeper auto-detection",
          body: "Read generateMetadata, static exports, and head tags with less setup.",
        },
        {
          phase: "Later",
          title: "More frameworks",
          body: "Extend the route adapter model to tools like Remix and Astro.",
        },
      ],
    },
    openSource: {
      number: "02",
      label: "Local-first",
      title: "Your code stays on your machine.",
      lead: "No account, upload, or remote scan. Open Seonic and inspect everything locally.",
      principles: [
        { text: "Runs locally from the start." },
        { text: "Read-only inspection. Your code is never modified." },
        { text: "No project data leaves localhost." },
        { text: "Static-friendly for simple deployment." },
      ],
    },
    finalCta: {
      eyebrow: "Local SEO workspace",
      title: "Preview and manage SEO locally.",
      lead: "Like Storybook for metadata, Seonic gives you one local place to inspect route output, preview SEO, and fix the source behind it.",
      primary: "Read the docs",
      secondary: "View on GitHub",
      points: [
        {
          title: "Preview every route",
          body: "See title, description, canonical, and OG output in one local view.",
        },
        {
          title: "Edit from source",
          body: "Trace each value back to the code that generated it and update it immediately.",
        },
        {
          title: "Keep SEO in flow",
          body: "Manage SEO while you build instead of treating it as a final deployment check.",
        },
      ],
    },
    footer: {
      eyebrow: "Seonic",
      summary:
        "Inspect routes, metadata, and source trace before shipping your Next.js app.",
      stamp:
        "See what each route renders, catch SEO issues early, and jump back to the code that produced it.",
      links: [
        {
          name: "MSUB",
          href: "https://msub.kr",
          note: "The team building Seonic.",
        },
        {
          name: "TimeFile",
          href: "https://timefile.co",
          note: "A free anonymous file sharing service.",
        },
        {
          name: "Devlink",
          href: "https://devlink.to/en",
          note: "A secure tunnel service for exposing localhost to the internet.",
        },
      ],
    },
  },
  ko: {
    lang: "ko",
    metadata: {
      title: "Seonic",
      description:
        "Seonic은 Next.js를 위한 오픈소스 로컬 SEO 점검 도구입니다. 라우트, 경고, 소스 추적을 배포 전에 확인합니다.",
    },
    header: {
      nav: {
        overview: "개요",
        roadmap: "로드맵",
        openSource: "로컬 우선",
        docs: "문서",
      },
      badge: "오픈소스",
      language: "언어",
    },
    hero: {
      kicker: "오픈소스 · 로컬 우선",
      title: "Next.js를 위한\n로컬 SEO 점검 도구",
      lead: "라우트를 스캔해 메타데이터 문제를 찾고, 값이 어디서 나왔는지 코드까지 배포 전에 확인합니다.",
      ctaPrimary: "시작하기",
      ctaSecondary: "GitHub 보기",
    },
    surfaces: {
      number: "01",
      label: "개요",
      title: "라우트, 경고, 소스를 한번에 봅니다.",
      lead: "페이지 파일을 뒤지지 않아도 놓치기 쉬운 메타데이터 상태를 빠르게 확인합니다.",
      cards: [
        {
          title: "전체 라우트",
          body: "title, description, canonical, OG 값을 페이지별로 바로 봅니다. 파일을 열 필요가 없습니다.",
        },
        {
          title: "놓치기 쉬운 경고",
          body: "빈 description, 중복 title, 잘못된 canonical, 빠진 alternate를 미리 잡습니다.",
        },
        {
          title: "소스 추적",
          body: "렌더링된 결과가 어디서 나왔는지 코드 줄까지 이어서 봅니다.",
        },
      ],
    },
    roadmap: {
      number: "03",
      label: "로드맵",
      title: "지금 필요한 것부터 만듭니다.",
      lead: "Next.js에서 시작하고, 실제로 많이 쓰는 흐름부터 넓혀갑니다.",
      items: [
        {
          phase: "지금",
          title: "App Router 점검",
          body: "라우트 스캔, 메타데이터 감지, 경고, SERP와 OG 미리보기를 제공합니다.",
        },
        {
          phase: "다음",
          title: "자동 감지 강화",
          body: "generateMetadata, 정적 export, head 태그를 더 적은 설정으로 읽어냅니다.",
        },
        {
          phase: "이후",
          title: "프레임워크 확장",
          body: "Remix, Astro 같은 도구로 넓혀 갈 수 있게 어댑터 구조를 다듬습니다.",
        },
      ],
    },
    openSource: {
      number: "02",
      label: "로컬 우선",
      title: "코드는 밖으로 나가지 않습니다.",
      lead: "계정 없이 실행됩니다. 업로드도 없습니다. 내 컴퓨터에서 바로 확인하면 됩니다.",
      principles: [
        { text: "로컬에서 바로 실행됩니다." },
        { text: "코드를 읽기만 합니다. 수정하지 않습니다." },
        { text: "데이터를 서버로 보내지 않습니다." },
        { text: "정적 환경에도 가볍게 올릴 수 있습니다." },
      ],
    },
    finalCta: {
      eyebrow: "로컬 SEO 워크스페이스",
      title: "로컬에서 SEO를 보고, 관리하고, 바로 고치세요.",
      lead: "Seonic은 메타데이터를 위한 스토리북처럼 라우트 출력을 한곳에서 보고, SEO를 프리뷰하고, 값이 나온 소스까지 따라가 수정할 수 있게 만든 도구입니다.",
      primary: "문서 보기",
      secondary: "GitHub 보기",
      points: [
        {
          title: "라우트별 프리뷰",
          body: "title, description, canonical, OG 출력을 로컬에서 한 화면으로 확인합니다.",
        },
        {
          title: "소스에서 바로 수정",
          body: "값이 나온 코드까지 이어서 보고 바로 수정 흐름으로 넘어갈 수 있습니다.",
        },
        {
          title: "개발 흐름 안에서 관리",
          body: "SEO를 배포 전 체크리스트가 아니라 개발 중 계속 다루는 작업으로 가져옵니다.",
        },
      ],
    },
    footer: {
      eyebrow: "Seonic",
      summary:
        "배포 전에 Next.js 앱의 라우트, 메타데이터, 소스 추적을 한 화면에서 점검합니다.",
      stamp:
        "각 라우트의 렌더링 결과를 보고, SEO 이슈를 미리 찾고, 값이 나온 코드로 바로 돌아갑니다.",
      links: [
        {
          name: "MSUB",
          href: "https://msub.kr",
          note: "Seonic을 개발하는 팀입니다.",
        },
        {
          name: "TimeFile",
          href: "https://timefile.co",
          note: "무료 익명 파일 공유 서비스입니다.",
        },
        {
          name: "Devlink",
          href: "https://devlink.to/en",
          note: "로컬호스트를 안전하게 외부에 노출하는 터널링 서비스입니다.",
        },
      ],
    },
  },
};

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (supportedLocales as readonly string[]).includes(locale);
}

export function getSiteCopy(locale: string = defaultLocale): SiteCopy {
  return siteCopy[locale as Locale] ?? siteCopy[defaultLocale];
}

function normalizePath(path: string): string {
  if (!path || path === "/") {
    return "/";
  }

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.replace(/\/+$/, "") || "/";
}

export function getLocaleHref(locale: Locale, path = ""): string {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/") {
    return locale === defaultLocale ? "/" : `/${locale}`;
  }

  return locale === defaultLocale
    ? normalizedPath
    : `/${locale}${normalizedPath}`;
}

export function getLocaleSwitchHref(locale: Locale, pathname = "/"): string {
  const normalizedPath = normalizePath(pathname);
  const segments = normalizedPath.split("/").filter(Boolean);

  if (segments.length > 0 && isSupportedLocale(segments[0])) {
    segments.shift();
  }

  const basePath = segments.length === 0 ? "/" : `/${segments.join("/")}`;
  return getLocaleHref(locale, basePath === "/" ? "" : basePath);
}

export function getLocalizedBasePath(pathname = "/"): string {
  const normalizedPath = normalizePath(pathname);
  const segments = normalizedPath.split("/").filter(Boolean);

  if (segments.length > 0 && isSupportedLocale(segments[0])) {
    segments.shift();
  }

  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

export function getMetadata(locale: string = defaultLocale): Metadata {
  const copy = getSiteCopy(locale);
  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: {
      languages: {
        en: getLocaleHref("en"),
        ko: getLocaleHref("ko"),
      },
    },
  };
}
