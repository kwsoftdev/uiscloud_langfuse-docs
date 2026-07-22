"use client";

import { usePathname, useRouter } from "next/navigation";
import { isKoreanPath, toEnglishPath, toKoreanPath } from "@/lib/i18n/koPaths";
import { writeLangPref, type LangPref } from "@/lib/i18n/langPref";

/**
 * Persistent site-wide language switch shown in the primary nav's flexible
 * middle column (Navbar.tsx and NavbarDocs.tsx render it directly — the
 * right-hand column shared via NavbarExtraContent has a fixed ~240px budget
 * already spoken for by Get Demo / Launch App, too tight to add anything).
 * Sets the visitor's stored preference (see lib/i18n/langPref.ts) and, when
 * the current page has a counterpart in the target language, navigates
 * straight to it. On pages with no counterpart (homepage, blog, pricing,
 * changelog, …) it only stores the preference — switching to Korean then
 * lands on /docs/kr as a sensible default entry point.
 *
 * Single small button showing the language you'd switch *to* (same pattern
 * as the inline per-page LocaleSwitcher) rather than a two-way segmented
 * control, to stay as narrow as possible.
 */
export function LanguagePreferenceToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const currentIsKo = isKoreanPath(pathname);

  function choose(lang: LangPref) {
    writeLangPref(lang);
    if (lang === "ko") {
      router.push(toKoreanPath(pathname) ?? "/docs/kr");
    } else {
      const target = toEnglishPath(pathname);
      if (target) router.push(target);
    }
  }

  return (
    <button
      type="button"
      onClick={() => choose(currentIsKo ? "en" : "ko")}
      className="shrink-0 px-1.5 py-1 font-mono text-[11px] leading-none text-text-tertiary rounded transition-colors hover:text-text-secondary hover:bg-surface-1"
      aria-label={
        currentIsKo ? "Switch site language to English" : "한국어로 전환"
      }
    >
      {currentIsKo ? "EN" : "한국어"}
    </button>
  );
}
