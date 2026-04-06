# 퍼스널 컬러 테스트

좋아요/싫어요 기반의 컬러 선호 테스트로 12시즌 퍼스널 컬러 타입을 추정하는 React + TypeScript 웹 애플리케이션입니다.

사용자는 컬러 카드를 빠르게 평가하고, 결과 화면에서 베스트 타입과 차순위 타입, 워스트 타입 및 팔레트 비교 결과를 확인할 수 있습니다.

## 주요 기능

- 풀스크린 컬러 카드 기반 테스트
- `ArrowRight` / `ArrowLeft` 키보드 단축키 지원
- 한국어 / 영어 전환 지원
- `about` 화면에서 퍼스널 컬러 및 PCCS 톤 시스템 소개
- 결과 화면에서 상위 타입과 워스트 타입 비교
- 팔레트별 좋아요/싫어요 겹침 표시

## 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- ESLint
- Prettier
- Vitest

## Getting Started

### Requirements

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

기본 개발 서버 주소는 `http://localhost:5173`입니다.

## 사용 방법

1. 홈 화면에서 테스트를 시작합니다.
2. 각 색상을 `좋아요` 또는 `싫어요`로 평가합니다.
3. 10개 이상 진행하면 중간 결과를 먼저 볼 수 있습니다.
4. 결과 화면에서 추천 타입과 팔레트 비교 내용을 확인합니다.

테스트 조작:

- `ArrowRight`: 좋아요
- `ArrowLeft`: 싫어요

## Scripts

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기
- `npm run lint`: ESLint 실행
- `npm run typecheck`: TypeScript 타입 검사
- `npm run test`: Vitest watch 모드 실행
- `npm run test:run`: 테스트 1회 실행
- `npm run format`: Prettier 포맷 적용
- `npm run format:check`: 포맷 검사

## 프로젝트 구조

- `src/App.tsx`: 화면 전환과 앱 전체 상태 관리
- `src/components`: 화면 및 공통 UI 컴포넌트
- `src/data/colorData.ts`: 12시즌 컬러 데이터
- `src/utils/analyzer.ts`: 테스트 결과 분석 로직
- `src/i18n/translations.ts`: 다국어 문자열
- `src/types.ts`: 공통 타입 정의
- `docs/`: 설계, 명세, 배포 문서

## 문서

- `docs/SPEC.md`
- `docs/DESIGN.md`
- `docs/DEPLOYMENT.md`
