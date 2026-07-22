"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { TextHighlight } from "@/components/ui";
import { HomeSection } from "@/components/home/HomeSection";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { cn } from "@/lib/utils";
import { HeroStatsStrip } from "@/components/home/HeroStatsStrip";
import { isKoreanPath } from "@/lib/i18n/koPaths";

export function Hero() {
  const ko = isKoreanPath(usePathname());
  return (
    <HomeSection className="pt-5 sm:pt-8 md:pt-[60px]">
      <CornerBox className="-mb-px -mt-px">
        <HeroStatsStrip />
      </CornerBox>
      <CornerBox className="flex flex-col gap-4 sm:gap-8 md:gap-10 items-center px-4 py-8 sm:px-8 sm:py-10">
        <Heading
          as="h1"
          size="big"
          className={cn(
            "flex-col items-center gap-0.5 sm:gap-1 md:gap-1.5 text-center font-medium leading-[105%] max-md:max-w-[500px]",
            "[leading-trim:both] [text-edge:cap]",
          )}
        >
          <TextHighlight
            highlightClassName="mix-blend-multiply"
            className="whitespace-nowrap"
          >
            {ko ? "오픈소스" : "Open Source"}
            <span className="inline max-[499px]:hidden">&nbsp;</span>
          </TextHighlight>
          <span className="flex min-[500px]:inline">
            <TextHighlight
              highlightClassName="mix-blend-multiply"
              className="whitespace-nowrap min-[500px]:pr-2"
            >
              {ko ? "에이전트 평가 &" : "Agent Evals &"}
            </TextHighlight>
          </span>
          <TextHighlight highlightClassName="mix-blend-multiply">
            {ko ? "옵저버빌리티" : "Observability"}
          </TextHighlight>
        </Heading>
        <Heading
          as="h1"
          size="big"
          className={cn(
            "flex sm:hidden flex-col items-center gap-1.5 text-center font-medium leading-[105%]",
            "[leading-trim:both] [text-edge:cap]",
          )}
        ></Heading>
        <div className="flex flex-col gap-6">
          <Text className="max-w-xl">
            {ko
              ? "하나의 오픈 플랫폼으로 AI 에이전트를 트레이싱하고, 평가하고, 개선하세요. 프로덕션 데이터로 동작을 파악하고, 함께 문제를 해결하며, 더 낮은 비용과 지연 시간으로 더 나은 품질을 제공하세요."
              : "Trace, evaluate, and improve AI agents with one open platform. Use production data to understand behavior, collaborate on fixes, and ship better quality at lower cost and latency."}
          </Text>
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <Button
              variant="primary"
              size="default"
              shortcutKey="s"
              href="/cloud"
            >
              {ko ? "무료로 시작하기" : "Start free"}
            </Button>
            <Button
              variant="secondary"
              size="default"
              shortcutKey="d"
              href={ko ? "/docs/kr" : "/docs"}
            >
              {ko ? "문서 보기" : "Documentation"}
            </Button>
          </div>
        </div>
      </CornerBox>
      <CornerBox className="pr-px pb-px -mt-px">
        <EnterpriseLogoGrid />
      </CornerBox>
    </HomeSection>
  );
}
