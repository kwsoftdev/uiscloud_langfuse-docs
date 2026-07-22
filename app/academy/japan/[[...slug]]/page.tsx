import { academySource, academyJaSource, academyKrSource } from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";

const route = createLocalizedDocRoute({
  source: academyJaSource,
  locale: "ja",
  urlSection: "academy/japan",
  sectionTitle: "Academy",
  siblings: {
    en: { urlSection: "academy", source: academySource },
    ko: { urlSection: "academy/kr", source: academyKrSource },
  },
  translationCredit: { name: "GAO, Inc.", url: "https://gao-ai.com" },
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
