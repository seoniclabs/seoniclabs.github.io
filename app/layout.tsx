import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Seonic", template: "%s | Seonic" },
  description: "Local SEO workspace for Next.js teams.",
  icons: { icon: "/logo.ico" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
