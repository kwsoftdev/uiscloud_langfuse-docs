import { selfHostingSource, selfHostingKrSource } from "@/lib/source";
import { createLocalizedDocRoute } from "@/lib/i18n/localizedSection";
import SelfHostHelpFooter from "@/components-mdx/self-host-help-footer.mdx";

const route = createLocalizedDocRoute({
  source: selfHostingKrSource,
  locale: "ko",
  urlSection: "self-hosting/kr",
  sectionTitle: "Self-hosting",
  siblings: {
    en: { urlSection: "self-hosting", source: selfHostingSource },
  },
  getBodyChromeProps: (page) => ({
    versionLabel: (page.data as { label?: string }).label ?? null,
  }),
  extraBottomSuffix: <SelfHostHelpFooter />,
});

export default route.Page;
export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
