---
title: Langfuse와 Cohere 통합하기
sidebarTitle: Cohere
description: 옵저버빌리티와 디버깅을 위해 OpenAI SDK를 통해 Cohere를 Langfuse와 통합하는 가이드입니다.
category: Integrations
logo: /images/integrations/cohere_icon.svg
---

# Langfuse로 Cohere 옵저버빌리티 구현하기

이 가이드는 OpenAI SDK 호환 API를 사용하여 Cohere를 Langfuse와 통합하는 방법을 보여줍니다. 애플리케이션을 원활하게 트레이싱하고 모니터링하세요.

> **Cohere란 무엇인가요?** [Cohere](https://docs.cohere.com/docs/)는 API를 통해 최첨단 언어 모델을 제공하는 AI 플랫폼으로, 개발자가 자연어 이해 기능을 갖춘 애플리케이션을 구축할 수 있게 해줍니다.

> **Langfuse란 무엇인가요?** [Langfuse](https://langfuse.com)는 LLM 애플리케이션의 트레이싱, 모니터링, 디버깅을 위한 오픈 소스 AI 엔지니어링 플랫폼입니다.

## 1단계: 종속성 설치

필요한 Python 패키지가 설치되어 있는지 확인하세요.

```python
%pip install openai langfuse
```

## 2단계: 환경 변수 설정

```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com

os.environ.setdefault("LANGFUSE_PUBLIC_KEY", "pk-lf...")
os.environ.setdefault("LANGFUSE_SECRET_KEY", "sk-lf...")
os.environ.setdefault("LANGFUSE_BASE_URL", "https://cloud.langfuse.com") # 🇪🇺 EU region
# Other Langfuse data regions include 🇺🇸 US: https://us.cloud.langfuse.com, 🇯🇵 Japan: https://jp.cloud.langfuse.com and ⚕️ HIPAA: https://hipaa.cloud.langfuse.com

# Set your Cohere API key from your Cohere account settings
os.environ.setdefault("COHERE_API_KEY", "...")
```

## 3단계: OpenAI SDK로 Cohere 사용하기

클라이언트를 초기화할 때 base URL을 Cohere의 엔드포인트로 교체하여 호환 API를 활용하세요.

```python
# Instead of importing openai directly, use Langfuse's drop-in replacement
from langfuse.openai import openai

client = openai.OpenAI(
  api_key=os.environ.get("COHERE_API_KEY"),
  base_url="https://api.cohere.ai/compatibility/v1"  # Cohere Compatibility API endpoint
)
```

## 4단계: 예시 실행하기

아래 예시는 기본적인 채팅 완성 요청을 보여줍니다. 모든 API 호출은 Langfuse에 의해 자동으로 트레이싱됩니다.

```python
response = client.chat.completions.create(
  model="command-r7b-12-2024",  # Replace with the desired Cohere model
  messages=[
    {"role": "system", "content": "You are an assistant."},
    {"role": "user", "content": "Tell me about the benefits of using Cohere with Langfuse."}
  ],
  name="Cohere-Trace"
)

print(response.choices[0].message.content)
```

## 5단계: Langfuse에서 트레이스 확인하기

예시를 실행한 후 Langfuse에 로그인하여 요청 매개변수, 응답 콘텐츠, 토큰 사용량, 지연 시간 메트릭을 포함한 상세 트레이스를 확인하세요.

![Langfuse 트레이스 예시](https://langfuse.com/images/cookbook/integration_cohere/cohere-example-trace.png)

_[공개 예시 트레이스](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/17d82424-f22f-46d1-a63b-6ec3e2c3da1e?timestamp=2025-03-05T11%3A35%3A26.398Z&observation=490e73b2-fdf5-40ad-95d7-a1d0bd054e0e)_

## 참고 자료

- [Cohere 문서](https://docs.cohere.com/docs/compatibility-api)
- [Langfuse](https://langfuse.com)
- [Langfuse OpenAI 통합 가이드](https://langfuse.com/integrations/model-providers/openai-py)
