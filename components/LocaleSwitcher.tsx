"use client";

import Link from "next/link";
import { getStrings, type SupportedLocale } from "@/lib/i18n/strings";
import { writeLangPref } from "@/lib/i18n/langPref";

export type LocaleLink = { lang: SupportedLocale; href: string };

/**
 * Small text-link switcher rendered in the doc chrome top bar (next to the
 * copy-as-markdown button) when a translated counterpart of the current page
 * exists. Renders nothing when there is only one locale to link to — pages
 * without a translation stay silent rather than advertising a missing one.
 *
 * Clicking a link also persists the site-wide language preference (see
 * lib/i18n/langPref.ts), same as LanguagePreferenceToggle, so a reader who
 * switches here stays on their chosen language on their next visit too.
 */
export function LocaleSwitcher({
  current,
  links,
}: {
  current: SupportedLocale;
  links: LocaleLink[];
}) {
  const others = links.filter((l) => l.lang !== current);
  if (others.length === 0) return null;
  const strings = getStrings(current);

  return (
    <div className="inline-flex items-center gap-2 text-xs text-fd-muted-foreground">
      {others.map((l) => (
        <Link
          key={l.lang}
          href={l.href}
          onClick={() => {
            if (l.lang === "en" || l.lang === "ko") writeLangPref(l.lang);
          }}
          className="underline underline-offset-2 decoration-1 hover:no-underline hover:text-fd-foreground"
        >
          {strings.switchTo[l.lang]}
        </Link>
      ))}
    </div>
  );
}
