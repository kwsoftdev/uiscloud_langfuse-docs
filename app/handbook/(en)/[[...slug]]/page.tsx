import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { handbookSource, handbookKrSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildLocalizedAlternates } from "@/lib/localization";
import type { LocaleLink } from "@/components/LocaleSwitcher";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function HandbookPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = handbookSource.getPage(slug);
  if (!page) notFound();

  const localeLinks: LocaleLink[] = [{ lang: "en", href: "/handbook" }];
  if (handbookKrSource.getPage(slug)) {
    const slugPath = slug.length > 0 ? `/${slug.join("/")}` : "";
    localeLinks.push({ lang: "ko", href: `/handbook/kr${slugPath}` });
  }

  return <DocsChromePage page={page} bodyChromeProps={{ localeLinks }} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = handbookSource.getPage(slug);
  if (!page) return { title: "Not Found" };

  const languages = handbookKrSource.getPage(slug)
    ? buildLocalizedAlternates({
        slug,
        defaultLocale: "en",
        routes: { en: "/handbook", "ko-KR": "/handbook/kr" },
      })
    : undefined;

  return buildSectionMetadata(page, "handbook", "Handbook", slug, {
    languages,
  });
}

export function generateStaticParams() {
  return handbookSource.generateParams();
}
