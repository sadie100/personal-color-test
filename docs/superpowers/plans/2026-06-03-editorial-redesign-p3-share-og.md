# 결과 공유 OG — 단일 브랜드 이미지 (P3-15) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [docs/UI_FEEDBACK.md](../../UI_FEEDBACK.md) §4 P3 #15 — 링크를 공유했을 때 **"퍼스널 컬러 셀프 테스트"라는 사이트 정체성(도메인 특성)이 미리보기로 뜨도록** 단일 브랜드 OG를 붙인다. 현재 [index.html](../../../index.html)에는 OG 태그가 전혀 없어 공유 시 제목·이미지 없이 휑하게 뜬다.

**Architecture:** **결과별 개인화는 하지 않는다(사용자 결정).** 퍼스널 컬러 타입별 이미지·생성 스크립트·stub 페이지·신규 의존성 전부 없음. `index.html`에 모든 페이지 공통 OG/Twitter 메타 1세트 + `public/`에 브랜드 OG 이미지 1장(1200×630)을 둔다. 더해, 공유 대상이 되는 `/results`·`/about`·`/types` 같은 비-루트 경로가 Vercel 정적 호스팅에서 `index.html`(=OG 메타 포함)로 서빙되도록 SPA 폴백 rewrite를 추가한다 — 이게 없으면 현재 직접 접근/크롤러 fetch 시 404라 OG 메타조차 못 읽는다(기존 deep-link 404도 함께 해소).

**Tech Stack:** 정적 Vite SPA + Vercel. 신규 의존성 없음. OG 이미지는 홈 히어로(오프화이트 + 실제 컬러칩 그리드 = 도메인 특성)를 1200×630으로 캡처해 정적 자산으로 커밋.

---

## 적용 범위 (확정)

| 항목                      | 결정                                                                                          | 대상 Task |
| ------------------------- | --------------------------------------------------------------------------------------------- | --------- |
| 공통 OG/Twitter 메타       | `index.html`에 title·description·og:image·twitter card 1세트 + `<html lang="ko">`             | Task 1    |
| 브랜드 OG 이미지 1장        | 홈 히어로를 1200×630 캡처 → `public/og.png` 커밋                                               | Task 2    |
| SPA 폴백 (정적 호스팅)     | `vercel.json` — 비-루트 경로를 `index.html`로 rewrite (공유 결과 링크가 OG 읽도록 + 404 해소)  | Task 3    |

**의도적으로 제외 (사용자 결정):**

- 퍼스널 컬러 **타입별 OG 이미지/자동 생성** — "도메인 특성이 드러나는 정도"면 충분하다는 사용자 의도에 따라 단일 브랜드 이미지로 대체.
- `@napi-rs/canvas`/`tsx` dev 의존성, 결과별 정적 stub 페이지(`/s/<slug>`), Vite OG 플러그인, `ogTargets.ts` — 전부 불필요.
- Results 공유 버튼 로직 변경 없음 — 기존 `/results?...` URL 그대로 공유하면 SPA 폴백이 OG 메타를 담은 `index.html`을 서빙한다.

---

## TDD 적용 방침

전부 **정적 자산·HTML 메타·배포 설정** 변경이라 red-green TDD 부적합(사용자 CLAUDE.md §4). `src/**` 코드를 건드리지 않으므로 기존 테스트에 영향 없음.

- 검증 = `npm run build`(빌드 성공) + `dist/index.html`에 OG 메타 존재 확인 + `dist/og.png` 존재 확인 + (선택) OG 디버거 육안.
- `npm run typecheck && npm run lint && npm run test:run`은 회귀 확인용으로 마지막에 1회.

**불변 제약:** `src/**` 미변경이므로 [src/App.test.tsx](../../../src/App.test.tsx) 포함 전 테스트 그대로 green.

---

## File Structure

**생성:**

- `public/og.png` — 1200×630 브랜드 OG 이미지(홈 히어로 캡처). (Task 2)
- `vercel.json` — SPA 폴백 rewrite. (Task 3)

**수정:**

- `index.html` — 공통 OG/Twitter 메타 + `<html lang>`. (Task 1)

**손대지 않음:** `src/**` 전부, `package.json`, `vite.config.ts`.

---

## Task 1: index.html 공통 OG/메타

**Files:**

- Modify: `index.html`

현재 [index.html](../../../index.html)은 `<title>`이 기본값(`personal-color-test`), `<html lang="en">`, OG 없음. 모든 페이지 공통으로 쓸 메타와 `og.png`를 추가한다.

- [ ] **Step 1: `<html lang>`를 ko로**

[index.html](../../../index.html) 2줄:
```html
<html lang="ko">
```

- [ ] **Step 2: `<title>` 교체 + 메타 블록 추가**

`<title>personal-color-test</title>`(8줄 부근)를 아래로 교체:
```html
    <title>퍼스널 컬러 셀프 테스트 · Personal Color Self Test</title>
    <meta
      name="description"
      content="색을 고르기만 하면 끝나는 퍼스널 컬러 셀프 진단. 12타입 컬러 팔레트로 내 시즌을 찾아보세요."
    />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="퍼스널 컬러 셀프 테스트" />
    <meta
      property="og:description"
      content="색을 고르기만 하면 끝나는 퍼스널 컬러 셀프 진단. 내 시즌을 찾아보세요."
    />
    <meta property="og:image" content="/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="퍼스널 컬러 셀프 테스트" />
    <meta name="twitter:description" content="색을 고르기만 하면 끝나는 퍼스널 컬러 셀프 진단." />
    <meta name="twitter:image" content="/og.png" />
```

> `og:image`는 상대경로 `/og.png`. 대부분 크롤러가 페이지 URL 기준으로 해석한다. 일부 플랫폼이 절대 URL을 요구하면 배포 도메인으로 절대경로(`https://<도메인>/og.png`)로 바꾼다(배포 후 OG 디버거로 확인).

- [ ] **Step 3: 검증(이미지 없이 메타만)**

Run: `npm run build`
Expected: 빌드 성공. (`og.png`는 Task 2에서 생성 — 이 시점엔 없어도 빌드 통과.)

Run: `grep -c "og:title\|og:image\|twitter:card" dist/index.html`
Expected: 3 이상(메타가 산출물에 반영됨).

- [ ] **Step 4: 커밋**

```bash
git add index.html
git commit -m "feat(share): 공통 OG/Twitter 메타 + lang=ko (#15)"
```

---

## Task 2: 브랜드 OG 이미지 생성

**Files:**

- Create: `public/og.png`

홈 히어로(오프화이트 배경 + 좌측 세리프 헤드라인 + 우측 실제 컬러칩 그리드)는 그 자체로 "퍼스널 컬러 도구"라는 도메인 특성을 보여준다. 이를 1200×630으로 캡처해 OG 이미지로 쓴다.

- [ ] **Step 1: dev 서버 실행**

Run: `npm run dev`
(백그라운드로 띄우고 `http://localhost:5173` 확인.)

- [ ] **Step 2: 1200×630 캡처**

브라우저(또는 chrome-devtools MCP)로:
1. 뷰포트를 **1200×630**으로 설정(`resize_page` 또는 DevTools device emulation).
2. `http://localhost:5173/` 로드, 폰트·컬러칩 렌더 완료 대기.
3. 뷰포트 스크린샷을 PNG로 저장 → `public/og.png`.

> 헤더가 고정(fixed)이라 히어로 상단이 헤더에 약간 가릴 수 있다. 필요하면 캡처 전 `pt`를 고려해 약간 스크롤하거나, 1200×630 안에 헤드라인+칩 그리드가 들어오게 프레이밍한다. 목표는 "정체성이 드러나는 한 장"이지 픽셀 퍼펙트가 아니다.

- [ ] **Step 3: 산출 확인**

Run: `ls -la public/og.png`
Expected: 파일 존재. 1200×630 PNG. (파일 크기가 과도하면 — 보통 수백 KB 이하 — 그대로 둔다.)

육안: `public/og.png`를 열어 오프화이트 배경 + 헤드라인 + 컬러칩이 보이는지 확인.

- [ ] **Step 4: 빌드로 자산 복사 확인**

Run: `npm run build`
Run: `ls dist/og.png`
Expected: `public/og.png`가 `dist/og.png`로 복사됨.

- [ ] **Step 5: 커밋**

```bash
git add public/og.png
git commit -m "feat(share): 브랜드 OG 이미지(홈 히어로) 추가 (#15)"
```

---

## Task 3: vercel.json — SPA 폴백 (공유 링크가 OG를 읽도록)

**Files:**

- Create: `vercel.json`

현재 `vercel.json`이 없다. Vite는 SPA 폴백을 자동 추가하지 않으므로, `/results`·`/about`·`/types/...` 같은 비-루트 경로를 직접 열거나 **크롤러가 fetch하면 404**가 난다 → OG 메타조차 못 읽는다. 모든 비-파일 경로를 `index.html`(OG 메타 포함)로 rewrite한다. (정적 파일은 Vercel이 rewrite보다 먼저 서빙하므로 `og.png`·JS·CSS는 그대로.)

- [ ] **Step 1: vercel.json 생성**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> 효과: 공유된 `/results?...` 링크를 크롤러가 fetch → `index.html` 서빙 → OG 메타(`og.png`) 읽음. 사람은 SPA가 로드돼 결과 렌더. 덤으로 기존 deep-link 404도 해소.

- [ ] **Step 2: 커밋**

```bash
git add vercel.json
git commit -m "feat(deploy): SPA 폴백 rewrite — 공유 링크 OG + deep-link 404 해소 (#15)"
```

---

## Task 4: 통합 검증

**Files:** 없음 (검증 전용)

- [ ] **Step 1: 산출물 확인**

Run: `npm run build && ls dist/og.png && grep -c "og:image" dist/index.html`
Expected: 빌드 성공, `dist/og.png` 존재, `og:image` 메타 1+.

- [ ] **Step 2: 회귀 확인(코드 무변경이므로 형식적)**

Run: `npm run typecheck && npm run lint && npm run test:run`
Expected: 전체 통과(src 미변경).

- [ ] **Step 3: 로컬 프리뷰 + OG 메타 육안**

Run: `npm run preview`
- `curl -s http://localhost:4173/ | grep og:` 로 메타 확인(또는 브라우저 소스 보기).
- `http://localhost:4173/results?mode=detailed&best=spring-bright` 가 404 없이 SPA로 뜨는지 확인(rewrite는 vercel.json이라 preview에선 적용 안 될 수 있음 — 배포 후 실제 확인이 정확).

> **배포 후 확정 검증:** OG 디버거(opengraph.xyz, 카카오/페북 디버거)에 배포 URL을 넣어 브랜드 이미지·제목이 뜨는지 확인. `og:image`가 상대경로로 안 뜨면 절대 URL로 교체(Task 1 주석).

---

## Self-Review

**1. 스펙 커버리지:** #15 "공유 OG" — 사용자 의도(도메인 특성 단일 OG)에 맞춰 index.html 메타(Task 1) + 브랜드 이미지(Task 2) + 공유 링크 도달성(Task 3)로 충족. 결과별 개인화는 사용자 결정으로 제외 — 범위 절에 명시. ✓

**2. 플레이스홀더 스캔:** TBD 없음. 메타 문자열·JSON·캡처 절차 모두 구체. OG 이미지는 "홈 히어로 캡처"라는 실행 가능한 산출 방법 명시(픽셀 퍼펙트 아님을 전제). ✓

**3. 일관성:** `og:image`/`twitter:image` 경로(`/og.png`) = Task 2 산출 파일명 = `dist/og.png`. vercel.json은 정적 파일 우선이라 `og.png` 서빙과 충돌 없음. ✓

**4. 기존 테스트 보호:** `src/**` 미변경 → 전 테스트 green. ✓

**주의 (실행자에게):** Task 2의 캡처는 dev 서버 + 브라우저가 필요하다(자동 빌드만으론 생성 불가). chrome-devtools/Playwright MCP가 있으면 `resize_page(1200×630)` → `navigate` → `take_screenshot`로 처리. 없으면 수동 캡처 후 `public/og.png`로 저장. `og:image` 상대경로가 일부 플랫폼에서 안 뜨면 배포 도메인 절대 URL로 교체.
