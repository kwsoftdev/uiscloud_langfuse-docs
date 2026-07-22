import { changelogSource } from "@/lib/source";
import { getGitHubStars } from "@/lib/github-stars";
import { getLatestGitHubReleaseDate } from "@/lib/github-releases";
import { LinkBox } from "@/components/ui/link-box";
import { Text } from "@/components/ui/text";
import discussionsData from "../../../src/langfuse_github_discussions.json";
import { Link } from "@/components/ui/link";

function formatCount(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

function formatRelativeDate(isoDate: string, ko: boolean): string {
  const date = new Date(isoDate);
  const dayDiff = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  if (ko) {
    if (dayDiff < 1) return "오늘";
    if (dayDiff < 14) return `${Math.round(dayDiff)}일 전`;
    if (dayDiff < 30) return `${Math.round(dayDiff / 7)}주 전`;
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  if (dayDiff < 1) return "today";
  if (dayDiff < 14) return `${Math.round(dayDiff)} days ago`;
  if (dayDiff < 30) return `${Math.round(dayDiff / 7)} weeks ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ── Static data ───────────────────────────────────────────────────────────────

const githubStars = getGitHubStars();

const qaCount =
  (
    discussionsData.categories as Array<{
      category: string;
      discussions: unknown[];
    }>
  ).find((c) => c.category === "Support")?.discussions.length ?? 0;

const ideasCount =
  (
    discussionsData.categories as Array<{
      category: string;
      discussions: unknown[];
    }>
  ).find((c) => c.category === "Ideas")?.discussions.length ?? 0;

function communityStatsFor(
  t: Strings,
): Array<{ label: string; value: string; href: string; tooltip: string }> {
  return [
    {
      label: t.githubStars,
      value: formatCount(githubStars),
      href: "https://github.com/langfuse/langfuse",
      tooltip: t.leaveStar,
    },
    {
      label: t.contributors,
      value: "300+",
      href: "https://github.com/langfuse/langfuse/graphs/contributors",
      tooltip: t.viewContributors,
    },
    {
      label: t.qaThreads,
      value: formatCount(qaCount),
      href: "https://github.com/orgs/langfuse/discussions/categories/support",
      tooltip: t.browseQa,
    },
    {
      label: t.roadmapThreads,
      value: formatCount(ideasCount),
      href: "https://github.com/orgs/langfuse/discussions/categories/ideas",
      tooltip: t.browseIdeas,
    },
  ];
}

const selfHostingLinks = [
  { label: "Docker Compose", href: "/self-hosting/deployment/docker-compose" },
  {
    label: "Kubernetes (Helm)",
    href: "/self-hosting/deployment/kubernetes-helm",
  },
  { label: "AWS (Terraform)", href: "/self-hosting/deployment/aws" },
  { label: "GCP (Terraform)", href: "/self-hosting/deployment/gcp" },
  { label: "Azure (Terraform)", href: "/self-hosting/deployment/azure" },
];

const STRINGS = {
  en: {
    communityStats: "Community Stats",
    githubStars: "GitHub Stars",
    leaveStar: "Leave a Star ⭐",
    contributors: "Contributors",
    viewContributors: "View contributors",
    qaThreads: "Community Q&A threads",
    browseQa: "Browse Q&A",
    roadmapThreads: "Roadmap threads",
    browseIdeas: "Browse ideas",
    viewReleases: "View releases",
    latestRelease: "Latest OSS release",
    changelog: "Changelog",
    viewAll: "View All",
    readArticle: "Read article",
    selfHostingGuides: "Self Hosting Guides",
  },
  ko: {
    communityStats: "커뮤니티 통계",
    githubStars: "GitHub Stars",
    leaveStar: "Star 남기기 ⭐",
    contributors: "기여자",
    viewContributors: "기여자 보기",
    qaThreads: "커뮤니티 Q&A 스레드",
    browseQa: "Q&A 둘러보기",
    roadmapThreads: "로드맵 스레드",
    browseIdeas: "아이디어 둘러보기",
    viewReleases: "릴리스 보기",
    latestRelease: "최신 OSS 릴리스",
    changelog: "체인지로그",
    viewAll: "전체 보기",
    readArticle: "글 읽기",
    selfHostingGuides: "셀프 호스팅 가이드",
  },
} as const;

type Strings = (typeof STRINGS)["en" | "ko"];

// ── Component ─────────────────────────────────────────────────────────────────

export async function HomeSidebar({ lang = "en" }: { lang?: "en" | "ko" }) {
  const ko = lang === "ko";
  const t = STRINGS[lang];
  const communityStats = communityStatsFor(t);
  const changelogItems = changelogSource
    .getPages()
    .filter((p) => p.data.title && p.data.date)
    .sort(
      (a, b) =>
        new Date(b.data.date as string).getTime() -
        new Date(a.data.date as string).getTime(),
    )
    .slice(0, 3)
    .map((p) => ({
      route: p.url,
      title: p.data.title as string,
      date: new Date(p.data.date as string).toISOString(),
    }));

  const latestReleaseDate =
    (await getLatestGitHubReleaseDate()) ?? changelogItems[0]?.date;

  return (
    <aside
      className="hidden lg:flex flex-col bg-line-structure sticky p-px pt-0 w-[240px] shrink-0"
      style={{
        top: "calc(var(--fd-banner-height, 0px) + var(--lf-nav-primary-height))",
        height:
          "calc(100vh - var(--fd-banner-height, 0px) - var(--lf-nav-primary-height))",
      }}
    >
      <nav className="flex overflow-y-auto overflow-x-hidden flex-col flex-1 rounded-sm bg-surface-1">
        <div className="pb-px bg-line-structure">
          <div className="px-2 py-4 rounded-sm bg-surface-1">
            <Text
              size="s"
              className="px-2 mb-3 font-[430] text-left text-[13px] text-text-primary"
            >
              {t.communityStats}
            </Text>
            <div className="flex flex-col gap-[2px] mb-[2px]">
              {communityStats.map((stat) => (
                <LinkBox
                  key={stat.label}
                  href={stat.href}
                  tooltip={stat.tooltip}
                  className="block px-2 w-full hover:bg-surface-bg"
                >
                  <div className="flex gap-2 justify-between items-center w-full">
                    <Text
                      size="s"
                      className="text-left group-hover:text-text-primary text-[13px]"
                    >
                      {stat.label}
                    </Text>
                    <Text
                      size="s"
                      className="tabular-nums text-right shrink-0 text-[13px] group-hover:text-text-primary"
                    >
                      {stat.value}
                    </Text>
                  </div>
                </LinkBox>
              ))}
            </div>

            {latestReleaseDate && (
              <LinkBox
                href="https://github.com/langfuse/langfuse/releases"
                tooltip={t.viewReleases}
                className="block px-2 w-full hover:bg-surface-bg"
              >
                <div className="flex gap-2 justify-between items-center w-full">
                  <Text
                    size="s"
                    className="text-left text-[13px] group-hover:text-text-primary"
                  >
                    {t.latestRelease}
                  </Text>
                  <Text
                    size="s"
                    className="text-right text-[13px] shrink-0 group-hover:text-text-primary"
                  >
                    {formatRelativeDate(latestReleaseDate, ko)}
                  </Text>
                </div>
              </LinkBox>
            )}
          </div>
        </div>

        {/* ── Changelog ─────────────────────────────────────────────────── */}
        <div className="pb-px bg-line-structure">
          <div className="px-2 py-4 rounded-sm bg-surface-1">
            <div className="flex justify-between items-center px-2 mb-3">
              <Text
                size="s"
                className="font-[430] text-[13px] text-left text-text-primary"
              >
                {t.changelog}
              </Text>
              <Link href="/changelog">
                <Text
                  size="xs"
                  className="transition-colors hover:text-text-primary"
                >
                  {t.viewAll}
                </Text>
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {changelogItems.map((item) => (
                <LinkBox
                  key={item.route}
                  href={item.route}
                  tooltip={t.readArticle}
                  tooltipPlacement="bottom-right"
                  className="block px-2 w-full hover:bg-surface-bg"
                >
                  <div className="flex flex-col gap-1.5">
                    <Text
                      size="s"
                      className="leading-snug text-left text-[13px] group-hover:text-text-primary"
                    >
                      {item.title}
                    </Text>
                    <Text
                      size="xs"
                      className="text-left no-underline group-hover:text-text-primary"
                    >
                      {formatRelativeDate(item.date, ko)}
                    </Text>
                  </div>
                </LinkBox>
              ))}
            </div>
          </div>
        </div>

        {/* ── Self Hosting Guides ────────────────────────────────────────── */}
        <div className="pb-px bg-line-structure">
          <div className="px-2 py-4 rounded-sm bg-surface-1">
            <Text
              size="s"
              className="block px-2 mb-2 font-[430] text-left text-[13px] text-text-primary"
            >
              {t.selfHostingGuides}
            </Text>
            <div className="flex flex-col gap-[2px]">
              {selfHostingLinks.map((link) => (
                <LinkBox
                  key={link.href}
                  href={link.href}
                  className="block px-2 w-full hover:bg-surface-bg"
                >
                  <Text
                    size="s"
                    className="text-left text-text-tertiary text-[13px] group-hover:text-text-primary"
                  >
                    {link.label}
                  </Text>
                </LinkBox>
              ))}
            </div>
          </div>
        </div>

        <span className="flex px-px w-full bg-line-structure h-[3px]">
          <span className="w-full h-full rounded-t-sm bg-surface-1" />
        </span>
      </nav>
    </aside>
  );
}
