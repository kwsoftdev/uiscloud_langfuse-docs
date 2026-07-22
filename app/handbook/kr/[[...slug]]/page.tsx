import { handbookSource, handbookKrSource } from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";

const route = createLocalizedDocRoute({
  source: handbookKrSource,
  locale: "ko",
  urlSection: "handbook/kr",
  sectionTitle: "Handbook",
  siblings: {
    en: { urlSection: "handbook", source: handbookSource },
  },
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
