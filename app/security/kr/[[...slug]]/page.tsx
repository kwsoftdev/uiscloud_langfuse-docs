import { securitySource, securityKrSource } from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";

const route = createLocalizedDocRoute({
  source: securityKrSource,
  locale: "ko",
  urlSection: "security/kr",
  sectionTitle: "Security",
  siblings: {
    en: { urlSection: "security", source: securitySource },
  },
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
