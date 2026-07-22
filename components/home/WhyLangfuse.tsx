"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { HomeSection } from "./HomeSection";
import { Heading } from "@/components/ui/heading";
import { TextHighlight } from "@/components/ui/text-highlight";
import { Text } from "@/components/ui/text";
import { isKoreanPath } from "@/lib/i18n/koPaths";

const reasons = [
  {
    title: "The full cycle",
    body: "Langfuse powers the entire development cycle from prototype to full scale production loads.",
  },
  {
    title: "Unified platform",
    body: "All components of Langfuse work great standalone but excel when used together.",
  },
  {
    title: "Open source (MIT)",
    body: "Inspect the code. Self-host for free. We are the largest OSS community in our category.",
  },
  {
    title: "OTel native",
    body: "Standard trace format. Works with existing OpenTelemetry instrumentation.",
  },
  {
    title: "100+ integrations",
    body: "Works with any model, any framework, and stack.",
  },
  {
    title: "Built for scale",
    body: "ClickHouse backend allows to query millions of traces in milliseconds.",
  },
  {
    title: "Async by default",
    body: "Tracing never blocks your application. Background processing, automatic batching.",
  },
  {
    title: "Loved by agents",
    body: "CLI, MCP, accessible docs - coding agents love working with Langfuse.",
  },
  {
    title: "Production-proven",
    body: "Billions of events processed per month. 50M+ SDK installs/month. Fortune 50 deployments.",
  },
  {
    title: "Shipping velocity",
    body: "The AI space is changing fast. We understand what patterns matter and ship daily.",
  },
];

const reasonsKo = [
  {
    title: "전체 사이클",
    body: "Langfuse는 프로토타입부터 완전한 규모의 프로덕션 부하까지 전체 개발 사이클을 지원합니다.",
  },
  {
    title: "통합 플랫폼",
    body: "Langfuse의 모든 구성 요소는 단독으로도 훌륭하지만, 함께 사용할 때 진가를 발휘합니다.",
  },
  {
    title: "오픈소스 (MIT)",
    body: "코드를 직접 확인하세요. 무료로 셀프 호스팅하세요. 저희는 이 분야에서 가장 큰 OSS 커뮤니티입니다.",
  },
  {
    title: "OTel 네이티브",
    body: "표준 트레이스 형식. 기존 OpenTelemetry 계측과 그대로 작동합니다.",
  },
  {
    title: "100개 이상의 통합",
    body: "어떤 모델, 어떤 프레임워크, 어떤 스택과도 작동합니다.",
  },
  {
    title: "규모를 위한 설계",
    body: "ClickHouse 백엔드로 수백만 개의 트레이스를 밀리초 단위로 조회할 수 있습니다.",
  },
  {
    title: "기본적으로 비동기",
    body: "트레이싱이 애플리케이션을 절대 막지 않습니다. 백그라운드 처리와 자동 배칭.",
  },
  {
    title: "에이전트가 사랑하는",
    body: "CLI, MCP, 접근하기 쉬운 문서 - 코딩 에이전트가 Langfuse와 함께 일하는 것을 좋아합니다.",
  },
  {
    title: "프로덕션에서 검증됨",
    body: "매월 수십억 건의 이벤트 처리. 월 5,000만+ SDK 설치. 포춘 50대 기업 배포 사례.",
  },
  {
    title: "빠른 출시 속도",
    body: "AI 분야는 빠르게 변화합니다. 저희는 어떤 패턴이 중요한지 이해하고 매일 배포합니다.",
  },
];

const OPEN_PATHS = [
  {
    d: "M0.999993 7.53333V8.46667H5.66666C6.69759 8.46667 7.53333 9.3024 7.53333 10.3333V15H8.46666V7.53333H0.999993Z",
    exitX: -4,
    exitY: 4,
  },
  {
    d: "M0.999993 8.46666V7.53333H5.66666C6.69759 7.53333 7.53333 6.69759 7.53333 5.66666V0.999993H8.46666V8.46666H0.999993Z",
    exitX: -4,
    exitY: -4,
  },
  {
    d: "M15 7.53333V8.46667H10.3333C9.30241 8.46667 8.46667 9.3024 8.46667 10.3333V15H7.53334V7.53333H15Z",
    exitX: 4,
    exitY: 4,
  },
  {
    d: "M15 8.46666V7.53333H10.3333C9.30241 7.53333 8.46667 6.69759 8.46667 5.66666V0.999993H7.53334V8.46666H15Z",
    exitX: 4,
    exitY: -4,
  },
];

function AccordionIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {OPEN_PATHS.map(({ d, exitX, exitY }, i) => (
        <motion.path
          key={i}
          d={d}
          fill="#6B6B66"
          initial={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? exitX : 0,
            y: isOpen ? exitY : 0,
          }}
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? exitX : 0,
            y: isOpen ? exitY : 0,
          }}
          transition={{
            duration: 0.22,
            delay: isOpen ? 0 : i * 0.03,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      ))}
      <motion.line
        x1="1"
        y1="8"
        x2="15"
        y2="8"
        stroke="#6B6B66"
        strokeLinejoin="round"
        initial={{
          opacity: isOpen ? 1 : 0,
          scaleX: isOpen ? 1 : 0,
        }}
        animate={{
          opacity: isOpen ? 1 : 0,
          scaleX: isOpen ? 1 : 0,
        }}
        style={{ transformOrigin: "8px 8px" }}
        transition={{
          duration: 0.22,
          delay: isOpen ? 0.1 : 0,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </svg>
  );
}

export function WhyLangfuse() {
  const ko = isKoreanPath(usePathname());
  const items = ko ? reasonsKo : reasons;
  const [openItem, setOpenItem] = useState<string>(items[0].title);

  return (
    <HomeSection id="why-langfuse" className="pt-[120px]">
      <div className="flex flex-col gap-3 mb-10">
        <Heading as="h2" size="normal">
          {ko ? (
            <>
              <TextHighlight>왜</TextHighlight> Langfuse를 사용해야 할까요?
            </>
          ) : (
            <>
              <TextHighlight>Why use</TextHighlight> Langfuse?
            </>
          )}
        </Heading>
        <Text className="max-w-[48ch] text-left">
          {ko
            ? "Langfuse는 가장 널리 채택된 오픈소스 LLM 엔지니어링 플랫폼입니다. 오픈소스와 데이터에 대한 통제권을 중요하게 여기는 개발자들이 Langfuse로 프로덕션급 에이전트와 LLM 애플리케이션을 구축합니다."
            : "Langfuse is the most widely adopted open-source LLM engineering platform. Developers who value open-source and control over their data build production grade agents and LLM applications with Langfuse."}
        </Text>
      </div>

      {/* Mobile / tablet: accordion (below lg) */}
      <AccordionPrimitive.Root
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
        className="flex flex-col lg:hidden"
      >
        {items.map((item) => (
          <AccordionPrimitive.Item
            key={item.title}
            value={item.title}
            className="border-t first:border-t-0 border-line-structure"
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="flex flex-1 gap-4 justify-between items-center py-4 text-left cursor-pointer text-text-primary">
                <Text className="font-medium text-text-secondary">
                  {item.title}
                </Text>
                <span className="shrink-0">
                  <AccordionIcon isOpen={openItem === item.title} />
                </span>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
              <Text size="s" className="pr-8 pb-4 text-left">
                {item.body}
              </Text>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>

      {/* Desktop: two-column list (lg and above) */}
      <ul className="hidden flex-col lg:flex">
        {items.map((item) => (
          <li
            key={item.title}
            className="grid grid-cols-[1fr_3fr] gap-8 py-4 items-center border-b border-line-structure last:border-b-0"
          >
            <Text className="self-center font-medium text-left text-text-secondary">
              {item.title}
            </Text>
            <Text size="s" className="self-center text-left">
              {item.body}
            </Text>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
