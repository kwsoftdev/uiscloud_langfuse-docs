import { MobileMenu } from "@/components/MobileMenu";
import type { SectionNavData } from "@/lib/nav-tree";
import { InkeepSearchButton } from "./inkeep/InkeepSearchBar";

export function NavbarExtraContent({
  sectionNavData = [],
}: {
  sectionNavData?: SectionNavData[];
}) {
  return (
    <>
      <div className="lg:hidden">
        <InkeepSearchButton />
      </div>
      <MobileMenu sectionNavData={sectionNavData} />
    </>
  );
}
