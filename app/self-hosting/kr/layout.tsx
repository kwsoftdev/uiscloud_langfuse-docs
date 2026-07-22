import { selfHostingKrSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function KrSelfHostingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout
      tree={selfHostingKrSource.getPageTree()}
      sectionLabel="문서"
    >
      {children}
    </SharedDocsLayout>
  );
}
