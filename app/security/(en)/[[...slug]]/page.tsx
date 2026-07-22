import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { securitySource, securityKrSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildLocalizedAlternates } from "@/lib/localization";
import type { LocaleLink } from "@/components/LocaleSwitcher";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function SecurityPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = securitySource.getPage(slug);
  if (!page) notFound();

  const localeLinks: LocaleLink[] = [{ lang: "en", href: "/security" }];
  if (securityKrSource.getPage(slug)) {
    const slugPath = slug.length > 0 ? `/${slug.join("/")}` : "";
    localeLinks.push({ lang: "ko", href: `/security/kr${slugPath}` });
  }

  return <DocsChromePage page={page} bodyChromeProps={{ localeLinks }} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = securitySource.getPage(slug);
  if (!page) return { title: "Not Found" };

  const languages = securityKrSource.getPage(slug)
    ? buildLocalizedAlternates({
        slug,
        defaultLocale: "en",
        routes: { en: "/security", "ko-KR": "/security/kr" },
      })
    : undefined;

  return buildSectionMetadata(page, "security", "Security", slug, {
    languages,
  });
}

export function generateStaticParams() {
  return securitySource.generateParams();
}
