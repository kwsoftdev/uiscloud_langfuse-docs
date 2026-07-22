"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Copy, Check } from "lucide-react";
import Image from "next/image";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, HoverCorners } from "@/components/ui/corner-box";
import { TextHighlight } from "@/components/ui";
import { cn } from "@/lib/utils";
import { isKoreanPath } from "@/lib/i18n/koPaths";

const AGENT_PROMPTS = [
  {
    label: "Tracing:",
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and use it to add tracing to this application with Langfuse following best practices.",
  },
  {
    label: "Evals:",
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and use it to set up evals for this application with Langfuse. Guide me through choosing the right evaluation approach methods.",
  },
  {
    label: "Prompt Management:",
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and use it to migrate the prompts in this codebase to Langfuse.",
  },
];

const AGENT_PROMPTS_KO = [
  {
    label: "트레이싱:",
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and use it to add tracing to this application with Langfuse following best practices.",
  },
  {
    label: "평가:",
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and use it to set up evals for this application with Langfuse. Guide me through choosing the right evaluation approach methods.",
  },
  {
    label: "프롬프트 관리:",
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and use it to migrate the prompts in this codebase to Langfuse.",
  },
];

const MANUAL_SNIPPETS = {
  python: {
    install: "pip install langfuse",
    code: `from langfuse.openai import openai

# Drop-in replacement — traces automatically
response = openai.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)`,
  },
  javascript: {
    install:
      "npm install @langfuse/openai @langfuse/otel @opentelemetry/sdk-node",
    code: `import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
new NodeSDK({ spanProcessors: [new LangfuseSpanProcessor()] }).start();

import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";

const openai = observeOpenAI(new OpenAI());

const res = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
});`,
  },
} as const;

type LangId = keyof typeof MANUAL_SNIPPETS;

const linkClassName =
  "text-text-secondary hover:text-text-primary underline underline-offset-2 decoration-line-structure hover:decoration-text-tertiary transition-colors";

const homeCodeBlockClassName =
  "my-0 w-full text-left [&_pre]:text-left rounded-[1px] shadow-none border border-line-structure bg-surface-1";

const AGENTS = [
  {
    name: "Claude Code",
    icon: "/images/integrations/anthropic_icon.png",
  },
  {
    name: "Cursor",
    icon: "/images/integrations/cursor_icon.png",
  },
  {
    name: "Codex",
    icon: "/images/integrations/openai_icon.svg",
  },
];

function PromptRow({
  label,
  prompt,
  ko,
}: {
  label: string;
  prompt: string;
  ko: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyIcon = copied ? (
    <Check className="w-3.5 h-3.5" />
  ) : (
    <Copy className="w-3.5 h-3.5" />
  );

  return (
    <button
      onClick={handleCopy}
      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-3 text-left cursor-pointer transition-colors hover:bg-surface-1 group/row w-full"
    >
      <div className="flex items-center justify-between gap-2 w-full sm:w-auto sm:flex-none">
        <span className="text-text-secondary font-analog font-medium text-[14px] whitespace-nowrap sm:min-w-[140px] sm:shrink-0 text-left">
          {label}
        </span>
        <span className="sm:hidden shrink-0 text-text-tertiary flex items-center">
          {copyIcon}
        </span>
      </div>
      <Text
        size="s"
        className="text-text-tertiary flex-1 text-left min-w-0 w-full"
      >
        <span className="text-text-secondary font-medium">
          {ko ? "프롬프트:" : "Prompt:"}
        </span>{" "}
        {prompt}
      </Text>
      <span className="hidden sm:flex shrink-0 text-text-tertiary items-center gap-1">
        {copyIcon}
      </span>
    </button>
  );
}

function AgentTab({ ko }: { ko: boolean }) {
  const prompts = ko ? AGENT_PROMPTS_KO : AGENT_PROMPTS;
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 px-4 pt-1 border-b border-line-structure min-h-9">
        <div className="inline-flex items-center gap-3 whitespace-nowrap pb-2 pt-1.5 text-xs font-[430]">
          {AGENTS.map((agent) => (
            <span key={agent.name} className="inline-flex items-center gap-1.5">
              <Image
                src={agent.icon}
                alt={agent.name}
                width={16}
                height={16}
                className="shrink-0"
              />
              <span className="text-text-secondary">{agent.name}</span>
            </span>
          ))}
        </div>
        <span className="inline-flex items-center whitespace-nowrap pb-2 pt-1.5 text-xs font-[430] text-text-tertiary">
          {ko ? "또는 다른 에이전트" : "or any other agent"}
        </span>
      </div>

      <div className="flex flex-col divide-y divide-line-structure">
        {prompts.map((item) => (
          <PromptRow
            key={item.label}
            label={item.label}
            prompt={item.prompt}
            ko={ko}
          />
        ))}
      </div>
      <div className="px-4 py-3 border-t border-line-structure">
        <NeedHelpFooter ko={ko} />
      </div>
    </div>
  );
}

function NeedHelpFooter({ ko }: { ko: boolean }) {
  return (
    <Text size="s" className="text-left">
      {ko ? "도움이 필요하신가요? — " : "Need help? — "}
      <a href="/talk-to-us" className={linkClassName}>
        {ko ? "영업팀에 문의" : "Talk to Sales"}
      </a>
      <span className="mx-1.5 text-text-tertiary">·</span>
      <a href="/support" className={linkClassName}>
        {ko ? "지원팀에 문의" : "Reach out to Support"}
      </a>
    </Text>
  );
}

const QUICKSTART_LINKS = [
  { label: "Observability", href: "/docs/observability/get-started" },
  { label: "Prompt Management", href: "/docs/prompt-management/get-started" },
  { label: "Evals", href: "/docs/evaluation/overview" },
];

const QUICKSTART_LINKS_KO = [
  { label: "관측성", href: "/docs/kr/observability/get-started" },
  { label: "프롬프트 관리", href: "/docs/kr/prompt-management/get-started" },
  { label: "평가", href: "/docs/kr/evaluation/overview" },
];

function ManualTab({ ko }: { ko: boolean }) {
  const [lang, setLang] = useState<LangId>("python");
  const snippet = MANUAL_SNIPPETS[lang];

  const langTabs: { id: LangId; label: string }[] = [
    { id: "python", label: "Python" },
    { id: "javascript", label: "JS/TS" },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 sm:gap-4 px-4 pt-1 border-b border-line-structure min-h-9">
        {langTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setLang(tab.id)}
            className={cn(
              "inline-flex items-center whitespace-nowrap rounded-none border-b pb-2 pt-1.5 text-xs transition-colors font-[430] cursor-pointer",
              lang === tab.id
                ? "border-line-cta text-text-primary font-medium"
                : "border-transparent text-text-tertiary hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <DynamicCodeBlock
          lang="bash"
          code={snippet.install}
          codeblock={{
            allowCopy: true,
            className: homeCodeBlockClassName,
          }}
        />
        <DynamicCodeBlock
          lang={lang === "python" ? "python" : "typescript"}
          code={snippet.code}
          codeblock={{
            allowCopy: true,
            className: homeCodeBlockClassName,
          }}
        />

        <Text size="s" className="text-left pt-1">
          {ko ? "빠른 시작 가이드 — " : "Quick start guides — "}
          {(ko ? QUICKSTART_LINKS_KO : QUICKSTART_LINKS).map((link, i) => (
            <span key={link.href}>
              {i > 0 && <span className="mx-1.5 text-text-tertiary">·</span>}
              <a href={link.href} className={linkClassName}>
                {link.label}
              </a>
            </span>
          ))}
        </Text>
        <NeedHelpFooter ko={ko} />
      </div>
    </div>
  );
}

type TabId = "agent" | "manual";

export function GetStartedSection() {
  const ko = isKoreanPath(usePathname());
  const [activeTab, setActiveTab] = useState<TabId>("agent");

  const tabs: { id: TabId; label: string }[] = ko
    ? [
        { id: "agent", label: "코딩 에이전트로 설치" },
        { id: "manual", label: "수동 설치" },
      ]
    : [
        { id: "agent", label: "Install via Coding Agent" },
        { id: "manual", label: "Manual Install" },
      ];

  const freeTierNotice = ko ? (
    <>
      시작하기 <span className="text-text-tertiary mx-1">—</span>{" "}
      <span className="text-text-tertiary">
        무료 요금제: <span className="text-primary">월 5만 건 observation</span>
        . 신용카드 불필요.
      </span>
    </>
  ) : (
    <>
      Get Started <span className="text-text-tertiary mx-1">—</span>{" "}
      <span className="text-text-tertiary">
        Free tier: <span className="text-primary">50k observations/month</span>.
        No credit card required.
      </span>
    </>
  );

  return (
    <HomeSection id="get-started" className="pt-[120px]">
      <div className="flex flex-col gap-2.5">
        <Text className="text-left hidden md:block">{freeTierNotice}</Text>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-6">
          <Heading className="text-primary text-left" size="large">
            {ko ? (
              <>
                <TextHighlight highlightClassName="mix-blend-multiply">
                  에이전트 개선을
                </TextHighlight>
                <br />
                5분 안에 시작하세요.
              </>
            ) : (
              <>
                <TextHighlight
                  highlightClassName="mix-blend-multiply"
                  className="max-md:pr-1.5 xl:pr-3"
                >
                  Start improving
                </TextHighlight>
                <TextHighlight highlightClassName="mix-blend-multiply">
                  your agents
                </TextHighlight>
                <br />
                in under 5 minutes.
              </>
            )}
          </Heading>
          <Text className="text-left md:hidden">{freeTierNotice}</Text>
          <div className="flex md:flex-col gap-0 items-start shrink-0 w-full sm:w-[150px] mt-2">
            <Button
              variant="primary"
              size="default"
              shortcutKey="s"
              href="/cloud"
              wrapperClassName="md:flex-none md:w-full"
            >
              {ko ? "무료로 시작하기" : "Start free"}
            </Button>
            <Button
              variant="secondary"
              size="default"
              shortcutKey="d"
              href={ko ? "/docs/kr" : "/docs"}
              wrapperClassName="md:flex-none md:w-full"
            >
              {ko ? "문서 보기" : "Documentation"}
            </Button>
          </div>
        </div>

        {/* Tabs + content area */}
        <div className="flex flex-col sm:flex-row items-start gap-3 mt-10">
          {/* Tab buttons — outside the content box, right-aligned, equal width */}
          <div className="flex sm:flex-col sm:items-end sm:justify-between shrink-0 gap-2 self-stretch">
            <div className="flex sm:flex-col sm:items-end gap-1 md:gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <div
                    key={tab.id}
                    className="relative flex items-center p-1 -m-1 group button-wrapper overflow-visible"
                  >
                    <HoverCorners />
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "inline-flex items-center justify-center w-full h-[26px] px-[10px] rounded-[2px] border text-left transition-colors whitespace-nowrap",
                        "font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px]",
                        isActive
                          ? "border-line-structure bg-surface-bg text-text-primary [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]"
                          : "border-transparent bg-transparent text-text-tertiary hover:text-text-primary hover:bg-surface-bg hover:border-line-structure hover:[box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]",
                      )}
                    >
                      {tab.label}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content box */}
          <CornerBox className="flex-1 min-w-0 w-full">
            {activeTab === "agent" ? (
              <AgentTab ko={ko} />
            ) : (
              <ManualTab ko={ko} />
            )}
          </CornerBox>
        </div>
      </div>
    </HomeSection>
  );
}
