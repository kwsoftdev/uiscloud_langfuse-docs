"use client";

import { usePathname } from "next/navigation";
import { HomeSection } from "./HomeSection";
import { Heading } from "@/components/ui/heading";
import { FAQAccordion, type FAQItem } from "@/components/shared/FAQAccordion";
import { isKoreanPath } from "@/lib/i18n/koPaths";

const faqsKo: FAQItem[] = [
  {
    question: "Langfuse란 무엇인가요?",
    answer:
      "Langfuse는 팀이 LLM 애플리케이션을 구축, 모니터링, 개선할 수 있도록 돕는 [오픈소스](https://github.com/langfuse/langfuse) AI 엔지니어링 플랫폼입니다. [트레이싱](/docs/observability/overview), [프롬프트 관리](/docs/prompt-management/overview), [평가](/docs/evaluation/overview), [분석 대시보드](/docs/metrics/overview)까지 전체 개발 라이프사이클을 한 곳에서 다룹니다. Langfuse는 2,300개 이상의 기업이 사용하며 매월 수십억 건의 observation을 처리합니다. [공개 데모 프로젝트](/docs/demo)로 바로 체험하거나 [무료로 가입](/cloud)해보세요.",
  },
  {
    question: "Langfuse는 어떤 부분에 도움이 되나요?",
    answer:
      "Langfuse는 AI 파이프라인의 모든 단계를 담은 상세한 트레이스로 [에이전트 그래프](/docs/observability/features/agent-graphs)를 포함해 [LLM 애플리케이션을 디버깅](/docs/observability/overview)하는 데 도움을 줍니다. [프롬프트를 협업하며 관리하고 버전 관리](/docs/prompt-management/overview)할 수 있고, [자동화된 평가](/docs/evaluation/evaluation-methods/llm-as-a-judge)(LLM-as-a-judge 및 [코드 기반 평가기](/docs/evaluation/evaluation-methods/code-evaluators) 포함)를 실행하고, 모델과 제공업체별 [비용과 지연 시간](/docs/observability/features/token-and-cost-tracking)을 추적하고, [데이터셋으로 실험](/docs/evaluation/experiments/overview)을 실행해 배포 전에 개선 효과를 측정할 수 있습니다. 팀 전체를 위한 [커스텀 대시보드](/docs/metrics/features/custom-dashboards)도 지원합니다.",
  },
  {
    question: "다른 기능 없이 트레이싱만 사용할 수 있나요?",
    answer:
      "네, [트레이싱](/docs/observability/overview)만을 위해 Langfuse를 사용할 수 있습니다. [SDK](/docs/observability/sdk/overview)는 모듈식으로 되어 있어 몇 줄의 코드로 앱을 계측하고 필요한 기능만 통합할 수 있습니다. 트레이싱은 [프롬프트 관리](/docs/prompt-management/overview), [평가](/docs/evaluation/overview) 등 다른 기능과 독립적으로 작동합니다. 많은 팀이 트레이싱만으로 시작한 뒤 필요에 따라 추가 기능을 도입합니다.",
  },
  {
    question: "어떤 배포 옵션이 있나요?",
    answer:
      "Langfuse는 [미국과 EU 리전](/security)에서 [매니지드 클라우드 서비스](https://cloud.langfuse.com)로 제공되며, [Docker Compose](/self-hosting/deployment/docker-compose), [Kubernetes (Helm)](/self-hosting/deployment/kubernetes-helm), 또는 [AWS](/self-hosting/deployment/aws)·[GCP](/self-hosting/deployment/gcp)·[Azure](/self-hosting/deployment/azure)용 Terraform 템플릿을 사용해 자체 인프라에 [셀프 호스팅](/self-hosting)할 수도 있습니다. 셀프 호스팅 버전은 [MIT 라이선스](/open-source) 하에 모든 제품 기능을 포함합니다. 추가 지원과 컴플라이언스가 필요한 팀을 위해 [셀프 호스팅 엔터프라이즈 플랜](/pricing-self-host)도 제공됩니다.",
  },
  {
    question: "셀프 호스팅은 정말 무료인가요?",
    answer:
      "네, Langfuse 셀프 호스팅은 완전히 무료입니다. 전체 코드베이스가 [MIT 라이선스 하의 오픈소스](https://github.com/langfuse/langfuse)이며, 기능 제한 없이 모든 제품 기능이 포함됩니다. 여러분은 자체 인프라 비용만 부담하면 됩니다. [셀프 호스팅 가이드](/self-hosting/deployment/docker-compose)를 참고해 `docker compose up`으로 시작하거나 [Kubernetes](/self-hosting/deployment/kubernetes-helm)로 규모 있게 배포하세요. [엔터프라이즈 셀프 호스팅 옵션](/pricing-self-host)은 이를 필요로 하는 조직을 위해 지원 SLA와 SSO를 추가로 제공합니다.",
  },
  {
    question: "어떤 프레임워크를 지원하나요?",
    answer:
      "Langfuse는 [LangChain](/integrations/frameworks/langchain), [LlamaIndex](/integrations/frameworks/llamaindex), [CrewAI](/integrations/frameworks/crewai), [OpenAI Agents](/integrations/frameworks/openai-agents), [Pydantic AI](/integrations/frameworks/pydantic-ai), [Mastra](/integrations/frameworks/mastra), [Google ADK](/integrations/frameworks/google-adk), [Vercel AI SDK](/integrations/frameworks/vercel-ai-sdk), [OpenAI](/integrations/model-providers/openai-py), [Anthropic](/integrations/model-providers/anthropic), [AWS Bedrock](/integrations/model-providers/amazon-bedrock)을 포함해 [100개 이상의 통합](/integrations)을 지원합니다. Langfuse는 [OpenTelemetry 네이티브](/integrations/native/opentelemetry)이므로 모든 OTEL 호환 라이브러리나 [기존 OTEL 설정](/faq/all/existing-otel-setup)과도 함께 작동합니다.",
  },
  {
    question: "지연 시간에 영향이 있나요?",
    answer:
      "Langfuse는 기본적으로 비동기로 동작합니다 — 트레이싱이 애플리케이션을 절대 막지 않습니다. SDK는 [자동 배칭과 큐잉](/docs/observability/features/queuing-batching)을 통해 백그라운드에서 데이터를 전송하므로 애플리케이션에 미치는 지연 시간 영향은 무시할 수 있는 수준입니다. 프롬프트 관리의 경우 [엣지 캐싱](/docs/prompt-management/features/caching)으로 최소한의 오버헤드로 프롬프트를 가져오며, [가용성 보장](/docs/prompt-management/features/guaranteed-availability)으로 Langfuse에 접근할 수 없는 상황에서도 애플리케이션이 계속 작동합니다.",
  },
  {
    question: "Langfuse는 안전하고 컴플라이언스를 준수하나요?",
    answer:
      "네. Langfuse Cloud는 [SOC 2 Type II](/security/soc2) 인증을 받았고, [ISO 27001](/security/iso27001)을 준수하며, [GDPR](/security/gdpr)을 준수하고, [HIPAA 대응 리전](/security/hipaa)을 제공합니다. 데이터는 저장 및 전송 시 [암호화](/security/encryption)되며, [미국, EU, 일본, HIPAA 데이터 리전](/security/data-regions) 중에서 선택할 수 있습니다. 완전한 통제가 필요하다면 [데이터 마스킹](/self-hosting/security/data-masking)과 자체 암호화 키로 자체 인프라에 Langfuse를 [셀프 호스팅](/self-hosting)할 수 있습니다. 자세한 내용은 [보안 개요](/security)를 참고하세요.",
  },
  {
    question: "어떻게 시작하나요?",
    answer:
      "현재 워크플로의 어느 단계에 있는지에 따라 다릅니다. **트레이싱을 추가**하려면 [트레이싱 퀵스타트](/docs/observability/get-started)를 따르세요. **프롬프트 관리를 설정**하려면 [프롬프트 관리 가이드](/docs/prompt-management/get-started)를 참고하세요. **평가 전략을 구축**하려면 [평가 개요](/docs/evaluation/overview)에서 다양한 접근 방식을 안내받을 수 있습니다. [Langfuse Cloud에 가입](/cloud)하거나(무료, 신용카드 불필요) [공개 데모 프로젝트](/docs/demo)에서 실제로 동작하는 모습을 확인해보세요.",
  },
  {
    question: "가격은 어떻게 책정되나요?",
    answer:
      "Langfuse Cloud는 신용카드 없이 사용할 수 있는 [무료 Hobby 플랜](/pricing)을 제공합니다. 유료 플랜은 플랫폼으로 전송하는 트레이스, observation, 점수 등 [청구 단위](/docs/administration/billable-units)를 기준으로 사용량 기반 [단계별 가격](/pricing)을 적용합니다. 규모가 커지면 볼륨 할인이 자동으로 적용됩니다. MIT 라이선스 하에 무료로 Langfuse를 [셀프 호스팅](/self-hosting)할 수도 있습니다. 전체 계산기와 플랜 비교는 [가격 페이지](/pricing)를 참고하세요.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "What is Langfuse?",
    answer:
      "Langfuse is an [open-source](https://github.com/langfuse/langfuse) AI engineering platform that helps teams build, monitor, and improve their LLM applications. It covers the full development lifecycle with [tracing](/docs/observability/overview), [prompt management](/docs/prompt-management/overview), [evaluations](/docs/evaluation/overview), and [analytics dashboards](/docs/metrics/overview) — all in one place. Langfuse is used by 2,300+ companies and processes billions of observations per month. You can try it instantly with the [public demo project](/docs/demo) or [sign up for free](/cloud)",
  },
  {
    question: "What does Langfuse help me with?",
    answer:
      "Langfuse helps you [debug LLM applications](/docs/observability/overview) with detailed traces that capture every step of your AI pipeline, including [agent graphs](/docs/observability/features/agent-graphs). You can [manage and version your prompts](/docs/prompt-management/overview) collaboratively, run [automated evaluations](/docs/evaluation/evaluation-methods/llm-as-a-judge) (including LLM-as-a-judge and [code evaluators](/docs/evaluation/evaluation-methods/code-evaluators)), track [costs and latency](/docs/observability/features/token-and-cost-tracking) across models and providers, and run [experiments on datasets](/docs/evaluation/experiments/overview) to measure improvements before shipping. It also supports [custom dashboards](/docs/metrics/features/custom-dashboards) for team-wide visibility.",
  },
  {
    question: "Can I use just tracing without the other features?",
    answer:
      "Yes, you can use Langfuse purely for [tracing](/docs/observability/overview). The [SDKs](/docs/observability/sdk/overview) are modular — you instrument your app with a few lines of code and can integrate only what you need. Tracing works independently of [prompt management](/docs/prompt-management/overview), [evaluations](/docs/evaluation/overview), or any other feature. Many teams start with tracing alone and adopt additional capabilities as their needs grow.",
  },
  {
    question: "What deployment options do exist?",
    answer:
      "Langfuse is available as a [managed cloud service](https://cloud.langfuse.com) in [US and EU regions](/security), or you can [self-host](/self-hosting) it on your own infrastructure using [Docker Compose](/self-hosting/deployment/docker-compose), [Kubernetes (Helm)](/self-hosting/deployment/kubernetes-helm), or Terraform templates for [AWS](/self-hosting/deployment/aws), [GCP](/self-hosting/deployment/gcp), and [Azure](/self-hosting/deployment/azure). The self-hosted version includes all product features under the [MIT license](/open-source). For teams needing additional support and compliance, there is a [self-hosted Enterprise plan](/pricing-self-host).",
  },
  {
    question: "Is self-hosting actually free?",
    answer:
      "Yes, self-hosting Langfuse is completely free. The entire codebase is [open source under the MIT license](https://github.com/langfuse/langfuse) — all product features are included with no feature gates. You only pay for your own infrastructure costs. Get started with `docker compose up` using our [self-hosting guide](/self-hosting/deployment/docker-compose) or deploy at scale on [Kubernetes](/self-hosting/deployment/kubernetes-helm). The [Enterprise self-hosted option](/pricing-self-host) adds support SLAs and SSO for organizations that need them.",
  },
  {
    question: "What frameworks are supported?",
    answer:
      "Langfuse supports [100+ integrations](/integrations) including [LangChain](/integrations/frameworks/langchain), [LlamaIndex](/integrations/frameworks/llamaindex), [CrewAI](/integrations/frameworks/crewai), [OpenAI Agents](/integrations/frameworks/openai-agents), [Pydantic AI](/integrations/frameworks/pydantic-ai), [Mastra](/integrations/frameworks/mastra), [Google ADK](/integrations/frameworks/google-adk), [Vercel AI SDK](/integrations/frameworks/vercel-ai-sdk), [OpenAI](/integrations/model-providers/openai-py), [Anthropic](/integrations/model-providers/anthropic), and [AWS Bedrock](/integrations/model-providers/amazon-bedrock). Langfuse is [OpenTelemetry native](/integrations/native/opentelemetry), so it works with any OTEL-compatible library or your [existing OTEL setup](/faq/all/existing-otel-setup).",
  },
  {
    question: "What's the latency impact?",
    answer:
      "Langfuse is async by default — tracing never blocks your application. The SDKs send data in the background with [automatic batching and queuing](/docs/observability/features/queuing-batching), so the latency impact on your application is negligible. For prompt management, [edge caching](/docs/prompt-management/features/caching) ensures prompts are fetched with minimal overhead, and [guaranteed availability](/docs/prompt-management/features/guaranteed-availability) means your application continues to work even if Langfuse is unreachable.",
  },
  {
    question: "Is Langfuse secure and compliant?",
    answer:
      "Yes. Langfuse Cloud is [SOC 2 Type II](/security/soc2) certified, [ISO 27001](/security/iso27001) compliant, [GDPR](/security/gdpr) compliant, and offers a [HIPAA-ready region](/security/hipaa). Data is [encrypted](/security/encryption) at rest and in transit, and you can choose between [US, EU, Japan, and HIPAA data regions](/security/data-regions). For full control, you can [self-host](/self-hosting) Langfuse on your own infrastructure with [data masking](/self-hosting/security/data-masking) and your own encryption keys. See our [security overview](/security) for details.",
  },
  {
    question: "How do I get started?",
    answer:
      "It depends on where you are in your workflow. To **add tracing**, follow the [tracing quickstart](/docs/observability/get-started). To **set up prompt management**, see the [prompt management guide](/docs/prompt-management/get-started). To **build an evaluation strategy**, the [evaluation overview](/docs/evaluation/overview) walks you through the different approaches. [Sign up for Langfuse Cloud](/cloud) (free, no credit card required) or explore the [public demo project](/docs/demo) to see everything in action.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Langfuse Cloud has a [free Hobby plan](/pricing) with no credit card required. Paid plans use usage-based [graduated pricing](/pricing) based on [billable units](/docs/administration/billable-units) — traces, observations, and scores you send to the platform. Volume discounts apply automatically as you scale. You can also [self-host](/self-hosting) Langfuse for free under the MIT license. See the [pricing page](/pricing) for the full calculator and plan comparison.",
  },
];

export function FAQ() {
  const ko = isKoreanPath(usePathname());
  return (
    <HomeSection id="faq" className="pt-[120px]">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
        <Heading as="h2" className="hidden top-8 text-left lg:block">
          {ko ? "자주 묻는 질문" : "Questions & Answers"}
        </Heading>

        <FAQAccordion faqs={ko ? faqsKo : faqs} />
      </div>
    </HomeSection>
  );
}
