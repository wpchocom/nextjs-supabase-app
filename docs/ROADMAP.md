# 모임 이벤트관리 개발 로드맵

카카오톡 대화방과 수기 계산으로 흩어져 있던 소모임 운영(공지·참석·정산·카풀)을 하나의 웹 서비스로 옮겨 주최자의 반복 부담을 없앤다.

## 개요

모임 이벤트관리는 **정기 소모임 주최자와 참여자**를 위한 **"이번 모임 한 번"을 완결시키는 운영 도구**로 다음 기능을 제공합니다.

- **모임 생성 / 합류**: 그룹과 첫 회차를 한 화면에서 동시에 생성하고, 초대링크로 참여자가 합류 (F000, F001)
- **공지사항**: 주최자가 공지를 등록하면 그룹 멤버 전원에게 이메일 발송 (F005, F006)
- **참여자관리**: 멤버 로스터, 회차별 RSVP, 실제 출석 체크 (F002, F003, F004)
- **정산관리**: 더치페이 금액 계산과 분담액 조회 (결제 연동 없음) (F007, F008, F009)
- **카풀매칭**: 차량 등록과 주최자의 수동 배정 (자동 매칭 없음) (F010, F011)

기준 문서: [`docs/PRD.md`](./PRD.md) · 코드 컨벤션: [`CLAUDE.md`](../CLAUDE.md)

---

## 핵심 개발 원칙: UI 우선 · 화면 검증 우선

**모든 Phase는 예외 없이 아래 5단계 순서를 따릅니다.**

```
① 더미데이터 UI/UX 구현  →  ② 🔍 사용자 확인 체크포인트  →  ③ DB 스키마 + RLS  →  ④ 실데이터 연동  →  ⑤ 통합 테스트
       (DB 없음)              (승인 전까지 ③ 착수 금지)        (Supabase MCP)      (더미→실호출 교체)   (Playwright MCP)
```

### 왜 이 순서인가

화면을 눈으로 먼저 확인해야 보완할 부분과 문제점을 조기에 잡을 수 있습니다. DB 스키마와 쿼리를 먼저 만들어 두면, 화면 하나를 고칠 때마다 스키마 → 타입 재생성 → 쿼리 → 컴포넌트까지 후속 수정이 연쇄적으로 발생하고, 그 과정에서 버그와 시간·토큰 소모가 커집니다. **되돌리기 비용이 가장 싼 단계(더미 UI)에서 설계 결함을 소진시키는 것**이 이 로드맵의 전제입니다.

### 되돌리기 비용을 낮추기 위한 구현 규칙

- **더미 데이터를 컴포넌트에 하드코딩하지 말 것.** 모든 목업 데이터는 `lib/dummy/`의 단일 소스에서 주입하고, 화면은 데이터의 출처를 모르는 상태로 작성합니다. ④단계에서 **데이터 소스 한 곳만 교체**하면 되도록 만드는 것이 목표입니다.
- **데이터 접근을 `lib/data/` 조회 함수로 한 겹 감쌀 것.** ①단계에서는 더미를 반환하고, ④단계에서 내부 구현만 Supabase 호출로 바꿉니다. 컴포넌트 시그니처는 그대로 유지됩니다.
- **더미 데이터의 형태(shape)를 먼저 확정할 것.** ①단계에서 정한 데이터 형태가 곧 ③단계 스키마 설계의 입력이 됩니다. 화면이 실제로 필요로 하는 필드만 테이블에 만듭니다.
- **DB 없이도 클릭·탐색이 되게 만들 것.** ①단계 산출물은 정적 시안이 아니라, 실제 서비스처럼 페이지 이동과 상호작용이 동작하는 프로토타입입니다(로컬 상태 기반의 낙관적 갱신 흉내 포함).

### 🔍 사용자 확인 체크포인트란

각 Phase의 UI 구현이 끝난 뒤 **사용자가 브라우저에서 직접 확인하고 명시적으로 승인해야 다음 단계로 진행**하는 강제 분기점입니다.

- `npm run dev`로 로컬 서버를 띄우고, 확인 대상 화면의 경로 목록을 사용자에게 전달
- Playwright MCP로 주요 화면 스크린샷(데스크톱/모바일)을 첨부해 확인 편의 제공
- 사용자가 지적한 보완 사항은 **이 단계에서 전부 반영**하고 재확인
- **승인 전까지 스키마 마이그레이션(③단계)에 착수하지 않습니다** — 이 규칙이 이 로드맵에서 가장 중요합니다

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `docs/ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `docs/tasks/` 디렉터리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-app-skeleton.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 `## 테스트 체크리스트` 섹션 필수 포함** (Playwright MCP 시나리오 작성)
   - 직전 완료 작업 2건을 예시로 참조 (현재가 `012`라면 `011`, `010`). 완료된 작업 파일은 체크된 박스와 변경 사항 요약을 담고 있으므로, 신규 작업 파일은 **빈 박스 + 변경 사항 요약 없음** 상태로 시작할 것

3. **작업 구현**
   - 작업 파일의 명세서를 따라 구현
   - **UI 단계에서는 DB를 건드리지 않는다** — Supabase 호출 없이 `lib/dummy/` 기반으로만 구현
   - **DB 변경은 반드시 사용자 확인 체크포인트 통과 이후**, `mcp__supabase__apply_migration`으로 원격 직접 적용 (로컬 `supabase/` 디렉터리 없음)
   - 스키마 변경 후 `mcp__supabase__get_advisors`(security/performance) 점검 → `mcp__supabase__generate_typescript_types`로 `database.types.ts` 재생성
   - **실데이터 연동 후 Playwright MCP로 E2E 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 진행 상황 업데이트, 단계 완료 시 중단하고 추가 지시 대기

4. **🔍 사용자 확인 체크포인트**
   - UI 구현 완료 시 사용자에게 확인 요청 후 **명시적 승인 대기**
   - 피드백 반영 → 재확인 → 승인. 승인 없이 다음 단계로 진행하지 않음

5. **검증 및 커밋**
   - `npm run lint` → `npm run typecheck` → `npm run build` 순서로 통과 확인
   - `npm run format`으로 Prettier 포맷 통일 (husky + lint-staged가 커밋 시 자동 실행)
   - 커밋 컨벤션: `<이모지> <타입>: <설명>` (한국어). **커밋 메시지에 Claude 서명을 추가하지 않는다**
   - 로드맵에서 완료된 작업을 ✅로 표시

---

## 프로젝트 고유 기술 제약 (모든 Task 공통)

- **폼 패턴**: `"use client"` + `useState` + Supabase 클라이언트 직접 호출. **Server Action / react-hook-form / zod 도입 안 함** (참고: `components/login-form.tsx`)
- **`cacheComponents: true`**: 동적 데이터를 읽는 Server Component는 반드시 `<Suspense>` 경계 안에 두어야 함 (참고: `app/protected/page.tsx`)
- **Supabase 클라이언트 3분할**: 브라우저 `lib/supabase/client.ts` / 서버 `lib/supabase/server.ts` / 세션 갱신 `lib/supabase/proxy.ts`. 서버 클라이언트는 매 요청마다 새로 생성
- **인증 경계**: 루트 `proxy.ts`(Next.js가 `middleware.ts`를 개명한 버전, `middleware.ts`는 존재하지 않음)가 `/`, `/login`, `/auth` 외 모든 경로를 `/auth/login`으로 리다이렉트
- **`docs/guides/*.md` 주의**: 다른 스타터에서 복사된 범용 가이드로 `src/` 레이아웃과 react-hook-form을 전제함. **이 저장소의 실제 패턴과 다르므로 예시 코드를 그대로 신뢰하지 말 것**

---

## 개발 단계

### Phase 0: 애플리케이션 골격 + 그룹/이벤트 기반 구축

> PRD 마일스톤 Phase 0 — F000(모임 생성) / F001(합류) / 홈

#### ① 더미데이터 UI/UX 구현

- [x] **Task 001: 전체 라우트 구조 및 레이아웃 골격 생성** - 우선순위
  - `app/protected/groups/[groupId]/` 하위 라우트 골격 생성: `page.tsx`(그룹 홈), `announcements/`, `members/`, `settlements/`, `carpools/`
  - `app/protected/groups/new/page.tsx`(모임 생성), `app/protected/groups/join/[inviteCode]/page.tsx`(합류) 빈 껍데기 생성
  - `app/protected/groups/[groupId]/layout.tsx` 구현: 그룹명 헤더 + 4개 기능 탭 네비게이션 골격
  - 홈 라우트 확보 — `app/protected/page.tsx`의 스타터 튜토리얼 콘텐츠 제거
  - 루트 `app/page.tsx` 랜딩을 서비스 소개로 정리하고, 로그인 상태면 `/protected`로 유도
  - 각 페이지에 `loading.tsx` / `error.tsx` 배치 및 `<Suspense>` 경계 위치 확정 (`cacheComponents: true` 대응)
  - **완료 기준**: 모든 라우트가 404 없이 렌더되고, 탭 이동이 동작하며 `npm run build` 통과

- [x] **Task 002: 공용 타입 · UI 프리미티브 · 더미 데이터 레이어 구축**
  - PRD 9절 기준 신규 shadcn/ui 프리미티브 추가: `npx shadcn@latest add tabs select textarea table` (기존 보유: badge, button, card, checkbox, dropdown-menu, input, label)
  - `lib/types/`에 도메인 타입 정의 — `Role`(organizer/member), `MemberStatus`(active/removed), `RsvpStatus`(attending/not_attending/pending), `AttendanceStatus`(attended/absent/unconfirmed), `SplitType`(equal/custom)
  - **화면 요구사항 기반으로 도메인 타입을 직접 정의** — 이 시점에는 `database.types.ts`에 신규 테이블이 없으므로 DB 타입에 의존하지 않는다. 이 타입이 이후 스키마 설계의 입력(계약)이 된다
  - `lib/dummy/` 더미 데이터 팩토리 작성 — 그룹/멤버/이벤트/공지/지출/차량 전 도메인 목업. **모든 Phase의 UI 단계가 이 단일 소스를 사용**
  - `lib/data/` 조회 함수 레이어 골격 — 지금은 `lib/dummy/`를 반환하고, 이후 Phase에서 내부 구현만 Supabase 호출로 교체 (컴포넌트 수정이 불필요하도록 설계)
  - 공용 UI 컴포넌트: `EmptyState`, `PageHeader`, `ErrorMessage`(폼 에러 표기 컨벤션 통일)
  - **완료 기준**: `npm run typecheck` 통과, 더미 데이터만으로 각 페이지 렌더 가능

- [x] **Task 003: 홈 · 모임 생성 · 합류 · 그룹 홈 화면 구현 (더미데이터)**
  - 홈(내 그룹 목록) — 그룹 카드에 그룹명 / 내 역할 배지 / 다가오는 회차 표시, 그룹 없을 때 EmptyState + CTA
  - 모임 생성 화면 — **그룹명 + 첫 회차(제목/일시/장소)를 한 폼에서 입력하는 단일 플로우**. 사용자가 그룹→이벤트 2단계 구조를 인지하지 않도록 설계 (PRD 1절 확정 사항)
  - 합류 화면 — 그룹 정보 미리보기 + 합류 확인 UI, 유효하지 않은 코드 안내 화면
  - 그룹 홈 — 다가오는 회차 요약 + 4개 기능 페이지 진입 카드 + 초대링크 복사 UI(주최자에게만 노출)
  - 폼 상호작용 완성 — 클라이언트 유효성 검증, 에러 메시지, 제출 중 버튼 비활성화, 제출 후 화면 전환(로컬 상태 기반)
  - 모바일 반응형 (주 사용 환경이 모바일)
  - **완료 기준**: DB 없이 홈 → 모임 생성 → 그룹 홈 → 합류 화면까지 클릭만으로 탐색 가능

#### ② 🔍 사용자 확인 체크포인트

- [x] **🔍 CP-0: 사용자 확인 필요 — Phase 0 화면 검증**
  - 확인 대상: `/`, `/protected`(홈), `/protected/groups/new`, `/protected/groups/[groupId]`, `/protected/groups/join/[inviteCode]`
  - `npm run dev` 실행 + Playwright MCP 스크린샷(데스크톱/모바일) 제공
  - 사용자 피드백 반영 및 재확인
  - **⛔ 사용자 승인 전까지 Task 004(스키마 마이그레이션) 착수 금지**

#### ③ DB 스키마 + RLS

- [x] **Task 004: 그룹/이벤트 코어 스키마 마이그레이션 및 RLS 구축**
  - **CP-0에서 확정된 화면 요구사항을 반영해 최종 컬럼 확정** 후 진행 (PRD 7절이 기준선, 화면에서 실제 쓰이지 않는 필드는 만들지 않음)
  - `mcp__supabase__apply_migration`으로 3개 테이블 생성: `groups`, `group_members`, `events` (`event_participants`는 화면이 확정되는 Phase 2에서 생성)
  - `groups.invite_code` 생성 규칙 확정 및 UNIQUE 제약 (추측 불가능한 랜덤 문자열, DB 기본값으로 생성)
  - RLS 정책 — **조회는 그룹 멤버만, 쓰기는 주최자만**
  - RLS 재귀 참조 방지: `group_members` 소속 판별을 `security definer` 헬퍼 함수로 분리 (self-referencing 정책 무한재귀 회피)
  - 인덱스 추가 (`group_members(group_id, user_id)`, `events(group_id)`)
  - `mcp__supabase__get_advisors`로 security/performance 경고 점검 후 해소
  - `mcp__supabase__generate_typescript_types`로 `database.types.ts` 재생성, `lib/types/`의 도메인 타입과 DB 타입 정합성 확인
  - **완료 기준**: 2개 계정으로 `mcp__supabase__execute_sql` 교차 조회 시 RLS가 실제로 차단됨을 확인

#### ④ 실데이터 연동

- [x] **Task 005: 홈 · 모임 생성 실데이터 연동 (F000)**
  - `lib/data/`의 그룹 조회 함수를 Supabase 실호출로 교체 — `group_members` 조인으로 내가 속한 active 그룹 조회, `<Suspense>` 적용
  - `components/group-create-form.tsx` 실제 저장 연동 — `"use client"` + `useState` + Supabase 클라이언트 직접 호출 (`login-form.tsx` 패턴)
  - **생성 원자성**: `groups` + `group_members`(주최자 row) + `events` 3건이 원자적으로 처리되도록 Postgres 함수(`create_group_with_event`)를 마이그레이션으로 추가하고 RPC 호출
  - 생성 성공 시 `router.push`로 그룹 홈 이동 + 초대링크 노출
  - **테스트 체크리스트**: Playwright MCP — 정상 생성 후 그룹 홈 진입, 내 그룹만 표시되고 타인 그룹 미노출, 부분 실패 시 orphan 그룹이 남지 않는지(롤백) 검증

- [x] **Task 006: 초대링크 합류 실데이터 연동 (F001)**
  - invite_code로 그룹 조회 + `group_members` insert를 수행하는 RPC(`join_group_by_invite_code`) 추가 — **비멤버는 RLS상 그룹을 조회할 수 없으므로 `security definer` 함수 필요**
  - 미로그인 진입 처리: `proxy.ts` 리다이렉트 시 원래 초대 URL을 보존해 로그인 후 합류 화면으로 복귀 (`redirect_to` 파라미터)
  - 엣지 케이스 — 이미 가입한 멤버(그룹 홈 이동), `status='removed'`였던 멤버(재활성화), 유효하지 않은 invite_code
  - **테스트 체크리스트**: Playwright MCP — 비로그인 초대링크 클릭 → 구글 로그인 → 자동 합류 복귀, 중복 합류 시 에러 없이 그룹 홈 진입, 잘못된 코드 안내

#### ⑤ 통합 테스트

- [x] **Task 007: Phase 0 통합 테스트**
  - Playwright MCP 전체 여정: 로그인 → 모임 생성 → 초대링크 공유 → 두 번째 계정 합류 → 양쪽 홈에서 그룹 확인
  - 권한 경계 — 참여자 계정의 그룹 설정 변경 차단, 비멤버의 `/groups/[groupId]` 직접 접근 차단
  - `npm run lint` / `npm run typecheck` / `npm run build` 통과 확인

---

### Phase 1: 공지사항 + 이메일 인프라

> PRD 마일스톤 Phase 1 — F005(공지 등록/조회) + F006(이메일 발송 인프라 최초 구축)

#### ① 더미데이터 UI/UX 구현

- [ ] **Task 008: 공지사항 페이지 구현 (더미데이터)**
  - 공지 목록 — 최신순 정렬, 작성자 프로필·작성일 표시, 공지 없을 때 EmptyState
  - 공지 작성 폼 — `components/announcement-form.tsx`, `textarea` 프리미티브 사용, **주최자에게만 노출**
  - 회차 연결 선택 — `select`로 특정 이벤트에 귀속시키거나 그룹 전체 공지로 등록
  - 참여자 뷰(조회 전용)와 주최자 뷰의 차이를 UI에서 명확히 구분 — 더미 역할 토글로 양쪽을 확인할 수 있게 구성
  - 긴 본문 렌더링, 줄바꿈 처리, 모바일 반응형

#### ② 🔍 사용자 확인 체크포인트

- [ ] **🔍 CP-1: 사용자 확인 필요 — 공지사항 화면 검증**
  - 확인 대상: `/protected/groups/[groupId]/announcements` (주최자 뷰 / 참여자 뷰 양쪽)
  - Playwright MCP 스크린샷 제공 및 피드백 반영
  - **⛔ 사용자 승인 전까지 Task 009 착수 금지**

#### ③ DB 스키마 + RLS

- [ ] **Task 009: announcements 스키마 마이그레이션**
  - CP-1에서 확정된 화면 기준으로 `announcements` 테이블 생성 (id, group_id, event_id nullable, author_id, title, content, created_at)
  - RLS — 조회는 그룹 멤버 전원, 작성/수정/삭제는 주최자만
  - `announcements(group_id, created_at desc)` 인덱스 추가
  - `get_advisors` 점검 → `database.types.ts` 재생성

#### ④ 실데이터 연동

- [ ] **Task 010: 공지 등록/조회 실데이터 연동 (F005)**
  - `lib/data/`의 공지 조회 함수를 Supabase 실호출로 교체, 작성자 프로필 조인, `<Suspense>` 적용
  - 공지 작성 폼 실제 insert 연동, 등록 후 목록 갱신
  - **테스트 체크리스트**: Playwright MCP — 주최자 작성 후 목록 즉시 반영, 참여자 계정에서 작성 UI 미노출 및 직접 insert 차단

- [ ] **Task 011: 이메일 발송 인프라 구축 (F006)**
  - Resend 계정/도메인 설정 및 API 키를 Supabase Edge Function 시크릿으로 등록 (`.env.local`에 클라이언트 노출 금지)
  - `mcp__supabase__deploy_edge_function`으로 공지 발송 Edge Function 배포 — 그룹 active 멤버 이메일 수집 후 Resend 일괄 발송
  - `announcements` INSERT에 Database Webhook 연결해 Edge Function 트리거
  - 이메일 템플릿 작성 (그룹명, 공지 제목/본문, 서비스 링크) 및 발송 실패 로깅
  - **정산 관련 알림은 발송하지 않음** (PRD 3절 확정 사항) — 트리거 대상을 공지로만 한정
  - **테스트 체크리스트**: 공지 등록 후 `mcp__supabase__get_logs`로 Edge Function 실행 확인, 실제 수신 확인, 멤버 0명/removed 멤버 제외 처리 검증

#### ⑤ 통합 테스트

- [ ] **Task 012: Phase 1 통합 테스트**
  - Playwright MCP — 공지 등록 → 목록 노출 → 참여자 계정 조회 → 이메일 발송 전체 플로우
  - 엣지 케이스: 이메일 발송 실패 시에도 공지 등록 자체는 성공하는지(비동기 분리) 확인

---

### Phase 2: 참여자관리

> PRD 마일스톤 Phase 2 — F002(로스터) / F003(RSVP) / F004(출석체크)

#### ① 더미데이터 UI/UX 구현

- [ ] **Task 013: 참여자관리 페이지 구현 (더미데이터)**
  - `tabs` 프리미티브로 "멤버 로스터" / "회차별 참석" 뷰 분리
  - `table` 프리미티브 기반 멤버 테이블 — 프로필(아바타/이름), 역할, RSVP, 출석 컬럼
  - RSVP 토글, 출석 체크박스, 멤버 제거 확인 다이얼로그를 **로컬 상태로 동작**시켜 실제 조작감을 확인할 수 있게 구현
  - RSVP 집계 요약 표시 (참석 n명 / 불참 n명 / 미응답 n명)
  - 주최자 뷰 / 참여자 뷰의 권한 차이를 UI에서 구분
  - 모바일 반응형 — 좁은 화면에서 테이블을 카드 리스트로 전환

#### ② 🔍 사용자 확인 체크포인트

- [ ] **🔍 CP-2: 사용자 확인 필요 — 참여자관리 화면 검증**
  - 확인 대상: `/protected/groups/[groupId]/members` (로스터 탭 / 회차별 참석 탭, 주최자·참여자 양쪽 뷰)
  - Playwright MCP 스크린샷 제공 및 피드백 반영
  - **⛔ 사용자 승인 전까지 Task 014 착수 금지**

#### ③ DB 스키마 + RLS

- [ ] **Task 014: event_participants 스키마 마이그레이션**
  - CP-2에서 확정된 화면 기준으로 `event_participants` 생성 (id, event_id, user_id, rsvp_status, attendance_status, created_at)
  - RLS — 조회는 그룹 멤버, 쓰기는 주최자만이되 **RSVP는 본인 row 예외 허용**
  - `event_participants(event_id, user_id)` 유니크 제약 및 인덱스
  - `get_advisors` 점검 → `database.types.ts` 재생성

#### ④ 실데이터 연동

- [ ] **Task 015: 멤버 로스터 관리 (F002)**
  - `group_members` + `profiles` 조인 조회로 더미 데이터 교체
  - 멤버 제거 — **소프트 삭제**(`status='removed'`), 물리 삭제 금지. 제거된 멤버는 목록에서 제외되나 과거 정산/출석 기록은 보존
  - 주최자 본인 제거 방지 가드
  - **테스트 체크리스트**: Playwright MCP — 제거 후 목록 갱신, 제거된 멤버 계정에서 그룹 접근 차단, 과거 기록 보존 확인

- [ ] **Task 016: 회차별 RSVP (F003)**
  - `event_participants` upsert로 본인 RSVP 갱신 — attending / not_attending / pending
  - **RLS 본인 예외 검증**: 참여자가 타인의 RSVP를 변경할 수 없어야 함
  - 미응답 멤버를 `pending`으로 간주하는 표시 규칙 확정 (row가 없는 경우 포함)
  - **테스트 체크리스트**: Playwright MCP — 두 계정으로 각자 RSVP 변경, 상호 간섭 없음 확인, 타인 row 직접 update 시도 차단

- [ ] **Task 017: 출석 체크 (F004)**
  - 주최자 전용 출석 체크 연동 — attended / absent / unconfirmed
  - **출석 상태는 Phase 3 정산 대상자 판단의 기준**이므로 데이터 정합성 확인
  - RSVP 참석자를 출석으로 일괄 반영하는 편의 액션
  - **테스트 체크리스트**: Playwright MCP — 주최자만 체크 가능, 참여자 계정에서 체크 UI 미노출 및 update 차단

#### ⑤ 통합 테스트

- [ ] **Task 018: Phase 2 통합 테스트**
  - Playwright MCP — 합류 → RSVP → 출석체크 → 로스터 제거 전체 플로우
  - 엣지 케이스: 멤버 0명 그룹, RSVP 후 제거된 멤버의 집계 처리

---

### Phase 3: 정산관리

> PRD 마일스톤 Phase 3 — F007(지출등록) / F008(더치페이 계산) / F009(분담액·정산완료). **결제/PG 연동 없음, 알림 발송 없음**

#### ① 더미데이터 UI/UX 구현

- [ ] **Task 019: 정산관리 페이지 및 분배 계산 로직 구현 (더미데이터)**
  - 지출 등록 폼 — 제목 / 금액 / 결제자(`select`) / 분배 방식(equal·custom), 천 단위 구분 포맷, 음수·0 방지
  - 지출 목록 및 총액, 참여자별 분담액 집계 뷰, 정산완료 체크 UI, 미정산 총액 요약
  - 참여자 본인 뷰 — 내 분담액과 정산 여부만 명확히 확인 가능
  - **`lib/settlement.ts`에 분배 로직을 순수 함수로 작성** — UI/DB 의존이 없으므로 이 단계에서 완성 가능
    - 균등분배 시 **나머지까지 정확 배분** (예: 10,000원 ÷ 3명 = 3,334 / 3,333 / 3,333). 분배 합계가 항상 원금과 일치해야 함(반올림 누수 금지)
    - 커스텀 분배 — 개별 금액 직접 조정, 합계와 원금 불일치 시 경고
    - 대상자 수동 조정 (계산에서 특정 멤버 제외/포함)
  - 더미 지출·멤버 데이터로 계산 결과가 화면에 실시간 반영되게 구성
  - **단위 검증**: 나머지 배분 경계값(1원 ÷ 3명, 대상자 1명/0명, 큰 금액) 확인

#### ② 🔍 사용자 확인 체크포인트

- [ ] **🔍 CP-3: 사용자 확인 필요 — 정산관리 화면 및 계산 결과 검증**
  - 확인 대상: `/protected/groups/[groupId]/settlements` (주최자·참여자 양쪽 뷰)
  - **계산 결과의 표기 방식(반올림 표시, 1원 차이 안내 문구)을 사용자와 함께 확정** — 금액은 사용자 신뢰와 직결되므로 이 시점에 합의 필수
  - Playwright MCP 스크린샷 제공 및 피드백 반영
  - **⛔ 사용자 승인 전까지 Task 020 착수 금지**

#### ③ DB 스키마 + RLS

- [ ] **Task 020: expenses / expense_shares 스키마 마이그레이션**
  - CP-3에서 확정된 화면 기준으로 `expenses`(id, event_id, title, amount, payer_id, split_type, created_at), `expense_shares`(id, expense_id, user_id, amount, is_settled, created_at) 생성
  - 금액 컬럼 타입 — **부동소수점 오차 방지를 위해 `integer`(원 단위) 또는 `numeric` 사용, `float` 금지**
  - RLS — 조회는 그룹 멤버, 쓰기는 주최자만. `is_settled` 체크도 주최자 권한
  - `expenses(event_id)`, `expense_shares(expense_id)` 인덱스 및 `expense_shares(expense_id, user_id)` 유니크 제약, 지출 삭제 시 shares cascade
  - `get_advisors` 점검 → `database.types.ts` 재생성

#### ④ 실데이터 연동

- [ ] **Task 021: 지출 항목 등록 (F007)**
  - 지출 등록/수정/삭제 Supabase 연동, 이벤트별 지출 목록과 총액 실데이터 반영
  - **테스트 체크리스트**: Playwright MCP — 등록 후 목록·총액 반영, 잘못된 금액 입력 차단, 참여자 계정에서 등록 차단

- [ ] **Task 022: 더치페이 분배 계산 실데이터 연동 (F008)**
  - Task 019의 순수 함수에 실제 멤버·출석 데이터를 주입하고 결과를 `expense_shares`에 저장
  - **대상자 판정 규칙**: 출석확인자(`attendance_status='attended'`) 기본 → 출석 정보가 없으면 RSVP 참석자로 폴백
  - 주최자의 대상자 조정 결과가 재계산·재저장되도록 연동
  - **테스트 체크리스트**: Playwright MCP — 출석자 기준 자동 판정, 폴백 동작, 대상자 조정 후 재계산 결과 저장 확인

- [ ] **Task 023: 분담액 조회 및 정산완료 체크 (F009)**
  - 여러 지출에 걸친 1인 총 분담액 집계 실데이터 연동
  - 주최자의 정산완료 수기 체크(`is_settled` 토글) 및 미정산 총액 요약
  - **알림 발송 없음** — PRD 3절 확정 사항. 정산 관련 이메일 트리거를 만들지 않도록 주의
  - **테스트 체크리스트**: Playwright MCP — 주최자·참여자 각 시점의 금액 일치, 체크 토글 반영, 참여자의 `is_settled` 변경 차단

#### ⑤ 통합 테스트

- [ ] **Task 024: Phase 3 통합 테스트**
  - Playwright MCP — 지출 등록 → 대상자 자동 판정 → 계산 → 분담액 조회 → 정산완료 전체 플로우
  - 엣지 케이스: 출석자 0명, 결제자 본인 분담 포함 여부, 지출 삭제 시 `expense_shares` 정리(cascade) 확인

---

### Phase 4: 카풀매칭

> PRD 마일스톤 Phase 4 — F010(차량등록) / F011(수동배정). **자동 매칭 알고리즘 없음, 좌석 초과는 경고만**

#### ① 더미데이터 UI/UX 구현

- [ ] **Task 025: 카풀매칭 페이지 구현 (더미데이터)**
  - 차량 등록 폼 — 운전자(멤버 `select`) / 출발지 / 출발시간 / 좌석수, 좌석수 0 이하 입력 방지
  - 차량 카드 목록 — 좌석 점유 현황(배정 n / 좌석 m) 표시, 수정·삭제
  - **미배정 참여자 목록 ↔ 차량별 탑승자 목록 2단 구성**, 배정/해제/차량 이동을 로컬 상태로 동작
  - **좌석 초과 시 경고만 표시하고 배정 자체는 허용** (PRD 3절 확정 사항 — 차단하지 말 것). 경고 UI 형태를 이 단계에서 확정
  - 참여자 뷰 — 내가 어느 차량에 배정되었는지, 출발지/시간 확인
  - 모바일 반응형 — 2단 레이아웃의 좁은 화면 대응

#### ② 🔍 사용자 확인 체크포인트

- [ ] **🔍 CP-4: 사용자 확인 필요 — 카풀매칭 화면 검증**
  - 확인 대상: `/protected/groups/[groupId]/carpools` (주최자 배정 뷰 / 참여자 확인 뷰)
  - **수동 배정 조작감(드래그 vs 버튼 방식)과 좌석 초과 경고 표현을 사용자와 확정**
  - Playwright MCP 스크린샷 제공 및 피드백 반영
  - **⛔ 사용자 승인 전까지 Task 026 착수 금지**

#### ③ DB 스키마 + RLS

- [ ] **Task 026: carpool_groups / carpool_assignments 스키마 마이그레이션**
  - CP-4에서 확정된 화면 기준으로 `carpool_groups`(id, event_id, driver_id, departure_location, departure_time, seat_count, created_at), `carpool_assignments`(id, carpool_group_id, user_id, created_at) 생성
  - **동일 이벤트에서 한 사람이 두 차량에 배정되지 않도록** 제약 설계 (이벤트 단위 유니크 보장 방식 확정)
  - **좌석수 초과는 DB 제약으로 막지 않는다** — 경고만 하는 정책이므로 CHECK 제약 금지
  - RLS — 조회는 그룹 멤버, 쓰기는 주최자만. 차량 삭제 시 배정 cascade
  - `get_advisors` 점검 → `database.types.ts` 재생성

#### ④ 실데이터 연동

- [ ] **Task 027: 차량 등록 (F010)**
  - 차량 등록/수정/삭제 Supabase 연동, 좌석 점유 현황 실데이터 집계
  - **테스트 체크리스트**: Playwright MCP — 등록 후 카드 반영, 좌석수 0 이하 입력 차단, 차량 삭제 시 배정 함께 정리

- [ ] **Task 028: 수동 카풀 배정 (F011)**
  - 배정/해제/차량 이동 Supabase 연동, 배정 대상은 해당 회차 참석자 기준
  - 좌석 초과 시 경고를 표시하되 배정은 성공 처리
  - **테스트 체크리스트**: Playwright MCP — 배정/해제/차량 이동, 좌석 초과 시 경고 노출되며 배정은 성공, 참여자 계정에서 배정 변경 차단

#### ⑤ 통합 테스트

- [ ] **Task 029: Phase 4 통합 테스트**
  - Playwright MCP — 차량 등록 → 참석자 배정 → 좌석 초과 경고 → 참여자 뷰 확인 전체 플로우
  - 엣지 케이스: 차량 0대, 운전자 본인의 자동 탑승 처리, 배정 후 멤버 제거 시 잔여 배정 처리

---

### Phase 5: 품질 보증 및 배포

> PRD 원안에는 없으나, MVP 릴리스를 위해 추가한 마무리 단계

- [ ] **Task 030: 전체 사용자 여정 E2E 및 에러 핸들링 정비**
  - Playwright MCP — PRD 4절 사용자 여정 전체를 주최자/참여자 2개 계정으로 재현
  - 전역 에러 처리 통일 — 네트워크 실패, 세션 만료, 권한 없음(403) 상황의 사용자 안내
  - 접근성 점검 — 폼 라벨 연결, 키보드 네비게이션, 색상 대비
  - 모바일 반응형 최종 점검

- [ ] **Task 031: 성능 최적화 및 배포 준비**
  - `get_advisors`(security + performance) 최종 전수 점검 — RLS 누락 0건, 미사용/누락 인덱스 정리
  - N+1 쿼리 제거 — 조인/집계를 DB 뷰나 RPC로 이전
  - `cacheComponents` 기준 캐시 경계 재점검, Suspense 스트리밍 최적화
  - **`lib/dummy/` 정리** — 실데이터로 전부 교체된 목업 제거 또는 개발 전용으로 격리
  - 프로덕션 환경변수 및 OAuth 리다이렉트 URL 설정, 배포 후 스모크 테스트
  - 스타터 잔재 최종 정리 (`components/tutorial/`, `deploy-button.tsx`, `hero.tsx`, 미사용 `docs/guides/`)

---

## 상태 표기 규칙

- **Phase 제목 + ✅**: 해당 Phase 전체 완료
- **Task 체크박스 `[x]` + ✅ - 완료**: 완료된 작업. 완료 시 `See: docs/tasks/XXX-xxx.md` 참조를 추가
- **🔍 CP-N**: 사용자 확인 체크포인트. **사용자의 명시적 승인이 있을 때만 체크하며, 미체크 상태에서 이후 Task 진행 금지**
- **- 우선순위**: 즉시 착수할 작업
- **표기 없음**: 대기 중

## 의존성 요약

```
[Phase 0]
Task 001 (라우트 골격)
  └─> Task 002 (타입 · UI 프리미티브 · lib/dummy · lib/data 골격)
        └─> Task 003 (홈·생성·합류·그룹홈 더미 UI)
              └─> 🔍 CP-0 ⛔ 사용자 승인 필요
                    └─> Task 004 (groups·group_members·events 스키마 + RLS)
                          ├─> Task 005 (홈·모임생성 연동, F000)
                          └─> Task 006 (합류 연동, F001)  ──> Task 007 (통합 테스트)

[Phase 1]  Task 004 이후 착수 가능 · Phase 2와 병렬 가능
Task 008 (공지 더미 UI) ─> 🔍 CP-1 ⛔ ─> Task 009 (announcements 스키마)
  └─> Task 010 (공지 연동, F005) ─> Task 011 (이메일 인프라, F006) ─> Task 012 (통합 테스트)

[Phase 2]  Task 004 이후 착수 가능 · Phase 1과 병렬 가능
Task 013 (참여자관리 더미 UI) ─> 🔍 CP-2 ⛔ ─> Task 014 (event_participants 스키마)
  └─> Task 015 (로스터 F002) / Task 016 (RSVP F003) / Task 017 (출석 F004) ─> Task 018 (통합 테스트)

[Phase 3]  UI 단계(019)는 선행 가능하나, 연동 단계(022)는 Task 017 완료 필요
Task 019 (정산 더미 UI + lib/settlement.ts) ─> 🔍 CP-3 ⛔ ─> Task 020 (expenses 스키마)
  └─> Task 021 (F007) ─> Task 022 (F008) ─> Task 023 (F009) ─> Task 024 (통합 테스트)
                            ↑ Task 017(출석체크)이 대상자 판정 기준

[Phase 4]  UI 단계(025)는 선행 가능하나, 연동 단계(028)는 Task 016 완료 필요
Task 025 (카풀 더미 UI) ─> 🔍 CP-4 ⛔ ─> Task 026 (carpool 스키마)
  └─> Task 027 (F010) ─> Task 028 (F011) ─> Task 029 (통합 테스트)
                            ↑ Task 016(RSVP)이 배정 대상 기준

[Phase 5]  전 Phase 완료 후
Task 030 (전체 E2E) ─> Task 031 (최적화 · 배포)
```

**병렬 진행 가이드**: 모든 Phase의 ①단계(더미 UI)는 DB에 의존하지 않으므로, 원한다면 Phase 1~4의 UI를 앞당겨 진행하고 체크포인트를 묶어서 한 번에 확인받을 수 있습니다. 다만 **④ 실데이터 연동 단계는 위 의존성을 반드시 지켜야 합니다** (정산은 출석체크, 카풀은 RSVP에 의존).
