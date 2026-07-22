---
title: Langfuse를 사용한 로컬 LLM의 Ollama 옵저버빌리티 및 트레이싱
sidebarTitle: Ollama
description: Ollama로 오픈소스 LLM을 로컬 머신에서 실행하고 Langfuse로 출력을 트레이싱하여 오픈소스 LLM 옵저버빌리티를 확보하세요.
category: Integrations
logo: /images/integrations/ollama_icon.svg
logoAppearance: dark
---

# Langfuse로 로컬 Ollama 모델 트레이싱하기

이 쿡북에서는 Ollama와 Langfuse로 로컬 언어 모델을 트레이싱하는 방법을 보여드립니다.

**참고: 이 예제에서는 Python용 Langfuse OpenAI SDK 통합을 사용합니다. 이는 [JS/TS](https://langfuse.com/integrations/model-providers/openai-js)에서도 동일하게 동작하며, [LangChain](https://langfuse.com/integrations/frameworks/langchain) 및 [LlamaIndex](https://langfuse.com/integrations/frameworks/llamaindex)와의 Langfuse 통합을 통해서도 사용할 수 있습니다.**

## Ollama란 무엇인가요?

Ollama([GitHub](https://github.com/ollama/ollama))는 대규모 언어 모델(LLM)을 로컬 머신에서 실행할 수 있게 해주는 오픈소스 플랫폼으로, [Llama 3.1](https://ollama.com/library/llama3.1)이나 [Mistral 7B](https://ollama.com/library/mistral)를 포함한 다양한 모델을 지원합니다. 모델 가중치, 설정, 데이터를 Modelfile로 정의된 하나의 패키지로 묶어 설정 및 구성을 최적화합니다.

## Langfuse란 무엇인가요?

Langfuse([GitHub](https://github.com/langfuse/langfuse))는 트레이싱, 프롬프트 관리, 평가를 통해 팀이 LLM 애플리케이션을 협업하며 디버깅, 분석, 개선할 수 있도록 돕는 오픈소스 AI 엔지니어링 플랫폼입니다.

### Langfuse 로컬 배포

물론 Langfuse를 로컬에 배포하여 자신의 기기에서만 모델을 실행하고 LLM 출력을 트레이싱할 수도 있습니다. [여기](https://langfuse.com/self-hosting/deployment/docker-compose)에서 Docker Compose를 사용하여 로컬 머신에 Langfuse를 실행하는 방법에 대한 가이드를 확인하세요. 이 방법은 Langfuse를 테스트하고 통합 문제를 해결하는 데 이상적입니다.

이 예제에서는 Langfuse 클라우드 버전을 사용하겠습니다.

## 예제 1: Llama 3.1 모델

이 예제에서는 Llama 3.1 모델을 사용하여 OpenAI Python SDK와 Langfuse 트레이싱으로 간단한 채팅 완료 애플리케이션을 만들어보겠습니다.

### 1단계: Ollama 설정

먼저 [Ollama를 다운로드](https://ollama.com/download)하고 [Llama 3.1](https://ollama.com/library/llama3.1) 모델을 pull하세요. 자세한 내용은 [Ollama 문서](https://github.com/ollama/ollama/tree/main/docs)를 참고하세요.

```bash
ollama pull llama3.1
```

Ollama의 OpenAI 호환 API 엔드포인트를 호출하려면 동일한 [OpenAI 형식](https://platform.openai.com/docs/quickstart?context=curl)을 사용하고 호스트명을 `http://localhost:11434`로 변경하세요.

```bash
curl http://localhost:11434/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "llama3.1",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Hello!"
            }
        ]
    }'
```

### 2단계: Langfuse 설정

Langfuse UI의 프로젝트 설정에서 [API 키](https://langfuse.com/faq/all/where-are-langfuse-api-keys)로 Langfuse 클라이언트를 초기화하고 환경 변수에 추가하세요.

```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ.setdefault("LANGFUSE_PUBLIC_KEY", "")
os.environ.setdefault("LANGFUSE_SECRET_KEY", "")
os.environ.setdefault("LANGFUSE_BASE_URL", "https://cloud.langfuse.com") # 🇪🇺 EU region
# Other Langfuse data regions include 🇺🇸 US: https://us.cloud.langfuse.com, 🇯🇵 Japan: https://jp.cloud.langfuse.com and ⚕️ HIPAA: https://hipaa.cloud.langfuse.com
```

```python
%pip install langfuse openai --upgrade
```

### 3단계: OpenAI Python SDK로 Llama3.1 모델 호출하기

Ollama 모델을 사용하기 위해 Ollama가 동일한 API를 제공하므로(위 참고) OpenAI Python SDK를 사용합니다. LLM 호출을 Langfuse에서 트레이싱하려면 **드롭인 대체재**([문서](https://langfuse.com/integrations/model-providers/openai-py), JS/TS와 LangChain, LlamaIndex를 통해서도 동일하게 동작함)를 사용하여 임포트만 변경하면 전체 로깅을 사용할 수 있습니다.

```diff
- import openai
+ from langfuse.openai import openai

Alternative imports:
+ from langfuse.openai import OpenAI, AsyncOpenAI, AzureOpenAI, AsyncAzureOpenAI

```

```python
# Drop-in replacement to get full logging by changing only the import
from langfuse.openai import OpenAI

# Configure the OpenAI client to use http://localhost:11434/v1 as base url
client = OpenAI(
    base_url = 'http://localhost:11434/v1',
    api_key='ollama', # required, but unused
)

response = client.chat.completions.create(
  model="llama3.1",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who was the first person to step on the moon?"},
    {"role": "assistant", "content": "Neil Armstrong was the first person to step on the moon on July 20, 1969, during the Apollo 11 mission."},
    {"role": "user", "content": "What were his first words when he stepped on the moon?"}
  ]
)
print(response.choices[0].message.content)
```

    A famous moment in history! When Neil Armstrong took his historic first steps on the moon, his first words were: "That's one small step for man, one giant leap for mankind." (Note: The word was actually "man", not "men" - it's often been reported as "one small step for men", but Armstrong himself said he meant to say "man")

### **4단계:** Langfuse에서 트레이스 확인하기

[Langfuse UI의 예제 트레이스](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/6ad58e47-3bff-4287-9a96-af85d2627ea4)

![View example trace in the Langfuse UI](https://langfuse.com/images/cookbook/integration-ollama/integration-ollama-llama-trace.png)

## 예제 2: Mistral 7B 모델

이 예제에서는 Mistral 7B 모델을 사용하여 OpenAI Python SDK와 Langfuse 트레이싱으로 간단한 채팅 완료 애플리케이션을 만들어보겠습니다.

### 1단계: Ollama 설정

먼저 [Ollama를 다운로드](https://ollama.com/download)하고 [Mistral 7B](https://ollama.com/library/mistral) 모델을 pull하세요.

```bash
ollama pull mistral

```

Ollama의 OpenAI 호환 API 엔드포인트를 호출하려면 동일한 [OpenAI 형식](https://platform.openai.com/docs/quickstart?context=curl)을 사용하고 호스트명을 http://localhost:11434로 변경하세요.

```bash
curl http://localhost:11434/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "mistral",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Hello!"
            }
        ]
    }'

```

### 2단계: Langfuse 설정

Langfuse UI의 프로젝트 설정에서 [API 키](https://langfuse.com/faq/all/where-are-langfuse-api-keys)로 Langfuse 클라이언트를 초기화하고 환경 변수에 추가하세요.

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

### 3단계: OpenAI Python SDK로 Mistral 모델 호출하기

```python
# Drop-in replacement to get full logging by changing only the import
from langfuse.openai import OpenAI

# Configure the OpenAI client to use http://localhost:11434/v1 as base url
client = OpenAI(
    base_url = 'http://localhost:11434/v1',
    api_key='ollama', # required, but unused
)

response = client.chat.completions.create(
  model="mistral",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "How many elements are there in the periodic table?"},
    {"role": "assistant", "content": "There are 118 elements in the periodic table."},
    {"role": "user", "content": "Which element was discovered most recently?"}
  ]
)
print(response.choices[0].message.content)
```

     The most recently confirmed element is oganesson (Og), with symbol Og and atomic number 118. It was officially recognized by IUPAC (International Union of Pure and Applied Chemistry) in 2016, following the synthesis of several atoms at laboratories in Russia and Germany. The latest unofficially-recognized element is ununsextium (Uus), with atomic number 138. However, its synthesis is still under investigation, and IUPAC has yet to officially confirm its existence.

### 4단계: Langfuse에서 트레이스 확인하기

[Langfuse UI의 예제 트레이스](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/85693874-9ddb-4fd4-a386-0031933cb784)

![View example trace in the Langfuse UI](https://langfuse.com/images/cookbook/integration-ollama/integration-ollama-mistral-trace.png)

## 피드백

피드백이나 요청 사항이 있다면 GitHub [Issue](https://langfuse.com/issue)를 생성하거나 [Discord](https://discord.langfuse.com/) 커뮤니티에 아이디어를 공유해 주세요.
