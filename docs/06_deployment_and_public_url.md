# STRONGER 배포 / 무료 URL 전략

## 1. 결론

이 서비스는 `React + Next.js + Prisma + PostgreSQL` 구조이므로,
가장 현실적인 첫 배포 조합은 아래입니다.

- 웹 앱: `Vercel`
- 데이터베이스: `Neon PostgreSQL`
- 이미지 저장소: `Cloudflare R2` 또는 `Supabase Storage`
- 도메인: 초반에는 무료 서브도메인, 이후 커스텀 도메인 연결

이 조합을 추천하는 이유는 다음과 같습니다.

- Next.js와 배포 궁합이 가장 좋음
- 무료 URL을 바로 받을 수 있음
- 여러 사용자가 동시에 접속 가능한 공개 URL을 만들 수 있음
- Prisma + PostgreSQL 운영 흐름이 단순함
- 나중에 유료 전환 시 구조를 갈아엎지 않아도 됨

## 2. 무료 URL을 받는 방법

### 방법 A. Vercel

가장 추천하는 방식입니다.

얻게 되는 URL:
- `https://your-project.vercel.app`

장점:
- Next.js와 궁합이 가장 좋음
- Git push만 해도 자동 배포 가능
- PR / 브랜치별 Preview URL이 자동 생성됨
- 여러 사용자가 동시에 접속 가능

주의:
- Hobby 플랜은 무료지만 공식 문서상 개인 프로젝트 / 소규모 용도 중심입니다.
- 상업 서비스로 본격 운영하면 Pro 이상을 검토해야 합니다.

## 3. Cloudflare Quick Tunnel은 왜 메인 배포용이 아닌가

우리가 방금 쓴 `trycloudflare.com` 링크는 데모용으로는 좋지만,
공식 문서 기준 `testing and development only`입니다.

즉:
- URL이 임시임
- uptime 보장이 없음
- production 메인 URL로 쓰면 안 됨

정리하면:
- `Quick Tunnel`: 지금 보여주기용
- `Vercel URL` 또는 `pages.dev`: 여러 사용자가 쓰는 안정적 테스트 URL
- `커스텀 도메인`: 실제 서비스 운영용

## 4. Cloudflare Pages는 언제 좋은가

얻게 되는 URL:
- `https://your-project.pages.dev`

장점:
- 무료 서브도메인 제공
- Preview deployment 무제한
- 정적 파일 요청은 무료 / 무제한
- 나중에 Cloudflare 생태계로 확장하기 좋음

주의:
- 우리 서비스는 Next.js + Prisma + 인증 + 추천 API가 있는 풀스택 앱이라
  초기 생산성은 Vercel 쪽이 더 좋습니다.
- Cloudflare Pages는 정적 중심 또는 Workers 구조에 익숙할수록 유리합니다.

## 5. 여러 사용자가 실제로 쓰게 하려면 필요한 구성

무료 URL만 있다고 끝나는 것이 아닙니다.
여러 사용자가 쓰려면 최소 아래 4개가 필요합니다.

1. `안정적인 공개 URL`
2. `공유 데이터베이스`
3. `이미지 저장소`
4. `배포 자동화`

실제 추천 조합:

- 앱 URL: `Vercel`
- DB: `Neon`
- 이미지: `Cloudflare R2` 또는 `Supabase Storage`
- 인증: 앱 내부 구현 또는 Auth 서비스 연동

## 6. 내가 수정하고 네가 계속 배포 가능한 구조

정확히 말하면, 내가 `자동 배포까지 완전히 알아서` 하려면
최소 아래 연결이 있어야 합니다.

1. Git 저장소가 있어야 함
2. 그 저장소가 Vercel에 연결되어 있어야 함
3. DB / Storage 환경변수가 설정되어 있어야 함

그다음 흐름은 아래처럼 됩니다.

1. 내가 코드 수정
2. 저장소에 커밋 / 푸시
3. Vercel이 자동 배포
4. `vercel.app` URL 또는 Preview URL 갱신

즉 `내가 계속 수정하고, 네가 URL로 확인`하는 가장 현실적인 구조는
`GitHub + Vercel 자동 배포`입니다.

## 7. 추천 배포 전략

### 1단계. 지금 바로
- Vercel Hobby
- Neon Free
- Cloudflare R2 Free 또는 Supabase Free Storage
- 무료 서브도메인 사용

목표:
- 닫힌 알파 / 테스트 유저용 공개 URL 확보

### 2단계. 사용자 수 증가
- Vercel Pro
- Neon Launch 이상
- 이미지 CDN / 저장소 운영 고도화
- 모니터링 추가

목표:
- 실제 다수 사용자 베타 운영

### 3단계. 정식 운영
- 커스텀 도메인 연결
- 백업 / 로그 / 알림 / 에러 모니터링 강화
- DB connection pooling / read replica / 집계 최적화

## 8. 실제 추천 조합

### 추천안 1. 가장 쉬운 조합
- Frontend / App: Vercel
- DB: Neon
- Storage: Cloudflare R2

이 조합이 가장 무난합니다.

### 추천안 2. 올인원 성향
- Frontend / App: Vercel
- DB / Auth / Storage: Supabase

이 조합은 초기 구현이 빠르지만,
Prisma 중심 운영을 하려면 DB ownership과 auth 구조를 조금 더 명확히 나누는 것이 좋습니다.

## 9. 실전 체크리스트

배포 준비 순서:

1. GitHub 저장소 생성
2. Vercel에 저장소 연결
3. Neon 프로젝트 생성
4. `DATABASE_URL`, `DIRECT_DATABASE_URL` 등록
5. 스토리지 계정 생성
6. `.env` 값 등록
7. Prisma migrate 배포
8. 첫 production 배포

## 10. 지금 내가 추천하는 운영 방식

지금 단계에서는 아래가 가장 현실적입니다.

- 메인 테스트 URL은 `Vercel`
- 임시 공유 / 시연은 `Cloudflare Quick Tunnel`
- DB는 `Neon`
- 이미지 저장은 `R2`

즉:

- 데모는 빠르게
- 구조는 production 친화적으로
- 나중에 커스텀 도메인만 붙이면 정식 서비스로 전환 가능

## 11. 최신 공식 참고

- Vercel Git 배포와 Preview Deployment: `https://vercel.com/docs/deployments/git`
- Vercel 무료 Hobby 플랜: `https://vercel.com/docs/accounts/plans/hobby`
- Cloudflare Quick Tunnel: `https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/`
- Cloudflare Pages limits: `https://developers.cloudflare.com/pages/platform/limits/`
- Cloudflare Pages custom domains: `https://developers.cloudflare.com/pages/configuration/custom-domains/`
- Neon pricing: `https://neon.com/pricing`
- Neon connection pooling: `https://neon.com/docs/connect/connection-pooling`
- Supabase pricing: `https://supabase.com/pricing`
