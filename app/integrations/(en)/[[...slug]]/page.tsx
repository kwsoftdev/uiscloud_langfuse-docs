import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { integrationsSource, integrationsKrSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildLocalizedAlternates } from "@/lib/localization";
import type { LocaleLink } from "@/components/LocaleSwitcher";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function IntegrationsPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = integrationsSource.getPage(slug);
  if (!page) notFound();

  const localeLinks: LocaleLink[] = [{ lang: "en", href: "/integrations" }];
  if (integrationsKrSource.getPage(slug)) {
    const slugPath = slug.length > 0 ? `/${slug.join("/")}` : "";
    localeLinks.push({ lang: "ko", href: `/integrations/kr${slugPath}` });
  }

  return <DocsChromePage page={page} bodyChromeProps={{ localeLinks }} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = integrationsSource.getPage(slug);
  if (!page) return { title: "Not Found" };

  const languages = integrationsKrSource.getPage(slug)
    ? buildLocalizedAlternates({
        slug,
        defaultLocale: "en",
        routes: { en: "/integrations", "ko-KR": "/integrations/kr" },
      })
    : undefined;

  return buildSectionMetadata(page, "integrations", "Integrations", slug, {
    languages,
  });
}

export function generateStaticParams() {
  return integrationsSource.generateParams();
}
