import { faqKrSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function KrFaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout tree={faqKrSource.getPageTree()} sectionLabel="문서">
      {children}
    </SharedDocsLayout>
  );
}
