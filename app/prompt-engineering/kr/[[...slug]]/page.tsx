import {
  promptEngineeringSource,
  promptEngineeringKrSource,
} from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";

const route = createLocalizedDocRoute({
  source: promptEngineeringKrSource,
  locale: "ko",
  urlSection: "prompt-engineering/kr",
  sectionTitle: "Prompt Engineering",
  siblings: {
    en: { urlSection: "prompt-engineering", source: promptEngineeringSource },
  },
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
