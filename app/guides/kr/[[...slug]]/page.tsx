import { guidesSource, guidesKrSource } from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";

const route = createLocalizedDocRoute({
  source: guidesKrSource,
  locale: "ko",
  urlSection: "guides/kr",
  sectionTitle: "Guides",
  siblings: {
    en: { urlSection: "guides", source: guidesSource },
  },
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
