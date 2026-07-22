---
title: OpenAI Assistants API를 위한 OSS 옵저버빌리티
sidebarTitle: OpenAI Assistants API
description: Langfuse 데코레이터를 사용하여 openai assistants에 대한 호출을 트레이싱하기
category: Integrations
logo: /images/integrations/openai_icon.svg
logoAppearance: dark
---

# 쿡북: Langfuse로 OpenAI Assistants API의 옵저버빌리티 확보하기

이 쿡북은 [OpenAI Assistants API](https://platform.openai.com/docs/assistants/overview)에 대한 호출을 트레이싱하기 위해 Langfuse [`observe` 데코레이터](https://langfuse.com/docs/observability/sdk/instrumentation#observe-wrapper)를 사용하는 방법을 보여줍니다. assistant를 생성하고, 스레드에서 실행하고, [Langfuse 트레이싱](https://langfuse.com/docs/tracing)으로 실행 과정을 관찰하는 방법을 다룹니다.

참고: 네이티브 [OpenAI SDK 래퍼](https://langfuse.com/integrations/model-providers/openai-py)는 OpenAI assistants API의 트레이싱을 지원하지 않으므로, 이 노트북에서 보여주는 대로 데코레이터를 통해 계측해야 합니다.

## Assistants API란 무엇인가요?

OpenAI의 Assistants API를 사용하면 개발자가 코드 인터프리터, 파일 검색, 함수 호출로 생성한 커스텀 도구 등 여러 도구와 데이터 소스를 동시에 활용할 수 있는 AI assistant를 만들 수 있습니다. 이 assistant는 특정 프롬프트로 GPT-4 같은 OpenAI의 언어 모델에 접근하고, 지속적인 대화 기록을 유지하며, 텍스트, 이미지, 스프레드시트 등 다양한 파일 형식을 처리할 수 있습니다. 개발자는 자신의 데이터로 언어 모델을 미세 조정하고 출력의 무작위성 같은 측면을 제어할 수 있습니다. 이 API는 언어 이해와 외부 도구 및 데이터를 결합한 AI 애플리케이션을 만들기 위한 프레임워크를 제공합니다.

## 예제 트레이스 출력

![OpenAI Assistants Trace in Langfuse](https://langfuse.com/images/docs/openai-assistants-trace.png)

## 설정

필요한 패키지를 설치하세요.

```python
%pip install --upgrade openai langfuse
```

환경을 설정하세요.

```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ.setdefault("LANGFUSE_PUBLIC_KEY", "")
os.environ.setdefault("LANGFUSE_SECRET_KEY", "")
os.environ.setdefault("LANGFUSE_BASE_URL", "https://cloud.langfuse.com") # 🇪🇺 EU region
# Other Langfuse data regions include 🇺🇸 US: https://us.cloud.langfuse.com, 🇯🇵 Japan: https://jp.cloud.langfuse.com and ⚕️ HIPAA: https://hipaa.cloud.langfuse.com

# Your openai key
os.environ.setdefault("OPENAI_API_KEY", "")
```

## 단계별 진행

### 1. Assistant 생성하기

`client.beta.assistants.create` 메서드를 사용하여 새 assistant를 생성합니다. 또는 OpenAI 콘솔을 통해서도 assistant를 생성할 수 있습니다.

```python
from langfuse import observe
from openai import OpenAI

@observe()
def create_assistant():
    client = OpenAI()

    assistant = client.beta.assistants.create(
        name="Math Tutor",
        instructions="You are a personal math tutor. Answer questions briefly, in a sentence or less.",
        model="gpt-4"
    )

    return assistant

assistant = create_assistant()
print(f"Created assistant: {assistant.id}")
```

**assistant 생성에 대한 [예제 트레이스 공개 링크](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/e659e523-2957-4452-83c4-426f29783923)**

### 2. Assistant 실행하기

스레드를 생성하고 그 위에서 assistant를 실행합니다.

```python
@observe()
def run_assistant(assistant_id, user_input):
    client = OpenAI()

    thread = client.beta.threads.create()

    client.beta.threads.messages.create(
        thread_id=thread.id, role="assistant", content="I am a math tutor that likes to help math students, how can I help?"
    )
    client.beta.threads.messages.create(
        thread_id=thread.id, role="user", content=user_input
    )

    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id,
    )

    return run, thread

user_input = "I need to solve the equation `3x + 11 = 14`. Can you help me?"
run, thread = run_assistant(assistant.id, user_input)
print(f"Created run: {run.id}")
```

**메시지 및 트레이스 생성에 대한 [예제 트레이스 공개 링크](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/e659e523-2957-4452-83c4-426f29783923)**

### 3. 응답 가져오기

스레드에서 assistant의 응답을 가져옵니다.

```python
import json
from langfuse import observe, get_client
langfuse = get_client()

@observe()
def get_response(thread_id, run_id):
    client = OpenAI()

    messages = client.beta.threads.messages.list(thread_id=thread_id, order="asc")
    assistant_response = messages.data[-1].content[0].text.value

    # get run for model and token counts
    run_log = client.beta.threads.runs.retrieve(
        thread_id=thread_id,
        run_id=run_id
    )

    message_log = client.beta.threads.messages.list(
        thread_id=thread_id,
    )
    input_messages = [{"role": message.role, "content": message.content[0].text.value} for message in message_log.data[::-1][:-1]]

    # log the internal generation within the openai assistant as a nested generation
    # it is automatically attached to the current trace and parent observation created by the decorator
    with langfuse.start_as_current_observation(
        as_type="generation",
        name="assistant-run",
        model=run_log.model,
        input=input_messages,
    ) as generation:
        generation.update(
            output=assistant_response,
            usage_details=run_log.usage.model_dump() if run_log.usage else None,
        )

    return assistant_response, run_log

response = get_response(thread.id, run.id)
print(f"Assistant response: {response[0]}")
```

**응답 조회에 대한 [예제 트레이스 공개 링크](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/e0933ea5-6806-4eb7-aed8-a42d23c57096?observation=401fb816-22e5-45ac-a4c9-e437b120f2e7)**

## 하나의 트레이스로 전부 보기

```python
import time

@observe()
def run_math_tutor(user_input):
    assistant = create_assistant()
    run, thread = run_assistant(assistant.id, user_input)

    time.sleep(5) # notebook only, wait for the assistant to finish

    response = get_response(thread.id, run.id)

    return response[0]

user_input = "I need to solve the equation `3x + 11 = 14`. Can you help me?"
response = run_math_tutor(user_input)
print(f"Assistant response: {response}")
```

Langfuse 트레이스는 assistant를 생성하고, 사용자 입력과 함께 스레드에서 실행하고, 캡처된 입력/출력 데이터와 함께 응답을 가져오는 흐름을 보여줍니다.

**[예제 트레이스 공개 링크](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/b3b7b128-5664-4f42-9fab-31999da9e2f1)**

![OpenAI Assistants Trace in Langfuse](https://langfuse.com/images/docs/openai-assistants-trace.png)

## 더 알아보기

Assistants API가 아닌 다른 엔드포인트를 사용하는 경우, 트레이싱을 위해 OpenAI SDK 래퍼를 사용할 수 있습니다. 자세한 내용은 [Langfuse 문서](https://langfuse.com/integrations/model-providers/openai-py)를 확인하세요.
