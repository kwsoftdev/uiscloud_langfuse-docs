"use client";

import { usePathname } from "next/navigation";
import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, Heading, Link, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { isKoreanPath } from "@/lib/i18n/koPaths";

const ASSISTANT_VIDEO_SRC =
  "https://static.langfuse.com/docs-videos/in-app-agent.mp4";

const ASSISTANT_HREF = "/docs/langfuse-assistant";

type ToolItem = {
  title: string;
  description: string;
  href: string;
  action: string;
  eyebrow: string;
};

const TOOL_ITEMS: ToolItem[] = [
  {
    title: "SKILL.md",
    description:
      "A ready-made skill for managing prompts, traces, and evals through natural language.",
    href: "/docs/api-and-data-platform/features/agent-skill",
    action: "Install the skill",
    eyebrow: "Coding agents",
  },
  {
    title: "Langfuse CLI",
    description:
      "Full API access from the terminal for agent workflows, scripts, and CI/CD.",
    href: "/docs/api-and-data-platform/features/cli",
    action: "Configure the CLI",
    eyebrow: "Terminal",
  },
  {
    title: "Platform MCP Server",
    description:
      "Structured access for IDE agents to manage prompts, query traces, and use Langfuse data.",
    href: "/docs/api-and-data-platform/features/mcp-server",
    action: "Configure MCP",
    eyebrow: "IDE agents",
  },
];

const TOOL_ITEMS_KO: Record<
  string,
  { description: string; action: string; eyebrow: string }
> = {
  "SKILL.md": {
    description:
      "자연어로 프롬프트, 트레이스, 평가를 관리할 수 있는 완제품 스킬입니다.",
    action: "스킬 설치하기",
    eyebrow: "코딩 에이전트",
  },
  "Langfuse CLI": {
    description:
      "에이전트 워크플로, 스크립트, CI/CD를 위한 터미널에서의 전체 API 접근.",
    action: "CLI 설정하기",
    eyebrow: "터미널",
  },
  "Platform MCP Server": {
    description:
      "IDE 에이전트가 프롬프트를 관리하고, 트레이스를 조회하고, Langfuse 데이터를 사용할 수 있는 구조화된 접근 방식.",
    action: "MCP 설정하기",
    eyebrow: "IDE 에이전트",
  },
};

const ASSISTANT_USE_CASES = [
  {
    title: "Debug traces",
    detail: "Find failed generations and traces with high latency",
  },
  {
    title: "Optimize spend",
    detail: "Break down token spend, cost, and latency",
  },
  {
    title: "Build evals",
    detail: "Create regression datasets and score configs",
  },
];

const ASSISTANT_USE_CASES_KO = [
  {
    title: "트레이스 디버깅",
    detail: "실패한 생성 및 지연 시간이 높은 트레이스 찾기",
  },
  {
    title: "지출 최적화",
    detail: "토큰 지출, 비용, 지연 시간 분석",
  },
  {
    title: "평가 구축",
    detail: "회귀 데이터셋과 점수 구성 만들기",
  },
];

function ToolCard({
  tool,
  index,
  ko,
}: {
  tool: ToolItem;
  index: number;
  ko: boolean;
}) {
  const text = ko ? { ...tool, ...TOOL_ITEMS_KO[tool.title] } : tool;
  return (
    <CornerBox
      hoverStripes
      className="flex h-full min-h-[180px] flex-col gap-4 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-[-0.2px] text-text-tertiary">
          0{index + 1}
        </span>
        <span className="rounded-[2px] border border-line-structure bg-surface-1 px-2 py-0.5 font-sans text-[11px] text-text-tertiary">
          {text.eyebrow}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Link
          href={tool.href}
          className="text-left text-[17px] font-medium text-text-primary"
        >
          {tool.title}
        </Link>
        <Text size="s" className="max-w-[38ch] text-left">
          {text.description}
        </Text>
      </div>

      <Link
        href={tool.href}
        className="mt-auto inline-flex w-fit items-center gap-1 font-sans text-[12px] font-medium text-text-secondary no-underline transition-colors hover:text-text-primary"
      >
        {text.action} <span aria-hidden>→</span>
      </Link>
    </CornerBox>
  );
}

function AssistantFeature({ ko }: { ko: boolean }) {
  const useCases = ko ? ASSISTANT_USE_CASES_KO : ASSISTANT_USE_CASES;
  return (
    <CornerBox className="flex flex-col overflow-hidden">
      <div className="flex flex-col gap-5 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[-0.2px] text-text-tertiary">
            00
          </span>
          <span className="rounded-[2px] border border-line-structure bg-surface-1 px-2 py-0.5 font-sans text-[11px] text-text-tertiary">
            {ko ? "인앱" : "In-app"}
          </span>
        </div>

        <div className="flex max-w-[58ch] flex-col gap-3">
          <h3 className="text-left font-sans text-[17px] font-medium text-text-primary">
            Langfuse Assistant
          </h3>
          <Text className="text-left">
            {ko
              ? "AI 엔지니어링 루프를 자동화하세요: Langfuse를 벗어나지 않고 프로덕션 데이터를 조사하고, 무슨 일이 있었는지 파악하고, 발견한 내용을 승인된 조치로 전환하세요."
              : "Automate the AI engineering loop: investigate production data, understand what happened, and turn findings into approved actions without leaving Langfuse."}
          </Text>
        </div>

        <div className="grid border-y border-line-structure sm:grid-cols-3 sm:divide-x sm:divide-line-structure">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="flex flex-col gap-1 border-b border-line-structure py-3 last:border-b-0 sm:block sm:border-b-0 sm:px-4 sm:first:pl-0 sm:last:pr-0"
            >
              <Text
                size="s"
                className="font-medium text-left text-text-secondary"
              >
                {useCase.title}
              </Text>
              <Text size="s" className="text-left sm:mt-1">
                {useCase.detail}
              </Text>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={ASSISTANT_HREF}
            className="inline-flex w-fit items-center gap-1 font-sans text-[12px] font-medium text-text-secondary no-underline transition-colors hover:text-text-primary"
          >
            {ko ? "문서 보기" : "View documentation"} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-line-structure bg-surface-1 p-3 sm:p-4">
        <video
          src={ASSISTANT_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          aria-label={
            ko
              ? "Langfuse Assistant가 Langfuse 앱에서 프로젝트 데이터를 조사하는 모습"
              : "The Langfuse Assistant investigating project data in the Langfuse app"
          }
          className="aspect-video h-auto w-full rounded-[2px] border border-line-structure object-cover shadow-sm"
        />
      </div>
    </CornerBox>
  );
}

export const DeveloperTools = () => {
  const ko = isKoreanPath(usePathname());
  return (
    <HomeSection id="developers-agents" className="pt-[120px]">
      <div className="flex relative flex-col gap-8 md:gap-10">
        <div className="flex max-w-[58ch] flex-col gap-4">
          <Heading className="text-left max-w-[16ch] sm:max-w-none">
            {ko ? (
              <>
                <TextHighlight>개발자</TextHighlight>를 위해 만들고,{" "}
                <TextHighlight>에이전트</TextHighlight>가 사랑하는 도구.
              </>
            ) : (
              <>
                Made for{" "}
                <span className="whitespace-nowrap">
                  <TextHighlight>developers</TextHighlight>,
                </span>{" "}
                loved by{" "}
                <span className="whitespace-nowrap">
                  <TextHighlight>agents</TextHighlight>.
                </span>
              </>
            )}
          </Heading>
          <Text className="max-w-[56ch] text-left">
            {ko
              ? "앱에서든 IDE에서든 작업하세요. Assistant가 프로덕션을 조사하고 승인된 조치를 수행하며, SKILL.md·CLI·MCP가 코딩 에이전트를 Langfuse와 연결합니다."
              : "Work in the app or from your IDE. The Assistant investigates production and takes approved actions; SKILL.md, CLI, and MCP connect coding agents to Langfuse."}
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <AssistantFeature ko={ko} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1 lg:grid-rows-3">
            {TOOL_ITEMS.map((tool, index) => (
              <div
                key={tool.title}
                className={
                  index === 0
                    ? "-mt-px lg:mt-0 lg:-ml-px"
                    : "-mt-px sm:-ml-px lg:-ml-px"
                }
              >
                <ToolCard tool={tool} index={index} ko={ko} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </HomeSection>
  );
};
