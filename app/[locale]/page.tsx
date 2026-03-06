import { notFound } from "next/navigation";
import { getMetadata, isSupportedLocale, supportedLocales } from "../site-copy";
import { LandingPage } from "../components/LandingPage";
import type { Metadata } from "next";

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
  if (!isSupportedLocale(locale)) notFound();
  return getMetadata(locale);
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return <LandingPage locale={locale} />;
}
