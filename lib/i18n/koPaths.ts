/**
 * Single source of truth for which URL prefixes are Korean (`kr`) sections.
 * Used by client-side nav components (Navbar/NavLinks, MobileMenu,
 * DocsSecondaryNav) to decide whether to render Korean labels/links —
 * matching the server-side locale routes defined in lib/source.ts.
 */
export const KO_SECTION_PREFIXES = [
  "/docs/kr",
  "/guides/kr",
  "/faq/kr",
  "/academy/kr",
  "/handbook/kr",
  "/security/kr",
  "/resources/kr",
  "/self-hosting/kr",
  "/integrations/kr",
] as const;

/** The Korean homepage — a single page (like /japan), not a section with sub-pages. */
export const KO_HOME_PATH = "/kr";

export function isKoreanPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (pathname === KO_HOME_PATH) return true;
  return KO_SECTION_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** English section roots, derived from KO_SECTION_PREFIXES by dropping "/kr". */
const EN_SECTION_PREFIXES = KO_SECTION_PREFIXES.map((p) =>
  p.replace(/\/kr$/, ""),
);

/**
 * Sub-paths within a translated section that have NO Korean counterpart, so
 * the auto-redirect (see LocalePreferenceRedirect) must leave them on the
 * English page instead of sending visitors to a 404.
 *  - /guides/cookbook/** — generated from notebooks, out of translation scope.
 *  - /faq/tag/**         — virtual tag-listing route, no backing MDX file.
 */
const EN_REDIRECT_EXCLUDE = ["/guides/cookbook", "/faq/tag"];

/**
 * Maps an English section path to its Korean counterpart, e.g.
 * "/docs/observability/overview" -> "/docs/kr/observability/overview".
 * Returns null when the path isn't an English section path, is already a
 * Korean path, or falls in a known untranslated sub-path.
 */
export function toKoreanPath(
  pathname: string | null | undefined,
): string | null {
  if (!pathname || isKoreanPath(pathname)) return null;
  if (pathname === "/") return KO_HOME_PATH;
  if (EN_REDIRECT_EXCLUDE.some((ex) => pathname.startsWith(ex))) return null;

  for (const prefix of EN_SECTION_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      const rest = pathname.slice(prefix.length);
      return `${prefix}/kr${rest}`;
    }
  }
  return null;
}

/**
 * Maps a Korean section path back to its English counterpart, e.g.
 * "/docs/kr/observability/overview" -> "/docs/observability/overview".
 * Returns null when the path isn't a Korean section path.
 */
export function toEnglishPath(
  pathname: string | null | undefined,
): string | null {
  if (!pathname) return null;
  if (pathname === KO_HOME_PATH) return "/";
  for (const prefix of KO_SECTION_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      const rest = pathname.slice(prefix.length);
      const enPrefix = prefix.replace(/\/kr$/, "");
      return `${enPrefix}${rest}`;
    }
  }
  return null;
}
