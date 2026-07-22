"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HomeSection } from "@/components/home/HomeSection";
import { Button, CornerBox, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import RiveMock from "@/components/home/img/rive-mock.png";
import { isKoreanPath } from "@/lib/i18n/koPaths";

const RiveAnimation = dynamic(
  () => import("@/components/rive/RiveAnimation").then((m) => m.RiveAnimation),
  { ssr: false },
);

const RIVE_FILE = "/animations/langfuse_axonometric.riv";
const RIVE_IN_VIEW_THRESHOLD = 0.45;
const RIVE_IN_VIEW_ACTIVATION_DELAY_MS = 250;

/**
 * View Model boolean path for the load trigger (`VmMainScene` is the VM in the editor, not a state machine).
 * If the animation does not run, try `"isLoad"` if the property sits on the default instance root.
 */
const RIVE_LOAD_VIEW_MODEL_PATH = "isLoad";

type RiveLabel = {
  heading: string;
  body: string;
};

const OVERVIEW: RiveLabel = {
  heading: "The full LLM engineering loop",
  body: "See how observability, prompts, evals, experiments, and human feedback work together.",
};

const LABELS: Record<string, RiveLabel> = {
  "obs-active": {
    heading: "Observability",
    body: "Use Observability to gain deep understanding of what happens under the hood of your application and inside the LLMs you are using. It helps you during development and when debugging in production.",
  },
  "prompts-active": {
    heading: "Prompts",
    body: "Prompt Management lets you separate prompts from code logic. This makes it much faster to build and iterate in your development process. It also allows Product Managers, domain experts, and QA to participate in writing prompts.",
  },
  "evals-active": {
    heading: "Evals",
    body: "Evals are a set of tools to monitor your application quality during development and production. Use LLM-as-a-Judge or fully custom setups via the API and SDKs to score the behavior of your application.",
  },
  "playground-active": {
    heading: "Playground",
    body: "The Playground is useful during development and in production. In development you can quickly try out different prompts and models side by side. In production it is handy to replay detailed logs of specific traces to better understand why an error occurred.",
  },
  "human-active": {
    heading: "Human Annotation",
    body: "Human Annotation workflows can be used in development or production to manually score the behavior and outputs of your application and learn how users use your service. They help you build collaborative workflows across teams.",
  },
  "exp-active": {
    heading: "Experiments",
    body: "Use Experiments during development to remove the guesswork from changes. They help you quickly test different prompt versions, models, or code variations and compare them against each other.",
  },
  "metrics-active": {
    heading: "Cost & Latency",
    body: "Cost and Latency help you monitor your application in production. Customize dashboards aggregating data from across Langfuse. Understand how cost, usage, quality, and other metrics perform over time.",
  },
};

const OVERVIEW_KO: RiveLabel = {
  heading: "완전한 LLM 엔지니어링 루프",
  body: "관측성, 프롬프트, 평가, 실험, 사람의 피드백이 어떻게 함께 작동하는지 확인하세요.",
};

const LABELS_KO: Record<string, RiveLabel> = {
  "obs-active": {
    heading: "관측성",
    body: "관측성을 활용해 애플리케이션 내부와 사용 중인 LLM 안에서 무슨 일이 일어나는지 깊이 있게 이해하세요. 개발 과정과 프로덕션 디버깅 모두에 도움이 됩니다.",
  },
  "prompts-active": {
    heading: "프롬프트",
    body: "프롬프트 관리를 사용하면 프롬프트를 코드 로직과 분리할 수 있습니다. 개발 과정에서 훨씬 빠르게 만들고 반복 개선할 수 있으며, 프로덕트 매니저·도메인 전문가·QA도 프롬프트 작성에 참여할 수 있습니다.",
  },
  "evals-active": {
    heading: "평가",
    body: "평가는 개발과 프로덕션 전반에서 애플리케이션 품질을 모니터링하는 도구 모음입니다. LLM-as-a-Judge를 사용하거나 API/SDK를 통해 완전히 커스텀한 방식으로 애플리케이션의 동작을 점수화하세요.",
  },
  "playground-active": {
    heading: "플레이그라운드",
    body: "플레이그라운드는 개발 과정과 프로덕션 모두에서 유용합니다. 개발 중에는 여러 프롬프트와 모델을 나란히 빠르게 테스트할 수 있고, 프로덕션에서는 특정 트레이스의 상세 로그를 재현해 오류의 원인을 더 잘 이해할 수 있습니다.",
  },
  "human-active": {
    heading: "Human Annotation",
    body: "Human Annotation 워크플로는 개발이나 프로덕션에서 애플리케이션의 동작과 출력을 사람이 직접 점수화하고, 사용자가 서비스를 어떻게 사용하는지 파악하는 데 사용할 수 있습니다. 팀 간 협업 워크플로를 만드는 데 도움이 됩니다.",
  },
  "exp-active": {
    heading: "실험",
    body: "개발 과정에서 실험을 사용하면 변경 사항에 대한 추측을 없앨 수 있습니다. 서로 다른 프롬프트 버전, 모델, 코드 변형을 빠르게 테스트하고 서로 비교하는 데 도움이 됩니다.",
  },
  "metrics-active": {
    heading: "비용 & 지연 시간",
    body: "비용과 지연 시간 기능은 프로덕션에서 애플리케이션을 모니터링하는 데 도움이 됩니다. Langfuse 전반의 데이터를 취합하는 대시보드를 커스터마이즈하고, 비용·사용량·품질 등 지표가 시간에 따라 어떻게 변화하는지 파악하세요.",
  },
};

export const RiveSection = () => {
  const ko = isKoreanPath(usePathname());
  const overview = ko ? OVERVIEW_KO : OVERVIEW;
  const labels = ko ? LABELS_KO : LABELS;
  const [label, setLabel] = useState<RiveLabel>(overview);
  const [riveSectionInView, setRiveSectionInView] = useState(false);
  const riveViewportRef = useRef<HTMLDivElement>(null);
  const inViewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRevTimeRef = useRef<number>(0);

  useEffect(() => {
    const el = riveViewportRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (inViewTimerRef.current) clearTimeout(inViewTimerRef.current);
          inViewTimerRef.current = setTimeout(() => {
            setRiveSectionInView(true);
            inViewTimerRef.current = null;
          }, RIVE_IN_VIEW_ACTIVATION_DELAY_MS);
          return;
        }
        if (inViewTimerRef.current) {
          clearTimeout(inViewTimerRef.current);
          inViewTimerRef.current = null;
        }
        setRiveSectionInView(false);
      },
      { threshold: RIVE_IN_VIEW_THRESHOLD, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (inViewTimerRef.current) clearTimeout(inViewTimerRef.current);
    };
  }, []);

  const loadViewModelBooleans = useMemo(
    () => ({ [RIVE_LOAD_VIEW_MODEL_PATH]: riveSectionInView }),
    [riveSectionInView],
  );

  const handleStateChange = useCallback(
    (states: string[]) => {
      if (states.some((s) => s.includes("-rev"))) {
        lastRevTimeRef.current = Date.now();
        return;
      }

      if (Date.now() - lastRevTimeRef.current < 250) return;

      const match = states.find((s) => s in labels);
      if (!match) return;

      setLabel(labels[match]);
    },
    [labels],
  );

  const handlePointerLeave = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setLabel(overview);
      resetTimerRef.current = null;
    }, 150);
  }, [overview]);

  const handlePointerEnter = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  return (
    <HomeSection id="llm-engineering-loop" className="pt-[120px]">
      <div className="flex flex-col gap-4 items-start">
        <Heading>
          {ko ? (
            <>
              <TextHighlight className="whitespace-nowrap">
                출시하고,&nbsp;
              </TextHighlight>
              <TextHighlight className="whitespace-nowrap">
                관찰하고,&nbsp;
              </TextHighlight>
              <TextHighlight className="whitespace-nowrap">개선</TextHighlight>
              하는 과정의 반복.
            </>
          ) : (
            <>
              <TextHighlight className="whitespace-nowrap">
                Launch,&nbsp;
              </TextHighlight>
              <TextHighlight className="whitespace-nowrap">
                observe,&nbsp;
              </TextHighlight>
              <TextHighlight className="whitespace-nowrap">
                improve
              </TextHighlight>{" "}
              — repeat.
            </>
          )}
        </Heading>
        <Text className="text-left max-w-[64ch]">
          {ko
            ? "Langfuse는 트레이싱, 모니터링, 데이터셋, 실험, 평가를 하나의 지속적인 루프로 연결합니다. 프로덕션 신호를 활용해 동작을 파악하고, 개선 사항을 테스트하고, 더 확신을 갖고 더 나은 에이전트를 배포하세요."
            : "Langfuse connects tracing, monitoring, datasets, experiments, and evaluation in one continuous loop. Use production signals to understand behavior, test improvements, and ship better agents with confidence."}
        </Text>
      </div>

      {/* Mobile: static image + tabs (below lg) */}
      <div className="flex flex-col -mt-20 pointer-events-none md:hidden -z-1">
        <div className="overflow-hidden relative w-full aspect-4/3">
          <Image
            src={RiveMock}
            alt={ko ? "Langfuse 플랫폼 개요" : "Langfuse platform overview"}
            fill
            className="object-cover object-center -translate-y-4"
            sizes="(max-width: 768px) 100vw, 800px"
            quality={100}
            priority
          />
        </div>
      </div>

      {/* Desktop: Rive animation + dynamic label (lg and above) */}
      <div className="hidden md:block">
        <div
          ref={riveViewportRef}
          className="p-4 -mt-px h-[500px]"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <RiveAnimation
            src={RIVE_FILE}
            stateMachine="Langfuse_SM"
            fit="cover"
            zoom={1.4}
            className="w-full h-full -translate-x-4 -translate-y-6"
            onStateChange={handleStateChange}
            viewModelBooleanInputs={loadViewModelBooleans}
          />
        </div>
      </div>

      <CornerBox className="flex min-h-[120px] w-full flex-col justify-between gap-5 bg-surface-bg p-4 -mt-px sm:flex-row sm:items-center">
        <div
          key={label.heading}
          className="rive-text-enter flex max-w-[64ch] flex-col gap-1.5"
        >
          <Text className="font-medium text-left text-text-primary">
            {label.heading}
          </Text>
          <Text size="s" className="w-full max-w-none text-left">
            {label.body}
          </Text>
        </div>
        <Button
          variant="secondary"
          size="default"
          href={ko ? "/academy/kr" : "/academy"}
          aria-label={ko ? "Academy에서 알아보기" : "Learn in Academy"}
          wrapperClassName="sm:flex-none"
        >
          {ko ? "Academy에서 알아보기" : "Learn in Academy"}
        </Button>
      </CornerBox>
    </HomeSection>
  );
};
