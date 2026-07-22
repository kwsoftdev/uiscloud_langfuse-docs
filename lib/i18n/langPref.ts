/** localStorage key for the visitor's persisted language preference ("en" | "ko"). */
export const LANG_PREF_KEY = "langfuse-lang-pref";

export type LangPref = "en" | "ko";

export function readLangPref(): LangPref | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(LANG_PREF_KEY);
    return value === "en" || value === "ko" ? value : null;
  } catch {
    return null;
  }
}

export function writeLangPref(pref: LangPref): void {
  try {
    window.localStorage.setItem(LANG_PREF_KEY, pref);
  } catch {
    // Ignore (private browsing / storage disabled) — preference just won't persist.
  }
}
