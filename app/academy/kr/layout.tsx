import { academyKrSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function KrAcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout tree={academyKrSource.getPageTree()} sectionLabel="문서">
      {children}
    </SharedDocsLayout>
  );
}
