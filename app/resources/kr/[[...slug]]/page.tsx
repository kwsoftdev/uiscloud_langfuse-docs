import { resourcesSource, resourcesKrSource } from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";

const route = createLocalizedDocRoute({
  source: resourcesKrSource,
  locale: "ko",
  urlSection: "resources/kr",
  sectionTitle: "Resources",
  siblings: {
    en: { urlSection: "resources", source: resourcesSource },
  },
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
