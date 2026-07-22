import { faqSource, faqKrSource } from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";

// Only real FAQ entries are translated — the /faq/tag/<tag> virtual route
// (see app/faq/(en)/[[...slug]]/page.tsx) has no Korean equivalent; any tag
// links inside translated FAQ content point back at the English /faq/tag/*.
const route = createLocalizedDocRoute({
  source: faqKrSource,
  locale: "ko",
  urlSection: "faq/kr",
  sectionTitle: "FAQ",
  siblings: {
    en: { urlSection: "faq", source: faqSource },
  },
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
