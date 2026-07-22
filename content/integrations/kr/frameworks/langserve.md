---
title: Langserve 통합
description: 이 가이드는 관찰 가능성, 메트릭, 평가, 프롬프트 관리, 플레이그라운드, 데이터셋을 위해 Langfuse를 LangChain의 Langserve와 네이티브로 통합하는 방법을 보여줍니다.
category: Integrations
sidebarTitle: Langserve
logo: /images/integrations/langchain_icon.png
---

# 쿡북: Langserve 통합

[Langserve](https://python.langchain.com/docs/langserve/) (Python)

> LangServe는 개발자가 LangChain runnable과 체인을 REST API로 배포할 수 있도록 돕습니다.
>
> 이 라이브러리는 FastAPI와 통합되어 있으며 데이터 검증을 위해 pydantic을 사용합니다.
>
> 또한, 서버에 배포된 runnable을 호출하는 데 사용할 수 있는 클라이언트도 제공합니다. JavaScript 클라이언트는 LangChain.js에서 사용할 수 있습니다.

이 쿡북은 ([LangChain 통합](https://langfuse.com/integrations/frameworks/langchain)을 사용하여) Langfuse로 Langserve를 통해 배포된 애플리케이션을 트레이싱하는 방법을 보여줍니다. 이 노트북에서 서버와 클라이언트를 모두 실행합니다.

## 설정

```python
%pip install fastapi sse_starlette httpx langserve langfuse langchain-openai langchain --upgrade
```

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

## 간단한 LLM 호출 예제

Langfuse `CallbackHandler`를 초기화하고(위에서 설정한 환경 변수를 통해 인증됩니다) 이를 콜백 핸들러로 사용해 LLM을 구성합니다. Langserve의 `add_routes()`를 통해 Fastapi에 추가합니다.

```python
from langchain_openai import ChatOpenAI
from langchain_core.runnables.config import RunnableConfig
from langfuse import get_client
from langfuse.langchain import CallbackHandler
from fastapi import FastAPI
from langserve import add_routes

# Initialize Langfuse CallbackHandler for Langchain (tracing)
langfuse_handler = CallbackHandler()

# Tests the SDK connection with the server
get_client().auth_check()

llm = ChatOpenAI()

config = RunnableConfig(callbacks=[langfuse_handler])

llm_with_langfuse = llm.with_config(config)

# Setup server
app = FastAPI()

# Add Langserve route
add_routes(
    app,
    llm_with_langfuse,
    path="/test-simple-llm-call",
)
```

_참고: 이 예제에서는 노트북에서 서버를 실행할 수 있도록 TestClient를 사용합니다_

```python
from fastapi.testclient import TestClient

# Initialize TestClient
client = TestClient(app)

# Test simple route
response = client.post("/test-simple-llm-call/invoke", json={"input": "Tell me a joke?"})
```

예제 트레이스: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/5f32e2e7-9508-4280-b47b-e0356bc3c81e

![Langserve 간단한 LLM 호출의 트레이스](https://langfuse.com/images/cookbook/integration_langserve_simple.png)

## LCEL 예제

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langserve import add_routes

# Create Chain
prompt = ChatPromptTemplate.from_template("Tell me a joke about {topic}")

chain = prompt | llm | StrOutputParser()

# Add new route
add_routes(
    app,
    chain.with_config(config),
    path="/test-chain",
)

# Test chain route
response = client.post("/test-chain/invoke", json={"input": {"topic": "Berlin"}})
```

예제 트레이스: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/261d1006-74ff-4b67-8baf-afdfc827aee2

![Langserve LCEL 예제의 트레이스](https://langfuse.com/images/cookbook/integration_langserve_chain.png)

## 에이전트 예제

```python
from langchain_core.tools import tool
from langchain_core.utils.function_calling import convert_to_openai_tool
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain.agents import AgentExecutor
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langserve.pydantic_v1 import BaseModel
from langchain_core.prompts import MessagesPlaceholder

class Input(BaseModel):
    input: str

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant."),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

@tool
def word_length(word: str) -> int:
    """Returns a counter word"""
    return len(word)

tools = [word_length]

llm_with_tools = llm.bind(tools=[convert_to_openai_tool(tool) for tool in tools])

agent = (
    {
        "input": lambda x: x["input"],
        "agent_scratchpad": lambda x: format_to_openai_tool_messages(
            x["intermediate_steps"]
        ),
    }
    | prompt
    | llm_with_tools
    | OpenAIToolsAgentOutputParser()
)
agent_executor = AgentExecutor(agent=agent, tools=tools)

agent_config = RunnableConfig({"run_name": "agent"}, callbacks=[langfuse_handler])

add_routes(
    app,
    agent_executor.with_types(input_type=Input).with_config(
        agent_config
    ),
    path="/test-agent",
)

response = client.post("/test-agent/invoke", json={"input": {"input": "How long is Leonardo DiCaprios last name?"}})
```

예제 트레이스: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/ed1d57f9-2f35-4e72-8150-b061f21840a7

![Langserve 에이전트 예제의 트레이스](https://langfuse.com/images/cookbook/integration_langserve_agent.png)
