import { integrationsSource, integrationsKrSource } from "@/lib/source";
import { Cards } from "@/components/docs";
import {
  nativeIntegrationsMeta,
  dataPlatformIntegrationsMeta,
} from "@/lib/integrations-meta";
import { cn } from "@/lib/utils";

type Lang = "en" | "ko";

/** Rewrites an /integrations/... route to its /integrations/kr/... counterpart.
 * Routes outside /integrations (e.g. /docs/...) are left untouched — same
 * convention as everywhere else on the site: cross-section links stay on the
 * English page unless that section is translated too. */
function localizeRoute(route: string, lang: Lang): string {
  if (lang !== "ko" || !route.startsWith("/integrations/")) return route;
  return `/integrations/kr${route.slice("/integrations".length)}`;
}

function additionalLinksFromMeta(metaConfig: Record<string, any>) {
  return Object.entries(metaConfig)
    .filter(([_, config]) => config.href)
    .map(([_, config]) => ({
      route: config.href,
      frontMatter: { title: config.title, logo: config.logo },
    }));
}

const categoryConfig: Record<
  string,
  {
    title: string;
    description: string;
    descriptionKo?: string;
    additionalLinks?: { route: string; frontMatter: any }[];
    featuredLinks?: ProcessedIntegrationPage[];
  }
> = {
  native: {
    title: "Native",
    description: "Native integrations with Langfuse",
    descriptionKo: "Langfuse의 네이티브 인테그레이션",
    additionalLinks: additionalLinksFromMeta(nativeIntegrationsMeta),
    featuredLinks: [
      {
        route: "/docs/api-and-data-platform/features/public-api",
        frontMatter: { title: "API" },
        title: "API",
      },
      {
        route: "/docs/sdk/python/sdk-v3",
        frontMatter: { title: "Python SDK" },
        title: "Python SDK",
      },
      {
        route: "/docs/sdk/typescript/guide",
        frontMatter: { title: "JS/TS SDK" },
        title: "JS/TS SDK",
      },
    ],
  },
  frameworks: {
    title: "Frameworks",
    description: "Integrate with popular AI frameworks",
    descriptionKo: "인기 있는 AI 프레임워크와 통합하세요",
    featuredLinks: [
      {
        route: "/integrations/frameworks/langchain",
        frontMatter: {
          title: "LangChain & LangGraph",
          logo: "/images/integrations/langchain_icon.png",
        },
        title: "LangChain & LangGraph",
      },
      {
        route: "/integrations/model-providers/openai-py",
        frontMatter: {
          title: "OpenAI (Python)",
          logo: "/images/integrations/openai_icon.svg",
          logoAppearance: "dark",
        },
        title: "OpenAI (Python)",
      },
      {
        route: "/integrations/frameworks/vercel-ai-sdk",
        frontMatter: {
          title: "Vercel AI SDK",
          logo: "/images/integrations/vercel_ai_sdk_icon.png",
          logoAppearance: "multicolor",
        },
        title: "Vercel AI SDK",
      },
      {
        route: "/integrations/frameworks/google-adk",
        frontMatter: {
          title: "Google ADK",
          logo: "/images/integrations/google_adk_icon.png",
        },
        title: "Google ADK",
      },
      {
        route: "/integrations/frameworks/pydantic-ai",
        frontMatter: {
          title: "Pydantic AI",
          logo: "/images/integrations/pydantic_ai_icon.svg",
        },
        title: "Pydantic AI",
      },
      {
        route: "/integrations/frameworks/openai-agents",
        frontMatter: {
          title: "OpenAI Agents",
          logo: "/images/integrations/openai_icon.svg",
          logoAppearance: "dark",
        },
        title: "OpenAI Agents",
      },
    ],
  },
  "model-providers": {
    title: "Model Providers",
    description: "Direct integrations with AI model providers",
    descriptionKo: "AI 모델 제공업체와의 직접 인테그레이션",
  },
  gateways: {
    title: "Gateways",
    description: "Connect through API gateways and proxies",
    descriptionKo: "API 게이트웨이 및 프록시를 통해 연결하세요",
  },
  "no-code": {
    title: "No-Code",
    description: "No-code agent builders and tools",
    descriptionKo: "노코드 에이전트 빌더 및 도구",
  },
  analytics: {
    title: "Analytics",
    description:
      "Analytics tools that can visualize Langfuse traces and metrics",
    descriptionKo: "Langfuse 트레이스와 메트릭을 시각화할 수 있는 분석 도구",
  },
  data: {
    title: "Data Platform",
    description:
      "Use Langfuse data and metrics in your own application and data platform",
    descriptionKo:
      "Langfuse 데이터와 메트릭을 여러분의 애플리케이션과 데이터 플랫폼에서 활용하세요",
    additionalLinks: additionalLinksFromMeta(dataPlatformIntegrationsMeta),
  },
  "developer-tools": {
    title: "Developer Tools",
    description:
      "Trace AI coding assistants, editors, and CLIs, or use Langfuse directly from your editor",
    descriptionKo:
      "AI 코딩 어시스턴트, 에디터, CLI를 트레이싱하거나 에디터에서 직접 Langfuse를 사용하세요",
  },
  other: {
    title: "Other",
    description: "Other integrations",
    descriptionKo: "기타 인테그레이션",
  },
};

export const categoryOrder = Object.keys(categoryConfig);

type IntegrationPage = { route: string; name?: string; frontMatter: any };
type ProcessedIntegrationPage = IntegrationPage & { title: string };

function IntegrationLogo({ frontMatter }: { frontMatter: any }) {
  if (!frontMatter?.logo) return null;
  const logoAppearance = frontMatter.logoAppearance;

  return (
    <img
      src={frontMatter.logo}
      alt=""
      className={cn(
        "w-5 h-5 object-contain",
        logoAppearance === "dark" && "dark:brightness-0 dark:invert",
        logoAppearance === "light" && "invert dark:invert-0",
      )}
    />
  );
}

function loadFilesystemPages(category: string, lang: Lang): IntegrationPage[] {
  const source = lang === "ko" ? integrationsKrSource : integrationsSource;
  const routePrefix = lang === "ko" ? "/integrations/kr" : "/integrations";
  try {
    const allParams = source.generateParams();
    return allParams
      .filter(({ slug }) => slug.length >= 2 && slug[0] === category)
      .map(({ slug }) => {
        const page = source.getPage(slug);
        if (!page) return null;
        return {
          route: `${routePrefix}/${slug.join("/")}`,
          name: String(slug[slug.length - 1] || ""),
          frontMatter: page.data as unknown as Record<string, unknown>,
        } as IntegrationPage;
      })
      .filter(Boolean) as IntegrationPage[];
  } catch {
    return [];
  }
}

function processPages(pages: IntegrationPage[]): ProcessedIntegrationPage[] {
  return pages
    .map((page) => ({
      ...page,
      title:
        page.frontMatter?.sidebarTitle || page.frontMatter?.title || page.name,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

function getCategory(category: string, lang: Lang = "en") {
  const config = categoryConfig[category];
  if (!config) return null;

  const filesystemPages = loadFilesystemPages(category, lang);
  const mergedPages = [
    ...(config.additionalLinks ?? []),
    ...(filesystemPages ?? []),
  ];

  if (mergedPages.length === 0) return null;

  const description =
    (lang === "ko" ? config.descriptionKo : undefined) ?? config.description;
  const featured = config.featuredLinks?.map((link) => ({
    ...link,
    route: localizeRoute(link.route, lang),
  }));

  return {
    config: { ...config, description },
    pages: processPages(mergedPages),
    featured,
  };
}

function IntegrationCards({
  pages,
  featured,
}: {
  pages: ProcessedIntegrationPage[];
  featured?: ProcessedIntegrationPage[];
}) {
  return (
    <>
      {featured && featured.length > 0 && (
        <Cards num={3}>
          {featured.slice(0, 6).map((page) => (
            <Cards.Card
              href={page.route}
              key={page.route}
              title={page.title}
              className=""
              icon={
                page.frontMatter?.logo ? (
                  <IntegrationLogo frontMatter={page.frontMatter} />
                ) : undefined
              }
              arrow
            >
              {""}
            </Cards.Card>
          ))}
        </Cards>
      )}
      <div className={featured && featured.length > 0 ? "mt-4" : ""}>
        <Cards num={3}>
          {pages
            .filter((p) => !(featured || []).some((f) => f.route === p.route))
            .map((page) => (
              <Cards.Card
                href={page.route}
                key={page.route}
                title={page.title}
                className=""
                icon={
                  page.frontMatter?.logo ? (
                    <IntegrationLogo frontMatter={page.frontMatter} />
                  ) : undefined
                }
                arrow
              >
                {""}
              </Cards.Card>
            ))}
        </Cards>
      </div>
    </>
  );
}

/**
 * Renders a single integration category's description and cards.
 * Headings are expected to be provided in the MDX so they appear in the TOC.
 */
export function IntegrationCategory({
  category,
  lang = "en",
}: {
  category: string;
  lang?: Lang;
}) {
  const data = getCategory(category, lang);
  if (!data) return null;

  return (
    <div className="mb-6">
      <p className="text-sm text-text-tertiary -mt-4 mb-4">
        {data.config.description}
      </p>
      <IntegrationCards pages={data.pages} featured={data.featured} />
    </div>
  );
}

/**
 * Legacy wrapper that renders all categories with headings inline.
 * Prefer using IntegrationCategory per-section in MDX for TOC support.
 */
export const IntegrationIndex = () => {
  return (
    <>
      {categoryOrder
        .filter((category) => getCategory(category) !== null)
        .map((category) => {
          const data = getCategory(category)!;
          return (
            <div key={category} className="my-10">
              <h3 className="font-semibold tracking-tight text-text-primary text-2xl mb-1">
                {data.config.title}
              </h3>
              <p className="text-sm text-text-tertiary mb-4">
                {data.config.description}
              </p>
              <IntegrationCards pages={data.pages} featured={data.featured} />
            </div>
          );
        })}
    </>
  );
};
