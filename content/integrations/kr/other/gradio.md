---
title: Open Source LLM Observability for Gradio
sidebarTitle: Gradio
logo: /images/integrations/gradio_icon.svg
description: 🤗 Gradio로 LLM 채팅 UI를 만들고 🪢 Langfuse로 트레이싱하세요.
category: Integrations
---

# 🤗 Gradio로 LLM 채팅 UI를 만들고 🪢 Langfuse로 트레이싱하기

이 노트북은 Gradio 애플리케이션을 LLM 옵저버빌리티와 평가를 위해 Langfuse와 통합하는 방법을 보여주는 간단한 엔드투엔드 예제입니다.

**참고:** 이 노트북은 Google Colab에서 실행하는 것을 권장합니다(위 링크 참고). 이 노트북은 Hugging Face Space 템플릿으로도 [여기](https://huggingface.co/spaces/langfuse/langfuse-gradio-example-template)에서 제공됩니다.

원본 구현과 이 노트북에 기여해 준 [@tkmamidi](https://github.com/tkmamidi)에게 감사드립니다.

## 소개

### Gradio란 무엇인가요?

[Gradio](https://github.com/gradio-app/gradio)는 머신 러닝 모델, API, Python 함수를 위한 웹 인터페이스를 빠르게 만들 수 있는 오픈 소스 Python 라이브러리입니다. 개발자가 어떤 Python 함수든 손쉽게 공유하거나 임베드할 수 있는 인터랙티브 UI로 감쌀 수 있게 해주어, 데모, 프로토타입, ML 모델 배포에 이상적입니다. 자세한 내용은 [문서](https://www.gradio.app/docs)를 참고하세요.

### Langfuse란 무엇인가요?

[Langfuse](https://github.com/langfuse/langfuse)는 LLM 애플리케이션 옵저버빌리티, 평가, 실험, 프롬프트 관리를 통해 신뢰할 수 있는 LLM 애플리케이션을 구축할 수 있도록 돕는 오픈 소스 AI 엔지니어링 플랫폼입니다. 자세한 내용은 [문서](https://langfuse.com/docs)를 참고하세요.

### 살펴보기

아래에서 구현 과정을 담은 영상을 확인할 수 있습니다. 영상이나 노트북을 따라 진행해 보세요.

<iframe
  width="100%"
  className="aspect-[16/9] rounded mt-3"
  src="https://www.youtube-nocookie.com/embed/O--lEvvfWf8?si=5eh_KPJ8FVypSFjV"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowFullScreen
></iframe>

### 개요

이 노트북에서는 다음을 다룹니다.

1. [Gradio `Chatbot`](https://www.gradio.app/docs/gradio/chatbot)을 사용해 Python으로 간단한 채팅 인터페이스를 만들고 노트북에서 렌더링하기
2. 챗봇에 [Langfuse Tracing](https://langfuse.com/docs/tracing) 추가하기
3. 채팅 애플리케이션에서 자주 사용되는 추가적인 Langfuse 트레이싱 기능 구현하기: [채팅 세션](https://langfuse.com/docs/tracing-features/sessions), [사용자 피드백](https://langfuse.com/docs/scores/user-feedback)

## 설정

필요한 패키지를 설치합니다. 이 간단한 예제에서는 OpenAI를 사용합니다. 어떤 모델이든 사용할 수 있습니다.

```python
%pip install gradio langfuse openai --upgrade
```

자격 증명을 설정하고, 나중에 사용자 피드백을 추가하는 데 사용할 Langfuse SDK 클라이언트를 초기화합니다.

몇 분 만에 무료 [Langfuse Cloud](https://cloud.langfuse.com) 계정을 만들거나 [Langfuse를 셀프 호스팅](https://langfuse.com/self-hosting)할 수 있습니다.

```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ.setdefault("LANGFUSE_PUBLIC_KEY", "")
os.environ.setdefault("LANGFUSE_SECRET_KEY", "")
os.environ.setdefault("LANGFUSE_BASE_URL", "https://cloud.langfuse.com") # 🇪🇺 EU region
# Other Langfuse data regions include 🇺🇸 US: https://us.cloud.langfuse.com, 🇯🇵 Japan: https://jp.cloud.langfuse.com and ⚕️ HIPAA: https://hipaa.cloud.langfuse.com

# Your openai key
# We use OpenAI for this demo, could easily change to other models
os.environ.setdefault("OPENAI_API_KEY", "")
```

```python
import gradio as gr
import json
import uuid
from langfuse import get_client

langfuse = get_client()
```

## 채팅 함수 구현

### 세션/스레드

각 채팅 메시지는 Gradio Chatbot의 스레드에 속하며, `clear`([참고](https://www.gradio.app/docs/gradio/chatbot#event-listeners))를 사용해 초기화할 수 있습니다.

전역적으로 사용되며 `set_new_session_id` 메서드를 통해 재설정할 수 있는 `session_id`를 생성하는 다음 메서드를 구현합니다. 이 session_id는 [Langfuse Sessions](https://langfuse.com/docs/tracing-features/sessions)에 사용됩니다.

```python
session_id = None
def set_new_session_id():
    global session_id
    session_id = str(uuid.uuid4())

# Initialize
set_new_session_id()
```

### 응답 핸들러

`respond` 메서드를 구현할 때, Langfuse [`@observe()` 데코레이터](https://langfuse.com/docs/observability/sdk/instrumentation#observe-wrapper)를 사용해 각 응답을 [Langfuse Tracing](https://langfuse.com/docs/tracing)에 자동으로 로깅합니다. 이 데코레이터는 트레이스의 루트 옵저베이션을 생성하며, `langfuse.update_current_span()`을 통해 채팅 입력/출력을 설정하고 `propagate_attributes(session_id=...)`를 통해 스레드의 모든 메시지를 하나의 [Langfuse Session](https://langfuse.com/docs/tracing-features/sessions)으로 그룹화합니다.

또한 모델 매개변수, 토큰 수, 기타 메타데이터를 캡처하기 위해 LLM 호출 계측을 단순화해 주는 [openai 통합](https://langfuse.com/integrations/model-providers/openai-py)을 사용합니다. 다른 방법으로는 [LangChain](https://langfuse.com/integrations/frameworks/langchain), [LlamaIndex](https://langfuse.com/integrations/frameworks/llamaindex), [다른 프레임워크](https://langfuse.com/integrations)와의 통합을 사용하거나, SDK로 직접 호출을 계측([예제](https://langfuse.com/docs/observability/sdk/instrumentation#custom))할 수도 있습니다.

```python
# Langfuse decorator and attribute propagation
from langfuse import observe, propagate_attributes
# Optional: automated instrumentation via OpenAI SDK integration
# See note above regarding alternative implementations
from langfuse.openai import openai

# Global reference for the current trace_id which is used to later add user feedback
current_trace_id = None

# Add decorator here to capture overall timings, input/output, and manipulate trace metadata via `langfuse`
@observe()
async def create_response(
    prompt: str,
    history,
):
    # Save trace id in global var to add feedback later
    global current_trace_id
    current_trace_id = langfuse.get_current_trace_id()

    # Add session_id to all observations of this trace to enable session tracking
    global session_id
    with propagate_attributes(
        trace_name="gradio_demo_chat",
        session_id=session_id,
    ):

        # Set input on the root observation created by the decorator
        langfuse.update_current_span(input=prompt)

        # Add prompt to history
        if not history:
            history = [{"role": "system", "content": "You are a friendly chatbot"}]
        history.append({"role": "user", "content": prompt})
        yield history

        # Get completion via OpenAI SDK
        # Auto-instrumented by Langfuse via the import, see alternative in note above
        response = {"role": "assistant", "content": ""}
        oai_response = openai.chat.completions.create(
            messages=history,
            model="gpt-4o-mini",
        )
        response["content"] = oai_response.choices[0].message.content or ""

        # Set output on the root observation for better readability in Langfuse Sessions
        langfuse.update_current_span(output=response["content"])

        yield history + [response]

async def respond(prompt: str, history):
    async for message in create_response(prompt, history):
        yield message
```

### 사용자 피드백 핸들러

Gradio 챗봇의 `like` 이벤트([참고](https://www.gradio.app/docs/gradio/chatbot#event-listeners))를 통해 [Langfuse에서 사용자 피드백 추적](https://langfuse.com/docs/scores/user-feedback)을 구현합니다. 이 메서드는 애플리케이션의 전역 상태에서 사용 가능한 현재 trace id를 재사용합니다.

```python
def handle_like(data: gr.LikeData):
    global current_trace_id
    if data.liked:
        langfuse.create_score(value=1, name="user-feedback", trace_id=current_trace_id)
    else:
        langfuse.create_score(value=0, name="user-feedback", trace_id=current_trace_id)
```

### 재시도

Gradio Chatbot의 `retry` 이벤트([문서](https://www.gradio.app/docs/gradio/chatbot#event-listeners))를 통해 완성 결과를 재시도할 수 있습니다. 이는 Langfuse와의 통합에 특화된 기능은 아닙니다.

```python
async def handle_retry(history, retry_data: gr.RetryData):
    new_history = history[: retry_data.index]
    previous_prompt = history[retry_data.index]["content"]
    async for message in respond(previous_prompt, new_history):
        yield message
```

## Gradio Chatbot 실행하기

위의 모든 메서드를 구현했으니 이제 [Gradio Chatbot](https://www.gradio.app/docs/gradio/chatbot)을 조합해 실행할 수 있습니다. Colab에서 실행하면 임베드된 Chatbot 인터페이스가 표시됩니다.

```python
with gr.Blocks() as demo:
    gr.Markdown("# Chatbot using 🤗 Gradio + 🪢 Langfuse")
    chatbot = gr.Chatbot(
        label="Chat",
        type="messages",
        show_copy_button=True,
        avatar_images=(
            None,
            "https://static.langfuse.com/cookbooks/gradio/hf-logo.png",
        ),
    )
    prompt = gr.Textbox(max_lines=1, label="Chat Message")
    prompt.submit(respond, [prompt, chatbot], [chatbot])
    chatbot.retry(handle_retry, chatbot, [chatbot])
    chatbot.like(handle_like, None, None)
    chatbot.clear(set_new_session_id)


if __name__ == "__main__":
    demo.launch(share=True, debug=True)
```

## Langfuse에서 데이터 살펴보기

Chatbot과 상호작용하면 Langfuse 프로젝트에서 트레이스, 세션, 피드백 점수를 확인할 수 있습니다. 자세한 내용은 위 영상을 참고하세요.

Langfuse의 트레이스, 세션, 사용자 피드백 예시([공개 링크](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/sessions/5c0b8d01-cbcb-4650-be50-c6e4ca0ce093)):

![Gradio Traces, sessions and user feedback in Langfuse](https://static.langfuse.com/cookbooks/gradio/gradio-traces-in-langfuse.gif)

질문이나 피드백이 있으시면 [Langfuse Discord](https://langfuse.com/discord)에 참여하거나 [GitHub Discussions](https://langfuse.com/gh-support)에 새 스레드를 만들어 주세요.
