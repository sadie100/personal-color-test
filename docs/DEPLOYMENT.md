# 배포 가이드

## 🚀 Vercel을 사용한 배포

Vercel은 가장 빠르고 쉬운 배포 플랫폼입니다.

### 방법 1: GitHub에 푸시 후 Vercel 연결 (권장)

#### 단계 1: GitHub 저장소 생성

1. https://github.com/new 방문
2. Repository name: `personal-color-test`
3. Description: `Personal Color Diagnosis Web App`
4. Public 선택
5. Create repository 클릭

#### 단계 2: GitHub에 코드 푸시

```bash
cd D:\dev\side-projects\personal-color-test

# GitHub 저장소 주소를 설정 (YOUR_USERNAME을 자신의 GitHub 이름으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/personal-color-test.git
git branch -M main
git push -u origin main
```

#### 단계 3: Vercel에 배포

1. https://vercel.com/login 방문
2. "GitHub로 계속" 클릭
3. GitHub 계정 인증
4. "Import Project" 클릭
5. GitHub 저장소 선택: `personal-color-test`
6. 설정 확인:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. "Deploy" 클릭

**완료!** 배포가 시작됩니다. 몇 초 후 라이브 URL을 받게 됩니다! 🎉

---

### 방법 2: Vercel CLI로 직접 배포

```bash
cd D:\dev\side-projects\personal-color-test

# Vercel에 로그인
vercel login

# 배포 실행
vercel

# 프롬프트:
# - Set up and deploy?: Yes
# - Which scope?: 자신의 이름 선택
# - Link to existing project?: No
# - Project name?: personal-color-test
# - In which directory is your code?: ./
# - Want to override the settings?: No
```

몇 초 후 배포 완료! 🚀

---

### 방법 3: GitHub Actions를 사용한 자동 배포

`.github/workflows/deploy.yml` 파일을 생성:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - run: npm install
      - run: npm run build

      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

설정:

1. Vercel에서 토큰 생성
2. GitHub 저장소 Settings → Secrets 추가
3. 각각 추가:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

---

## ✨ 배포 후

배포가 완료되면:

✅ 라이브 URL 받기 (예: `https://personal-color-test.vercel.app`)
✅ 세계 어디서나 접근 가능
✅ 자동 HTTPS
✅ CDN 전 세계 배포
✅ 무료 호스팅

## 🔄 업데이트 배포

### GitHub 방법

```bash
git add .
git commit -m "Update features"
git push origin main
# Vercel이 자동으로 배포함
```

### Vercel CLI

```bash
vercel --prod
```

---

## 🌐 커스텀 도메인 연결 (선택)

Vercel 대시보드에서:

1. 프로젝트 선택
2. Settings → Domains
3. 커스텀 도메인 추가
4. DNS 설정 따라하기

---

## 📊 배포 최적화

프로덕션 빌드 확인:

```bash
npm run build
npm run preview
```

## 🆘 문제 해결

### 빌드 실패

- `npm run build` 로컬에서 실행해보기
- node_modules 삭제 후 재설치
- Node.js 버전 확인 (16+ 필요)

### 배포 느림

- `package-lock.json` 커밋되었는지 확인
- Vercel 빌드 로그 확인

### 라우팅 문제

Vite SPA 설정 확인 - vercel.json 생성:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

**배포는 이제 완료되었습니다! 🎉**
