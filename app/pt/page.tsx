import type { Metadata } from "next";
import HomePage from "@/components/site/home-page";
import { content } from "@/lib/site-content";

export const metadata: Metadata = {
  title: content.pt.meta.title,
  description: content.pt.meta.description,
};

export default function HomePt() {
  return <HomePage lang="pt" />;
}
