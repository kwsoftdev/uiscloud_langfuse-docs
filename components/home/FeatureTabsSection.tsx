"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { HomeSection } from "./HomeSection";
import { FeatureTabs, featureTabsData } from "./feature-tabs";
import { Heading } from "../ui/heading";
import { TextHighlight } from "../ui/text-highlight";
import { mobileFeatureTabsData, featureTabsKoText } from "./feature-tabs/data";
import { isKoreanPath } from "@/lib/i18n/koPaths";

export function FeatureTabsSection() {
  const ko = isKoreanPath(usePathname());
  const features = useMemo(
    () =>
      ko
        ? featureTabsData.map((f) => ({ ...f, ...featureTabsKoText[f.id] }))
        : featureTabsData,
    [ko],
  );

  return (
    <HomeSection id="overview" className="pt-[120px]">
      <div className="flex items-start mb-6 md:hidden">
        <Heading className="text-left">
          {ko ? (
            <>
              트레이스를{" "}
              <TextHighlight className="whitespace-nowrap">
                깊이 있게
              </TextHighlight>{" "}
              들여다보세요
            </>
          ) : (
            <>
              Gain{" "}
              <TextHighlight className="whitespace-nowrap">
                deep visibility
              </TextHighlight>{" "}
              into your traces
            </>
          )}
        </Heading>
      </div>

      <Suspense>
        <FeatureTabs
          features={features}
          mobileFeature={mobileFeatureTabsData}
        />
      </Suspense>
    </HomeSection>
  );
}
