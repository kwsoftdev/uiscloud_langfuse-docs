import { integrationsKrSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function KrIntegrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout
      tree={integrationsKrSource.getPageTree()}
      sectionLabel="문서"
    >
      {children}
    </SharedDocsLayout>
  );
}
