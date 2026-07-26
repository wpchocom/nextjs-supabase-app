# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Supabase 공식 "with-supabase" Next.js 스타터를 기반으로 한 앱. Next.js (App Router, `cacheComponents: true`), React 19, `@supabase/ssr` 쿠키 기반 인증, Tailwind CSS + shadcn/ui(new-york 스타일)로 구성되어 있다. `src/` 디렉터리 없이 저장소 루트에 `app/`, `components/`, `lib/`가 바로 위치한다.

## 명령어

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint (next/core-web-vitals, next/typescript)
npx tsc --noEmit # 타입 체크 (package.json에 별도 typecheck 스크립트 없음)
```

단일 테스트 실행 명령은 없음 — 테스트 프레임워크가 아직 설치되어 있지 않다.

커밋은 `/commit` 커스텀 명령(`.claude/commands/git/commit.md`) 컨벤션을 따른다: `<이모지> <타입>: <설명>` 형식의 컨벤셔널 커밋이며, **커밋 메시지에 Claude 서명을 추가하지 않는다** (이 프로젝트의 명시적 규칙으로, 전역 기본 동작보다 우선한다).

## 개발 순서 원칙 (UI 우선, DB는 나중에)

DB 스키마가 필요한 신규 기능은 항상 다음 순서로 진행한다. **먼저 스키마/RLS부터 설계하고 그 위에 화면을 얹는 순서로 진행하지 않는다.**

1. **UI/UX를 더미 데이터로 먼저 구현** — Supabase 스키마·RLS 연동 없이, 화면과 인터랙션을 실제 서비스처럼 클릭·탐색 가능한 수준까지 완성한다.
2. **사용자 확인 체크포인트** — 사용자가 브라우저에서 직접 확인하고 레이아웃/문구/플로우 피드백을 반영받은 뒤에만 다음 단계로 진행한다. 이 단계를 생략하고 바로 DB 연동으로 넘어가지 않는다.
3. **DB 스키마 마이그레이션 + RLS 구축** (`mcp__supabase__apply_migration` → `get_advisors` → `generate_typescript_types`)
4. **실데이터 연동** — 더미 데이터를 실제 Supabase 호출로 교체한다.
5. **통합 테스트**

**이유**: DB가 먼저 연결된 상태에서 화면을 고치면 스키마·쿼리·타입까지 연쇄적으로 다시 손봐야 해서 버그와 시간·토큰 낭비가 커진다. UI를 먼저 눈으로 확인해 문제를 조기에 잡는 편이 훨씬 저렴하다. `docs/ROADMAP.md`의 각 Phase 구성도 이 순서를 따른다 — 새 기능/Phase를 계획하거나 작업 순서를 제안할 때 매번 되묻지 말고 기본으로 이 순서를 적용할 것.

## 아키텍처

### Supabase 클라이언트 3분할

- `lib/supabase/client.ts` — 브라우저(Client Component)용 `createBrowserClient<Database>()`
- `lib/supabase/server.ts` — Server Component/Server Action용 `createServerClient<Database>()`. Fluid compute 대응을 위해 전역 변수로 두지 않고 매 요청마다 새로 생성한다.
- `lib/supabase/proxy.ts` — `updateSession(request)`: 세션 갱신 + 미인증 사용자 리다이렉트. 루트의 `proxy.ts`가 이를 호출하는 얇은 래퍼다 (Next.js가 `middleware.ts`를 `proxy.ts`로 개명한 버전을 사용 중이므로 `middleware.ts`는 존재하지 않는다). `matcher`는 정적 파일을 제외한 전체 경로이며, 내부 로직상 `/`, `/login`, `/auth`로 시작하는 경로만 미인증 접근을 허용하고 나머지는 `/auth/login`으로 리다이렉트한다.

세 파일 모두 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 환경변수를 사용한다 (`lib/utils.ts`의 `hasEnvVars`로 미설정 여부를 체크해 proxy에서 우회 가능).

### 인증 흐름

`app/auth/` 아래에 로그인/회원가입/비밀번호 재설정 페이지가 있고, 실제 폼 로직은 `components/*-form.tsx`에 있다. 이 폼들은 React Hook Form이나 Server Action이 아니라 **`"use client"` + `useState` + `supabase.auth.*()` 직접 호출** 패턴을 쓴다 (예: `components/sign-up-form.tsx`). 회원가입은 `signUp({ email, password, options: { emailRedirectTo } })`만 호출하며 `options.data`로 추가 메타데이터를 넘기지 않는다. 이메일 확인은 `app/auth/confirm/route.ts`의 OTP 검증(`verifyOtp`) 방식이다.

### 데이터베이스 (Supabase MCP 경유 관리)

`supabase/` 디렉터리(로컬 CLI, `config.toml`, migrations 폴더)가 없다 — 이 프로젝트는 로컬 Supabase CLI를 쓰지 않고, `.mcp.json`에 등록된 supabase MCP 서버(project 스코프, project_ref는 `.env.local`의 `NEXT_PUBLIC_SUPABASE_URL`과 동일)를 통해 **원격 프로젝트에 직접** 스키마 변경을 적용한다. DDL은 `mcp__supabase__apply_migration`으로, 조회는 `mcp__supabase__execute_sql`로 수행하고, 변경 후에는 `mcp__supabase__get_advisors`로 RLS 누락 등 보안 경고를 확인하는 것이 이 저장소의 관례다.

`public.profiles` 테이블이 존재한다: `id`(=`auth.users.id`), `username`, `full_name`, `avatar_url`, `bio`, `email`, `created_at`, `updated_at`. RLS는 전체 조회 가능/본인만 수정 가능이며, `auth.users` insert 시 `handle_new_user()` 트리거가 프로필 row를 자동 생성한다(트리거 전용이라 `anon`/`authenticated`의 직접 RPC 호출 권한은 회수되어 있다). 스키마를 바꾼 뒤에는 `mcp__supabase__generate_typescript_types`로 `database.types.ts`(저장소 루트)를 재생성하고, `lib/supabase/client.ts` / `server.ts`의 `Database` 제네릭이 최신 상태인지 확인해야 한다.

### 경로 별칭 & UI

`@/*` → 저장소 루트(`tsconfig.json`). shadcn/ui 컴포넌트는 `components/ui/`에 있으며 `npx shadcn@latest add <name>`으로 추가한다(`components.json` 기준 new-york 스타일, neutral 베이스 컬러). 스타일은 Tailwind 유틸리티 클래스 + `cn()`(`lib/utils.ts`)으로 조합하고, 색상은 `app/globals.css`의 CSS 변수(`bg-background`, `text-foreground` 등) 기반 시맨틱 클래스를 쓴다.

### docs/guides/ 관련 주의사항

`docs/guides/*.md`에 Next.js 패턴, 컴포넌트 패턴, 폼 처리, 스타일링 가이드가 있다. 다만 이 문서들은 다른 스타터 템플릿(`claude-nextjs-starters`)에서 복사된 범용 가이드로, **`src/` 레이아웃, `react-hook-form`/`zod`/`@hookform/resolvers` 사용, `npm run typecheck`/`check-all` 같은 스크립트를 전제**로 한다 — 이 저장소의 실제 `package.json`에는 해당 패키지도 스크립트도 없다. 폼/서버 액션 관련 예시를 참고할 땐 이 저장소의 실제 패턴(위 "인증 흐름" 참조)과 다르다는 점을 감안하고, 실제로 해당 라이브러리를 도입하기 전까지는 예시 코드를 그대로 신뢰하지 말 것.
