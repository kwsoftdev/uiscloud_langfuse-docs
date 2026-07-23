import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  promptEngineeringSource,
  promptEngineeringKrSource,
} from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildLocalizedAlternates } from "@/lib/localization";
import type { LocaleLink } from "@/components/LocaleSwitcher";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function PromptEngineeringPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = promptEngineeringSource.getPage(slug);
  if (!page) notFound();

  const localeLinks: LocaleLink[] = [
    { lang: "en", href: "/prompt-engineering" },
  ];
  if (promptEngineeringKrSource.getPage(slug)) {
    const slugPath = slug.length > 0 ? `/${slug.join("/")}` : "";
    localeLinks.push({ lang: "ko", href: `/prompt-engineering/kr${slugPath}` });
  }

  return <DocsChromePage page={page} bodyChromeProps={{ localeLinks }} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = promptEngineeringSource.getPage(slug);
  if (!page) return { title: "Not Found" };

  const languages = promptEngineeringKrSource.getPage(slug)
    ? buildLocalizedAlternates({
        slug,
        defaultLocale: "en",
        routes: {
          en: "/prompt-engineering",
          "ko-KR": "/prompt-engineering/kr",
        },
      })
    : undefined;

  return buildSectionMetadata(
    page,
    "prompt-engineering",
    "Prompt Engineering",
    slug,
    { languages },
  );
}

export function generateStaticParams() {
  return promptEngineeringSource.generateParams();
}
