import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guidesSource, guidesKrSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildPageUrl } from "@/lib/og-url";
import { buildLocalizedAlternates } from "@/lib/localization";
import { COOKBOOK_ROUTE_MAPPING } from "@/lib/cookbook_route_mapping";
import type { LocaleLink } from "@/components/LocaleSwitcher";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function GuidesPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = guidesSource.getPage(slug);
  if (!page) notFound();

  const localeLinks: LocaleLink[] = [{ lang: "en", href: "/guides" }];
  if (guidesKrSource.getPage(slug)) {
    const slugPath = slug.length > 0 ? `/${slug.join("/")}` : "";
    localeLinks.push({ lang: "ko", href: `/guides/kr${slugPath}` });
  }

  return <DocsChromePage page={page} bodyChromeProps={{ localeLinks }} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = guidesSource.getPage(slug);
  if (!page) return { title: "Not Found" };

  // Guides generated from cookbook notebooks can point their canonical URL at
  // the corresponding docs page via COOKBOOK_ROUTE_MAPPING. An explicit
  // `canonical` field in frontmatter still wins.
  const pagePath = `/guides${slug.length > 0 ? `/${slug.join("/")}` : ""}`;
  const mapping = COOKBOOK_ROUTE_MAPPING.find(
    (r) => r.path === pagePath && r.canonicalPath,
  );
  const canonicalFallback = mapping?.canonicalPath
    ? buildPageUrl(mapping.canonicalPath)
    : null;

  const languages = guidesKrSource.getPage(slug)
    ? buildLocalizedAlternates({
        slug,
        defaultLocale: "en",
        routes: { en: "/guides", "ko-KR": "/guides/kr" },
      })
    : undefined;

  return buildSectionMetadata(page, "guides", "Guides", slug, {
    canonicalFallback,
    languages,
  });
}

export function generateStaticParams() {
  return guidesSource.generateParams();
}
