import { handbookKrSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function KrHandbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout
      tree={handbookKrSource.getPageTree()}
      showSecondaryNav={false}
      sectionLabel="핸드북"
    >
      {children}
    </SharedDocsLayout>
  );
}
