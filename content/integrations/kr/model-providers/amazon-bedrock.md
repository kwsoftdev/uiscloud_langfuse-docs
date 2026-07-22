---
title: "Amazon Bedrock 통합"
sidebarTitle: Amazon Bedrock
seoTitle: Open Source Observability and Metrics for Amazon Bedrock
description: Amazon Bedrock 애플리케이션과 Bedrock SDK를 위한 오픈 소스 옵저버빌리티입니다.
logo: /images/integrations/bedrock_icon.png
---

# Amazon Bedrock 통합

[**Amazon Bedrock**](https://aws.amazon.com/bedrock/)은 파운데이션 모델과 커스텀 모델을 사용하여 텍스트, 이미지, 오디오를 생성할 수 있게 해주는 완전 관리형 AWS 서비스입니다.

**Amazon Bedrock과 함께 Langfuse를 사용**하면 모든 요청에 대해 [상세한 트레이스](https://langfuse.com/docs/tracing)와 메트릭을 손쉽게 캡처하여 애플리케이션의 성능과 동작에 대한 인사이트를 얻을 수 있습니다.

트레이싱 외의 모든 인 UI Langfuse 기능(플레이그라운드, llm-as-a-judge 평가, 프롬프트 실험)은 Amazon Bedrock과 완전히 호환됩니다 – 프로젝트 설정에서 Bedrock 구성을 추가하기만 하면 됩니다.

## 통합 옵션

Amazon Bedrock의 트레이스와 메트릭을 캡처하는 몇 가지 방법이 있습니다:

1. Langfuse와 통합된 애플리케이션 프레임워크를 통해:
   - [Langchain](https://langfuse.com/integrations/frameworks/langchain)
   - [Llama Index](https://langfuse.com/integrations/frameworks/llamaindex)
   - [Haystack](https://langfuse.com/integrations/frameworks/haystack)
   - [Vercel AI SDK](https://langfuse.com/integrations/frameworks/vercel-ai-sdk)

2. [LiteLLM](https://langfuse.com/integrations/gateways/litellm)과 같은 프록시를 통해
3. [Langfuse Decorator](https://langfuse.com/docs/sdk/python/decorators)로 Bedrock SDK를 래핑하여 (_아래 예시 참고_)

## Amazon Bedrock SDK(Converse API)를 래핑하는 방법

```python
# install requirements
%pip install boto3 langfuse awscli --quiet
```

### AWS 세션 인증하기

Amazon Bedrock에 접근 권한이 있는 AWS 역할로 로그인합니다.

```python
AWS_ACCESS_KEY_ID="***"
AWS_SECRET_ACCESS_KEY="***"
AWS_SESSION_TOKEN="***"

import boto3

# used to access Bedrock configuration
bedrock = boto3.client(
    service_name="bedrock",
    region_name="eu-west-1",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    aws_session_token=AWS_SESSION_TOKEN
)

# used to invoke the Bedrock Converse API
bedrock_runtime = boto3.client(
    service_name="bedrock-runtime",
    region_name="eu-west-1",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    aws_session_token=AWS_SESSION_TOKEN
)
```

```python
# Check which models are available in your account
models = bedrock.list_inference_profiles()
for model in models["inferenceProfileSummaries"]:
  print(model["inferenceProfileName"] + " - " + model["inferenceProfileId"])
```

    EU Anthropic Claude 3 Sonnet - eu.anthropic.claude-3-sonnet-20240229-v1:0
    EU Anthropic Claude 3 Haiku - eu.anthropic.claude-3-haiku-20240307-v1:0
    EU Anthropic Claude 3.5 Sonnet - eu.anthropic.claude-3-5-sonnet-20240620-v1:0
    EU Meta Llama 3.2 3B Instruct - eu.meta.llama3-2-3b-instruct-v1:0
    EU Meta Llama 3.2 1B Instruct - eu.meta.llama3-2-1b-instruct-v1:0

### Langfuse 자격 증명 설정하기

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

환경 변수를 설정했으니, 이제 Langfuse 클라이언트를 초기화할 수 있습니다. `get_client()`는 환경 변수에 제공된 자격 증명을 사용하여 Langfuse 클라이언트를 초기화합니다.

```python
from langfuse import get_client

langfuse = get_client()

# Verify connection
if langfuse.auth_check():
    print("Langfuse client is authenticated and ready!")
else:
    print("Authentication failed. Please check your credentials and host.")
```

### Bedrock SDK 래핑하기

```python
from langfuse import observe
from botocore.exceptions import ClientError

@observe(as_type="generation", name="Bedrock Converse")
def wrapped_bedrock_converse(**kwargs):
  # 1. extract model metadata
  kwargs_clone = kwargs.copy()
  input = kwargs_clone.pop('messages', None)
  modelId = kwargs_clone.pop('modelId', None)
  model_parameters = {
      **kwargs_clone.pop('inferenceConfig', {}),
      **kwargs_clone.pop('additionalModelRequestFields', {})
  }
  langfuse.update_current_generation(
    input=input,
    model=modelId,
    model_parameters=model_parameters,
    metadata=kwargs_clone
  )

  # 2. model call with error handling
  try:
    response = bedrock_runtime.converse(**kwargs)
  except (ClientError, Exception) as e:
    error_message = f"ERROR: Can't invoke '{modelId}'. Reason: {e}"
    langfuse.update_current_generation(level="ERROR", status_message=error_message)
    print(error_message)
    return

  # 3. extract response metadata
  response_text = response["output"]["message"]["content"][0]["text"]
  langfuse.update_current_generation(
    output=response_text,
    usage_details={
        "input": response["usage"]["inputTokens"],
        "output": response["usage"]["outputTokens"],
        "total": response["usage"]["totalTokens"]
    },
    metadata={
        "ResponseMetadata": response["ResponseMetadata"],
    }
  )

  return response_text
```

### 예시 실행하기

```python
# Converesation according to AWS spec including prompting + history
user_message = """You will be acting as an AI personal finance advisor named Alex, created by the company SmartFinance Advisors. Your goal is to provide financial advice and guidance to users. You will be replying to users who are on the SmartFinance Advisors site and who will be confused if you don't respond in the character of Alex.

Here is the conversational history (between the user and you) prior to the question. It could be empty if there is no history:
<history>
User: Hi Alex, I'm really looking forward to your advice!
Alex: Hello! I'm Alex, your AI personal finance advisor from SmartFinance Advisors. How can I assist you with your financial goals today?
</history>

Here are some important rules for the interaction:
-  Always stay in character, as Alex, an AI from SmartFinance Advisors.
-  If you are unsure how to respond, say "I'm sorry, I didn't quite catch that. Could you please rephrase your question?"

"""

conversation = [
    {
        "role": "user",
        "content": [{"text": user_message}],
    }
]

@observe()
def examples_bedrock_converse_api():
  responses = {}

  responses["anthropic"] = wrapped_bedrock_converse(
    modelId="eu.anthropic.claude-3-5-sonnet-20240620-v1:0",
    messages=conversation,
    inferenceConfig={"maxTokens":500,"temperature":1},
    additionalModelRequestFields={"top_k":250}
  )

  responses["llama3-2"] = wrapped_bedrock_converse(
    modelId="eu.meta.llama3-2-3b-instruct-v1:0",
    messages=conversation,
    inferenceConfig={"maxTokens":500,"temperature":1},
  )

  return responses

res = examples_bedrock_converse_api()

for key, value in res.items():
    print(f"{key.title()}\n{value}\n")
```

    Anthropic
    Understood. I'll continue to act as Alex, the AI personal finance advisor from SmartFinance Advisors, maintaining that character throughout our interaction. I'll provide financial advice and guidance based on the user's questions and needs. If I'm unsure about something, I'll ask for clarification as instructed. How may I assist you with your financial matters today?

    Llama3-2
    Hello again! I'm glad you're excited about receiving my advice. How can I assist you with your financial goals today? Are you looking to create a budget, paying off debt, saving for a specific goal, or something else entirely?

Example trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/f01a828c-fed1-45e1-b836-cd74c331597d?observation=512a4d7f-5a6c-461e-bd8f-76f6bdcc91fd

![Bedrock Converse API 트레이스](https://langfuse.com/images/cookbook/integration-amazon-bedrock/bedrock-converse-trace.png)

## Langfuse에서 Amazon Bedrock 비용과 토큰 사용량을 모니터링할 수 있나요?

네, Langfuse에서 Bedrock 호출의 비용과 토큰 사용량을 모니터링할 수 있습니다. LLM 애플리케이션 프레임워크와의 네이티브 통합 및 LiteLLM 프록시는 자동으로 Langfuse에 토큰 사용량을 보고합니다.

[Langfuse Decorator 또는 Context Manager](https://langfuse.com/docs/sdk/python/sdk-v3)를 사용하면 토큰 사용량과 (선택적으로) 비용 정보도 직접 [보고](https://langfuse.com/docs/model-usage-and-cost)할 수 있습니다. 자세한 내용은 위 예시를 참고하세요.

Langfuse 대시보드나 UI를 통해 커스텀 가격 정보를 정의하여([문서 참고](https://langfuse.com/docs/model-usage-and-cost)) Amazon Bedrock에서 사용하는 모델의 정확한 가격에 맞게 조정할 수 있습니다.

## 추가 자료

- AWS 팀이 관리하는 AWS 관련 예시 모음이 담긴 [langfuse-genaiops Notebook](https://github.com/aws-samples/genai-ml-platform-examples/blob/main/integration/langfuse/langfuse-genaiops.ipynb)
- AWS에 Langfuse를 배포하기 위한 [셀프 호스팅 가이드](https://langfuse.com/self-hosting)
