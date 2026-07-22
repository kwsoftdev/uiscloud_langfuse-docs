import { securityKrSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function KrSecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout
      tree={securityKrSource.getPageTree()}
      showSecondaryNav={false}
      sectionLabel="보안"
    >
      {children}
    </SharedDocsLayout>
  );
}
