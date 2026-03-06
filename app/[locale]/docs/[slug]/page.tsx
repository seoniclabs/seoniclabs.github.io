import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage } from "../../../components/DocsPage";
import {
  getDocsDocument,
  getDocsMetadata,
  getDocsNavigation,
  getDocsStaticParams,
} from "../../../docs-source";
import { isSupportedLocale, supportedLocales } from "../../../site-copy";

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) =>
    getDocsStaticParams().map(({ slug }) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const doc = getDocsDocument(locale, slug);
  if (!doc) {
    notFound();
  }

  return getDocsMetadata(locale, slug);
}

export default async function LocaleDocsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const doc = getDocsDocument(locale, slug);
  if (!doc) {
    notFound();
  }

  return (
    <DocsPage locale={locale} doc={doc} navigation={getDocsNavigation(locale)} />
  );
}
