import { source, docsKrSource } from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";

const route = createLocalizedDocRoute({
  source: docsKrSource,
  locale: "ko",
  urlSection: "docs/kr",
  sectionTitle: "Docs",
  siblings: {
    en: { urlSection: "docs", source: source },
  },
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
