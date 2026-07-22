import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildLocalizedAlternates } from "@/lib/localization";
import { getStrings, type SupportedLocale } from "@/lib/i18n/strings";
import type { LocaleLink } from "@/components/LocaleSwitcher";

type AnySource = {
  getPage: (slug: string[]) => any;
  getPages: () => any[];
  generateParams: () => { slug: string[] }[];
};

/** Maps a `SupportedLocale` to the hreflang value search engines expect. */
const HREFLANG: Record<SupportedLocale, string> = {
  en: "en",
  ja: "ja-JP",
  ko: "ko-KR",
};

type SiblingLocale = {
  /** URL path this sibling locale lives under, e.g. "guides" or "guides/kr". */
  urlSection: string;
  source: AnySource;
};

export type LocalizedDocRoute = {
  Page: (props: {
    params: Promise<{ slug?: string[] }>;
  }) => Promise<React.JSX.Element>;
  generateMetadata: (props: {
    params: Promise<{ slug?: string[] }>;
  }) => Promise<Metadata>;
  generateStaticParams: () => { slug?: string[] }[];
};

/**
 * Builds the {Page, generateMetadata, generateStaticParams} trio for one
 * locale's route within a translated section — e.g. the "en" side of
 * /academy or the "ko" side of /guides/kr. Both the default-locale route and
 * its translations use this same factory (symmetric: each just lists the
 * others as `siblings`), so hreflang and the locale switcher are always
 * built consistently instead of hand-rolled per section.
 *
 * See app/academy/(en)/[[...slug]]/page.tsx and
 * app/academy/japan/[[...slug]]/page.tsx for the canonical two-locale
 * example, and app/guides/kr/[[...slug]]/page.tsx for a from-scratch
 * translation added on top of an existing English-only section.
 */
export function createLocalizedDocRoute(opts: {
  source: AnySource;
  /** Real BCP47 language code for this route — drives html lang + strings. */
  locale: SupportedLocale;
  /** URL path this route lives under, e.g. "academy" or "guides/kr". */
  urlSection: string;
  /** Human-readable section title used in <title>/OG metadata. */
  sectionTitle: string;
  /** The other locale(s) of this same section, for hreflang + switcher. */
  siblings: Partial<Record<SupportedLocale, SiblingLocale>>;
  defaultLocale?: SupportedLocale;
  /** Rendered on the section's index page only (slug === []). */
  translationCredit?: { name: string; url: string };
  /** Extra bodyChromeProps merged in per-page (e.g. self-hosting's versionLabel). */
  getBodyChromeProps?: (page: any) => Record<string, unknown>;
  /** Extra node appended into bottomSuffix on every page (e.g. self-hosting's shared footer). */
  extraBottomSuffix?: React.ReactNode;
}): LocalizedDocRoute {
  const {
    source,
    locale,
    urlSection,
    sectionTitle,
    siblings,
    defaultLocale = "en",
    translationCredit,
    getBodyChromeProps,
    extraBottomSuffix,
  } = opts;

  async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug = [] } = await params;
    const page = source.getPage(slug);
    if (!page) notFound();

    const strings = getStrings(locale);
    const localeLinks: LocaleLink[] = [
      { lang: locale, href: `/${urlSection}` },
    ];
    for (const [sibLocale, sibling] of Object.entries(siblings) as [
      SupportedLocale,
      SiblingLocale,
    ][]) {
      if (sibling.source.getPage(slug)) {
        const slugPath = slug.length > 0 ? `/${slug.join("/")}` : "";
        localeLinks.push({
          lang: sibLocale,
          href: `/${sibling.urlSection}${slugPath}`,
        });
      }
    }

    const isIndexPage = slug.length === 0;

    return (
      <DocsChromePage
        page={page}
        bodyChromeProps={{
          lang: locale === "en" ? undefined : locale,
          localeLinks,
          ...(getBodyChromeProps?.(page) ?? {}),
        }}
        bottomSuffix={
          (translationCredit && isIndexPage) || extraBottomSuffix ? (
            <>
              {translationCredit && isIndexPage && (
                <div className="mt-10 text-right text-xs italic text-fd-muted-foreground">
                  {strings.translatedBy}{" "}
                  <a
                    href={translationCredit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 decoration-1 hover:no-underline"
                  >
                    {translationCredit.name}
                  </a>
                </div>
              )}
              {extraBottomSuffix}
            </>
          ) : undefined
        }
      />
    );
  }

  async function generateMetadata({
    params,
  }: {
    params: Promise<{ slug?: string[] }>;
  }): Promise<Metadata> {
    const { slug = [] } = await params;
    const page = source.getPage(slug);
    if (!page) return { title: "Not Found" };

    const routes: Record<string, string> = {
      [HREFLANG[locale]]: `/${urlSection}`,
    };
    for (const [sibLocale, sibling] of Object.entries(siblings) as [
      SupportedLocale,
      SiblingLocale,
    ][]) {
      if (sibling.source.getPage(slug)) {
        routes[HREFLANG[sibLocale]] = `/${sibling.urlSection}`;
      }
    }

    return buildSectionMetadata(page, urlSection, sectionTitle, slug, {
      languages: buildLocalizedAlternates({
        slug,
        defaultLocale: HREFLANG[defaultLocale],
        routes,
      }),
    });
  }

  function generateStaticParams() {
    return source
      .generateParams()
      .map((p: { slug: string[] }) =>
        p.slug.length > 0 ? { slug: p.slug } : {},
      );
  }

  return { Page, generateMetadata, generateStaticParams };
}
