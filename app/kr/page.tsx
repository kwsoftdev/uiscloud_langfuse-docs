import type { Metadata } from "next";
import { Home } from "@/components/home";
import { buildLocalizedAlternates } from "@/lib/localization";

export const metadata: Metadata = {
  title: "Langfuse - 오픈소스 AI 엔지니어링 플랫폼",
  description:
    "Langfuse는 팀이 LLM 애플리케이션을 공동으로 디버깅, 분석, 개선할 수 있도록 돕는 오픈소스 AI 엔지니어링 플랫폼입니다.",
  alternates: {
    canonical: "https://langfuse.com/kr",
    languages: buildLocalizedAlternates({
      defaultLocale: "en",
      routes: { en: "/", "ko-KR": "/kr" },
    }),
  },
};

export default function KrHomePage() {
  return <Home />;
}
