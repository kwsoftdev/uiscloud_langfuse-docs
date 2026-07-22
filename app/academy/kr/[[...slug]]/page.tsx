import { academySource, academyJaSource, academyKrSource } from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";

const route = createLocalizedDocRoute({
  source: academyKrSource,
  locale: "ko",
  urlSection: "academy/kr",
  sectionTitle: "Academy",
  siblings: {
    en: { urlSection: "academy", source: academySource },
    ja: { urlSection: "academy/japan", source: academyJaSource },
  },
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
