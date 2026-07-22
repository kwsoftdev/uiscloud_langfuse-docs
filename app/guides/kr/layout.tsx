import { guidesKrSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function KrGuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout tree={guidesKrSource.getPageTree()} sectionLabel="문서">
      {children}
    </SharedDocsLayout>
  );
}
