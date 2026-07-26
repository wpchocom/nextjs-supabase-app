# Development Guidelines (AI Agent 전용)

> 이 문서는 AI Coding Agent가 이 저장소에서 즉시 참조하는 운영 규칙이다. 일반 개발 지식은 담지 않는다.
> 배경·전체 워크플로우는 [`CLAUDE.md`](./CLAUDE.md), 기능 명세는 [`docs/PRD.md`](./docs/PRD.md), Phase별 작업 목록·의존성은 [`docs/ROADMAP.md`](./docs/ROADMAP.md)가 단일 진실 소스(SSOT)다. 이 문서는 그 세 파일의 규칙을 "지금 무엇을 어떤 순서로 건드려야 하는가"로 압축한 것이며, 세 파일과 충돌하면 세 파일이 우선한다.

## 프로젝트 개요

- Next.js(App Router, `cacheComponents: true`) + React 19 + Supabase(`@supabase/ssr`) 기반 "모임 이벤트관리" 앱. `src/` 디렉터리 없음 — `app/`, `components/`, `lib/`가 루트에 직접 위치.
- 기존 스타터(구글 OAuth 로그인 + `public.profiles`만 존재)에 그룹/이벤트/공지/참여자/정산/카풀 기능을 새로 얹는 그린필드 확장 작업이다.
- 현재 상태: `docs/ROADMAP.md`의 Phase 0 Task 001부터 미착수. `lib/dummy/`, `lib/data/`, `lib/types/`, `lib/settlement.ts`, `app/protected/groups/`는 아직 존재하지 않는다 — 새 작업을 시작하기 전에 반드시 `docs/ROADMAP.md`의 체크박스 상태로 실제 진행도를 재확인할 것(이 문서의 서술만으로 판단하지 말 것).

## 절대 순서: UI 우선 · DB는 나중 (모든 신규 기능 공통)

`docs/ROADMAP.md`에 정의된 5단계를 예외 없이 따른다. 사용자가 순서를 명시하지 않아도 이 순서를 기본으로 적용하고 되묻지 않는다.

1. **더미 UI 구현** — `lib/dummy/`의 단일 소스에서 목업 데이터를 주입, DB/Supabase 호출 금지
2. **🔍 사용자 확인 체크포인트** — `npm run dev`로 확인 경로 전달, 가능하면 Playwright MCP 스크린샷 제공. **사용자의 명시적 승인 없이 3단계로 진행 금지** (가장 중요한 규칙)
3. **DB 스키마 + RLS** — `mcp__supabase__apply_migration` → `mcp__supabase__get_advisors` → `mcp__supabase__generate_typescript_types` 순서로 반드시 연쇄 실행
4. **실데이터 연동** — `lib/data/` 함수의 내부 구현만 Supabase 호출로 교체(컴포넌트 시그니처 유지)
5. **통합 테스트** — Playwright MCP

**허용되는 예외**: 각 Phase의 1단계(더미 UI)는 DB에 의존하지 않으므로 여러 Phase를 병렬로 미리 만들어도 된다. 단, 4단계(실데이터 연동)는 `docs/ROADMAP.md`의 "의존성 요약"에 명시된 선행 Task(예: Task 022는 Task 017 완료 필요)를 반드시 지킨다.

## 스키마 변경 시 멀티파일 연쇄 수정 (필수 체인)

DB 스키마를 하나라도 바꾸면 아래를 **모두, 이 순서로** 수행한다. 하나라도 건너뛰면 안 됨.

1. `mcp__supabase__apply_migration`로 원격에 직접 적용 (로컬 `supabase/` 디렉터리는 존재하지 않음 — 로컬 CLI 마이그레이션 파일을 만들지 않는다)
2. `mcp__supabase__get_advisors` (security + performance) 로 RLS 누락·인덱스 경고 확인 및 해소
3. `mcp__supabase__generate_typescript_types`로 저장소 루트 `database.types.ts` 재생성
4. `lib/supabase/client.ts`, `lib/supabase/server.ts`의 `Database` 제네릭이 최신 타입을 정상 참조하는지 확인
5. `lib/types/`에 정의된 도메인 타입(Role, MemberStatus, RsvpStatus 등)과 재생성된 DB 타입 간 정합성 확인

## 폼 구현 표준

- **패턴 고정**: `"use client"` + `useState` + Supabase 클라이언트 직접 호출만 사용한다. 참고 구현: `components/login-form.tsx`, `components/sign-up-form.tsx`.
- **금지**: `react-hook-form`, `zod`, `@hookform/resolvers`, Server Action 기반 폼 제출을 도입하지 않는다. `package.json`에 해당 패키지가 없으며 의도적으로 배제된 것이다.
- 회원가입 관련 코드에서 `supabase.auth.signUp()`의 `options.data`로 메타데이터를 넘기지 않는다(기존 컨벤션 유지).

## Server Component / 캐싱 표준

- `next.config.ts`의 `cacheComponents: true`로 인해, 동적 데이터를 읽는 Server Component는 반드시 `<Suspense>` 경계로 감싼다. 참고: `app/protected/page.tsx`.
- 새 라우트를 추가할 때 `loading.tsx`/`error.tsx` 배치와 `<Suspense>` 위치를 함께 결정한다(더미 UI 단계부터 확정).

## `docs/guides/*.md` 취급 규칙

- 이 폴더(`component-patterns.md`, `forms-react-hook-form.md`, `nextjs-15.md`, `project-structure.md`, `styling-guide.md`)는 다른 스타터 템플릿(`claude-nextjs-starters`)에서 복사된 범용 문서다.
- `src/` 레이아웃, `react-hook-form`/`zod`, `npm run typecheck`/`check-all` 스크립트를 전제로 하며 이 저장소와 어긋난다.
- **금지**: 이 폴더의 예시 코드를 그대로 복사해 붙여넣지 않는다. 참고할 경우 반드시 "인증 흐름"(위 폼 구현 표준) 및 이 저장소의 실제 패턴과 대조 후 수정해서 적용한다.

## 정산(F007~~F009) / 카풀(F010~~F011) 계산 로직 표준

- 금액 컬럼은 `integer`(원 단위) 또는 `numeric`만 사용한다. **`float`/`real` 타입 금지** — 부동소수점 오차로 정산 금액이 틀어지면 신뢰 문제로 직결된다.
- 균등분배 시 나머지까지 정확히 배분해 분배 합계가 항상 원금과 정확히 일치해야 한다(반올림 누수 금지). 분배 로직은 `lib/settlement.ts`에 순수 함수로 작성한다(UI/DB 의존 없이 단독 테스트 가능해야 함).
- 정산 대상자 판정: 출석확인자(`attendance_status='attended'`) 우선 → 출석 정보가 없으면 RSVP 참석자로 폴백.
- 카풀 좌석 초과는 UI 경고만 표시하고 배정 자체는 차단하지 않는다. **DB에 CHECK 제약으로 좌석 초과를 막지 않는다** — 정책상 허용된 상태이므로 제약을 걸면 PRD 요구사항 위반이다.

## PRD 비범위 — 구현/제안 금지 항목 (`docs/PRD.md` 6절)

다음은 사용자가 별도로 명시하지 않는 한 절대 구현하거나 제안하지 않는다.

- 실제 결제/PG 연동
- 카풀 자동 매칭 알고리즘
- 카카오톡 연동, 인앱 알림
- 이메일/비밀번호 회원가입(소셜 로그인만 지원 — 구글 OAuth만)
- 정산 관련 이메일/알림 발송 (공지 발송(F006)만 이메일 트리거 대상이다. `expenses`/`expense_shares` 변경에 알림 트리거를 절대 연결하지 않는다)
- 모임 히스토리/통계 대시보드

## 멤버 삭제 표준

- 그룹 멤버 제거(F002)는 **소프트 삭제**(`status='removed'`)만 사용한다. 물리 삭제(`DELETE`) 금지 — 과거 정산/출석 기록이 참조 무결성을 유지해야 하기 때문이다.
- 주최자 본인을 제거할 수 없도록 애플리케이션 레벨 가드를 포함한다.

## 커밋 규칙

- 형식: `<이모지> <타입>: <설명>` (한국어), `/commit` 커스텀 명령(`.claude/commands/git/commit.md`) 컨벤션을 따른다.
- **커밋 메시지에 Claude 서명을 추가하지 않는다** — 이 프로젝트의 명시적 규칙이며 전역 기본 동작(Co-Authored-By 추가)보다 우선한다.
- 커밋 전 검증 순서: `npm run lint` → `npm run typecheck` → `npm run build` → `npm run format` (husky + lint-staged가 커밋 시 포맷을 자동 실행하므로 수동 포맷팅 누락은 큰 문제가 아니지만 사전 확인을 권장).

## `.claude/agents/` 서브에이전트 정의 파일 규칙

- 새 서브에이전트를 만들거나 기존 파일(frontmatter의 `color` 필드)을 수정할 때 **`color: red`를 사용하지 않는다** — red는 에러 상태로 오인되므로 이 워크스페이스 전역에서 금지된 값이다.

## 작업 계획/추적 파일 갱신 규칙

- 새 기능 작업을 시작하거나 완료하면 `docs/ROADMAP.md`의 해당 Task 체크박스를 갱신한다. 완료 시 `[x]` + ✅ + `See: docs/tasks/XXX-xxx.md` 참조를 추가한다.
- `docs/tasks/` 신규 작업 파일은 `XXX-description.md` 형식이며, 직전 완료 작업 2건을 형식 예시로 참조한다. API/비즈니스 로직 작업에는 `## 테스트 체크리스트`(Playwright MCP 시나리오) 섹션을 반드시 포함한다.
- 🔍 체크포인트(CP-N) 박스는 **사용자의 명시적 승인이 있을 때만** 체크한다. AI가 스스로 판단해 체크하지 않는다.

## AI 의사결정 기준 (모호한 지시 처리)

- "기능 추가해줘"처럼 순서를 명시하지 않은 요청 → 항상 "절대 순서: UI 우선 · DB는 나중" 섹션을 기본 적용하고, 순서를 되묻지 않는다.
- 새 테이블/컬럼이 필요한지 애매한 요청 → 먼저 더미 UI로 화면 요구사항을 확정한 뒤 스키마를 설계한다(스키마를 먼저 설계해 화면에 맞추지 않는다).
- 이 문서·`CLAUDE.md`·`docs/ROADMAP.md`·`docs/PRD.md` 간 서술이 충돌하면: `docs/PRD.md`(제품 결정) > `docs/ROADMAP.md`(작업 순서·의존성) > `CLAUDE.md`(아키텍처·컨벤션) > 이 문서(운영 요약) 순으로 우선한다. 단, 이 문서에만 있는 세부 체인(스키마 변경 4단계 등)은 그대로 따른다.

## 금지 행동 요약

- 사용자 확인 체크포인트 승인 전 DB 마이그레이션 착수
- 로컬 `supabase/` 디렉터리·CLI 마이그레이션 파일 생성 (원격 직접 적용만 사용)
- `react-hook-form`/`zod`/Server Action 기반 폼 도입
- 금액 컬럼에 `float`/`real` 사용
- 카풀 좌석 초과를 DB CHECK 제약으로 차단
- 그룹 멤버 물리 삭제(`DELETE`)
- PRD 비범위 항목(결제 연동, 자동 매칭, 카카오톡/인앱 알림, 정산 알림, 이메일/비밀번호 회원가입) 구현
- 커밋 메시지에 Claude 서명 추가
- 서브에이전트 정의 파일 `color`에 `red` 사용
- `docs/guides/*.md` 예시 코드를 대조 없이 그대로 복사
