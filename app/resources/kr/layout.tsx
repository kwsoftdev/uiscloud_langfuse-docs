import { resourcesKrSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function KrResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout
      tree={resourcesKrSource.getPageTree()}
      showSecondaryNav={false}
      sectionLabel="리소스"
    >
      {children}
    </SharedDocsLayout>
  );
}
