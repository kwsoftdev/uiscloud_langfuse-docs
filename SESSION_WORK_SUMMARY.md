<!--
title: Langfuse Docs — Session Work Summary
-->

# Langfuse Docs — 세션 작업 요약

이 문서는 `uiscloud_langfuse-docs` 저장소에서 이번 세션 동안 진행한 작업 전체를 정리한 내부 기록입니다. 크게 4가지 축으로 진행되었습니다: **(1) 한국어(i18n) 로컬라이제이션**, **(2) 상단 내비게이션/Footer 단순화**, **(3) 배포 인프라 전환(Cloudflare Pages/Vercel → Jenkins + Docker Hub)**, **(4) Prompt Engineering Guide 신규 섹션 구축**.

## 1. 한국어(i18n) 로컬라이제이션

### 목표

기존에 영어 전용이던 Langfuse 마케팅 사이트 + 문서 사이트에 한국어 버전을 추가하고, 처음 방문하는 사용자에게 한국어를 기본값으로 제공하며, 언제든 영어로 전환할 수 있는 토글을 제공하는 것.

### 아키텍처 결정

| 결정                 | 내용                                                                                                                                         | 이유                                                                                                                                                                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| URL 세그먼트         | `/kr` (예: `/docs/kr`, `/guides/kr`, 홈은 `/kr`)                                                                                             | 기존에 예약되어 있던 `/kr` 마케팅 랜딩 컨벤션과 일치                                                                                                                                                                                                                     |
| 내부 언어 코드       | `ko` (BCP47)                                                                                                                                 | `/kr`은 URL 세그먼트일 뿐, `hreflang`/`<DocsBody lang>`/문자열 사전 키는 실제 언어 코드인 `ko`를 사용                                                                                                                                                                    |
| 라우팅 방식          | 섹션별 별도 Fumadocs 컬렉션 + 별도 `app/` 라우트 (Next.js 내장 i18n 미들웨어 **미사용**)                                                     | 도입 당시 사이트가 Cloudflare Pages용 정적 export(`STATIC_EXPORT=true`)로 배포되어 서버가 없어 미들웨어 기반 리다이렉트가 불가능했음. 기존 `academy/japan` 패턴을 그대로 확장. (Cloudflare Pages 지원은 이후 완전히 제거됨 — §3 참고 — 하지만 라우팅 구조는 그대로 유지) |
| 언어 감지/리다이렉트 | `localStorage`(`langfuse-lang-pref`) + `useEffect` 기반 클라이언트 사이드 리다이렉트 (`LocalePreferenceRedirect`, `app/layout.tsx`에 마운트) | 정적 export라 서버가 없어 미들웨어 불가 → 유일한 대안이었음 (알려진 트레이드오프: JS를 실행하지 않는 크롤러는 리다이렉트를 따라가지 않음). Cloudflare Pages 지원 제거 후에는 서버 사이드 미들웨어도 가능해졌지만, 별도 요청이 없어 현재 구현은 그대로 유지               |
| 언어 전환 UI         | `LanguagePreferenceToggle` — 상대 언어 이름만 보여주는 단일 버튼, `Navbar`/`NavbarDocs`의 유연한 가운데 컬럼에 배치                          | 처음 시도한 2버튼(한국어/EN) 디자인이 `NavbarExtraContent`의 고정폭 오른쪽 컬럼에서 잘려 보이는 문제 발생 → 되돌리고 재설계                                                                                                                                              |
| 공용 라우트 팩토리   | `lib/i18n/localizedSection.tsx`의 `createLocalizedDocRoute()`                                                                                | 섹션마다 Page/generateMetadata/generateStaticParams를 손으로 반복하지 않고, hreflang·언어 스위처 링크를 일관되게 생성                                                                                                                                                    |
| 경로 판별 유틸       | `lib/i18n/koPaths.ts` — `KO_SECTION_PREFIXES`, `isKoreanPath()`, `toKoreanPath()`, `toEnglishPath()`                                         | 어떤 URL 접두사가 한국어 섹션인지에 대한 단일 진실 소스. 클라이언트 컴포넌트들은 `usePathname()` + 이 유틸로 스스로 언어를 감지 (prop drilling 회피)                                                                                                                     |
| 번역 드리프트 추적   | `translationStatus`/`sourceRevision`/`translator` frontmatter 필드를 `source.config.ts`의 `baseFrontmatterSchema`에 전역 추가                | 원문이 바뀌었을 때 번역이 뒤처졌는지 추적할 수 있는 토대 마련 (현재는 필드만 존재, 자동화된 검사는 아직 없음)                                                                                                                                                            |

### 번역/신규 작성된 섹션 (총 10개 + 홈페이지)

1. **docs, guides, faq, academy, handbook, security, resources, self-hosting** (8개) — 약 400개 파일, 멀티에이전트 Workflow로 일괄 번역
2. **integrations** — 123개 mdx/md 파일 + 10개 meta.json, 8개 병렬 Agent로 번역. 유일하게 순수 번역을 넘어선 엔지니어링이 필요했던 섹션 — 개요 페이지의 카드 그리드가 `IntegrationCategory` 컴포넌트(`components/integrations/IntegrationIndex.tsx`)를 통해 Fumadocs 소스에서 동적으로 렌더링되므로, `lang` prop을 받아 `integrationsKrSource`와 `/integrations/kr/...` 링크를 생성하도록 로케일 인식형으로 리팩토링
3. **prompt-engineering** (신규 섹션, §4 참고) — 15개 영문 페이지를 새로 작성 후 한글 15개 페이지로 번역

**홈페이지** (`/`, `/kr`) — 마케팅 콘텐츠 자체를 실제로 번역 (단순 리다이렉트가 아님). 11개 섹션 전부 (Hero, RiveSection, FeatureTabsSection, Integrations, OpenSource, DeveloperTools, Enterprise, WhyLangfuse, GetStartedSection, FAQ, AllTheTools, FeaturedCustomers, HeroStatsStrip) + HomeSidebar/HomeAside.

### 번역 원칙 (모든 섹션에 일관 적용)

- 본문(제목/문단/리스트/캘아웃/이미지 alt)은 번역한다.
- 코드 블록, 인라인 코드, CLI 명령어, config/env 키, 파일 경로, JSX/MDX 컴포넌트 태그와 그 prop 값은 번역하지 않는다.
- 고유명사·제품명·프레임워크명·모델명은 영어 그대로 둔다 (예: Docker Compose, LangChain, OpenAI, SOC 2 Type II, GDPR, chain-of-thought, ReAct).
- frontmatter 중 `title`/`sidebarTitle`/`description`만 번역하고 나머지(`logo`, `logoAppearance` 등)는 그대로 둔다.
- 헤딩 앵커 `[#id]`는 원문과 완전히 동일하게 유지한다 (내부 링크 깨짐 방지).
- 파일당 H1은 정확히 하나만 유지한다.
- 같은 섹션 내부 링크는 해당 섹션의 `/kr` 버전으로 바꾸고, 다른 섹션(예: `/docs/...`)으로 가는 링크는 그 섹션이 이미 번역되어 있어도 영어 페이지를 그대로 가리키게 둔다 — 사이트 전역에서 일관되게 적용되는 규칙.

### 기본 언어 동작

- 처음 방문자는 번역된 섹션 + 홈페이지에서 한국어가 기본값 (localStorage 리다이렉트).
- 아직 번역되지 않은 섹션(blog, changelog, pricing 등)은 영어로 유지된다.
- 상단 내비게이션의 언어 토글로 언제든 전환 가능하며, 선택은 영구 저장된다.

## 2. 상단 내비게이션 / Footer 단순화

| 제거된 요소                                        | 위치                                                    |
| -------------------------------------------------- | ------------------------------------------------------- |
| "by ClickHouse" 어필리에이션 텍스트                | `Logo` 컴포넌트                                         |
| 🐐 채용 배지 (`HiringBadge`)                       | `Navbar`/`NavbarDocs` — 컴포넌트 파일 자체 삭제         |
| Pricing 링크                                       | 상단 바 + 모바일 메뉴 (Footer에는 유지)                 |
| Changelog 링크                                     | 상단 바, 리소스 드롭다운, 모바일 메뉴 (Footer에는 유지) |
| Support 링크                                       | 리소스 드롭다운                                         |
| Workshop 탭                                        | `DocsSecondaryNav`                                      |
| Launch App / Get Demo 버튼                         | `NavbarExtraContent`                                    |
| Footer 링크 4열 + 소셜 아이콘 + 법적 링크 바       | `Footer` — 저작권 줄만 남김                             |
| GitHub/X/Ask AI 커뮤니티 스트립                    | `HomeAside` (블로그의 `BlogAside`는 그대로 유지)        |
| Actions 박스(피드백/GitHub 편집) + 커뮤니티 스트립 | `DocsTocFooter` — Contributors 블록만 남김              |
| "지원"(Support) 사이드바 항목                      | `content/docs/meta.json` "더 보기" 섹션                 |

## 3. 배포 인프라 전환: Cloudflare Pages/Vercel → Jenkins + Docker Hub

### 3.1 Cloudflare Pages 정적 export 지원 제거

실제 배포 대상이 Vercel(`vercel.json` 존재)로 확인되어, 이미 쓰이지 않던 `STATIC_EXPORT` 정적 export 경로를 제거:

- `next.config.mjs` — `output: "export"` / `images.unoptimized` 조건부 블록 제거
- `next-sitemap.config.js` — `/api/*` 정적 export 제외 조건 제거
- `package.json` — `build:static`, `postbuild:static` 스크립트 제거
- `scripts/generate-cloudflare-redirects.js`, `lib/_headers` 삭제, 잔재였던 `out/_headers`(git에 추적되어 있던 빌드 산출물)와 빈 `out/` 디렉토리 정리

### 3.2 Vercel 제거 + Jenkins/Docker Hub 파이프라인 구성

- `vercel.json`, `scripts/vercel_ignore_build_check.sh` 삭제 (`@vercel/og`, `@vercel/mcp-adapter`, `@vercel/functions`, `@langfuse/vercel-ai-sdk` 같은 npm 라이브러리 의존성은 호스팅과 무관함을 확인 후 그대로 유지)
- `next.config.mjs`에 `output: "standalone"` 추가 (Docker용 경량 서버 번들)
- `Dockerfile.prod` 신규 작성 — 멀티스테이지 프로덕션 이미지 (`builder` 스테이지: git+zip 설치, 전체 저장소 복사 후 `pnpm install`(postinstall.sh 요구사항 반영) → `next build`; `runner` 스테이지: `.next/standalone` + `.next/static` + `public`만 복사, non-root `nextjs` 사용자로 실행, `CMD ["node", "server.js"]`). `GITHUB_ACCESS_TOKEN`과 4개의 `*_LANGFUSE_BASE_URL` ARG는 실제 Langfuse Cloud 리전 URL을 기본값으로 지정해 빌드 실패를 방지
- `docker-compose.yml` 신규 작성 — 단일 서비스 `langfuse-docs`, `image: knowwheresoft/langfuse-docs:${IMAGE_TAG:-latest}`, 포트 3333, 선택적 `.env` 파일 지원
- `Jenkinsfile` 신규 작성 — 처음엔 "빌드 + Docker Hub push까지만" 범위로 시작했으나, 이후 사용자 요청으로 실제 배포까지 포함하도록 확장. 최종 단계 구성: Checkout(전체 git 히스토리) → Lint & Type Check → Docker Build → Push to Docker Hub → **Deploy**(SSH + docker compose) → **Health Check**(curl 재시도 루프)

### 3.3 실제 Jenkins 서버(`jenkins.uiscloud.net`)에 job 생성 및 실행

- 처음 안내받은 URL(`hypermakinarag-pipeline`)은 스테이지 구성(Go Test, Docreader, LightRAG Adapter 등)이 이 Next.js 프로젝트와 전혀 무관한 다른 프로젝트의 job으로 확인되어, 기존 job을 건드리지 않고 참고용으로만 구조를 확인
- 새 job `langfuse-docs-pipeline`을 생성: Pipeline script from SCM, Git repo `https://github.com/kwsoftdev/uiscloud_langfuse-docs.git` (public repo라 credential 불필요), branch `*/main`, Script Path `Jenkinsfile`, Lightweight checkout 활성화, GitHub hook trigger 활성화
- 기존 Jenkins 서버에 이미 등록되어 있던 credential을 그대로 재사용 (`dockerhub-credentials`, `deploy-server-ssh`, `github-pat` 등 — 새로 만들지 않음)
- job 생성 시 조직 차원의 자동 정책으로 `DEPLOY_HOST`(192.168.0.151)/`DEPLOY_DIR`(job 이름 기반 자동 생성 경로) 파라미터가 자동으로 추가됨을 확인 → 이를 실제로 사용해 Deploy 단계까지 구현하도록 범위를 확장 (원래는 "빌드+push까지만, 배포는 별도 처리"로 시작했던 결정에서 변경됨)
- Docker Hub 이미지명을 `knowwheresoft/langfuse-docs`로 명시적으로 설정

### 3.4 실제 빌드 3회 실행하며 발견/수정한 버그

- **빌드 #1 실패** — `corepack enable` 단계에서 `EACCES: permission denied` (Jenkins Docker Pipeline이 non-root UID로 컨테이너를 띄우기 때문). `docker { image ... }` 에이전트 블록에 `args "-u root"`를 추가해 해결 (커밋 `99bd41d2`)
- **빌드 #2 실패** — `npx tsc --noEmit`이 `fumadocs-mdx:collections/server` 가상 모듈을 찾지 못해 수십 건의 타입 에러 발생. 원인: 신선한 git 체크아웃에는 `.source/`(gitignored, 평소엔 Next.js dev/build 시 자동 생성)가 없음. 로컬에서 `.source/`를 옮겨 재현 확인 후, `node_modules/.bin/fumadocs-mdx`(인자 없이 실행, ~20ms)로 재생성하는 스텝을 `tsc` 이전에 Lint 스테이지에 추가해 해결 (커밋 `b7d44c82`)
- **`github-access-token`이라는 Secret Text credential이 실제로는 존재하지 않음** — Jenkins Credentials 관리 화면에서 확인한 결과, 해당 이름의 credential은 없고 Username/Password 타입의 `github-pat`(rockgis 소유)만 존재. GitHub API 레이트 리밋은 어떤 저장소용으로 발급된 토큰이든 인증만 되면 완화된다는 점에 근거해 `withCredentials([usernamePassword(credentialsId: "github-pat", ...)])`로 교체해 해결 (커밋 `b0a69e26`)
- **빌드 #3 완전 성공** — Checkout → Lint & Type Check → Docker Build → Push → Deploy → Health Check 전체 통과. 컨테이너 `langfusedocsuiscloudnet-langfuse-docs-1`가 `192.168.0.151:3333`에 실제로 배포됨. Jenkins 콘솔 로그에서 "Health check passed (attempt 1, HTTP 200)"과 "Build/Deploy success: b7d44c8" 확인, curl로 페이지/정적 에셋 모두 200 응답 재확인

**참고**: 배포 직후 브라우저에서 페이지가 스타일 없이(순수 HTML) 보이는 현상이 있었으나, 이는 실제 배포 결함이 아니라 raw IP:port로 HTTP 접속 시 Chrome이 정적 에셋 요청을 자동으로 HTTPS로 업그레이드하면서 (포트 3333에는 TLS 리스너가 없어) 실패하는 브라우저 자체의 동작으로 확인됨 — `curl`로 HTTP 요청은 페이지/에셋 모두 정상 200임을 재확인해 실제 서버는 정상 동작 중임을 검증함.

## 4. Prompt Engineering Guide 신규 섹션

### 배경 — 저작권 문제로 방향 전환

원래 요청은 `learnprompting.org/docs/introduction`의 내용을 크롤링해 한국어로 번역하고 "Prompt Engineering Guide"라는 메뉴로 구성하는 것이 가능한지 조사하는 것이었음. 조사(포크 에이전트를 통한 실제 라이선스 확인) 결과, 해당 사이트는 **CC BY-NC-SA 4.0**(저작자표시-비영리-동일조건변경허락) 라이선스로 공개되어 있음을 확인:

- **NC(NonCommercial)** 조항 — 상업적 사이트인 langfuse-docs에 그대로 옮겨 게시하는 것은 라이선스 위반 소지가 있음
- **SA(ShareAlike)** 조항 — 번역을 포함한 2차 저작물은 동일한 라이선스로 공개해야 하므로, 사이트의 나머지 독점 콘텐츠와 라이선스 체계가 충돌함

이 조사 결과를 근거로 크롤링·재게시 방식은 진행하지 않기로 하고, 사용자에게 대안을 확인받아 **Langfuse가 직접 작성한 오리지널 가이드**로 방향을 전환해 진행함.

### 콘텐츠 구성 (영문 15페이지 신규 작성 → 한글 15페이지 번역)

- **개요** (1) — 프롬프트 엔지니어링이란 무엇인가, "핵심 반복 과정"(Write → Trace → Evaluate → Version → Repeat)
- **기초** (2) — Zero-shot/Few-shot 프롬프팅, 프롬프트 구조화(system vs. user 메시지, 구분자, structured output)
- **기법** (5) — Chain-of-thought, Self-consistency, ReAct(추론+행동), Role prompting, RAG-aware prompting
- **고급 패턴** (3) — Prompt chaining, Agentic prompting, Long context & optimization
- **평가** (3, ★Langfuse 차별점) — 왜 프롬프트를 평가해야 하는가, Langfuse Prompt Management로 테스트·버전 관리하기(`/docs/prompt-management/overview`, `get-started`, `features/prompt-version-control`, `features/a-b-testing`, `/docs/evaluation/experiments/datasets`, `experiments-via-ui` 등 실제 검증된 문서 경로로 링크), LLM-as-a-judge
- **마무리** (1) — 흔한 실수 및 더 알아보기 (OpenAI/Anthropic 공식 프롬프트 엔지니어링 가이드로 링크, learnprompting.org는 "커뮤니티가 유지하는 오픈소스 라이브러리, Creative Commons 라이선스로 공개"라고 명시하며 링크만 제공 — 콘텐츠 재사용 없음)

### 기술 아키텍처

기존 Integrations 섹션과 동일한 패턴을 그대로 적용:

- `source.config.ts`/`lib/source.ts`에 `promptEngineering`/`promptEngineeringKr` Fumadocs 컬렉션 쌍 추가
- `app/prompt-engineering/(en)/[[...slug]]/page.tsx` + `layout.tsx`, `app/prompt-engineering/kr/[[...slug]]/page.tsx`(`createLocalizedDocRoute()` 사용) + `layout.tsx` + `not-found.tsx`
- `lib/i18n/koPaths.ts`의 `KO_SECTION_PREFIXES`에 `/prompt-engineering/kr` 추가
- `DocsSecondaryNav`에 "Prompt Engineering"/"프롬프트 엔지니어링" 탭 추가 (Academy 다음, AI Engineering Library 이전 위치)
- `lib/nav-tree.ts` 모바일 메뉴에도 동일하게 반영

## 검증 방법론

모든 변경마다 반복적으로 수행:

- `tsc --noEmit` (Jenkins에서는 `.source/` 재생성 스텝 포함)
- `pnpm run format` / `format:check`
- `node scripts/check-h1-headings.js`
- 번역/신규 작성된 모든 페이지 URL을 `curl`로 순회하여 200 상태 확인
- 실제 브라우저 스크린샷으로 렌더링 확인 (Chrome DevTools MCP) — 네비게이션 탭, 사이드바 트리, TOC 포함
- `grep`으로 도구 호출 잔재 재확인
- Jenkins 파이프라인은 실제로 3회 빌드를 돌려 실패를 재현하고 고치는 방식으로 검증 (설정만 보고 판단하지 않음)

## 커밋 현황

| 커밋       | 내용                                                                             |
| ---------- | -------------------------------------------------------------------------------- |
| `7b9be2cc` | feat(i18n): Korean 로컬라이제이션 인프라 + 8개 섹션 + 홈페이지 번역 (490 files)  |
| `47c9e31c` | refactor(nav): 상단바/Footer/HomeAside 단순화                                    |
| `50cdb428` | refactor(docs): Support 항목 제거, TOC footer 단순화                             |
| `88de6d9c` | docs: 이 요약 문서 추가                                                          |
| `1f208b6d` | feat(i18n): Integrations 섹션 한국어 번역 — 144개 파일 신규/수정                 |
| `fec31b60` | chore: Cloudflare Pages 정적 export 지원 제거                                    |
| `d6d4fb43` | chore: Vercel 제거, Jenkins + Docker Hub 파이프라인으로 교체                     |
| `65ee0629` | chore(ci): Jenkins 파이프라인 Docker Hub 이미지명 설정                           |
| `3b5dfe5e` | feat(ci): Jenkins 파이프라인에 Deploy/Health Check 스테이지 추가                 |
| `b0a69e26` | fix(ci): 존재하지 않는 credential 대신 기존 github-pat 재사용                    |
| `99bd41d2` | fix(ci): Lint & Type Check 컨테이너를 root로 실행 (corepack 권한 오류 수정)      |
| `b7d44c82` | fix(ci): tsc 이전에 fumadocs-mdx 소스 생성 스텝 추가                             |
| `2873dbe4` | feat(prompt-engineering): 오리지널 Prompt Engineering Guide 섹션 추가 (51 files) |

## 주요 파일 참조

```
lib/i18n/koPaths.ts              한국어 경로 판별/변환 유틸 (단일 진실 소스)
lib/i18n/localizedSection.tsx    createLocalizedDocRoute() 팩토리
lib/source.ts                    섹션별 Fumadocs 로더 (영/한 쌍)
source.config.ts                 섹션별 Fumadocs 컬렉션 정의 (영/한 쌍)
components/LocalePreferenceRedirect.tsx   최초 방문자 자동 리다이렉트
components/LanguagePreferenceToggle.tsx   상단 언어 토글 버튼
components/layout/Navbar.tsx              홈페이지용 상단바
components/layout/NavbarDocs.tsx          문서 페이지용 상단바
components/layout/SharedDocsLayout.tsx    문서형 섹션 공용 레이아웃
components/home/layout/HomeLayout.tsx     홈페이지 3단 레이아웃
Dockerfile.prod                           프로덕션 Docker 이미지 (Jenkins가 빌드)
docker-compose.yml                        배포 서버에서 실행하는 compose 파일
Jenkinsfile                               Jenkins CI/CD 파이프라인 정의
app/kr/                                   한국어 홈페이지 라우트
app/{docs,guides,faq,academy,handbook,security,resources,self-hosting,integrations,prompt-engineering}/kr/
                                           섹션별 한국어 라우트
content/{같은 섹션들}/kr/                  섹션별 한국어 콘텐츠
content/prompt-engineering/               신규 오리지널 Prompt Engineering Guide 콘텐츠 (영/한)
```
