/**
 * Minimal UI-chrome string dictionary for localized doc sections (e.g.
 * /academy/japan, /guides/kr). This is intentionally not a full i18n
 * framework (next-intl etc.) — the site is a content site, not an app, so
 * only the handful of chrome strings that actually render on localized
 * pages need translations. Content itself is translated per-file in MDX.
 *
 * Keyed by real BCP47 language code ("ko", not the URL segment "kr") because
 * this same code drives the HTML `lang` attribute (via DocBodyChrome) and
 * hreflang alternates — those must be valid language tags regardless of what
 * URL segment a section chooses to use. See lib/i18n/localizedSection.tsx for
 * the urlSegment <-> lang mapping.
 *
 * Add a locale by adding a key to `dictionaries` below; every entry falls
 * back to `en` for any missing key.
 */

export type SupportedLocale = "en" | "ja" | "ko";

type Dictionary = {
  /** Heading above the thumbs up/down feedback widget. */
  pageHelpful: string;
  /** Copy-page button label (idle state). */
  copyPage: string;
  /** Copy-page button label while the fetch is in flight. */
  copying: string;
  /** Locale switcher link label, per target locale. */
  switchTo: Record<SupportedLocale, string>;
  /** Prefix before the translator/agency credit line. */
  translatedBy: string;
};

const en: Dictionary = {
  pageHelpful: "Was this page helpful?",
  copyPage: "Copy page",
  copying: "Copying...",
  switchTo: { en: "English", ja: "日本語", ko: "한국어" },
  translatedBy: "Translation by",
};

const dictionaries: Record<SupportedLocale, Dictionary> = {
  en,
  ja: {
    ...en,
    pageHelpful: "このページは役に立ちましたか?",
    switchTo: en.switchTo,
    translatedBy: "翻訳:",
  },
  ko: {
    ...en,
    pageHelpful: "이 페이지가 도움이 되었나요?",
    copyPage: "페이지 복사",
    copying: "복사 중...",
    switchTo: en.switchTo,
    translatedBy: "번역:",
  },
};

export function getStrings(locale?: string | null): Dictionary {
  return dictionaries[locale as SupportedLocale] ?? en;
}
