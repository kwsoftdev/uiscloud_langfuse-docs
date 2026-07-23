import { promptEngineeringSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function PromptEngineeringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout tree={promptEngineeringSource.getPageTree()}>
      {children}
    </SharedDocsLayout>
  );
}
