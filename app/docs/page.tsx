import { notFound } from "next/navigation";
import { DocsPage } from "../components/DocsPage";
import {
  getDocsDocument,
  getDocsMetadata,
  getDocsNavigation,
} from "../docs-source";

export const metadata = getDocsMetadata("en");

export default function DocsHome() {
  const doc = getDocsDocument("en");
  if (!doc) {
    notFound();
  }

  return (
    <DocsPage locale="en" doc={doc} navigation={getDocsNavigation("en")} />
  );
}
