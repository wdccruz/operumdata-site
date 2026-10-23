import type { Metadata } from "next";
import { content } from "@/lib/site-content";
import "./globals.css";

export const metadata: Metadata = {
  title: content.en.meta.title,
  description: content.en.meta.description,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
