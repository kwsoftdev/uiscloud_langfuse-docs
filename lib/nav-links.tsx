import {
  Activity,
  BarChart2,
  BookOpen,
  Bookmark,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  LayoutGrid,
  Map,
  MessageSquare,
  Newspaper,
  Presentation,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavPanelLink = {
  name: string;
  href: string;
  icon: LucideIcon;
};

type SimpleLink = {
  name: string;
  href: string;
  tabletHidden?: boolean;
};

export const productLinks: NavPanelLink[] = [
  { name: "Overview", href: "/docs", icon: LayoutGrid },
  {
    name: "LLM Observability",
    href: "/docs/observability/overview",
    icon: Activity,
  },
  {
    name: "Prompt Management",
    href: "/docs/prompt-management/overview",
    icon: MessageSquare,
  },
  { name: "Evaluation", href: "/docs/evaluation/overview", icon: FlaskConical },
  { name: "Metrics", href: "/docs/metrics/overview", icon: BarChart2 },
];

export const resourcesLinks: NavPanelLink[] = [
  { name: "Academy", href: "/academy", icon: BookOpen },
  { name: "Workshop", href: "/workshop", icon: Presentation },
  { name: "Blog", href: "/blog", icon: Newspaper },
  { name: "Roadmap", href: "/docs/roadmap", icon: Map },
  { name: "Users", href: "/users", icon: Users },
  { name: "Example Project", href: "/docs/demo", icon: Bookmark },
  { name: "Walkthroughs", href: "/guides", icon: GraduationCap },
  { name: "Support", href: "/support", icon: HelpCircle },
];

export const simpleLinks: SimpleLink[] = [{ name: "Docs", href: "/docs" }];

// ---------------------------------------------------------------------------
// Korean counterparts — rendered instead of the above when the current path is
// under a translated /kr section (see lib/i18n/koPaths.ts). Links point at the
// /kr version of a page where one exists; sections that aren't translated yet
// (Workshop, Blog, Changelog, Users, Support, Integrations, Pricing, Library)
// keep their Korean label but link to the English page, same as everywhere
// else on the site a translated label can point at untranslated content.
// ---------------------------------------------------------------------------

export const productLinksKo: NavPanelLink[] = [
  { name: "개요", href: "/docs/kr", icon: LayoutGrid },
  {
    name: "LLM 관측성",
    href: "/docs/kr/observability/overview",
    icon: Activity,
  },
  {
    name: "프롬프트 관리",
    href: "/docs/kr/prompt-management/overview",
    icon: MessageSquare,
  },
  { name: "평가", href: "/docs/kr/evaluation/overview", icon: FlaskConical },
  { name: "메트릭", href: "/docs/kr/metrics/overview", icon: BarChart2 },
];

export const resourcesLinksKo: NavPanelLink[] = [
  { name: "아카데미", href: "/academy/kr", icon: BookOpen },
  { name: "워크숍", href: "/workshop", icon: Presentation },
  { name: "블로그", href: "/blog", icon: Newspaper },
  { name: "로드맵", href: "/docs/kr/roadmap", icon: Map },
  { name: "고객 사례", href: "/users", icon: Users },
  { name: "예제 프로젝트", href: "/docs/kr/demo", icon: Bookmark },
  { name: "실습 가이드", href: "/guides/kr", icon: GraduationCap },
  { name: "지원", href: "/support", icon: HelpCircle },
];

export const simpleLinksKo: SimpleLink[] = [{ name: "문서", href: "/docs/kr" }];
