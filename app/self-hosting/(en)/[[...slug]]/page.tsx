import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { selfHostingSource, selfHostingKrSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import SelfHostHelpFooter from "@/components-mdx/self-host-help-footer.mdx";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildLocalizedAlternates } from "@/lib/localization";
import type { LocaleLink } from "@/components/LocaleSwitcher";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function SelfHostingPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = selfHostingSource.getPage(slug);
  if (!page) notFound();
  // Self-hosting pages may carry a `label` frontmatter field (e.g. "Version: v3")
  // that the docs chrome renders next to the copy button.
  const versionLabel = (page.data as { label?: string }).label ?? null;

  const localeLinks: LocaleLink[] = [{ lang: "en", href: "/self-hosting" }];
  if (selfHostingKrSource.getPage(slug)) {
    const slugPath = slug.length > 0 ? `/${slug.join("/")}` : "";
    localeLinks.push({ lang: "ko", href: `/self-hosting/kr${slugPath}` });
  }

  return (
    <DocsChromePage
      page={page}
      bodyChromeProps={{ versionLabel, localeLinks }}
      bottomSuffix={<SelfHostHelpFooter />}
    />
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = selfHostingSource.getPage(slug);
  if (!page) return { title: "Not Found" };

  const languages = selfHostingKrSource.getPage(slug)
    ? buildLocalizedAlternates({
        slug,
        defaultLocale: "en",
        routes: { en: "/self-hosting", "ko-KR": "/self-hosting/kr" },
      })
    : undefined;

  return buildSectionMetadata(page, "self-hosting", "Self-hosting", slug, {
    languages,
  });
}

export function generateStaticParams() {
  return selfHostingSource.generateParams();
}
