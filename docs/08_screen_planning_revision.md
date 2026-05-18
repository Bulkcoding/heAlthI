# STRONGER 화면 기획 개편안

## 1. 이번 개편의 방향

기존 구조가 "단일 대시보드 중심 MVP"였다면,
이번 구조는 `상황별 화면군`을 먼저 정의하는 방식입니다.

즉 화면을 아래 4개 묶음으로 나눕니다.

1. 로그인 화면 3안
2. 메인 화면 3안
3. 상세 화면 3안
4. 오늘 운동 시작 플로우 3안

이 구조의 장점은 다음과 같습니다.

- 브랜드 톤앤매너를 여러 방향으로 비교 가능
- 실제 개발 전에 핵심 상호작용 구조를 빠르게 검증 가능
- 다크 / 라이트 / 하이브리드 UI를 병렬 검토 가능
- 운동 기록 서비스의 핵심 여정을 화면군 단위로 점검 가능

## 2. 화면군 재정의

### A. 로그인 화면

목표:
- 첫 인상을 결정하는 진입 화면
- 회원가입 전환과 브랜드 톤을 동시에 전달

세 가지 방향:

1. `Dark Coach`
- 어두운 헬스장 배경
- 보디빌더 비주얼
- 강한 코칭 / 퍼포먼스 인상
- 타깃: 하드코어 리프터, 남성 유저 비중이 높은 초반 유입

2. `Clean Athlete`
- 밝은 배경
- 여성 운동자 비주얼
- 깔끔하고 프리미엄한 피트니스 브랜드 인상
- 타깃: 넓은 일반 사용자층

3. `Hybrid Gym Intro`
- 좌측 브랜드 소개 + 우측 로그인 카드
- 서비스 규모, 통계, 신뢰감을 같이 노출
- 타깃: 실제 서비스다운 인상을 주는 첫 화면

추천:
- 실제 production 첫 화면은 `Hybrid Gym Intro`
- 마케팅 랜딩이나 A/B 테스트 후보로 `Dark Coach`, `Clean Athlete`

### B. 메인 화면

목표:
- 로그인 후 가장 자주 보는 허브
- 오늘 운동, AI 피드백, 기록 추이, 친구 활동을 즉시 파악

세 가지 방향:

1. `Dark Daily Dashboard`
- KPI 카드 + 오늘 운동 + AI 점수 + 친구 활동
- 사용 빈도가 가장 높은 기본형

2. `Light Guided Dashboard`
- 밝은 배경 + 높은 가독성
- 초보 사용자도 부담 없이 접근 가능

3. `Dark Analysis Dashboard`
- 분석 중심
- 레이더 차트, 근육 후면 히트맵, 기록 추이, 최근 운동, AI 추천
- 파워유저 / 분석 선호층 대상

추천:
- 기본 대시보드는 `Dark Daily Dashboard`
- 설정에서 `Light Guided Dashboard` 테마 지원
- `Dark Analysis Dashboard`는 별도 분석 홈 또는 탭으로 분리

### C. 상세 화면

목표:
- 운동 기록을 깊게 보고
- AI 피드백과 다음 추천을 함께 확인하는 화면

세 가지 방향:

1. `3-Column Review`
- 좌측 운동 리스트
- 중앙 세트 기록 테이블
- 우측 AI 분석 / 다음 운동 추천
- 가장 작업 효율이 높은 구조

2. `Focused Detail + Right Rail`
- 중앙 콘텐츠 집중형
- 우측 보조 패널
- 기록 열람과 추천 확인의 균형형

3. `Modal Review`
- 리스트 위에 모달 상세
- 빠른 확인과 비교에 유리
- 모바일 / 태블릿 확장에 좋음

추천:
- PC 기본은 `3-Column Review`
- 라이트 버전 상세는 `Focused Detail + Right Rail`
- 빠른 비교 UI는 `Modal Review`

### D. 오늘 운동 시작 플로우

목표:
- 사용자가 운동 시작 전 의사결정을 자연스럽게 끝내게 하기
- 부위, 시간, 기구, AI 보조, 운동 구성까지 유도

세 가지 방향:

1. `Horizontal Step Wizard`
- 상단 스텝 바
- 근육 부위 카드 선택
- 가장 익숙한 일반적 구조

2. `Centered Cards Flow`
- 단계별 카드 집중형
- 기구 사진 업로드와 AI 도움 강조
- 제품 차별점 전달에 좋음

3. `Sidebar Step Flow`
- 좌측 단계 내비게이션
- 우측 큰 작업 영역
- PC에서 가장 안정적인 프로세스형 UI

추천:
- 웹 기본은 `Sidebar Step Flow`
- 모바일은 `Horizontal Step Wizard`
- AI 장비 인식 강조 캠페인에는 `Centered Cards Flow`

## 3. 실제 서비스 기준 권장 조합

운영용 첫 버전에서 가장 현실적인 조합은 아래입니다.

- 로그인: `Hybrid Gym Intro`
- 대시보드: `Dark Daily Dashboard`
- 분석 홈: `Dark Analysis Dashboard`
- 운동 상세: `3-Column Review`
- 빠른 기록 확인: `Modal Review`
- 오늘 운동 시작: `Sidebar Step Flow`

## 4. 페이지 구조 반영

새 기준으로 핵심 라우트는 아래처럼 가져갑니다.

- `/planning`
- `/login`
- `/dashboard`
- `/exercise-detail`
- `/today-workout`

## 5. 디자인 시스템 방향

이번 시안의 공통 방향은 아래와 같습니다.

- 기본 테마는 다크 우선
- 보조 테마로 라이트 지원
- 브랜드 키 컬러는 보라 + 블루 계열
- 데이터 카드와 작업 카드의 역할 분리
- 운동 기록 테이블과 AI 보조 패널을 항상 분리
- 상단 KPI는 짧고 강하게
- AI 요약은 길게 말하지 않고 행동 유도형으로 구성

## 6. 다음 구현 우선순위

1. planning gallery
2. 로그인 3안
3. 대시보드 3안
4. 운동 상세 3안
5. 오늘 운동 플로우 3안
6. 이후 실제 선택안 기준으로 production UI 정리
