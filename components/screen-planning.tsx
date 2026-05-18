import Link from "next/link";
import type { ReactNode } from "react";

type RouteKey =
  | "planning"
  | "login"
  | "dashboard"
  | "exercise-detail"
  | "today-workout";

type ShellProps = {
  route: RouteKey;
  title: string;
  description: string;
  children: ReactNode;
};

type SectionHeadingProps = {
  step: string;
  title: string;
  subtitle: string;
};

type ScreenFrameProps = {
  mode: "dark" | "light";
  title: string;
  caption: string;
  children: ReactNode;
  tall?: boolean;
};

const navigation: Array<{ href: RouteKey; label: string }> = [
  { href: "planning", label: "화면 기획" },
  { href: "login", label: "로그인" },
  { href: "dashboard", label: "대시보드" },
  { href: "exercise-detail", label: "운동 상세" },
  { href: "today-workout", label: "오늘 운동" }
];

const pageHref: Record<RouteKey, string> = {
  planning: "/planning",
  login: "/login",
  dashboard: "/dashboard",
  "exercise-detail": "/exercise-detail",
  "today-workout": "/today-workout"
};

const tableRows = [
  ["1", "80", "5", "7", "120초"],
  ["2", "80", "5", "7", "120초"],
  ["3", "80", "5", "8", "120초"],
  ["4", "80", "5", "8", "120초"],
  ["5", "80", "5", "8", "130초"]
];

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function Shell({ route, title, description, children }: ShellProps) {
  return (
    <div className="screen-planning-page">
      <div className="sp-app">
        <header className="sp-topbar">
          <div className="sp-brand">
            <div className="sp-brand__mark">S</div>
            <div>
              <p className="sp-brand__name">STRONGER</p>
              <p className="sp-brand__sub">Screen Planning Studio</p>
            </div>
          </div>

          <nav className="sp-topnav">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={pageHref[item.href]}
                className={cx(
                  "sp-topnav__link",
                  route === item.href && "sp-topnav__link--active"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <section className="sp-hero">
          <p className="sp-hero__eyebrow">Updated Screen Direction</p>
          <h1>{title}</h1>
          <p className="sp-hero__copy">{description}</p>
        </section>

        <main className="sp-body">{children}</main>
      </div>
    </div>
  );
}

function SectionHeading({ step, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="sp-section-heading">
      <div className="sp-section-heading__index">{step}</div>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function ScreenFrame({
  mode,
  title,
  caption,
  children,
  tall = false
}: ScreenFrameProps) {
  return (
    <article
      className={cx(
        "sp-screen-frame",
        `sp-screen-frame--${mode}`,
        tall && "sp-screen-frame--tall"
      )}
    >
      <div className="sp-screen-frame__bar">
        <div className="sp-screen-frame__dots">
          <span />
          <span />
          <span />
        </div>
        <p className="sp-screen-frame__title">{title}</p>
      </div>

      <div className="sp-screen-frame__body">{children}</div>
      <p className="sp-screen-frame__caption">{caption}</p>
    </article>
  );
}

function LoginDarkVariant() {
  return (
    <ScreenFrame
      mode="dark"
      title="로그인 화면 A"
      caption="Dark Coach · 강한 몰입감과 퍼포먼스 중심 인상"
    >
      <div className="sp-login-split sp-login-split--dark">
        <div className="sp-hero-panel sp-hero-panel--bodybuilder">
          <p className="sp-screen-brand">STRONGER</p>
          <h3>기록이 성장을 만든다.</h3>
          <p>AI FITNESS COACH</p>
        </div>

        <div className="sp-auth-card sp-auth-card--dark">
          <div className="sp-auth-tabs">
            <span className="active">로그인</span>
            <span>회원가입</span>
          </div>

          <div className="sp-field-stack">
            <div className="sp-mini-input">이메일</div>
            <div className="sp-mini-input">비밀번호</div>
          </div>

          <div className="sp-mini-row">
            <span>로그인 상태 유지</span>
            <span>비밀번호 찾기</span>
          </div>

          <div className="sp-cta sp-cta--violet">로그인</div>

          <div className="sp-social-mini">
            <span>G</span>
            <span>A</span>
            <span>K</span>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function LoginLightVariant() {
  return (
    <ScreenFrame
      mode="light"
      title="로그인 화면 B"
      caption="Clean Athlete · 넓은 사용자층에 맞는 밝고 프리미엄한 진입"
    >
      <div className="sp-login-split sp-login-split--light">
        <div className="sp-hero-panel sp-hero-panel--athlete">
          <p className="sp-screen-brand sp-screen-brand--dark">STRONGER</p>
          <h3 className="sp-dark-copy">기록이 성장을 만든다.</h3>
          <p className="sp-muted-copy">AI FITNESS COACH</p>
        </div>

        <div className="sp-auth-card sp-auth-card--light">
          <div className="sp-auth-tabs sp-auth-tabs--light">
            <span className="active">로그인</span>
            <span>회원가입</span>
          </div>

          <div className="sp-field-stack">
            <div className="sp-mini-input sp-mini-input--light">이메일</div>
            <div className="sp-mini-input sp-mini-input--light">비밀번호</div>
          </div>

          <div className="sp-mini-row sp-mini-row--light">
            <span>로그인 상태 유지</span>
            <span>비밀번호 보기</span>
          </div>

          <div className="sp-cta sp-cta--blue">로그인</div>

          <div className="sp-social-mini sp-social-mini--light">
            <span>G</span>
            <span>A</span>
            <span>K</span>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function LoginHybridVariant() {
  return (
    <ScreenFrame
      mode="dark"
      title="로그인 화면 C"
      caption="Hybrid Gym Intro · 브랜드 소개와 인증 카드를 함께 배치"
    >
      <div className="sp-login-overlay">
        <div className="sp-gym-hero">
          <p className="sp-screen-brand">STRONGER</p>
          <h3>기록이 성장을 만든다.</h3>
          <p>AI FITNESS COACH</p>

          <div className="sp-stats-inline">
            <div>
              <strong>250K+</strong>
              <span>사용자</span>
            </div>
            <div>
              <strong>1.2M+</strong>
              <span>운동 기록</span>
            </div>
            <div>
              <strong>98%</strong>
              <span>추천 만족도</span>
            </div>
          </div>
        </div>

        <div className="sp-floating-login">
          <div className="sp-auth-tabs sp-auth-tabs--light">
            <span className="active">로그인</span>
            <span>회원가입</span>
          </div>

          <div className="sp-field-stack">
            <div className="sp-mini-input sp-mini-input--light">이메일</div>
            <div className="sp-mini-input sp-mini-input--light">비밀번호</div>
          </div>

          <div className="sp-mini-row sp-mini-row--light">
            <span>로그인 상태 유지</span>
            <span>비밀번호 찾기</span>
          </div>

          <div className="sp-cta sp-cta--violet">로그인</div>

          <div className="sp-social-mini sp-social-mini--light">
            <span>G</span>
            <span>A</span>
            <span>K</span>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function DashboardDarkVariant() {
  return (
    <ScreenFrame
      mode="dark"
      title="메인 화면 A"
      caption="Dark Daily Dashboard · 가장 자주 쓰는 허브형 대시보드"
    >
      <div className="sp-dashboard-shell sp-dashboard-shell--dark">
        <aside className="sp-mini-sidebar">
          <p className="sp-mini-sidebar__brand">STRONGER</p>
          {["대시보드", "운동 기록", "AI 추천", "분석", "친구", "설정"].map(
            (item, index) => (
              <div
                key={item}
                className={cx("sp-mini-nav", index === 0 && "sp-mini-nav--active")}
              >
                {item}
              </div>
            )
          )}
        </aside>

        <div className="sp-mini-main">
          <div className="sp-kpi-row">
            {[
              ["이번 주 운동", "4 / 5회"],
              ["운동 시간", "5h 32m"],
              ["총 볼륨", "12,450kg"],
              ["소모 칼로리", "3,250kcal"]
            ].map(([label, value]) => (
              <div key={label} className="sp-kpi-card sp-kpi-card--dark">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="sp-content-grid sp-content-grid--dashboard">
            <div className="sp-panel sp-panel--dark sp-score-panel">
              <div className="sp-score-badge">85</div>
              <div>
                <h4>AI 추천 요약</h4>
                <p>오늘 운동은 하체 Push가 적절합니다.</p>
              </div>
            </div>

            <div className="sp-panel sp-panel--dark">
              <h4>주간 운동 추이</h4>
              <div className="sp-line-chart" />
            </div>

            <div className="sp-panel sp-panel--dark">
              <h4>오늘의 운동</h4>
              <ul>
                <li>벤치프레스 80kg</li>
                <li>인클라인 덤벨프레스</li>
                <li>운동 시작하기</li>
              </ul>
            </div>

            <div className="sp-panel sp-panel--dark">
              <h4>친구 활동</h4>
              <ul>
                <li>김민수 · 데드리프트 150kg</li>
                <li>이예진 · 스쿼트 120kg</li>
                <li>박지훈 · 벤치 100kg</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function DashboardLightVariant() {
  return (
    <ScreenFrame
      mode="light"
      title="메인 화면 B"
      caption="Light Guided Dashboard · 밝은 가독성과 초보 친화형 구성"
    >
      <div className="sp-dashboard-shell sp-dashboard-shell--light">
        <aside className="sp-mini-sidebar sp-mini-sidebar--light">
          <p className="sp-mini-sidebar__brand sp-mini-sidebar__brand--dark">
            STRONGER
          </p>
          {["대시보드", "운동 기록", "AI 추천", "분석", "친구", "설정"].map(
            (item, index) => (
              <div
                key={item}
                className={cx(
                  "sp-mini-nav",
                  "sp-mini-nav--light",
                  index === 0 && "sp-mini-nav--active-light"
                )}
              >
                {item}
              </div>
            )
          )}
        </aside>

        <div className="sp-mini-main">
          <div className="sp-kpi-row">
            {[
              ["이번 주 운동", "4 / 5회"],
              ["운동 시간", "5h 32m"],
              ["총 볼륨", "12,450kg"],
              ["소모 칼로리", "3,250kcal"]
            ].map(([label, value]) => (
              <div key={label} className="sp-kpi-card sp-kpi-card--light">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="sp-content-grid sp-content-grid--dashboard">
            <div className="sp-panel sp-panel--light sp-score-panel">
              <div className="sp-score-badge sp-score-badge--green">85</div>
              <div>
                <h4>AI 추천 요약</h4>
                <p>전반적으로 좋은 흐름입니다.</p>
              </div>
            </div>

            <div className="sp-panel sp-panel--light">
              <h4>추천 운동 추이</h4>
              <div className="sp-line-chart sp-line-chart--blue" />
            </div>

            <div className="sp-panel sp-panel--light">
              <h4>오늘의 운동</h4>
              <ul>
                <li>벤치프레스 5세트</li>
                <li>덤벨프레스 4세트</li>
                <li>운동 시작하기</li>
              </ul>
            </div>

            <div className="sp-panel sp-panel--light">
              <h4>친구 활동</h4>
              <ul>
                <li>김민수 · 데드 150kg</li>
                <li>이예진 · 스쿼트 120kg</li>
                <li>박지훈 · 벤치 100kg</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function DashboardAnalysisVariant() {
  return (
    <ScreenFrame
      mode="dark"
      title="메인 화면 C"
      caption="Dark Analysis Dashboard · 분석과 다음 액션 중심의 파워유저 화면"
    >
      <div className="sp-dashboard-shell sp-dashboard-shell--analysis">
        <aside className="sp-mini-sidebar">
          <p className="sp-mini-sidebar__brand">STRONGER</p>
          {["대시보드", "운동 기록", "AI 추천", "분석", "커뮤니티", "설정"].map(
            (item, index) => (
              <div
                key={item}
                className={cx("sp-mini-nav", index === 0 && "sp-mini-nav--active")}
              >
                {item}
              </div>
            )
          )}
        </aside>

        <div className="sp-mini-main">
          <div className="sp-analysis-grid">
            <div className="sp-panel sp-panel--dark">
              <h4>운동 분석</h4>
              <div className="sp-radar-shape" />
            </div>

            <div className="sp-panel sp-panel--dark">
              <h4>근육 후면 밸런스</h4>
              <div className="sp-muscle-map" />
            </div>

            <div className="sp-panel sp-panel--dark">
              <h4>기록 추이</h4>
              <div className="sp-line-chart" />
            </div>

            <div className="sp-panel sp-panel--dark">
              <h4>최근 운동</h4>
              <ul>
                <li>벤치프레스 · 80kg</li>
                <li>스쿼트 · 100kg</li>
                <li>RPE / 시간 / 세트</li>
              </ul>
            </div>

            <div className="sp-panel sp-panel--dark">
              <h4>AI 추천</h4>
              <p>오늘은 상체 중심 루틴을 우선 추천합니다.</p>
              <div className="sp-cta sp-cta--violet sp-cta--inline">
                추천 운동 보기
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function DetailSplitVariant() {
  return (
    <ScreenFrame
      mode="dark"
      title="상세 화면 A"
      caption="3-Column Review · 기록·세트·AI 피드백을 동시에 확인"
    >
      <div className="sp-detail-shell">
        <aside className="sp-detail-panel sp-detail-panel--dark">
          <p className="sp-detail-nav__title">운동 기록</p>
          {["기록", "세트", "메모", "AI 추천", "히스토리"].map((item, index) => (
            <div
              key={item}
              className={cx("sp-detail-chip", index === 0 && "sp-detail-chip--active")}
            >
              {item}
            </div>
          ))}
        </aside>

        <div className="sp-detail-panel sp-detail-panel--dark">
          <h4>벤치프레스</h4>
          <div className="sp-table-mock">
            {tableRows.map((row) => (
              <div key={row.join("-")} className="sp-table-row">
                {row.map((cell, cellIndex) => (
                  <span key={`${cell}-${cellIndex}`}>{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="sp-detail-panel sp-detail-panel--dark">
          <h4>AI 분석 & 추천</h4>
          <div className="sp-ai-card">
            <strong>잘했어요</strong>
            <ul>
              <li>볼륨이 안정적입니다.</li>
              <li>휴식 간격도 좋습니다.</li>
            </ul>
          </div>

          <div className="sp-ai-card">
            <strong>다음 운동 추천</strong>
            <p>벤치프레스 82.5kg / 5세트</p>
          </div>

          <div className="sp-cta sp-cta--violet">추천 적용</div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function DetailFocusedVariant() {
  return (
    <ScreenFrame
      mode="dark"
      title="상세 화면 B"
      caption="Focused Detail + Right Rail · 기록 중심형 상세 구조"
    >
      <div className="sp-detail-shell sp-detail-shell--focused">
        <div className="sp-detail-panel sp-detail-panel--dark">
          <h4>벤치프레스</h4>
          <div className="sp-table-mock">
            {tableRows.map((row) => (
              <div key={row.join("-")} className="sp-table-row">
                {row.map((cell, cellIndex) => (
                  <span key={`${cell}-${cellIndex}`}>{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="sp-detail-panel sp-detail-panel--dark">
          <h4>AI 분석</h4>
          <ul>
            <li>세트 완수율이 좋습니다.</li>
            <li>후반 피로 누적은 주의가 필요합니다.</li>
          </ul>

          <h4>다음 운동 후보</h4>
          <p>벤치프레스 82.5kg / 스쿼트 100kg</p>
        </div>
      </div>
    </ScreenFrame>
  );
}

function DetailModalVariant() {
  return (
    <ScreenFrame
      mode="light"
      title="상세 화면 C"
      caption="Modal Review · 리스트 위에서 빠르게 열람하는 오버레이 구조"
    >
      <div className="sp-modal-scene">
        <div className="sp-blurred-board" />

        <div className="sp-floating-modal">
          <div className="sp-floating-modal__header">
            <h4>벤치프레스</h4>
            <span>×</span>
          </div>

          <div className="sp-floating-modal__grid">
            <div className="sp-modal-table">
              {tableRows.map((row) => (
                <div key={row.join("-")} className="sp-table-row sp-table-row--light">
                  {row.slice(0, 4).map((cell, cellIndex) => (
                    <span key={`${cell}-${cellIndex}`}>{cell}</span>
                  ))}
                </div>
              ))}
            </div>

            <div className="sp-modal-side">
              <strong>AI 분석</strong>
              <ul>
                <li>전반적으로 안정적</li>
                <li>다음 운동은 82.5kg 추천</li>
              </ul>
            </div>
          </div>

          <div className="sp-cta sp-cta--violet">확인</div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function WorkoutFlowHorizontalVariant() {
  return (
    <ScreenFrame
      mode="light"
      title="오늘 운동 흐름 A"
      caption="Horizontal Step Wizard · 가장 익숙한 단계형 온보딩 구조"
      tall
    >
      <div className="sp-flow-scene">
        <div className="sp-step-track">
          {[
            "운동 부위 선택",
            "운동 이름 선택",
            "AI 옵션",
            "운동 방식 설정",
            "세트 기록"
          ].map((item, index) => (
            <div
              key={item}
              className={cx("sp-step-pill", index === 0 && "sp-step-pill--active")}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="sp-flow-stage">
          <h4>오늘 운동 부위 선택</h4>
          <div className="sp-muscle-grid">
            {["가슴", "등", "어깨", "팔", "하체", "복근"].map((item, index) => (
              <div
                key={item}
                className={cx("sp-muscle-card", index === 0 && "sp-muscle-card--active")}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="sp-flow-actions">
            <span>준비하기</span>
            <div className="sp-cta sp-cta--violet sp-cta--inline">다음 단계</div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function WorkoutFlowCardVariant() {
  return (
    <ScreenFrame
      mode="light"
      title="오늘 운동 흐름 B"
      caption="Centered Cards Flow · 장비 인식과 단계 집중을 강조한 카드형 구조"
      tall
    >
      <div className="sp-card-stack">
        <div className="sp-wizard-card sp-wizard-card--purple">
          <p>1. 운동 부위 선택</p>
          <div className="sp-body-card">가슴</div>
        </div>

        <div className="sp-wizard-card">
          <p>2. 운동 이름 선택</p>
          <div className="sp-pill-list">
            <span>벤치프레스</span>
            <span>인클라인 벤치프레스</span>
            <span>체스트 프레스</span>
          </div>
        </div>

        <div className="sp-wizard-card sp-wizard-card--upload">
          <p>3. 이미지 기반 AI 보조</p>
          <div className="sp-upload-box">운동 기구 사진 업로드</div>
        </div>

        <div className="sp-wizard-card">
          <p>4. 운동 방식 선택</p>
          <div className="sp-pill-list">
            <span>5x5</span>
            <span>Wendler</span>
            <span>PPL</span>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function WorkoutFlowSidebarVariant() {
  return (
    <ScreenFrame
      mode="light"
      title="오늘 운동 흐름 C"
      caption="Sidebar Step Flow · PC 기준 가장 안정적인 작업형 구조"
      tall
    >
      <div className="sp-flow-shell">
        <aside className="sp-flow-sidebar">
          {[
            "운동 부위 선택",
            "운동 이름 선택",
            "AI 보조 선택",
            "운동 방식 선택",
            "세트 기록"
          ].map((item, index) => (
            <div
              key={item}
              className={cx("sp-flow-step", index === 0 && "sp-flow-step--active")}
            >
              {item}
            </div>
          ))}
        </aside>

        <div className="sp-flow-stage sp-flow-stage--wide">
          <h4>1. 운동 부위 선택</h4>
          <div className="sp-muscle-grid sp-muscle-grid--wide">
            {["가슴", "등", "어깨", "팔", "하체", "복근", "전신"].map(
              (item, index) => (
                <div
                  key={item}
                  className={cx(
                    "sp-muscle-card",
                    index === 0 && "sp-muscle-card--active"
                  )}
                >
                  {item}
                </div>
              )
            )}
          </div>

          <div className="sp-flow-actions">
            <span>선택하기</span>
            <div className="sp-cta sp-cta--violet sp-cta--inline">다음</div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function VariantGrid({ children }: { children: ReactNode }) {
  return <div className="sp-variant-grid">{children}</div>;
}

export function LoginSection() {
  return (
    <section className="sp-planning-section">
      <SectionHeading
        step="1"
        title="로그인 화면"
        subtitle="브랜드 첫 인상을 비교하기 위한 3가지 방향"
      />

      <VariantGrid>
        <LoginDarkVariant />
        <LoginLightVariant />
        <LoginHybridVariant />
      </VariantGrid>
    </section>
  );
}

export function DashboardSection() {
  return (
    <section className="sp-planning-section">
      <SectionHeading
        step="2"
        title="메인 화면 (대시보드)"
        subtitle="일상형, 가이드형, 분석형 대시보드 3안"
      />

      <VariantGrid>
        <DashboardDarkVariant />
        <DashboardLightVariant />
        <DashboardAnalysisVariant />
      </VariantGrid>
    </section>
  );
}

export function DetailSection() {
  return (
    <section className="sp-planning-section">
      <SectionHeading
        step="3"
        title="상세 화면 (운동 상세 + AI 분석)"
        subtitle="운동 기록과 AI 추천을 연결하는 3가지 상세 구조"
      />

      <VariantGrid>
        <DetailSplitVariant />
        <DetailFocusedVariant />
        <DetailModalVariant />
      </VariantGrid>
    </section>
  );
}

export function WorkoutFlowSection() {
  return (
    <section className="sp-planning-section">
      <SectionHeading
        step="4"
        title="오늘 운동 시작 화면"
        subtitle="운동 시작 전 선택 흐름을 검증하는 3가지 프로세스 구조"
      />

      <VariantGrid>
        <WorkoutFlowHorizontalVariant />
        <WorkoutFlowCardVariant />
        <WorkoutFlowSidebarVariant />
      </VariantGrid>
    </section>
  );
}

export function PlanningGalleryPage() {
  return (
    <Shell
      route="planning"
      title="화면 기획 개편안"
      description="로그인, 메인 대시보드, 운동 상세, 오늘 운동 시작 플로우를 각각 3안씩 비교할 수 있도록 planning gallery 구조로 정리했습니다."
    >
      <LoginSection />
      <DashboardSection />
      <DetailSection />
      <WorkoutFlowSection />
    </Shell>
  );
}

export function LoginPlanningPage() {
  return (
    <Shell
      route="login"
      title="로그인 화면 3안"
      description="브랜드 몰입형, 범용 프리미엄형, 서비스 소개형 로그인을 비교합니다."
    >
      <LoginSection />
    </Shell>
  );
}

export function DashboardPlanningPage() {
  return (
    <Shell
      route="dashboard"
      title="대시보드 3안"
      description="일상 사용 중심, 밝은 가이드형, 분석 중심 대시보드를 비교합니다."
    >
      <DashboardSection />
    </Shell>
  );
}

export function ExerciseDetailPlanningPage() {
  return (
    <Shell
      route="exercise-detail"
      title="운동 상세 화면 3안"
      description="기록 테이블과 AI 피드백을 어떤 밀도로 연결할지 비교하는 상세 구조입니다."
    >
      <DetailSection />
    </Shell>
  );
}

export function TodayWorkoutPlanningPage() {
  return (
    <Shell
      route="today-workout"
      title="오늘 운동 시작 플로우 3안"
      description="운동 시작 전 부위, 운동명, AI 보조, 운동 방식, 세트 기록으로 이어지는 흐름입니다."
    >
      <WorkoutFlowSection />
    </Shell>
  );
}
