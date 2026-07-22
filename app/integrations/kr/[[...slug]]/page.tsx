import { integrationsSource, integrationsKrSource } from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";

const route = createLocalizedDocRoute({
  source: integrationsKrSource,
  locale: "ko",
  urlSection: "integrations/kr",
  sectionTitle: "Integrations",
  siblings: {
    en: { urlSection: "integrations", source: integrationsSource },
  },
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
