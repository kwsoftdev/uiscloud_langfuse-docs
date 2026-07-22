export interface SectionNavData {
  name: string;
  href: string;
}

export const sectionNavData: SectionNavData[] = [
  { name: "Docs", href: "/docs" },
  { name: "Self Hosting", href: "/self-hosting" },
  { name: "Guides", href: "/guides" },
  { name: "Integrations", href: "/integrations" },
  { name: "FAQ", href: "/faq" },
  { name: "Handbook", href: "/handbook" },
  { name: "Changelog", href: "/changelog" },
  { name: "Pricing", href: "/pricing" },
  { name: "Library", href: "/library" },
  { name: "Security & Compliance", href: "/security" },
];

// Korean counterpart, shown instead of the above when browsing a /kr section
// (see lib/i18n/koPaths.ts). Sections without a Korean translation yet keep
// their Korean label but link to the English page.
export const sectionNavDataKo: SectionNavData[] = [
  { name: "문서", href: "/docs/kr" },
  { name: "셀프 호스팅", href: "/self-hosting/kr" },
  { name: "가이드", href: "/guides/kr" },
  { name: "인테그레이션", href: "/integrations" },
  { name: "자주 묻는 질문", href: "/faq/kr" },
  { name: "핸드북", href: "/handbook/kr" },
  { name: "체인지로그", href: "/changelog" },
  { name: "가격", href: "/pricing" },
  { name: "라이브러리", href: "/library" },
  { name: "보안 및 컴플라이언스", href: "/security/kr" },
];
