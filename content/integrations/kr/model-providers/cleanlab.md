---
title: "Langfuse와 Cleanlab 통합"
sidebarTitle: Cleanlab
description: "Cleanlab의 신뢰할 수 있는 Language Model(TLM)로 LLM을 실시간으로 자동 평가하세요"
logo: /images/integrations/cleanlab_icon.png
logoAppearance: dark
---

# Cleanlab을 사용한 자동화된 평가

Cleanlab의 [Trustworthy Language Model](https://cleanlab.ai/tlm/)(TLM)은 Langfuse 사용자가 모든 LLM 트레이스에서 품질이 낮거나 환각을 일으킨 응답을 빠르게 식별할 수 있게 해줍니다.

## TLM이란 무엇인가요?

TLM은 모든 LLM 출력에 신뢰성과 설명 가능성을 더해주는 자동화된 평가 도구입니다. TLM은 프로덕션 로그와 트레이스에 숨어 있는 품질이 낮고 부정확한 LLM 응답을 자동으로 찾아냅니다. 이를 통해 이러한 잘못된 응답을 직접 찾기 위한 수작업 검토 및 주석 작업을 크게 줄이면서도 더 나은 평가를 수행할 수 있습니다. TLM은 또한 모든 LLM 출력에 대한 신뢰도 점수를 사용하여 LLM 자동화 응답과 의사 결정을 위한 스마트 라우팅을 지원합니다.

**TLM은 사용자에게 다음을 제공합니다:**

- 모든 LLM 응답에 대한 신뢰도 점수와 설명
- 더 높은 정확도: 엄격한 [벤치마크](https://cleanlab.ai/blog/trustworthy-language-model/)에 따르면 TLM은 GPT 4/4o, Claude와 같은 다른 LLM보다 지속적으로 더 정확한 결과를 생성합니다.
- 확장 가능한 API: 대규모 데이터셋을 처리하도록 설계된 TLM은 데이터 추출, 태깅/레이블링, Q&A(RAG) 등을 포함한 대부분의 엔터프라이즈 애플리케이션에 적합합니다.

## 시작하기

이 가이드는 Cleanlab의 Trustworthy Language Models(TLM)를 사용하여 Langfuse에 캡처된 LLM 응답을 평가하는 과정을 안내합니다.

### 종속성 설치 및 환경 변수 설정

```python
%pip install langfuse openai cleanlab-tlm --upgrade
```

```python
import os
import pandas as pd
from getpass import getpass
import dotenv
dotenv.load_dotenv()
```

### API 키

이 가이드에는 Cleanlab TLM API 키가 필요합니다. 아직 없다면 [여기](https://tlm.cleanlab.ai/)에서 무료 체험판에 가입할 수 있습니다.

이 가이드에는 네 가지 API 키가 필요합니다:

- [Langfuse Public Key](https://cloud.langfuse.com/)(모든 Langfuse Cloud 리전에서 사용 가능: [EU](https://cloud.langfuse.com), [US](https://us.cloud.langfuse.com), [Japan](https://jp.cloud.langfuse.com), [HIPAA](https://hipaa.cloud.langfuse.com))
- Langfuse Secret Key(동일한 프로젝트에서)
- [OpenAI API Key](https://platform.openai.com/api-keys)
- [Cleanlab TLM API Key](https://tlm.cleanlab.ai/)

```python
# Get keys for your project from the project settings page: https://cloud.langfuse.com

os.environ.setdefault("LANGFUSE_PUBLIC_KEY", "pk-lf-...")
os.environ.setdefault("LANGFUSE_SECRET_KEY", "sk-lf-...")
os.environ.setdefault("LANGFUSE_BASE_URL", "https://cloud.langfuse.com") # 🇪🇺 EU region
# Other Langfuse data regions include 🇺🇸 US: https://us.cloud.langfuse.com, 🇯🇵 Japan: https://jp.cloud.langfuse.com and ⚕️ HIPAA: https://hipaa.cloud.langfuse.com

os.environ.setdefault("OPENAI_API_KEY", "<openai_api_key>")

os.environ.setdefault("CLEANLAB_TLM_API_KEY", "<cleanlab_tlm_api_key>")
```

### 트레이스 데이터셋 준비 및 Langfuse에 로드하기

시연 목적으로, 트레이스를 간단히 생성하여 Langfuse에서 추적해 보겠습니다. 일반적으로는 이미 Langfuse에 트레이스를 캡처해두었을 것이므로 "Langfuse에서 트레이스 데이터셋 다운로드하기" 부분으로 건너뛰면 됩니다.

참고: TLM은 LLM에 대한 전체 입력이 제공되어야 합니다. 여기에는 응답을 생성하기 위해 원래 LLM에 제공된 모든 시스템 프롬프트, 컨텍스트, 기타 정보가 포함됩니다. 아래에서는 기본적으로 트레이스가 입력 안에 시스템 프롬프트를 포함하지 않기 때문에 시스템 프롬프트를 트레이스 메타데이터에 포함시킨 것을 확인할 수 있습니다.

```python
from langfuse import observe, get_client, propagate_attributes
from openai import OpenAI

langfuse = get_client()
openai = OpenAI()
```

```python
# Let's use some tricky trivia questions to generate some traces
trivia_questions = [
    "What is the 3rd month of the year in alphabetical order?",
    "What is the capital of France?",
    "How many seconds are in 100 years?",
    "Alice, Bob, and Charlie went to a café. Alice paid twice as much as Bob, and Bob paid three times as much as Charlie. If the total bill was $72, how much did each person pay?",
    "When was the Declaration of Independence signed?"
]

@observe()
def generate_answers(trivia_question):
    system_prompt = "You are a trivia master."

    # Propagate the trace name, tags, and metadata to all observations of this trace
    with propagate_attributes(
        trace_name=f"Answering question: '{trivia_question}'",
        tags=["TLM_eval_pipeline"],
        metadata={"system_prompt": system_prompt}
    ):
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": trivia_question},
            ],
        )

        answer = response.choices[0].message.content
        return answer


# Generate answers
answers = []
for i in range(len(trivia_questions)):
    answer = generate_answers(trivia_questions[i])
    answers.append(answer)
    print(f"Question {i+1}: {trivia_questions[i]}")
    print(f"Answer {i+1}:\n{answer}\n")

# Ensure all traces are sent to Langfuse before we fetch them below
langfuse.flush()

print(f"Generated {len(answers)} answers and tracked them in Langfuse.")
```

이 튜토리얼의 목표는 외부 평가 파이프라인을 구축하는 방법을 보여주는 것임을 기억하세요. 이러한 파이프라인은 CI/CD 환경에서 실행되거나, 다른 오케스트레이션된 컨테이너 서비스에서 실행될 수 있습니다. 어떤 환경을 선택하든 항상 다음 세 가지 핵심 단계가 적용됩니다:

1.  **트레이스 가져오기**: 애플리케이션 트레이스를 평가 환경으로 가져옵니다
2.  **평가 실행하기**: 원하는 평가 로직을 적용합니다
3.  **결과 저장하기**: 계산에 사용된 Langfuse 트레이스에 평가 결과를 다시 첨부합니다.

이 노트북의 나머지 부분에서는 하나의 목표를 갖습니다:

---

🎯 목표: **_지난 24시간 동안 실행된 모든 트레이스 평가하기_**

---

### Langfuse에서 트레이스 데이터셋 다운로드하기

Langfuse에서 트레이스를 가져오는 것은 간단합니다. Langfuse 클라이언트를 설정하고 퍼블릭 API 래퍼를 사용하여 데이터를 가져오기만 하면 됩니다. 트레이스를 가져와서 평가하겠습니다. 그 후 우리의 점수를 다시 Langfuse에 추가하겠습니다.

`langfuse.api.trace.list()` 메서드에는 태그, 타임스탬프 등으로 트레이스를 필터링하는 인자가 있습니다. [트레이스 쿼리](https://langfuse.com/docs/api-and-data-platform/features/query-via-sdk)에 대한 다른 방법은 문서에서 확인할 수 있습니다.

```python
from langfuse import get_client
from datetime import datetime, timedelta

langfuse = get_client()
now = datetime.now()
one_day_ago = now - timedelta(hours=24)

traces = langfuse.api.trace.list(
    tags="TLM_eval_pipeline",
    from_timestamp=one_day_ago,
    to_timestamp=now,
).data
```

### TLM으로 평가 생성하기

Langfuse는 숫자형, 불리언형, 범주형(`string`) 점수를 처리할 수 있습니다. 커스텀 평가 로직을 함수로 감싸는 것이 종종 좋은 관행입니다.

각 트레이스에 대해 TLM을 개별적으로 실행하는 대신, 모든 prompt, response 쌍을 리스트로 TLM에 한 번에 제공하겠습니다. 이는 더 효율적이며 모든 트레이스에 대한 점수와 설명을 한 번에 얻을 수 있게 해줍니다. 그런 다음 `trace.id`를 사용하여 점수와 설명을 Langfuse의 올바른 트레이스에 다시 첨부할 수 있습니다.

```python
from cleanlab_tlm import TLM

tlm = TLM(options={"log": ["explanation"]})
```

```python
# This helper method will extract the prompt and response from each trace and return three lists: trace ID's, prompts, and responses.
def get_prompt_response_pairs(traces):
    prompts = []
    responses = []
    for trace in traces:
        prompts.append(trace.metadata["system_prompt"] + "\n" + trace.input["args"][0])
        responses.append(trace.output)
    return prompts, responses

trace_ids = [trace.id for trace in traces]
prompts, responses = get_prompt_response_pairs(traces)
```

이제 TLM을 사용하여 각 트레이스에 대한 `trustworthiness score`와 `explanation`을 생성해 보겠습니다.

**중요:** 응답을 생성하기 위해 원래 LLM에 제공된 모든 시스템 프롬프트, 컨텍스트, 기타 정보를 항상 포함하는 것이 필수적입니다. `get_trustworthiness_score()`에 대한 프롬프트 입력은 원래 프롬프트와 최대한 유사하게 구성해야 합니다. 이것이 바로 시스템 프롬프트를 트레이스 메타데이터에 포함시킨 이유입니다.

```python
# Evaluate each of the prompt, response pairs using TLM
evaluations = tlm.get_trustworthiness_score(prompts, responses)

# Extract the trustworthiness scores and explanations from the evaluations
trust_scores = [entry["trustworthiness_score"] for entry in evaluations]
explanations = [entry["log"]["explanation"] for entry in evaluations]

# Create a DataFrame with the evaluation results
trace_evaluations = pd.DataFrame({
    'trace_id': trace_ids,
    'prompt': prompts,
    'response': responses,
    'trust_score': trust_scores,
    'explanation': explanations
})
trace_evaluations
```

    Querying TLM... 100%|██████████|

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>trace_id</th>
      <th>prompt</th>
      <th>response</th>
      <th>trust_score</th>
      <th>explanation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2f0d41b2-9b89-4ba6-8b3f-7dadac8a8fae</td>
      <td>You are a trivia master.\nWhen was the Declara...</td>
      <td>The Declaration of Independence was signed on ...</td>
      <td>0.389889</td>
      <td>The proposed response states that the Declarat...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>f8e91744-3fcb-4ef5-b6c6-7cbcf0773144</td>
      <td>You are a trivia master.\nAlice, Bob, and Char...</td>
      <td>Let's denote the amount Charlie paid as C. \n\...</td>
      <td>0.669774</td>
      <td>This response is untrustworthy due to lack of ...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>f9b42125-4e5e-4533-bfbb-36c30490bd1d</td>
      <td>You are a trivia master.\nHow many seconds are...</td>
      <td>There are 3,153,600,000 seconds in 100 years.</td>
      <td>0.499818</td>
      <td>To calculate the number of seconds in 100 year...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>71b131b9-e706-41c7-9bfd-b77719783f29</td>
      <td>You are a trivia master.\nWhat is the capital ...</td>
      <td>The capital of France is Paris.</td>
      <td>0.987433</td>
      <td>Did not find a reason to doubt trustworthiness.</td>
    </tr>
    <tr>
      <th>4</th>
      <td>da0ee9fa-01cf-42ce-9e3e-e8d127ca105b</td>
      <td>You are a trivia master.\nWhat is the 3rd mont...</td>
      <td>March.</td>
      <td>0.114874</td>
      <td>To determine the 3rd month of the year in alph...</td>
    </tr>
  </tbody>
</table>
</div>

훌륭합니다! 이제 트레이스 ID를 각각의 점수와 설명에 매핑한 DataFrame이 생겼습니다. 시연을 위해 각 트레이스의 prompt와 response도 포함시켰습니다. 이제 **가장 신뢰도가 낮은 트레이스**를 찾아보겠습니다!

```python
sorted_df = trace_evaluations.sort_values(by="trust_score", ascending=True).head()
sorted_df
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>trace_id</th>
      <th>prompt</th>
      <th>response</th>
      <th>trust_score</th>
      <th>explanation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>4</th>
      <td>da0ee9fa-01cf-42ce-9e3e-e8d127ca105b</td>
      <td>You are a trivia master.\nWhat is the 3rd mont...</td>
      <td>March.</td>
      <td>0.114874</td>
      <td>To determine the 3rd month of the year in alph...</td>
    </tr>
    <tr>
      <th>0</th>
      <td>2f0d41b2-9b89-4ba6-8b3f-7dadac8a8fae</td>
      <td>You are a trivia master.\nWhen was the Declara...</td>
      <td>The Declaration of Independence was signed on ...</td>
      <td>0.389889</td>
      <td>The proposed response states that the Declarat...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>f9b42125-4e5e-4533-bfbb-36c30490bd1d</td>
      <td>You are a trivia master.\nHow many seconds are...</td>
      <td>There are 3,153,600,000 seconds in 100 years.</td>
      <td>0.499818</td>
      <td>To calculate the number of seconds in 100 year...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>f8e91744-3fcb-4ef5-b6c6-7cbcf0773144</td>
      <td>You are a trivia master.\nAlice, Bob, and Char...</td>
      <td>Let's denote the amount Charlie paid as C. \n\...</td>
      <td>0.669774</td>
      <td>This response is untrustworthy due to lack of ...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>71b131b9-e706-41c7-9bfd-b77719783f29</td>
      <td>You are a trivia master.\nWhat is the capital ...</td>
      <td>The capital of France is Paris.</td>
      <td>0.987433</td>
      <td>Did not find a reason to doubt trustworthiness.</td>
    </tr>
  </tbody>
</table>
</div>

```python
# Let's look at the least trustworthy trace.
print("Prompt: ", sorted_df.iloc[0]["prompt"], "\n")
print("OpenAI Response: ", sorted_df.iloc[0]["response"], "\n")
print("TLM Trust Score: ", sorted_df.iloc[0]["trust_score"], "\n")
print("TLM Explanation: ", sorted_df.iloc[0]["explanation"])
```

    Prompt:  You are a trivia master.
    What is the 3rd month of the year in alphabetical order?

    OpenAI Response:  March.

    TLM Trust Score:  0.11487442493072615

    TLM Explanation:  To determine the 3rd month of the year in alphabetical order, we first list the months: January, February, March, April, May, June, July, August, September, October, November, December. When we arrange these months alphabetically, we get: April, August, December, February, January, July, June, March, May, November, October, September. In this alphabetical list, March is the 8th month, not the 3rd. The 3rd month in alphabetical order is actually December. Therefore, the proposed response is incorrect.
    This response is untrustworthy due to lack of consistency in possible responses from the model. Here's one inconsistent alternate response that the model considered (which may not be accurate either):
    December.

#### 훌륭합니다! TLM은 OpenAI로부터 온 잘못된 답변을 포함한 여러 트레이스를 식별할 수 있었습니다.

`trust_score`와 `explanation` 열을 Langfuse에 업로드해 보겠습니다.

### Langfuse에 평가 결과 업로드하기

```python
for idx, row in trace_evaluations.iterrows():
    trace_id = row["trace_id"]
    trust_score = row["trust_score"]
    explanation = row["explanation"]

    # Add the trustworthiness score to the trace with the explanation as a comment
    langfuse.create_score(
        trace_id=trace_id,
        name="trust_score",
        value=trust_score,
        comment=explanation
    )

langfuse.flush()
```

이제 Langfuse UI에서 TLM 신뢰도 점수와 설명을 확인할 수 있습니다!

![Cleanlab의 TLM 신뢰도 점수를 보여주는 Langfuse 플랫폼 이미지](https://langfuse.com/images/cookbook/integration-cleanlab/tlm_trust_scores.png)

트레이스를 클릭하면 신뢰도 점수와 제공된 설명도 확인할 수 있습니다.

![Cleanlab의 TLM 신뢰도 점수와 설명을 보여주는 Langfuse 플랫폼 이미지](https://langfuse.com/images/cookbook/integration-cleanlab/tlm_trust_scores_explanation.png)
