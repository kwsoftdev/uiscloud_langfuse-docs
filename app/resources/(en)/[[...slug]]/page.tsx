import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resourcesSource, resourcesKrSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildLocalizedAlternates } from "@/lib/localization";
import type { LocaleLink } from "@/components/LocaleSwitcher";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function ResourcesPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = resourcesSource.getPage(slug);
  if (!page) notFound();

  const localeLinks: LocaleLink[] = [{ lang: "en", href: "/resources" }];
  if (resourcesKrSource.getPage(slug)) {
    const slugPath = slug.length > 0 ? `/${slug.join("/")}` : "";
    localeLinks.push({ lang: "ko", href: `/resources/kr${slugPath}` });
  }

  return <DocsChromePage page={page} bodyChromeProps={{ localeLinks }} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = resourcesSource.getPage(slug);
  if (!page) return { title: "Not Found" };

  const languages = resourcesKrSource.getPage(slug)
    ? buildLocalizedAlternates({
        slug,
        defaultLocale: "en",
        routes: { en: "/resources", "ko-KR": "/resources/kr" },
      })
    : undefined;

  return buildSectionMetadata(page, "resources", "Resources", slug, {
    languages,
  });
}

export function generateStaticParams() {
  return resourcesSource.generateParams();
}
