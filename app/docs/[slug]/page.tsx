import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage } from "../../components/DocsPage";
import {
  getDocsDocument,
  getDocsMetadata,
  getDocsNavigation,
  getDocsStaticParams,
} from "../../docs-source";

export const dynamicParams = false;

export function generateStaticParams() {
  return getDocsStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocsDocument("en", slug);

  if (!doc) {
    notFound();
  }

  return getDocsMetadata("en", slug);
}

export default async function DocsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDocsDocument("en", slug);

  if (!doc) {
    notFound();
  }

  return (
    <DocsPage locale="en" doc={doc} navigation={getDocsNavigation("en")} />
  );
}
