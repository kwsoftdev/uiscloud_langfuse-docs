import {
  TextQuote,
  LineChart,
  GitPullRequestArrow,
  ThumbsUp,
  FlaskConical,
  // Globe,
  MessageSquare,
} from "lucide-react";
import type { FeatureTabData } from "./types";

import observabilityPng from "components/home/feature-tabs/img/observability-ui.png";
import observabilityMobilePng from "components/home/feature-tabs/img/observability-mobile-ui.png";
import metricsPng from "components/home/feature-tabs/img/cost-ui.png";
import PromptPng from "components/home/feature-tabs/img/prompts-ui.png";
import EvalsPng from "components/home/feature-tabs/img/evals-ui.png";
import PlaygroundPng from "components/home/feature-tabs/img/playground-ui.png";
import AnnotationPng from "components/home/feature-tabs/img/annotation-ui.png";

/**
 * Korean text overrides for featureTabsData, keyed by feature id. Merged over
 * the English data by consumers (see FeatureTabsSection) when ko — images,
 * hrefs, icons, and code snippets are shared, not translated.
 */
export const featureTabsKoText: Record<
  string,
  { title: string; subtitle: string; body: string }
> = {
  observability: {
    title: "트레이스를 깊이 있게 들여다보세요",
    subtitle: "모든 LLM 호출을 비용과 지연 시간과 함께 트레이싱합니다.",
    body: "LLM 애플리케이션/에이전트의 전체 트레이스를 기록하세요. 트레이스로 실패를 파악하고 평가용 데이터셋을 구축할 수 있습니다. OpenTelemetry 기반이며 널리 쓰이는 모든 LLM/에이전트 라이브러리를 지원합니다.",
  },
  metrics: {
    title: "모델 비용과 지연 시간을 추적하세요",
    subtitle: "비용, 지연 시간, 품질을 추적합니다.",
    body: "포괄적인 메트릭 대시보드와 API로 LLM 애플리케이션의 성능을 모니터링하세요. 모델·사용자·기간별로 비용, 지연 시간, 토큰 사용량, 품질 점수를 추적할 수 있습니다.",
  },
  "prompt-management": {
    title: "프롬프트를 개선하세요",
    subtitle: "낮은 지연 시간으로 프롬프트를 버전 관리하고 배포하세요.",
    body: "프롬프트를 협업하며 버전 관리하고, 여러 환경에 즉시 배포/롤백하세요. 템플릿, 변수, A/B 테스트를 지원합니다. 클라이언트 사이드에 캐싱되어 지연 시간과 가용성에 영향이 없습니다.",
  },
  evaluation: {
    title: "모델 출력을 자동으로 평가하세요",
    subtitle: "피드백을 수집하고 평가를 실행하세요.",
    body: "UI(프롬프트/모델 실험)와 SDK(엔드투엔드 애플리케이션 실험)를 통해 온라인/오프라인 평가를 실행하세요. 트레이스로부터 데이터셋을 만들어 평가를 지속적으로 개선하고, 결과는 UI에서 확인하세요.",
  },
  annotations: {
    title: "사람의 리뷰를 통해 협업하세요",
    subtitle: "수동 피드백과 수정 사항을 추가하세요.",
    body: "수동 주석(annotation)을 만들어 LLM 출력에 대한 피드백, 수정, 개선 사항을 기록하세요. 주석을 활용해 고품질 데이터셋을 구축하고 자동 평가의 기준선을 설정할 수 있습니다.",
  },
  playground: {
    title: "구조화된 실험으로 반복 개선하세요",
    subtitle: "프롬프트와 모델을 인터랙티브하게 테스트하세요.",
    body: "인터랙티브한 플레이그라운드에서 다양한 프롬프트, 모델, 파라미터를 실험해보세요. 출력을 비교하고, 프롬프트를 반복 개선하고, 성공적인 설정을 프롬프트 관리에 저장하세요.",
  },
};

export const mobileFeatureTabsData: Pick<FeatureTabData, "image"> = {
  image: {
    light: observabilityMobilePng,
    dark: observabilityMobilePng,
    alt: "Langfuse observability trace detail view showing nested observations with latency and cost",
  },
};

export const featureTabsData: FeatureTabData[] = [
  {
    id: "observability",
    icon: TextQuote,
    title: "Gain deep visibility into your traces",
    subtitle: "Trace every LLM call with cost and latency.",
    body: "Capture complete traces of your LLM applications/agents. Use traces to inspect failures and build eval datasets. Based on OpenTelemetry with support for all popular LLM/agent libraries.",
    docsHref: "/docs/observability/overview",
    videoHref: "/watch-demo?tab=observability",
    image: {
      light: observabilityPng,
      dark: observabilityPng,
      alt: "Langfuse observability trace detail view showing nested observations with latency and cost",
    },
    code: {
      snippets: {
        python: `from langfuse import observe

# drop-in wrapper adds OpenTelemetry tracing to OpenAI
# many other llm/agent integrations are available
from langfuse.openai import openai

@observe()  # decorate any function; all nested calls are auto-linked
def handle_request(text: str) -> str:
    res = openai.chat.completions.create(
        model="gpt-5",
        messages=[
            {"role": "system", "content": "Summarize in one sentence."},
            {"role": "user", "content": text},
        ],
    )
    return res.choices[0].message.content`,
        javascript: `import { observe } from "@langfuse/tracing";
import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";

// Wrap OpenAI client for Langfuse auto-instrumentation
// Integrations for many other llm/agent libraries are available
const openai = observeOpenAI(new OpenAI());

async function handleRequest(userInput: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      { role: "system", content: "Reply concisely." },
      { role: "user", content: userInput },
    ],
  });
  return res.choices[0].message.content;
}
  
// Wrap the function with observe to trace timings, nested calls, and I/O
export default observe(handleRequest);`,
      },
    },
    quickstartHref: "/docs/observability/get-started",
  },
  {
    id: "metrics",
    icon: LineChart,
    title: "Track model cost and latency",
    subtitle: "Track cost, latency, and quality.",
    body: "Monitor your LLM application's performance with comprehensive metrics dashboards and APIs. Track costs, latencies, token usage, and quality scores across models, users, and time periods.",
    docsHref: "/docs/metrics/overview",
    image: {
      light: metricsPng,
      dark: metricsPng,
      alt: "Langfuse analytics dashboard showing cost and latency metrics over time",
    },
    code: {
      snippets: {
        python: `# The metrics API enables querying of custom aggregations
# Example: Total LLM cost for each user over the last 30 days

import json, time
from langfuse import get_client

langfuse = get_client()
now = int(time.time() * 1000)                     # ms
from_ms = now - 30 * 24 * 60 * 60 * 1000          # 30 days ago

# Construct the query object
query = {
  "view": "traces",
  "dimensions": [{"field": "userId"}],
  "metrics": [{"measure": "totalCost", "aggregation": "sum"}],
  "fromTimestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(from_ms/1000)),
  "toTimestamp":   time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(now/1000)),
  "orderBy": [{"field": "totalCost_sum", "direction": "desc"}],
}

# Get metrics from Langfuse API
res = langfuse.api.metrics.metrics(query=json.dumps(query))`,
        javascript: `// Metrics API enables querying of custom aggregations
// Example: Total LLM cost for each user over the last 30 days
        
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();

const now = Date.now();
const from = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();

// Construct the query object
const query = JSON.stringify({
  view: "traces",
  dimensions: [{ field: "userId" }],
  metrics: [{ measure: "totalCost", aggregation: "sum" }],
  fromTimestamp: from,
  toTimestamp: new Date(now).toISOString(),
  orderBy: [{ field: "totalCost_sum", direction: "desc" }],
});

// Get metrics from Langfuse API
const res = await langfuse.api.metrics.metrics({query});`,
      },
    },
    quickstartHref: "/docs/metrics/overview",
  },
  {
    id: "prompt-management",
    icon: GitPullRequestArrow,
    title: "Improve your prompts",
    subtitle: "Version and deploy prompts with low latency.",
    body: "Version-control prompts collaboratively, deploy/roll-back instantly to different environments, support for templates, variables, and A/B testing. Cached client-side for 0 latency/availability impact.",
    docsHref: "/docs/prompt-management/overview",
    videoHref: "/watch-demo?tab=prompt",
    image: {
      light: PromptPng,
      dark: PromptPng,
      alt: "Langfuse prompt management interface showing versioned prompts",
    },
    code: {
      snippets: {
        python: `from langfuse import get_client
from langfuse.openai import openai

langfuse = get_client()

def handle_request(user_input: str) -> str:
  # Fetches the latest 'production' version if no 'label' is provided
  # Caches client-side, revalidates in background, instant subsequent calls
  prompt = langfuse.get_prompt("support-reply", type="chat")

  # Prompt can contain variables and placeholders
  # Filled at runtime via compile()
  compiled_prompt = prompt.compile(tone="friendly", input=user_input)

  # Works with any model, supports text and chat message formats
  res = openai.chat.completions.create(
      model="gpt-5",
      messages=compiled_prompt,
  )
  return res.choices[0].message.content
`,
        javascript: `import { LangfuseClient } from "@langfuse/client";
import OpenAI from "openai";

const langfuse = new LangfuseClient();
const openai = new OpenAI();

async function handleRequest(userInput: string) {
  // Fetches the latest 'production' version if no 'label' is provided
  // Caches client-side, revalidates in background, instant subsequent calls
  const prompt = await langfuse.prompt.get("support-reply", { type: "chat" });

  // Prompt can contain variables and placeholders
  // Filled at runtime via compile()
  const compiledPrompt = prompt.compile({ tone: "friendly", input: userInput });

  // Works with any model, supports text and chat message formats
  const res = await openai.chat.completions.create({
    model: "gpt-5",
    messages: compiledPrompt,
  });
  
  return res.choices[0].message.content;
}
`,
      },
    },
    quickstartHref: "/docs/prompt-management/get-started",
  },
  {
    id: "evaluation",
    icon: ThumbsUp,
    title: "Evaluate model outputs automatically",
    subtitle: "Collect feedback and run evaluations.",
    body: "Run online/offline evals, via UI (experiment with prompts/models) and via SDKs (experiment with end-to-end application). Build datasets from traces to continuously improve your evals. View results in UI.",
    docsHref: "/docs/evaluation/overview",
    videoHref: "/watch-demo?tab=evaluation",
    image: {
      light: EvalsPng,
      dark: EvalsPng,
      alt: "Langfuse evaluation interface showing feedback and scores",
    },
    code: {
      snippets: {
        python: `from langfuse import get_client, Evaluation
from langfuse.openai import OpenAI

langfuse = get_client()
dataset = langfuse.get_dataset("capital_cities") # fetch dataset with examples

def task(*, item, **_): # TODO: call your own application logic here
    r = OpenAI().chat.completions.create(
        model="gpt-5",
        messages=[{"role": "user", "content": item["input"]}],
    )
    return r.choices[0].message.content

def accuracy_eval(*, input, output, expected_output, **_):
    ok = expected_output.lower() in output.lower()
    return Evaluation(name="accuracy", value=1.0 if ok else 0.0)

# Experiment runner iterates dataset items, traces calls, and applies evaluators
result = langfuse.run_experiment(
    name="Capitals - simple implementation",
    data=dataset.items,
    task=task,
    evaluators=[accuracy_eval],
)
print(result.format())`,
        javascript: `import { LangfuseClient } from "@langfuse/client";
import OpenAI from "openai";

const langfuse = new LangfuseClient();
const dataset = await langfuse.dataset.get("capital_cities");

const task = async (item: { input: string }) => {
  const res = await new OpenAI().chat.completions.create({
    model: "gpt-5",
    messages: [{ role: "user", content: item.input }],
  });
  return res.choices[0].message.content;
};

const accuracy = async ({ output, expectedOutput }: any) => ({
  name: "accuracy",
  value: output.toLowerCase() === expectedOutput.toLowerCase() ? 1 : 0,
});

// Experiment runner: loops over dataset items, traces runs, applies evaluators
const result = await langfuse.experiment.run({
  name: "Capitals - simple implementation",
  data: dataset.items,
  task,
  evaluators: [accuracy],
});`,
      },
    },
  },
  {
    id: "annotations",
    icon: MessageSquare,
    title: "Collaborate on human reviews",
    subtitle: "Add manual feedback and corrections.",
    body: "Create manual annotations to provide feedback, corrections, and improvements to your LLM outputs. Use annotations to build high-quality datasets and set a baseline for automated evals.",
    docsHref: "/docs/evaluation/evaluation-methods/annotation",
    image: {
      light: AnnotationPng,
      dark: AnnotationPng,
      alt: "Langfuse annotation interface for manual feedback and corrections",
    },
    displayMode: "image-only",
  },
  {
    id: "playground",
    icon: FlaskConical,
    title: "Iterate with structured experiments",
    subtitle: "Test prompts and models interactively.",
    body: "Experiment with different prompts, models, and parameters in an interactive playground. Compare outputs, iterate on prompts, and save successful configurations to prompt management.",
    docsHref: "/docs/prompt-management/features/playground",
    image: {
      light: PlaygroundPng, // Placeholder - needs playground screenshot
      dark: PlaygroundPng,
      alt: "Langfuse playground interface for testing prompts and models",
    },
    displayMode: "image-only",
    quickstartHref: "/docs/prompt-management/features/playground",
  },
  //   {
  //     id: "public-api",
  //     icon: Globe,
  //     title: "Public API",
  //     subtitle: "Full REST API access to all features.",
  //     body: "Access all Langfuse features and data programmatically through our API. Integrate with your existing workflows, build custom interfaces and dashboards, and automate your workflows.",
  //     docsHref: "/docs/api-and-data-platform/overview",
  //     image: {
  //       light: observabilityPng, // Placeholder - needs API documentation screenshot
  //       dark: observabilityPng,
  //       alt: "Langfuse API documentation and examples",
  //     },
  //     code: {
  //       snippets: {
  //         python: `from langfuse import get_client

  // langfuse = get_client()

  // # Get list of traces with optional filters & pagination
  // traces = langfuse.api.trace.list(limit=100, user_id="user_123", tags=["production"])

  // # Get a single trace by ID
  // trace = langfuse.api.trace.get("traceId")

  // # Get observations for a specific trace
  // observations = langfuse.api.observations.get_many(trace_id="traceId", type="GENERATION", limit=50)

  // # Get sessions and scores
  // sessions = langfuse.api.sessions.list(limit=20)
  // scores = langfuse.api.score_v_2.get(limit=20)

  // # Get aggregated metrics (see other tab)
  // metrics = langfuse.api.metrics.metrics(...)

  // # Many more APIs are available
  // # See the API reference or SDK docs for more details`,
  //         javascript: `import { LangfuseClient } from "@langfuse/client";

  // const langfuse = new LangfuseClient();

  // // Get list of traces with optional filters & pagination
  // const traces = await langfuse.api.trace.list({ limit: 100 });

  // // Get a single trace by ID
  // const trace = await langfuse.api.trace.get("traceId");

  // // Get observations for a specific trace
  // const observations = await langfuse.api.observations.getMany({traceId: "traceId", type: "GENERATION", limit: 50});

  // // Get sessions and scores
  // const sessions = await langfuse.api.sessions.list({ limit: 20 });
  // const scores = await langfuse.api.scoreV2.get({ limit: 20 });

  // // Get aggregated metrics (see other tab)
  // const metrics = await langfuse.api.metrics.metrics({...});

  // // Many more APIs are available
  // // See the API reference or SDK docs for more details`,
  //       },
  //     },
  //     displayMode: "code-only",
  //   },
];
