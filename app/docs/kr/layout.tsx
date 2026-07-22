import { docsKrSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function KrDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout tree={docsKrSource.getPageTree()} sectionLabel="문서">
      {children}
    </SharedDocsLayout>
  );
}
