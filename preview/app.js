const dashboardMetrics = [
  ["이번 주 운동", "4 / 5회"],
  ["총 운동 시간", "5h 32m"],
  ["총 볼륨", "12,450kg"],
  ["수행 점수", "85점"]
];

const quickActions = [
  ["운동 기록 시작", "세트 입력과 타이머를 바로 시작합니다."],
  ["AI 추천 확인", "다음 운동 세팅과 루틴 길이를 확인합니다."],
  ["방식별 분석", "5x5, Wendler, PPL 진행 상태를 분석합니다."],
  ["장비 인식", "사진으로 기구를 인식하고 가능한 운동을 제안합니다."]
];

const featuredPrograms = [
  ["오늘 추천", "상체 Push 루틴", "벤치프레스 중심 · 예상 68분 · 회복도 적합"],
  ["분석 기반", "Wendler 3주차 체크", "Training Max 재계산 후보 · AMRAP 성과 양호"],
  ["빠른 세션", "45분 압축 루틴", "시간 부족일용 자동 최적화 구성"]
];

const activityCards = [
  ["최근 기록", "벤치프레스 80kg", "5세트 x 5회 · RPE 8 · 지난주 대비 안정적"],
  ["커뮤니티", "친구 3명이 오늘 운동 완료", "김민수 데드 150kg · 이예진 스쿼트 120kg"],
  ["성취", "7일 연속 운동 달성", "이번 주 출석 streak 유지 중"],
  ["AI 피드백", "후반 세트 휴식 관리 필요", "보조 운동 볼륨 1세트 감축 추천"]
];

const todayRoutine = [
  ["벤치프레스", "5세트 x 5회", "80kg · 메인 리프트 유지"],
  ["인클라인 덤벨프레스", "4세트 x 8회", "30kg · 상부 자극 강화"],
  ["케이블 플라이", "3세트 x 12회", "수축 우선 · 볼륨 관리"]
];

const recentLogs = [
  ["2026.05.14 상체 Push", "총 볼륨 4,820kg · 수행 점수 85"],
  ["2026.05.12 하체 Pull", "총 볼륨 5,340kg · 수행 점수 82"],
  ["2026.05.10 어깨 + 팔", "총 볼륨 2,910kg · 수행 점수 88"]
];

const rankingItems = [
  ["1", "김민수", "데드리프트 150kg 달성"],
  ["2", "이예진", "스쿼트 120kg PR 갱신"],
  ["3", "박지훈", "7일 연속 운동 완료"]
];

const recentExercises = [
  "벤치프레스",
  "인클라인 벤치프레스",
  "덤벨 숄더프레스",
  "딥스",
  "케이블 플라이"
];

const setRows = [
  ["1", "80", "5", "7", "120초"],
  ["2", "80", "5", "7", "120초"],
  ["3", "80", "5", "8", "120초"],
  ["4", "80", "5", "8", "130초"],
  ["5", "82.5", "4", "8", "150초"]
];

const bodyParts = ["가슴", "등", "어깨", "팔", "하체", "복근", "전신"];
const programTypes = ["5x5", "Wendler", "PPL", "상체/하체", "자율 루틴"];

const STORAGE_KEY = "stronger-theme";

function routePath(name) {
  return name === "home" ? "/" : `/${name}`;
}

function detectRoute() {
  const fileName = window.location.pathname.split("/").pop() || "";
  const path = window.location.pathname;

  if (fileName === "login.html" || path === "/login") return "login";
  if (fileName === "dashboard.html" || path === "/dashboard") return "dashboard";
  if (fileName === "exercise-detail.html" || path === "/exercise-detail") {
    return "exercise-detail";
  }
  if (fileName === "today-workout.html" || path === "/today-workout") {
    return "today-workout";
  }
  return "home";
}

function getSavedTheme() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "light" ? "light" : "dark";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  window.localStorage.setItem(STORAGE_KEY, theme);
}

function themeToggle() {
  const theme = getSavedTheme();
  return `
    <div class="stronger-theme-toggle">
      <button type="button" data-theme-value="dark" class="stronger-theme-toggle__button ${theme === "dark" ? "stronger-theme-toggle__button--active" : ""}">다크</button>
      <button type="button" data-theme-value="light" class="stronger-theme-toggle__button ${theme === "light" ? "stronger-theme-toggle__button--active" : ""}">라이트</button>
    </div>
  `;
}

function topbar(authenticated = false) {
  return `
    <header class="stronger-clean-topbar">
      <a class="stronger-brand" href="${routePath("home")}">
        <span class="stronger-brand__mark">S</span>
        <span>
          <strong>STRONGER</strong>
          <small>AI Fitness Coach</small>
        </span>
      </a>
      <nav class="stronger-clean-nav">
        <a href="${routePath("dashboard")}">대시보드</a>
        <a href="${routePath("today-workout")}">오늘 운동</a>
        <a href="${routePath("exercise-detail")}">운동 상세</a>
        <a href="#insight">AI 분석</a>
      </nav>
      <div class="stronger-clean-topbar__actions">
        ${themeToggle()}
        ${
          authenticated
            ? `
              <div class="stronger-user-pill">
                <div class="stronger-avatar">홍</div>
                <div>
                  <strong>홍길동</strong>
                  <small>Lv.23</small>
                </div>
              </div>
            `
            : `<a href="${routePath("login")}" class="stronger-button stronger-button--ghost">로그인</a>`
        }
      </div>
    </header>
  `;
}

function sectionHeader(title, description, action = "") {
  return `
    <div class="stronger-section__header">
      <div>
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
      ${action}
    </div>
  `;
}

function panel(title, description, body, action = "", id = "") {
  return `
    <section class="stronger-panel stronger-panel--clean" ${id ? `id="${id}"` : ""}>
      ${sectionHeader(title, description, action)}
      ${body}
    </section>
  `;
}

function landingAside() {
  return `
    <div class="stronger-aside-stack">
      <section class="stronger-stat-card">
        ${sectionHeader("오늘의 AI 상태", "지금 바로 시작 가능한 추천 흐름")}
        <div class="stronger-score-summary">
          <div class="stronger-score-summary__ring">
            <strong>85</strong>
            <span>/100</span>
          </div>
          <div>
            <h3>운동 준비가 잘 되어 있습니다.</h3>
            <p>회복도와 최근 성공률 기준으로 상체 Push 세션이 가장 적합합니다.</p>
          </div>
        </div>
        <div class="stronger-mini-stats">
          <article><span>예상 시간</span><strong>68분</strong></article>
          <article><span>중량 변화</span><strong>+2.5kg</strong></article>
          <article><span>루틴 강도</span><strong>중간</strong></article>
          <article><span>추천 확신도</span><strong>높음</strong></article>
        </div>
      </section>
      <section class="stronger-stat-card">
        ${sectionHeader("지금 많이 하는 루틴", "최근 24시간 기준")}
        <div class="stronger-ranking-list">
          ${rankingItems
            .map(
              ([rank, name, meta]) => `
                <article class="stronger-ranking-item">
                  <div class="stronger-ranking-badge stronger-ranking-badge--${rank}">${rank}</div>
                  <div>
                    <strong>${name}</strong>
                    <p>${meta}</p>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    </div>
  `;
}

function landingPage() {
  return `
    <div class="stronger-page stronger-page--clean">
      <div class="stronger-container">
        ${topbar(false)}
        <section class="stronger-showcase">
          <div class="stronger-showcase__lead">
            <div class="stronger-showcase__visual">
              <div class="stronger-showcase__overlay">
                <p class="stronger-eyebrow">AI Strength Platform</p>
                <h1>기록이 성장을 만든다.</h1>
                <p class="stronger-copy">운동 기록, 다음 세트 추천, 수행 평가, 소셜 동기부여를 하나의 제품 흐름으로 묶은 근력운동 서비스입니다.</p>
                <div class="stronger-search-surface">
                  <span>오늘 어떤 운동을 기록할까요?</span>
                  <a href="${routePath("today-workout")}" class="stronger-button stronger-button--primary">빠른 시작</a>
                </div>
              </div>
            </div>
            <div class="stronger-action-grid">
              ${quickActions
                .map(
                  ([title, detail]) => `
                    <article class="stronger-action-card">
                      <strong>${title}</strong>
                      <p>${detail}</p>
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>
          ${landingAside()}
        </section>

        <section class="stronger-section">
          ${sectionHeader("추천 프로그램", "기록과 회복도 기준으로 오늘 우선순위가 높은 화면입니다.", `<a href="${routePath("dashboard")}">대시보드 보기</a>`)}
          <div class="stronger-media-grid stronger-media-grid--triple">
            ${featuredPrograms
              .map(
                ([badge, title, detail], index) => `
                  <article class="stronger-media-card">
                    <div class="stronger-media-card__visual stronger-media-card__visual--${index + 1}"></div>
                    <div class="stronger-media-card__body">
                      <span>${badge}</span>
                      <strong>${title}</strong>
                      <p>${detail}</p>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>

        <section class="stronger-section">
          ${sectionHeader("최근 플랫폼 흐름", "운동 기록, 커뮤니티, 성취 시스템이 어떤 식으로 연결되는지 보여줍니다.")}
          <div class="stronger-media-grid stronger-media-grid--quad">
            ${activityCards
              .map(
                ([badge, title, detail], index) => `
                  <article class="stronger-media-card stronger-media-card--compact">
                    <div class="stronger-media-card__visual stronger-media-card__visual--feed-${index + 1}"></div>
                    <div class="stronger-media-card__body">
                      <span>${badge}</span>
                      <strong>${title}</strong>
                      <p>${detail}</p>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      </div>
    </div>
  `;
}

function loginPage() {
  return `
    <div class="stronger-page stronger-page--clean">
      <div class="stronger-container">
        ${topbar(false)}
        <section class="stronger-login-clean">
          <div class="stronger-login-clean__visual">
            <p class="stronger-eyebrow">Member Access</p>
            <h1>오늘 운동을 이어가볼까요?</h1>
            <p class="stronger-copy">로그인 후 대시보드, 추천 루틴, 분석 결과, 친구 활동을 한 번에 이어서 확인할 수 있습니다.</p>
            <div class="stronger-mini-stats">
              <article><span>가입 사용자</span><strong>250K+</strong></article>
              <article><span>누적 운동 기록</span><strong>1.2M+</strong></article>
              <article><span>추천 수용률</span><strong>98%</strong></article>
              <article><span>평균 세션</span><strong>62분</strong></article>
            </div>
          </div>
          <div class="stronger-login-clean__form">
            <div class="stronger-login-card__tabs">
              <span class="active">로그인</span>
              <span>회원가입</span>
            </div>
            <label class="stronger-field">
              <span>이메일</span>
              <input type="email" placeholder="you@stronger.app" />
            </label>
            <label class="stronger-field">
              <span>비밀번호</span>
              <input type="password" placeholder="비밀번호를 입력하세요" />
            </label>
            <div class="stronger-inline-row">
              <label class="stronger-check"><input type="checkbox" /><span>로그인 상태 유지</span></label>
              <button type="button" class="stronger-link-button">비밀번호 찾기</button>
            </div>
            <button type="button" class="stronger-button stronger-button--primary stronger-button--full">로그인</button>
            <div class="stronger-divider">또는</div>
            <div class="stronger-social-grid">
              <button type="button" class="stronger-social-button">Google</button>
              <button type="button" class="stronger-social-button">Apple</button>
              <button type="button" class="stronger-social-button">Kakao</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function dashboardPage() {
  return `
    <div class="stronger-page stronger-page--clean">
      <div class="stronger-container">
        ${topbar(true)}
        <section class="stronger-dashboard-hero">
          <div class="stronger-dashboard-hero__main">
            <p class="stronger-eyebrow">Dashboard</p>
            <h1>오늘 성장 포인트가 정리되어 있습니다.</h1>
            <p class="stronger-copy">오늘 운동, AI 요약, 최근 기록, 커뮤니티 흐름을 한 화면에서 읽을 수 있도록 정리했습니다.</p>
            <div class="stronger-metric-inline">
              ${dashboardMetrics
                .map(
                  ([label, value]) => `
                    <article><span>${label}</span><strong>${value}</strong></article>
                  `
                )
                .join("")}
            </div>
          </div>
          <aside class="stronger-dashboard-hero__aside">
            <span class="stronger-panel-tag">오늘의 추천</span>
            <strong>상체 Push 루틴</strong>
            <p>벤치프레스 중심 구성 · 예상 68분 · 중량 소폭 상향 가능</p>
            <a href="${routePath("today-workout")}" class="stronger-button stronger-button--primary">운동 시작</a>
          </aside>
        </section>
        <section class="stronger-main-layout">
          <div class="stronger-content-stack">
            ${panel(
              "오늘 추천 루틴",
              "지금 바로 시작 가능한 루틴과 AI 추천 근거입니다.",
              `
                <div class="stronger-media-grid stronger-media-grid--triple">
                  ${featuredPrograms
                    .map(
                      ([badge, title, detail], index) => `
                        <article class="stronger-media-card">
                          <div class="stronger-media-card__visual stronger-media-card__visual--${index + 1}"></div>
                          <div class="stronger-media-card__body">
                            <span>${badge}</span>
                            <strong>${title}</strong>
                            <p>${detail}</p>
                          </div>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              `,
              `<a href="${routePath("today-workout")}">전체 보기</a>`
            )}
            ${panel(
              "최근 운동 기록",
              "최근 세션 핵심만 빠르게 읽는 요약형 로그입니다.",
              `
                <div class="stronger-insight-list">
                  ${recentLogs
                    .map(
                      ([label, detail]) => `
                        <article class="stronger-insight-row">
                          <strong>${label}</strong>
                          <p>${detail}</p>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              `,
              `<a href="${routePath("exercise-detail")}">운동 상세</a>`
            )}
            ${panel(
              "오늘 세트 추천",
              "AI가 제안한 현재 세션의 핵심 종목 구성입니다.",
              `
                <div class="stronger-table-card">
                  ${todayRoutine
                    .map(
                      ([name, summary, meta]) => `
                        <article class="stronger-simple-table__row">
                          <div>
                            <strong>${name}</strong>
                            <p>${summary}</p>
                          </div>
                          <span>${meta}</span>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              `
            )}
          </div>
          <div class="stronger-aside-stack" id="insight">
            <section class="stronger-stat-card">
              ${sectionHeader("AI 코치 요약", "지난 세션 기준 수행 분석")}
              <div class="stronger-score-summary">
                <div class="stronger-score-summary__ring"><strong>85</strong><span>/100</span></div>
                <div>
                  <h3>전반적으로 안정적입니다.</h3>
                  <p>메인 리프트는 유지 후 상향 가능, 후반 보조 볼륨은 1세트 감축이 좋습니다.</p>
                </div>
              </div>
            </section>
            <section class="stronger-stat-card">
              ${sectionHeader("이번 주 집중 부위", "볼륨과 회복도 기준")}
              <div class="stronger-mini-stats">
                <article><span>가슴</span><strong>적정</strong></article>
                <article><span>하체</span><strong>높음</strong></article>
                <article><span>어깨</span><strong>보통</strong></article>
                <article><span>복근</span><strong>낮음</strong></article>
              </div>
            </section>
            <section class="stronger-stat-card">
              ${sectionHeader("친구 활동", "최근 성취 기준")}
              <div class="stronger-ranking-list">
                ${rankingItems
                  .map(
                    ([rank, name, meta]) => `
                      <article class="stronger-ranking-item">
                        <div class="stronger-ranking-badge stronger-ranking-badge--${rank}">${rank}</div>
                        <div>
                          <strong>${name}</strong>
                          <p>${meta}</p>
                        </div>
                      </article>
                    `
                  )
                  .join("")}
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  `;
}

function exerciseDetailPage() {
  return `
    <div class="stronger-page stronger-page--clean">
      <div class="stronger-container">
        ${topbar(true)}
        <section class="stronger-detail-hero">
          <p class="stronger-eyebrow">Exercise Detail</p>
          <h1>운동 기록과 AI 피드백을 함께 확인합니다.</h1>
          <p class="stronger-copy">세트 기록, 실패 지점, 휴식 시간, 다음 세션 추천을 하나의 작업 흐름으로 묶은 상세 화면입니다.</p>
        </section>
        <section class="stronger-detail-layout">
          <div class="stronger-detail-main">
            ${panel(
              "운동 목록",
              "최근 상체 Push 세션 기준",
              `
                <div class="stronger-chip-list">
                  ${recentExercises
                    .map(
                      (exercise, index) => `
                        <div class="stronger-chip ${index === 0 ? "stronger-chip--active" : ""}">
                          ${exercise}
                        </div>
                      `
                    )
                    .join("")}
                </div>
              `
            )}
            ${panel(
              "벤치프레스 세트 기록",
              "2026.05.14 · 오전 10:30 · 총 5세트",
              `
                <div class="stronger-set-table">
                  <div class="stronger-set-table__head">
                    <span>세트</span><span>중량</span><span>반복</span><span>RPE</span><span>휴식</span>
                  </div>
                  ${setRows
                    .map(
                      (row) => `
                        <div class="stronger-set-table__row">
                          ${row.map((cell) => `<span>${cell}</span>`).join("")}
                        </div>
                      `
                    )
                    .join("")}
                </div>
              `
            )}
          </div>
          <div class="stronger-aside-stack">
            <section class="stronger-stat-card">
              ${sectionHeader("AI 분석", "수행 품질 요약")}
              <div class="stronger-note-stack">
                <article class="stronger-note-card"><strong>잘한 점</strong><p>초반 세트 품질이 안정적이고 과부하 상승 흐름이 좋습니다.</p></article>
                <article class="stronger-note-card"><strong>주의할 점</strong><p>4세트 이후 휴식 시간이 늘어나 피로 누적이 보입니다.</p></article>
              </div>
            </section>
            <section class="stronger-stat-card">
              ${sectionHeader("다음 운동 추천", "다음 세션 기준")}
              <div class="stronger-insight-list">
                <article class="stronger-insight-row"><strong>벤치프레스 82.5kg</strong><p>5세트 x 5회 · 메인 리프트 상향</p></article>
                <article class="stronger-insight-row"><strong>인클라인 덤벨프레스 30kg</strong><p>4세트 x 8회 · 현재 볼륨 유지</p></article>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  `;
}

function todayWorkoutPage() {
  return `
    <div class="stronger-page stronger-page--clean">
      <div class="stronger-container">
        ${topbar(true)}
        <section class="stronger-detail-hero">
          <p class="stronger-eyebrow">Workout Session</p>
          <h1>오늘 운동 세션을 시작합니다.</h1>
          <p class="stronger-copy">선택 단계는 단순하게, 보조 정보는 오른쪽에 정리해서 실제 사용 흐름에 집중할 수 있도록 구성했습니다.</p>
        </section>
        <section class="stronger-session-layout">
          <div class="stronger-session-main">
            ${panel(
              "운동 구성 선택",
              "부위 선택부터 운동 방식까지 한 흐름으로 이어집니다.",
              `
                <div class="stronger-step-pills">
                  ${["운동 부위", "운동 이름", "AI 보조", "운동 방식", "세트 준비"]
                    .map(
                      (step, index) => `
                        <div class="stronger-step-pill ${index === 0 ? "stronger-step-pill--active" : ""}">${step}</div>
                      `
                    )
                    .join("")}
                </div>
                <div class="stronger-session-stage">
                  ${sectionHeader("1. 오늘 운동 부위 선택", "지금 집중할 부위를 먼저 선택하세요.")}
                  <div class="stronger-option-matrix">
                    ${bodyParts
                      .map(
                        (part, index) => `
                          <button type="button" class="stronger-option-card ${index === 0 ? "stronger-option-card--active" : ""}">${part}</button>
                        `
                      )
                      .join("")}
                  </div>
                </div>
                <div class="stronger-session-stage">
                  ${sectionHeader("2. 운동 방식 선택", "오늘 세션 운영 방식을 선택하세요.")}
                  <div class="stronger-program-grid">
                    ${programTypes
                      .map(
                        (program, index) => `
                          <button type="button" class="stronger-program-card ${index === 0 ? "stronger-program-card--active" : ""}">${program}</button>
                        `
                      )
                      .join("")}
                  </div>
                </div>
              `
            )}
          </div>
          <div class="stronger-aside-stack">
            <section class="stronger-stat-card">
              ${sectionHeader("오늘 세션 요약", "현재 선택 기준")}
              <div class="stronger-summary-card">
                <strong>상체 Push</strong>
                <p>예상 68분 · 메인 리프트 벤치프레스 · 회복도 적합</p>
              </div>
            </section>
            <section class="stronger-stat-card">
              ${sectionHeader("AI 보조 옵션", "필요 시 추가 사용")}
              <div class="stronger-insight-list">
                <article class="stronger-insight-row"><strong>운동기구 인식</strong><p>헬스장 사진 업로드로 가능한 운동 추천</p></article>
                <article class="stronger-insight-row"><strong>시간 기반 압축</strong><p>45분 이하로 세션 자동 최적화</p></article>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  `;
}

function render() {
  setTheme(getSavedTheme());
  const route = detectRoute();
  const root = document.getElementById("root");
  const pageMap = {
    home: landingPage,
    login: loginPage,
    dashboard: dashboardPage,
    "exercise-detail": exerciseDetailPage,
    "today-workout": todayWorkoutPage
  };
  root.innerHTML = pageMap[route]();
  document.querySelectorAll("[data-theme-value]").forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(button.getAttribute("data-theme-value"));
      render();
    });
  });
}

render();
