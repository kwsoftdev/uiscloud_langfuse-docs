<!--
title: Langfuse Docs — Korean i18n & Nav Cleanup
-->

# Langfuse Docs — Korean 로컬라이제이션 작업 요약

이 문서는 `uiscloud_langfuse-docs` 저장소에서 진행한 한국어(i18n) 로컬라이제이션 구축 및 상단/문서 UI 단순화 작업을 정리한 내부 기록입니다.

## 목표

기존에 영어 전용이던 Langfuse 마케팅 사이트 + 문서 사이트에 한국어 버전을 추가하고, 처음 방문하는 사용자에게 한국어를 기본값으로 제공하며, 언제든 영어로 전환할 수 있는 토글을 제공하는 것.

## 아키텍처 결정

| 결정                 | 내용                                                                                                                                         | 이유                                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| URL 세그먼트         | `/kr` (예: `/docs/kr`, `/guides/kr`, 홈은 `/kr`)                                                                                             | 기존에 예약되어 있던 `/kr` 마케팅 랜딩 컨벤션과 일치                                                                                                            |
| 내부 언어 코드       | `ko` (BCP47)                                                                                                                                 | `/kr`은 URL 세그먼트일 뿐, `hreflang`/`<DocsBody lang>`/문자열 사전 키는 실제 언어 코드인 `ko`를 사용                                                           |
| 라우팅 방식          | 섹션별 별도 Fumadocs 컬렉션 + 별도 `app/` 라우트 (Next.js 내장 i18n 미들웨어 **미사용**)                                                     | 사이트가 Cloudflare Pages용 정적 export(`STATIC_EXPORT=true`)로 배포되어 서버가 없음 → 미들웨어 기반 리다이렉트 불가능. 기존 `academy/japan` 패턴을 그대로 확장 |
| 언어 감지/리다이렉트 | `localStorage`(`langfuse-lang-pref`) + `useEffect` 기반 클라이언트 사이드 리다이렉트 (`LocalePreferenceRedirect`, `app/layout.tsx`에 마운트) | 정적 export라 서버가 없어 미들웨어 불가 → 유일한 대안. (알려진 트레이드오프: JS를 실행하지 않는 크롤러는 리다이렉트를 따라가지 않음)                            |
| 언어 전환 UI         | `LanguagePreferenceToggle` — 상대 언어 이름만 보여주는 단일 버튼, `Navbar`/`NavbarDocs`의 유연한 가운데 컬럼에 배치                          | 처음 시도한 2버튼(한국어/EN) 디자인이 `NavbarExtraContent`의 고정폭(`lg:max-w-[240px]`) 오른쪽 컬럼에서 잘려 보이는 문제 발생 → 되돌리고 재설계                 |
| 공용 라우트 팩토리   | `lib/i18n/localizedSection.tsx`의 `createLocalizedDocRoute()`                                                                                | 섹션마다 Page/generateMetadata/generateStaticParams를 손으로 반복하지 않고, hreflang·언어 스위처 링크를 일관되게 생성                                           |
| 경로 판별 유틸       | `lib/i18n/koPaths.ts` — `KO_SECTION_PREFIXES`, `isKoreanPath()`, `toKoreanPath()`, `toEnglishPath()`                                         | 어떤 URL 접두사가 한국어 섹션인지에 대한 단일 진실 소스. 클라이언트 컴포넌트들은 `usePathname()` + 이 유틸로 스스로 언어를 감지 (prop drilling 회피)            |
| 번역 드리프트 추적   | `translationStatus`/`sourceRevision`/`translator` frontmatter 필드를 `source.config.ts`의 `baseFrontmatterSchema`에 전역 추가                | 원문이 바뀌었을 때 번역이 뒤처졌는지 추적할 수 있는 토대 마련 (현재는 필드만 존재, 자동화된 검사는 아직 없음)                                                   |

## 번역된 섹션 (총 9개 + 홈페이지)

1. **docs**, **guides**, **faq**, **academy**, **handbook**, **security**, **resources**, **self-hosting** (8개 섹션)
   — 약 400개 파일, 멀티에이전트 Workflow로 일괄 처리
2. **integrations** — 123개 mdx/md 파일 + 10개 meta.json, 8개 병렬 Agent로 처리 (가장 최근 작업)
   - 유일하게 순수 콘텐츠 번역을 넘어서는 엔지니어링이 필요했던 섹션: 개요 페이지의 카드 그리드가 `IntegrationCategory` 컴포넌트(`components/integrations/IntegrationIndex.tsx`)를 통해 Fumadocs 소스에서 동적으로 렌더링되므로, 이 컴포넌트를 `lang` prop을 받아 `integrationsKrSource`와 `/integrations/kr/...` 링크를 사용하도록 로케일 인식형으로 리팩토링

**홈페이지** (`/`, `/kr`) — 마케팅 콘텐츠 자체를 실제로 번역 (단순 리다이렉트가 아님). 11개 섹션 전부: Hero, RiveSection, FeatureTabsSection, Integrations, OpenSource, DeveloperTools, Enterprise, WhyLangfuse, GetStartedSection, FAQ, AllTheTools, FeaturedCustomers, HeroStatsStrip + HomeSidebar/HomeAside.

### 번역 원칙 (모든 섹션에 일관 적용)

- 본문(제목/문단/리스트/캘아웃/이미지 alt)은 번역한다.
- 코드 블록, 인라인 코드, CLI 명령어, config/env 키, 파일 경로, JSX/MDX 컴포넌트 태그와 그 prop 값은 번역하지 않는다.
- 고유명사·제품명·프레임워크명·모델명은 영어 그대로 둔다 (예: Docker Compose, LangChain, OpenAI, SOC 2 Type II, GDPR).
- frontmatter 중 `title`/`sidebarTitle`/`description`만 번역하고 나머지(`logo`, `logoAppearance` 등)는 그대로 둔다.
- 헤딩 앵커 `[#id]`는 원문과 완전히 동일하게 유지한다 (내부 링크 깨짐 방지).
- 파일당 H1은 정확히 하나만 유지한다.
- 같은 섹션 내부 링크(예: `/guides/...`)는 해당 섹션의 `/kr` 버전으로 바꾸고, 아직 번역되지 않은 다른 섹션(`/docs/...` 등)으로 가는 링크는 영어 페이지를 그대로 가리키게 둔다.

### 기본 언어 동작

- 처음 방문자는 번역된 9개 섹션 + 홈페이지에서 한국어가 기본값 (localStorage 리다이렉트).
- 아직 번역되지 않은 나머지 섹션(blog, changelog, pricing 등)은 영어로 유지된다.
- 상단 내비게이션의 언어 토글로 언제든 전환 가능하며, 선택은 영구 저장된다.

## 상단 내비게이션 / Footer 단순화 (i18n과 별개로 같은 세션에서 진행)

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

## 발견하고 고친 버그

- **Workflow `args` 파라미터 미전달** — 파일 목록을 스크립트 본문에 리터럴로 임베드하여 우회.
- **번역 에이전트가 남긴 도구 호출 잔재** (`</content>` 등) 76개 파일에 남아 있어 MDX 빌드 전체가 깨짐 — 정규식으로 일괄 제거 후 전체 페이지 재검증.
- **오래된 Docker 컨테이너가 포트 3333을 가로챔** — `lsof -i :3333`으로 발견, 컨테이너 제거로 해결.
- **`AllTheTools.tsx`에서 `return (` 구문 누락** (TS1128) — 편집 중 실수, `tsc --noEmit` 체크포인트에서 즉시 발견/수정.
- **`HomeSidebar.tsx`의 과도하게 좁은 TypeScript 파라미터 타입** — `as const` 객체에서 "en" 리터럴로만 추론되던 문제, `type Strings` 추출로 해결.
- **2버튼 언어 토글이 고정폭 내비게이션 컬럼에서 잘림** — 단일 버튼 설계로 교체.

## 검증 방법론

모든 변경마다 아래를 반복적으로 수행:

- `tsc --noEmit`
- `pnpm run format` / `format:check`
- `node scripts/check-h1-headings.js`
- 번역된 모든 페이지 URL을 `curl`로 순회하여 200 상태 확인
- 실제 브라우저 스크린샷으로 렌더링 확인 (Chrome DevTools MCP)
- `grep`으로 도구 호출 잔재 재확인

## 커밋 현황

| 커밋       | 내용                                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `7b9be2cc` | feat(i18n): Korean 로컬라이제이션 인프라 + 8개 섹션 + 홈페이지 번역 (490 files)                                              |
| `47c9e31c` | refactor(nav): 상단바/Footer/HomeAside 단순화                                                                                |
| `50cdb428` | refactor(docs): Support 항목 제거, TOC footer 단순화                                                                         |
| _(미커밋)_ | Integrations 섹션 한국어 번역 — 136개 파일 신규 (`content/integrations/kr/`, `app/integrations/kr/`) + 인프라 수정 11개 파일 |

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
app/kr/                                   한국어 홈페이지 라우트
app/{docs,guides,faq,academy,handbook,security,resources,self-hosting,integrations}/kr/
                                           섹션별 한국어 라우트
content/{같은 8개 섹션 + integrations}/kr/
                                           섹션별 한국어 콘텐츠
```
