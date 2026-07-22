"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toKoreanPath } from "@/lib/i18n/koPaths";
import { readLangPref, writeLangPref } from "@/lib/i18n/langPref";

/**
 * Site-wide default-locale redirect for the 8 translated sections
 * (docs, guides, faq, academy, handbook, security, resources, self-hosting).
 *
 * Korean is the default for every visitor: landing on the English path of a
 * translated section redirects to its /kr counterpart unless the visitor has
 * explicitly chosen "English" before (via LanguagePreferenceToggle or
 * LocaleSwitcher, both of which call writeLangPref("en")).
 *
 * Pure client-side redirect (useEffect, no middleware) so it works identically
 * on the Vercel (SSR) and Cloudflare Pages (static export) deployments — a
 * static export has no server to run middleware on. The server-rendered
 * English page is still what crawlers and no-JS clients see; canonical +
 * hreflang tags on that page already point at the right locale pair.
 *
 * Mounted once in the root layout.
 */
export function LocalePreferenceRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (readLangPref() === "en") return; // explicit English choice — never override

    const target = toKoreanPath(pathname);
    if (!target) return;

    writeLangPref("ko");
    const suffix =
      typeof window !== "undefined"
        ? window.location.search + window.location.hash
        : "";
    router.replace(target + suffix);
  }, [pathname, router]);

  return null;
}
