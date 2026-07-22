"use client";

import Image, { type StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import { HomeSection } from "./HomeSection";
import { Heading, TextHighlight, ChipCard } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { FeaturedCustomers } from "./FeaturedCustomers";
import { isKoreanPath } from "@/lib/i18n/koPaths";
import observabilityVisual from "./img/tools/observability.png";
import promptManagementVisual from "./img/tools/prompt.png";
import evaluationVisual from "./img/tools/evaluation.png";
import playgroundVisual from "./img/tools/playground.png";
import experimentsVisual from "./img/tools/experiments.png";
import humanAnnotationVisual from "./img/tools/human.png";
import metricsAlertsVisual from "./img/tools/metrics.png";

const toolDescriptionClassName =
  "text-left sm:text-[14px] font-normal not-italic leading-[150%] tracking-[-0.07px] text-text-tertiary";

type ToolEntry = {
  title: string;
  description: string;
  href: string;
  tooltip: string;
  span: string;
  visual: StaticImageData;
};

const tools: ToolEntry[] = [
  {
    title: "Observability",
    description:
      "Hierarchical traces capture every LLM call, tool invocation, and retrieval step. Filter by user, session, cost, latency, or custom metadata.",
    href: "/docs/tracing",
    tooltip: "Read more",
    span: "col-span-1",
    visual: observabilityVisual as StaticImageData,
  },
  {
    title: "Evaluation",
    description:
      "LLM-as-a-judge, heuristic functions, or human review. Run evaluators on production data or during experiments.",
    href: "/docs/scores",
    tooltip: "Read more",
    span: "col-span-1",
    visual: evaluationVisual,
  },
  {
    title: "Prompt Management",
    description:
      "Separate prompts from code with one-click deployments and rollbacks. Turn improving your production prompts a team sport.",
    href: "/docs/prompts",
    tooltip: "Read more",
    span: "col-span-1",
    visual: promptManagementVisual as StaticImageData,
  },
  {
    title: "Playground",
    description:
      "Test prompts on real production inputs and compare models side-by-side.",
    href: "/docs/playground",
    tooltip: "Read more",
    span: "col-span-1",
    visual: playgroundVisual as StaticImageData,
  },
  {
    title: "Experiments",
    description:
      "Define test cases and run experiments. Compare results side by side.",
    href: "/docs/experimentation",
    tooltip: "Read more",
    span: "col-span-1",
    visual: experimentsVisual as StaticImageData,
  },
  {
    title: "Human Annotation",
    description:
      "Collaborative Human-in the-Loop workflows to review traces and create golden datasets.",
    href: "/docs/evaluation/evaluation-methods/annotation-queues",
    tooltip: "Read more",
    span: "col-span-1",
    visual: humanAnnotationVisual as StaticImageData,
  },
  {
    title: "Cost & Latency",
    description:
      "Monitor cost, latency, and quality with dashboards and automated alerts.",
    href: "/docs/analytics",
    tooltip: "Read more",
    span: "col-span-1",
    visual: metricsAlertsVisual as StaticImageData,
  },
];

const toolsKoText: Record<string, { title: string; description: string }> = {
  Observability: {
    title: "관측성",
    description:
      "계층적 트레이스로 모든 LLM 호출, 도구 실행, 검색 단계를 기록합니다. 사용자, 세션, 비용, 지연 시간, 커스텀 메타데이터로 필터링하세요.",
  },
  Evaluation: {
    title: "평가",
    description:
      "LLM-as-a-judge, 휴리스틱 함수, 사람의 리뷰 중 선택하세요. 프로덕션 데이터나 실험 중에 평가기를 실행할 수 있습니다.",
  },
  "Prompt Management": {
    title: "프롬프트 관리",
    description:
      "원클릭 배포와 롤백으로 프롬프트를 코드에서 분리하세요. 프로덕션 프롬프트 개선을 팀 전체가 함께하는 작업으로 만듭니다.",
  },
  Playground: {
    title: "플레이그라운드",
    description:
      "실제 프로덕션 입력값으로 프롬프트를 테스트하고 모델을 나란히 비교하세요.",
  },
  Experiments: {
    title: "실험",
    description:
      "테스트 케이스를 정의하고 실험을 실행하세요. 결과를 나란히 비교할 수 있습니다.",
  },
  "Human Annotation": {
    title: "Human Annotation",
    description:
      "협업 기반 Human-in-the-Loop 워크플로로 트레이스를 검토하고 골든 데이터셋을 만드세요.",
  },
  "Cost & Latency": {
    title: "비용 & 지연 시간",
    description:
      "대시보드와 자동 알림으로 비용, 지연 시간, 품질을 모니터링하세요.",
  },
};

export function AllTheTools() {
  const ko = isKoreanPath(usePathname());
  const readMore = ko ? "더 알아보기" : "Read more";
  return (
    <HomeSection id="platform-features" className="pt-[120px]">
      <div className="flex flex-col gap-4 items-start mb-10">
        <Heading className="sm:max-w-none max-w-[24ch]">
          {ko ? (
            <>
              모든 도구를{" "}
              <TextHighlight className="sm:pr-1.5">하나로</TextHighlight>
              <TextHighlight>통합한 플랫폼.</TextHighlight>
            </>
          ) : (
            <>
              All the tools,{" "}
              <TextHighlight className="sm:pr-1.5">one</TextHighlight>
              <TextHighlight>integrated platform.</TextHighlight>
            </>
          )}
        </Heading>
        <Text className="text-left max-w-[46ch]">
          {ko
            ? "프로토타입부터 프로덕션 규모까지, 트레이싱·프롬프트 관리·평가·실험을 하나의 통합 플랫폼에서."
            : "One integrated platform to trace, manage prompts, evaluate, and experiment from prototype to production scale."}
        </Text>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
            {tools.slice(0, 3).map((tool) => {
              const text = ko ? toolsKoText[tool.title] : tool;
              return (
                <ChipCard
                  key={tool.title}
                  href={tool.href}
                  tooltip={readMore}
                  className="flex flex-col items-stretch p-0 w-full min-w-0 h-full"
                >
                  <div className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden sm:max-h-[200px] sm:flex-row xl:max-h-[337px] xl:flex-col">
                    <div className="flex relative z-10 flex-1 flex-col gap-1 p-4 pb-1 sm:pb-2.5">
                      <Text
                        size="m"
                        className="font-medium text-left text-text-secondary"
                      >
                        {text.title}
                      </Text>
                      <Text size="s" className={toolDescriptionClassName}>
                        {text.description}
                      </Text>
                    </div>
                    <div className="flex-1 w-full overflow-clip -mt-[20%] sm:mt-0 xl:-mt-[20%] pointer-events-none">
                      <Image
                        src={tool.visual}
                        alt={text.title}
                        width={100}
                        height={100}
                        className="object-contain w-full h-full"
                        quality={100}
                        unoptimized
                      />
                    </div>
                  </div>
                </ChipCard>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
            {tools.slice(3).map((tool) => {
              const text = ko ? toolsKoText[tool.title] : tool;
              return (
                <ChipCard
                  key={tool.title}
                  href={tool.href}
                  tooltip={readMore}
                  className="flex flex-col items-stretch p-0 w-full min-w-0 h-full"
                >
                  <div className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden xl:min-h-[277px] lg:max-h-[277px]">
                    <div className="flex relative z-10 flex-col gap-1 p-2 pb-2.5 sm:p-4">
                      <Text
                        size="m"
                        className="font-medium text-left text-text-secondary"
                      >
                        {text.title}
                      </Text>
                      <Text size="s" className={toolDescriptionClassName}>
                        {text.description}
                      </Text>
                    </div>
                    <div className="hidden flex-1 -mt-[20%] w-full overflow-clip xl:flex">
                      <Image
                        src={tool.visual}
                        alt={text.title}
                        width={100}
                        height={100}
                        className="object-contain w-full h-full"
                        quality={100}
                        unoptimized
                      />
                    </div>
                  </div>
                </ChipCard>
              );
            })}
          </div>
        </div>
        <FeaturedCustomers />
      </div>
    </HomeSection>
  );
}
