import { academySource, academyJaSource, academyKrSource } from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";

const route = createLocalizedDocRoute({
  source: academySource,
  locale: "en",
  urlSection: "academy",
  sectionTitle: "Academy",
  siblings: {
    ja: { urlSection: "academy/japan", source: academyJaSource },
    ko: { urlSection: "academy/kr", source: academyKrSource },
  },
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
