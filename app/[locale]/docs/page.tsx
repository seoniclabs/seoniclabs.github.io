import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage } from "../../components/DocsPage";
import {
  isSupportedLocale,
  supportedLocales,
} from "../../site-copy";
import {
  getDocsDocument,
  getDocsMetadata,
  getDocsNavigation,
} from "../../docs-source";

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return getDocsMetadata(locale);
}

export default async function LocaleDocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const doc = getDocsDocument(locale);
  if (!doc) {
    notFound();
  }

  return (
    <DocsPage locale={locale} doc={doc} navigation={getDocsNavigation(locale)} />
  );
}
