import type { Metadata } from "next";
import { Home } from "@/components/home";
import { buildLocalizedAlternates } from "@/lib/localization";

export const metadata: Metadata = {
  alternates: {
    languages: buildLocalizedAlternates({
      defaultLocale: "en",
      routes: { en: "/", "ko-KR": "/kr" },
    }),
  },
};

export default function HomePage() {
  return <Home />;
}
