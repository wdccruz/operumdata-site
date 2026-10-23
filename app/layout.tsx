import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OperumData | Operações de campo para Physical AI no Brasil",
  description:
    "Coleta de dados do mundo real e operações de campo no Brasil para Physical AI e robótica.",
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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
