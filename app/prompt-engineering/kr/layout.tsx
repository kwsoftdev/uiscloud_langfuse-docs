import { promptEngineeringKrSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function KrPromptEngineeringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout
      tree={promptEngineeringKrSource.getPageTree()}
      sectionLabel="문서"
    >
      {children}
    </SharedDocsLayout>
  );
}
