"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BodyPartIcon } from "@/components/body-part-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Viewer } from "@/lib/viewer";
import type { CardioLoadSummary } from "@/lib/strava/types";

const APP_NAME = "R-FORCE";
const APP_TAGLINE = "AI Training System";

type GoalKey = "strength" | "muscle" | "diet" | "health";
type DurationKey = "under30" | "30to60" | "60to90" | "over90";

type GoalOption = {
  key: GoalKey;
  title: string;
  description: string;
};

type DurationOption = {
  key: DurationKey;
  title: string;
  label: string;
};

const metricCards = [
  { label: "이번 주 운동", value: "4 / 5회" },
  { label: "총 운동 시간", value: "5h 32m" },
  { label: "총 볼륨", value: "12,450 kg" },
  { label: "총 칼로리", value: "3,250 kcal" }
];

const recentWorkouts = [
  { name: "벤치프레스", detail: "80kg / 5세트", time: "2시간 전" },
  { name: "데드리프트", detail: "120kg / 5세트", time: "1일 전" },
  { name: "스쿼트", detail: "100kg / 5세트", time: "2일 전" }
];

const activityFeed = [
  { user: "김민수", detail: "데드리프트 150kg 달성", time: "방금 전" },
  { user: "이예진", detail: "스쿼트 120kg PR 갱신", time: "15분 전" },
  { user: "박재현", detail: "7일 연속 운동 완료", time: "1시간 전" }
];

const bodyParts = ["가슴", "등", "어깨", "이두", "삼두", "하체", "복근", "전신", "유산소"] as const;
type BodyPart = (typeof bodyParts)[number];

const goals: GoalOption[] = [
  { key: "strength", title: "근력 향상", description: "중량 상승과 기록 갱신에 집중" },
  { key: "muscle", title: "근육 성장", description: "볼륨과 자극 중심 루틴 추천" },
  { key: "diet", title: "체지방 감소", description: "운동 밀도와 소비 칼로리 강화" },
  { key: "health", title: "건강 유지", description: "무리 없는 균형 루틴 구성" }
];

const durations: DurationOption[] = [
  { key: "under30", title: "30분 이하", label: "약 25분" },
  { key: "30to60", title: "30 - 60분", label: "약 45분" },
  { key: "60to90", title: "60 - 90분", label: "약 75분" },
  { key: "over90", title: "90분 이상", label: "약 95분" }
];

const todayRoutine = [
  { name: "벤치프레스 5x5", note: "80kg" },
  { name: "인클라인 덤벨프레스 4x8", note: "26kg" },
  { name: "딥스 3x10", note: "체중" }
];

const exerciseCatalog = [
  { name: "벤치프레스", en: "Barbell Bench Press", tags: ["가슴", "바벨"] },
  { name: "인클라인 벤치프레스", en: "Incline Bench Press", tags: ["가슴", "상부"] },
  { name: "덤벨 벤치프레스", en: "Dumbbell Bench Press", tags: ["가슴", "덤벨"] },
  { name: "체스트 프레스 머신", en: "Chest Press Machine", tags: ["가슴", "머신"] }
];

const sessionSets = [
  { set: "1", weight: "80", reps: "5", rpe: "7", rest: "120초" },
  { set: "2", weight: "80", reps: "5", rpe: "7", rest: "120초" },
  { set: "3", weight: "80", reps: "5", rpe: "8", rest: "120초" },
  { set: "4", weight: "82.5", reps: "5", rpe: "8", rest: "130초" }
];

function isEmailConfirmationError(message: string) {
  const normalized = message.trim().toLowerCase();
  return normalized.includes("email not confirmed") || normalized.includes("email_not_confirmed");
}

function getFriendlyAuthErrorMessage(message: string) {
  if (isEmailConfirmationError(message)) {
    return "이메일 인증이 아직 완료되지 않았어요. 가입할 때 받은 인증 메일을 확인한 뒤 다시 로그인해주세요.";
  }

  return message;
}

function getSeoulDateKey() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul"
  }).format(new Date());
}

function getRoutinePreview(parts: string[], goal: GoalKey, duration: DurationKey) {
  const partLabel = parts.join(" · ");
  const durationOption = durations.find((item) => item.key === duration) ?? durations[1];
  const goalOption = goals.find((item) => item.key === goal) ?? goals[1];

  const routineItems =
    goal === "strength"
      ? ["벤치프레스", "오버헤드프레스", "딥스"]
      : goal === "muscle"
        ? ["벤치프레스", "인클라인 덤벨프레스", "케이블 푸시다운"]
        : goal === "diet"
          ? ["서킷 벤치프레스", "푸시업", "로잉 머신 인터벌"]
          : ["벤치프레스", "랫풀다운", "레그프레스"];

  return {
    goalTitle: goalOption.title,
    durationLabel: durationOption.label,
    partLabel,
    routineItems
  };
}

function AppShell({
  children,
  viewer = null,
  showTopbar = true
}: {
  children: ReactNode;
  viewer?: null | Viewer;
  showTopbar?: boolean;
}) {
  return (
    <div className="pf-page">
      <div className="pf-container">
        {showTopbar ? (viewer ? <AuthenticatedTopbar viewer={viewer} /> : <Topbar />) : null}
        {children}
      </div>
    </div>
  );
}

type DashboardCardioResponse = {
  configured: boolean;
  connected: boolean;
  error?: string;
  summary: CardioLoadSummary | null;
};

function getCardioTypeLabel(activity: CardioLoadSummary["activities"][number]) {
  const source = activity.sport_type ?? activity.type ?? "Workout";

  if (source === "Run") return "러닝";
  if (source === "Ride") return "사이클";
  if (source === "Walk") return "걷기";
  if (source === "Hike") return "하이킹";

  return source;
}

function LogoutButton() {
  return (
    <form action="/auth/signout" method="post">
      <button type="submit" className="pf-button pf-button--ghost">
        로그아웃
      </button>
    </form>
  );
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "pf-brand-logo pf-brand-logo--compact" : "pf-brand-logo"}>
      <Image
        src="/brand/r-force-light.png"
        alt="R-FORCE"
        width={216}
        height={216}
        className="pf-brand-logo__image pf-brand-logo__image--light"
        priority
      />
      <Image
        src="/brand/r-force-dark.png"
        alt="R-FORCE"
        width={216}
        height={216}
        className="pf-brand-logo__image pf-brand-logo__image--dark"
        priority
      />
    </span>
  );
}

function AuthenticatedTopbar({ viewer }: { viewer: Viewer }) {
  return (
    <header className="pf-topbar">
      <Link href="/" className="pf-brand">
        <BrandLogo />
      </Link>

      <nav className="pf-topnav">
        <Link href="/dashboard">대시보드</Link>
        <Link href="/today-workout">운동 기록</Link>
        <Link href="/exercise-detail">운동 상세</Link>
      </nav>

      <div className="pf-topbar__actions">
        <ThemeToggle />
        <div className="pf-user-pill">
          <span className="pf-user-pill__avatar">{viewer.initials}</span>
          <div>
            <strong>{viewer.displayName}</strong>
            <small>{viewer.email}</small>
          </div>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

function Topbar({ loggedIn = false }: { loggedIn?: boolean }) {
  return (
    <header className="pf-topbar">
      <Link href="/" className="pf-brand">
        <BrandLogo />
      </Link>

      <nav className="pf-topnav">
        <Link href="/dashboard">대시보드</Link>
        <Link href="/today-workout">운동 기록</Link>
        <Link href="/exercise-detail">운동 상세</Link>
      </nav>

      <div className="pf-topbar__actions">
        <ThemeToggle />
        {loggedIn ? (
          <div className="pf-user-pill">
            <span className="pf-user-pill__avatar">HJ</span>
            <div>
              <strong>홍길동</strong>
              <small>Lv.23</small>
            </div>
          </div>
        ) : (
          <Link href="/login" className="pf-button pf-button--ghost">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

function Sidebar() {
  const items = [
    { label: "대시보드", href: "/dashboard" },
    { label: "운동 기록", href: "/today-workout" },
    { label: "루틴", href: "#" },
    { label: "분석", href: "/exercise-detail" },
    { label: "AI 추천", href: "#" },
    { label: "커뮤니티", href: "#" },
    { label: "챌린지", href: "#" },
    { label: "설정", href: "#" }
  ];

  return (
    <aside className="pf-sidebar">
      <Link href="/dashboard" className="pf-sidebar__brand">
        <BrandLogo compact />
      </Link>

      <nav className="pf-sidebar__nav">
        {items.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={index === 0 ? "pf-sidebar__link pf-sidebar__link--active" : "pf-sidebar__link"}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pf-sidebar__profile">
        <span className="pf-user-pill__avatar">HJ</span>
        <div>
          <strong>홍길동</strong>
          <small>Lv.23</small>
        </div>
      </div>
    </aside>
  );
}

function AuthenticatedSidebar({ viewer }: { viewer: Viewer }) {
  const items = [
    { label: "대시보드", href: "/dashboard" },
    { label: "운동 기록", href: "/today-workout" },
    { label: "루틴", href: "#" },
    { label: "분석", href: "/exercise-detail" },
    { label: "AI 추천", href: "#" },
    { label: "커뮤니티", href: "#" },
    { label: "챌린지", href: "#" },
    { label: "설정", href: "#" }
  ];

  return (
    <aside className="pf-sidebar">
      <Link href="/dashboard" className="pf-sidebar__brand">
        <BrandLogo compact />
      </Link>

      <nav className="pf-sidebar__nav">
        {items.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={index === 0 ? "pf-sidebar__link pf-sidebar__link--active" : "pf-sidebar__link"}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pf-sidebar__profile">
        <span className="pf-user-pill__avatar">{viewer.initials}</span>
        <div>
          <strong>{viewer.displayName}</strong>
          <small>{viewer.email}</small>
        </div>
      </div>
    </aside>
  );
}

function DashboardLayout({
  children,
  viewer = null
}: {
  children: ReactNode;
  viewer?: null | Viewer;
}) {
  return (
    <div className="pf-dashboard-shell">
      {viewer ? <AuthenticatedSidebar viewer={viewer} /> : <Sidebar />}
      <div className="pf-dashboard-main">{children}</div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  children
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="pf-card">
      <div className="pf-card__header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ProgressRing() {
  return (
    <div className="pf-progress">
      <div className="pf-progress__ring">
        <div className="pf-progress__inner">
          <strong>85</strong>
          <small>/ 100</small>
        </div>
      </div>
      <div className="pf-progress__copy">
        <strong>잘했어요</strong>
        <p>지난 세션보다 볼륨이 12% 상승했습니다. 다음 벤치프레스는 82.5kg를 추천합니다.</p>
      </div>
    </div>
  );
}

function MiniLineChart() {
  return (
    <div className="pf-chart">
      <svg viewBox="0 0 320 120" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          fill="none"
          stroke="var(--pf-accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="10,90 70,68 130,72 190,54 250,56 310,28"
        />
      </svg>
      <div className="pf-chart__axis">
        <span>5/07</span>
        <span>5/09</span>
        <span>5/11</span>
        <span>5/13</span>
      </div>
    </div>
  );
}

function BodyPartChoiceCard({
  active = false,
  label,
  onClick
}: {
  active?: boolean;
  label: BodyPart;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? "pf-choice-card pf-choice-card--body-part pf-choice-card--active" : "pf-choice-card pf-choice-card--body-part"}
      onClick={onClick}
    >
      <span className="pf-choice-card__icon" aria-hidden="true">
        <BodyPartIcon name={label} />
      </span>
      <strong>{label}</strong>
    </button>
  );
}

function DashboardWizard({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>(["가슴", "어깨", "삼두"]);
  const [selectedGoal, setSelectedGoal] = useState<GoalKey>("muscle");
  const [selectedDuration, setSelectedDuration] = useState<DurationKey>("30to60");

  const preview = useMemo(
    () => getRoutinePreview(selectedParts, selectedGoal, selectedDuration),
    [selectedDuration, selectedGoal, selectedParts]
  );

  function toggleBodyPart(part: BodyPart) {
    setSelectedParts((current) => {
      if (current.includes(part)) {
        if (current.length === 1) return current;
        return current.filter((item) => item !== part);
      }

      if (current.length >= 3) {
        return [...current.slice(1), part];
      }

      return [...current, part];
    });
  }

  function handleNext() {
    setStep((current) => Math.min(current + 1, 5));
  }

  function handlePrev() {
    setStep((current) => Math.max(current - 1, 1));
  }

  function handleStart() {
    onClose();
    router.push("/today-workout");
  }

  if (!open) return null;

  return (
    <div className="pf-modal" role="dialog" aria-modal="true" aria-labelledby="daily-planning-title">
      <div className="pf-modal__backdrop" onClick={onClose} />
      <div className="pf-modal__panel">
        <button type="button" className="pf-modal__close" onClick={onClose} aria-label="팝업 닫기">
          ×
        </button>

        <div className="pf-modal__progress">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={index + 1 <= step ? "pf-modal__step pf-modal__step--active" : "pf-modal__step"}
            >
              {index + 1}
            </span>
          ))}
        </div>

        {step === 1 ? (
          <div className="pf-wizard pf-wizard--welcome">
            <div className="pf-spotlight">
              <p className="pf-kicker">오늘 첫 로그인</p>
              <h2 id="daily-planning-title">오늘 운동을 시작하기 전에 계획부터 맞춰볼까요?</h2>
              <p>
                부위, 목표, 시간만 정하면 {APP_NAME}가 최근 수행 기록과 패턴을 바탕으로 오늘 루틴을
                추천해드립니다.
              </p>
            </div>

            <div className="pf-wizard__visual">
              <div className="pf-hero-silhouette" />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="pf-wizard">
            <div className="pf-modal__title">
              <p className="pf-kicker">운동 부위 선택</p>
              <h2>어떤 부위를 운동할 예정인가요?</h2>
              <p>최대 3개까지 선택해 추천 루틴 정확도를 높일 수 있습니다.</p>
            </div>

            <div className="pf-split-choice">
              <BodyFigure parts={selectedParts} />
              <div className="pf-choice-grid pf-choice-grid--compact">
                {bodyParts.map((part) => {
                  const active = selectedParts.includes(part);

                  return (
                    <BodyPartChoiceCard
                      key={part}
                      label={part}
                      active={active}
                      onClick={() => toggleBodyPart(part)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="pf-wizard">
            <div className="pf-modal__title">
              <p className="pf-kicker">운동 목표 선택</p>
              <h2>오늘의 운동 목표는 무엇인가요?</h2>
              <p>목표에 따라 중량, 세트 수, 보조 운동 비율을 조정합니다.</p>
            </div>

            <div className="pf-choice-grid">
              {goals.map((goal) => (
                <button
                  key={goal.key}
                  type="button"
                  className={
                    selectedGoal === goal.key
                      ? "pf-choice-card pf-choice-card--active"
                      : "pf-choice-card"
                  }
                  onClick={() => setSelectedGoal(goal.key)}
                >
                  <strong>{goal.title}</strong>
                  <span>{goal.description}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="pf-wizard">
            <div className="pf-modal__title">
              <p className="pf-kicker">운동 시간 선택</p>
              <h2>오늘 확보 가능한 운동 시간은 얼마인가요?</h2>
              <p>시간에 맞춰 메인 운동과 보조 운동 수를 자동 최적화합니다.</p>
            </div>

            <div className="pf-choice-grid">
              {durations.map((duration) => (
                <button
                  key={duration.key}
                  type="button"
                  className={
                    selectedDuration === duration.key
                      ? "pf-choice-card pf-choice-card--active"
                      : "pf-choice-card"
                  }
                  onClick={() => setSelectedDuration(duration.key)}
                >
                  <strong>{duration.title}</strong>
                  <span>{duration.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 5 ? (
          <div className="pf-wizard">
            <div className="pf-modal__title">
              <p className="pf-kicker">추천 루틴 미리보기</p>
              <h2>오늘 루틴이 준비되었습니다</h2>
              <p>선택한 조건과 최근 기록을 바탕으로 생성한 추천 루틴입니다.</p>
            </div>

            <div className="pf-preview-panel">
              <div className="pf-preview-meta">
                <div>
                  <span>예상 운동 시간</span>
                  <strong>{preview.durationLabel}</strong>
                </div>
                <div>
                  <span>추천 부위</span>
                  <strong>{preview.partLabel}</strong>
                </div>
                <div>
                  <span>운동 목표</span>
                  <strong>{preview.goalTitle}</strong>
                </div>
              </div>

              <div className="pf-preview-list">
                {preview.routineItems.map((item, index) => (
                  <div key={item} className="pf-preview-list__item">
                    <span>{index + 1}</span>
                    <div>
                      <strong>{item}</strong>
                      <small>{index === 0 ? "4세트" : "3세트"}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="pf-modal__footer">
          {step > 1 ? (
            <button type="button" className="pf-button pf-button--secondary" onClick={handlePrev}>
              이전
            </button>
          ) : (
            <button type="button" className="pf-button pf-button--secondary" onClick={onClose}>
              건너뛰기
            </button>
          )}

          {step < 5 ? (
            <button type="button" className="pf-button pf-button--primary" onClick={handleNext}>
              다음
            </button>
          ) : (
            <button type="button" className="pf-button pf-button--primary" onClick={handleStart}>
              루틴 시작하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LandingPage({ viewer = null }: { viewer?: null | Viewer }) {
  const [wizardOpen, setWizardOpen] = useState(false);

  function handleOpenWizard() {
    setWizardOpen(true);
  }

  function handleCloseWizard() {
    const today = getSeoulDateKey();
    const storageKey = `repforge-daily-wizard:${today}`;
    window.localStorage.setItem(storageKey, "done");
    setWizardOpen(false);
  }

  return (
    <AppShell viewer={viewer}>
      <section className="pf-hero">
        <div className="pf-hero__copy">
          <p className="pf-kicker">{APP_TAGLINE}</p>
          <h1>운동 기록이 쌓일수록, 다음 루틴은 더 정교해집니다.</h1>
          <p className="pf-lead">
            {APP_NAME}는 운동 기록, 다음 세트 추천, 루틴 최적화, 수행 분석을 하나의 흐름으로 연결해 더
            정확한 근력운동 루틴을 만들어주는 AI 트레이닝 플랫폼입니다.
          </p>

          <div className="pf-hero__actions">
            <Link href="/dashboard" className="pf-button pf-button--primary">
              대시보드 보기
            </Link>
            <Link href="/login" className="pf-button pf-button--secondary">
              로그인 화면 보기
            </Link>
          </div>

          <div className="pf-kpi-strip">
            <div>
              <strong>250K+</strong>
              <span>저장 가능한 운동 세션</span>
            </div>
            <div>
              <strong>1.2M+</strong>
              <span>누적 세트 로그 기준 설계</span>
            </div>
            <div>
              <strong>98%</strong>
              <span>추천 수락률 목표 지표</span>
            </div>
          </div>
        </div>

        <div className="pf-hero__panel">
          <div className="pf-showcase-card pf-showcase-card--primary">
            <div className="pf-showcase-card__header">
              <strong>오늘의 추천 루틴</strong>
              <span>45분</span>
            </div>
            <div className="pf-routine-summary">
              <div>
                <span>추천 부위</span>
                <strong>가슴 · 어깨 · 삼두</strong>
              </div>
              <div>
                <span>루틴 성격</span>
                <strong>상체 집중 · 근비대</strong>
              </div>
            </div>
            <div className="pf-body-figure__labels pf-body-figure__labels--left">
              {["가슴", "어깨", "삼두"].map((part) => (
                <span key={part}>{part}</span>
              ))}
            </div>
            <ul className="pf-showcase-list">
              {todayRoutine.map((item) => (
                <li key={item.name}>
                  <strong>{item.name}</strong>
                  <span>{item.note}</span>
                </li>
              ))}
            </ul>

            <div className="pf-showcase-card__actions">
              <button type="button" className="pf-button pf-button--primary pf-button--block" onClick={handleOpenWizard}>
                오늘 루틴 다시 고르기
              </button>
            </div>
          </div>

          <div className="pf-showcase-grid">
            <div className="pf-showcase-card">
              <strong>AI 추천 요약</strong>
              <p>최근 3회 벤치프레스 수행 패턴을 바탕으로 82.5kg 4세트를 추천합니다.</p>
            </div>
            <div className="pf-showcase-card">
              <strong>루틴 최적화</strong>
              <p>운동 가능 시간과 부위 선택에 맞춰 세트 수와 보조 운동을 자동 조정합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <DashboardWizard open={wizardOpen} onClose={handleCloseWizard} />
    </AppShell>
  );
}

export function LoginScreenPage({
  nextPath = "/dashboard",
  authError = null,
  initialMode = "login",
  viewer = null
}: {
  nextPath?: string;
  authError?: null | string;
  initialMode?: "login" | "recovery";
  viewer?: null | Viewer;
}) {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot" | "recovery">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  function switchAuthMode(mode: "login" | "signup" | "forgot" | "recovery") {
    setAuthMode(mode);
    setError(null);
    setNotice(null);
    setNeedsEmailConfirmation(false);
    setPassword("");
    setConfirmPassword("");
  }

  async function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    setNeedsEmailConfirmation(false);

    try {
      const supabase = createSupabaseBrowserClient({ persistent: rememberMe });
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(getFriendlyAuthErrorMessage(error.message));
        setNeedsEmailConfirmation(isEmailConfirmationError(error.message));
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendConfirmation() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("인증 메일을 다시 보내려면 먼저 가입한 이메일 주소를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: trimmedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      setNotice("인증 메일을 다시 보냈어요. 받은편지함과 스팸함을 확인한 뒤, 메일 안의 버튼으로 인증을 완료해주세요.");
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "인증 메일 재발송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordResetRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    setNeedsEmailConfirmation(false);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?mode=recovery&next=${encodeURIComponent(nextPath)}`
      });

      if (error) {
        setError(error.message);
        return;
      }

      setNotice("비밀번호 재설정 메일을 보냈습니다. 메일의 링크를 열어 새 비밀번호를 설정해주세요.");
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "비밀번호 재설정 메일 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRecoveryUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    setNeedsEmailConfirmation(false);

    if (password.length < 8) {
      setError("비밀번호는 8자 이상으로 입력해주세요.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) {
        setError(error.message);
        return;
      }

      await supabase.auth.signOut();
      setNotice("비밀번호가 변경되었습니다. 새 비밀번호로 다시 로그인해주세요.");
      setPassword("");
      setConfirmPassword("");
      setAuthMode("login");
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
      router.refresh();
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "비밀번호 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    setNeedsEmailConfirmation(false);

    if (password.length < 8) {
      setError("비밀번호는 8자 이상으로 입력해주세요.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        router.push(nextPath);
        router.refresh();
        return;
      }

      setNotice("회원가입이 완료되었어요. 받은편지함에서 인증 메일을 확인한 뒤 로그인해주세요.");
      setPassword("");
      setConfirmPassword("");
      setAuthMode("login");
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider: "google" | "apple" | "kakao") {
    setLoading(true);
    setError(null);
    setNotice(null);
    setNeedsEmailConfirmation(false);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
        }
      });

      if (error) {
        setError(error.message);
      }
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "소셜 로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell viewer={viewer} showTopbar={false}>
      <section className="pf-login pf-login--solo">
        <div className="pf-login-card pf-login-card--solo">
          <div className="pf-login-card__header">
            <div>
              <p className="pf-kicker">{APP_NAME}</p>
              <h1 className="pf-login-card__title">
                {authMode === "signup"
                  ? "회원가입"
                  : authMode === "forgot"
                    ? "비밀번호 찾기"
                    : authMode === "recovery"
                      ? "새 비밀번호 설정"
                      : "로그인"}
              </h1>
            </div>
            <ThemeToggle />
          </div>

          <div className="pf-tab-row">
            <button
              type="button"
              className={
                authMode === "login" ? "pf-tab-row__item pf-tab-row__item--active" : "pf-tab-row__item"
              }
              onClick={() => switchAuthMode("login")}
            >
              로그인
            </button>
            <button
              type="button"
              className={
                authMode === "signup" ? "pf-tab-row__item pf-tab-row__item--active" : "pf-tab-row__item"
              }
              onClick={() => switchAuthMode("signup")}
            >
              회원가입
            </button>
            <button
              type="button"
              className={
                authMode === "forgot" || authMode === "recovery"
                  ? "pf-tab-row__item pf-tab-row__item--active"
                  : "pf-tab-row__item"
              }
              onClick={() => switchAuthMode("forgot")}
            >
              비밀번호 찾기
            </button>
          </div>

          <form
            className="pf-login-form"
            onSubmit={
              authMode === "login"
                ? handleEmailLogin
                : authMode === "signup"
                  ? handleEmailSignup
                  : authMode === "forgot"
                    ? handlePasswordResetRequest
                    : handleRecoveryUpdate
            }
          >
            {authMode !== "recovery" ? (
              <div className="pf-field">
                <label htmlFor="email">이메일</label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            ) : null}

            {authMode !== "forgot" ? (
              <div className="pf-field">
                <label htmlFor="password">{authMode === "recovery" ? "새 비밀번호" : "비밀번호"}</label>
                <input
                  id="password"
                  type="password"
                  placeholder={authMode === "recovery" ? "새 비밀번호를 입력하세요" : "비밀번호를 입력하세요"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            ) : null}

            {authMode === "signup" || authMode === "recovery" ? (
              <div className="pf-field">
                <label htmlFor="confirm-password">비밀번호 확인</label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>
            ) : null}

            {authMode === "login" ? (
              <div className="pf-inline-row">
                <label className="pf-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>로그인 상태 유지</span>
                </label>
                <button type="button" className="pf-text-button" onClick={() => switchAuthMode("forgot")}>
                  비밀번호 찾기
                </button>
              </div>
            ) : authMode === "signup" ? (
              <p className="pf-form-hint">가입 후 이메일 인증을 완료하면 바로 로그인할 수 있습니다.</p>
            ) : authMode === "forgot" ? (
              <p className="pf-form-hint">가입한 이메일로 비밀번호 재설정 링크를 보내드립니다.</p>
            ) : (
              <p className="pf-form-hint">메일에서 연 비밀번호 재설정 링크로 새 비밀번호를 설정해주세요.</p>
            )}

            {authError === "missing_supabase_env" ? (
              <p className="pf-form-error">
                Supabase 환경변수가 아직 연결되지 않았습니다. Vercel과 로컬 env를 먼저 설정해주세요.
              </p>
            ) : null}

            {notice ? <p className="pf-form-success">{notice}</p> : null}
            {error ? <p className="pf-form-error">{error}</p> : null}

            {needsEmailConfirmation ? (
              <button
                type="button"
                className="pf-button pf-button--secondary pf-button--block"
                disabled={loading}
                onClick={handleResendConfirmation}
              >
                인증 메일 다시 보내기
              </button>
            ) : null}

            <button type="submit" className="pf-button pf-button--primary pf-button--block" disabled={loading}>
              {loading
                ? authMode === "login"
                  ? "로그인 중..."
                  : authMode === "signup"
                    ? "가입 중..."
                    : authMode === "forgot"
                      ? "전송 중..."
                      : "변경 중..."
                : authMode === "login"
                  ? "로그인"
                  : authMode === "signup"
                    ? "회원가입"
                    : authMode === "forgot"
                      ? "재설정 메일 보내기"
                      : "새 비밀번호 저장"}
            </button>
          </form>

          <div className="pf-divider">또는</div>

          <div className="pf-social-row">
            <button type="button" className="pf-social-button" disabled={loading} onClick={() => handleSocialLogin("google")}>
              Google
            </button>
            <button type="button" className="pf-social-button" disabled={loading} onClick={() => handleSocialLogin("apple")}>
              Apple
            </button>
            <button type="button" className="pf-social-button" disabled={loading} onClick={() => handleSocialLogin("kakao")}>
              Kakao
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export function DashboardScreenPage({ viewer = null }: { viewer?: null | Viewer }) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [cardioState, setCardioState] = useState<DashboardCardioResponse | null>(null);
  const [cardioLoading, setCardioLoading] = useState(false);

  useEffect(() => {
    const today = getSeoulDateKey();
    const storageKey = `repforge-daily-wizard:${today}`;
    const seen = window.localStorage.getItem(storageKey);

    if (!seen) {
      setWizardOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!viewer) {
      return;
    }

    let active = true;

    async function loadCardioSummary() {
      setCardioLoading(true);

      try {
        const response = await fetch("/api/integrations/strava/cardio-summary", {
          cache: "no-store"
        });
        const data = (await response.json()) as DashboardCardioResponse;

        if (!active) {
          return;
        }

        setCardioState(data);
      } catch {
        if (active) {
          setCardioState({
            configured: true,
            connected: false,
            error: "Strava 상태를 불러오지 못했습니다.",
            summary: null
          });
        }
      } finally {
        if (active) {
          setCardioLoading(false);
        }
      }
    }

    void loadCardioSummary();

    return () => {
      active = false;
    };
  }, [viewer]);

  function handleCloseWizard() {
    const today = getSeoulDateKey();
    const storageKey = `repforge-daily-wizard:${today}`;
    window.localStorage.setItem(storageKey, "done");
    setWizardOpen(false);
  }

  function handleOpenWizard() {
    setWizardOpen(true);
  }

  return (
    <AppShell viewer={viewer}>
      <DashboardLayout viewer={viewer}>
        <div className="pf-dashboard-header">
          <div>
            <p className="pf-kicker">안녕하세요, {viewer?.displayName ?? "회원"}님</p>
            <h1>오늘도 기록을 바탕으로, 더 정확하게 훈련해볼까요?</h1>
          </div>

          <div className="pf-header-actions">
            <button type="button" className="pf-button pf-button--secondary">
              AI 추천 보기
            </button>
            <Link href="/today-workout" className="pf-button pf-button--primary">
              운동 기록하기
            </Link>
          </div>
        </div>

        <div className="pf-metric-grid">
          {metricCards.map((item) => (
            <section key={item.label} className="pf-metric-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </section>
          ))}
        </div>

        <div className="pf-section-grid">
          <SectionCard
            title="AI 추천 점수"
            subtitle="최근 기록, 성공률, 피로도 기준으로 계산합니다."
            action={<button className="pf-text-button">상세 보기</button>}
          >
            <ProgressRing />
          </SectionCard>

          <SectionCard title="주간 운동 추이" subtitle="최근 7일 볼륨 추이를 확인하세요.">
            <MiniLineChart />
          </SectionCard>
        </div>

        <div className="pf-section-grid">
          <SectionCard
            title="오늘의 루틴"
            subtitle="오늘 첫 로그인 기준으로 추천된 루틴입니다."
            action={
              <button type="button" className="pf-text-button" onClick={handleOpenWizard}>
                다시 선택
              </button>
            }
          >
            <div className="pf-routine-card">
              <div className="pf-routine-card__copy">
                <span>45분 루틴</span>
                <strong>가슴 · 어깨 · 삼두</strong>
                <div className="pf-routine-summary">
                  <div>
                    <span>추천 부위</span>
                    <strong>가슴 · 어깨 · 삼두</strong>
                  </div>
                  <div>
                    <span>루틴 스타일</span>
                    <strong>상체 집중 · 근비대</strong>
                  </div>
                </div>
                <ul className="pf-list">
                  {todayRoutine.map((item) => (
                    <li key={item.name} className="pf-list__item">
                      <strong>{item.name}</strong>
                      <span>{item.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="최근 운동" subtitle="가장 최근에 기록한 세션입니다.">
            <div className="pf-feed">
              {recentWorkouts.map((item) => (
                <article key={item.name} className="pf-feed__item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <small>{item.time}</small>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="pf-section-grid">
          <SectionCard
            title="Strava 연동"
            subtitle="러닝과 사이클 기록을 함께 읽어 하체 피로와 다음 추천에 반영합니다."
            action={
              cardioState?.connected ? (
                <a href="/api/integrations/strava/connect?next=/dashboard" className="pf-text-button">
                  다시 연결
                </a>
              ) : null
            }
          >
            {cardioLoading ? <p className="pf-form-hint">Strava 활동을 불러오는 중입니다.</p> : null}

            {!cardioLoading && cardioState && !cardioState.configured ? (
              <p className="pf-form-hint">Strava 환경변수가 아직 연결되지 않았습니다. 배포 환경에 Strava 키를 먼저 설정해주세요.</p>
            ) : null}

            {!cardioLoading && cardioState?.configured && !cardioState.connected ? (
              <div className="pf-connection-note">
                <p>Strava를 연결하면 최근 러닝과 사이클 부하를 보고 다음 하체 세션 볼륨을 보수적으로 조정할 수 있습니다.</p>
                <a href="/api/integrations/strava/connect?next=/dashboard" className="pf-button pf-button--primary">
                  Strava 연결하기
                </a>
              </div>
            ) : null}

            {!cardioLoading && cardioState?.connected && cardioState.summary ? (
              <div className="pf-stack">
                <div className="pf-cardio-metric-grid">
                  <div className="pf-cardio-metric">
                    <span>지난 24시간</span>
                    <strong>{cardioState.summary.last24Hours.distanceKm} km</strong>
                    <small>{cardioState.summary.last24Hours.movingMinutes}분</small>
                  </div>
                  <div className="pf-cardio-metric">
                    <span>지난 7일</span>
                    <strong>{cardioState.summary.last7Days.distanceKm} km</strong>
                    <small>{cardioState.summary.last7Days.movingHours}시간</small>
                  </div>
                  <div className="pf-cardio-metric">
                    <span>연결 계정</span>
                    <strong>{cardioState.summary.connectedAthlete?.athleteName ?? "Strava"}</strong>
                    <small>{cardioState.summary.last7Days.activityCount}개 활동</small>
                  </div>
                </div>

                {cardioState.summary.insight ? (
                  <div className="pf-insight">
                    <strong>추천 반영</strong>
                    <p>{cardioState.summary.insight.message}</p>
                  </div>
                ) : null}

                <div className="pf-feed">
                  {cardioState.summary.activities.slice(0, 3).map((activity) => (
                    <article key={activity.id} className="pf-feed__item">
                      <div>
                        <strong>{activity.name}</strong>
                        <p>
                          {getCardioTypeLabel(activity)} · {Math.round((activity.distance ?? 0) / 100) / 10}km · {" "}
                          {Math.round((activity.moving_time ?? activity.elapsed_time ?? 0) / 60)}분
                        </p>
                      </div>
                      <small>{activity.start_date_local ? new Date(activity.start_date_local).toLocaleDateString("ko-KR") : ""}</small>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {!cardioLoading && cardioState?.error ? <p className="pf-form-error">{cardioState.error}</p> : null}
          </SectionCard>

          <SectionCard title="친구 활동" subtitle="친구들의 최근 성과를 확인해보세요.">
            <div className="pf-feed">
              {activityFeed.map((item) => (
                <article key={`${item.user}-${item.detail}`} className="pf-feed__item">
                  <div>
                    <strong>{item.user}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <small>{item.time}</small>
                </article>
              ))}
            </div>
          </SectionCard>

          <section className="pf-banner">
            <div>
              <p className="pf-kicker">기록이 쌓일수록 추천은 더 정교해집니다</p>
              <h2>꾸준한 기록이 쌓일수록 {APP_NAME}의 다음 세트와 루틴 추천은 더 정확해집니다.</h2>
            </div>
            <Link href="/exercise-detail" className="pf-button pf-button--secondary">
              분석 화면 보기
            </Link>
          </section>
        </div>
      </DashboardLayout>

      <DashboardWizard open={wizardOpen} onClose={handleCloseWizard} />
    </AppShell>
  );
}

export function ExerciseDetailScreenPage({ viewer = null }: { viewer?: null | Viewer }) {
  return (
    <AppShell viewer={viewer}>
      <DashboardLayout viewer={viewer}>
        <div className="pf-dashboard-header">
          <div>
            <p className="pf-kicker">운동 상세</p>
            <h1>벤치프레스 세션 분석</h1>
          </div>

          <div className="pf-header-actions">
            <button type="button" className="pf-button pf-button--secondary">
              기록 수정
            </button>
            <button type="button" className="pf-button pf-button--primary">
              세션 저장
            </button>
          </div>
        </div>

        <div className="pf-detail-grid">
          <SectionCard title="세트 기록" subtitle="운동명: 벤치프레스 (Barbell Bench Press)">
            <div className="pf-table-wrap">
              <table className="pf-table">
                <thead>
                  <tr>
                    <th>세트</th>
                    <th>중량(kg)</th>
                    <th>반복</th>
                    <th>RPE</th>
                    <th>휴식</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionSets.map((row) => (
                    <tr key={row.set}>
                      <td>{row.set}</td>
                      <td>{row.weight}</td>
                      <td>{row.reps}</td>
                      <td>{row.rpe}</td>
                      <td>{row.rest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div className="pf-stack">
            <SectionCard title="AI 분석" subtitle="이번 세션의 수행 품질을 정리했습니다.">
              <div className="pf-insight-list">
                <div className="pf-insight">
                  <strong>잘한 점</strong>
                  <p>상위 세트까지 중량 유지가 안정적이었고 마지막 세트에서도 반복 수가 무너지지 않았습니다.</p>
                </div>
                <div className="pf-insight">
                  <strong>개선점</strong>
                  <p>3세트 이후 휴식 시간이 길어졌습니다. 다음 세션에서는 120초 기준으로 맞춰보세요.</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="다음 운동 추천" subtitle="최근 3회 기록과 현재 목표 기준">
              <div className="pf-next-card">
                <strong>벤치프레스 82.5kg / 4세트 / 5회</strong>
                <p>현재 성공률과 피로도를 감안했을 때 가장 안정적인 다음 단계입니다.</p>
                <button type="button" className="pf-button pf-button--primary pf-button--block">
                  추천 적용
                </button>
              </div>
            </SectionCard>
          </div>
        </div>
      </DashboardLayout>
    </AppShell>
  );
}

export function TodayWorkoutScreenPage({ viewer = null }: { viewer?: null | Viewer }) {
  return (
    <AppShell viewer={viewer}>
      <DashboardLayout viewer={viewer}>
        <div className="pf-dashboard-header">
          <div>
            <p className="pf-kicker">운동 기록 추가</p>
            <h1>오늘 운동을 빠르게 시작하세요</h1>
          </div>

          <div className="pf-header-actions">
            <button type="button" className="pf-button pf-button--secondary">
              AI 인식 열기
            </button>
            <button type="button" className="pf-button pf-button--primary">
              다음
            </button>
          </div>
        </div>

        <div className="pf-stepper">
          {["운동 부위 선택", "운동 이름 선택", "운동 방식 선택", "세트 기록"].map((item, index) => (
            <div key={item} className={index === 0 ? "pf-stepper__item pf-stepper__item--active" : "pf-stepper__item"}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>

        <div className="pf-workout-builder">
          <SectionCard title="운동 부위 선택" subtitle="어떤 부위를 운동하셨나요?">
            <div className="pf-choice-grid pf-choice-grid--compact">
              {bodyParts.map((part, index) => (
                <BodyPartChoiceCard
                  key={part}
                  label={part}
                  active={index === 0}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="운동 이름 선택" subtitle="기억나지 않는다면 AI 사진 인식을 활용하세요.">
            <div className="pf-exercise-browser">
              <input type="search" className="pf-search-input" placeholder="운동 이름 검색" />

              <div className="pf-exercise-tags">
                <span>인기</span>
                <span>벤치프레스</span>
                <span>인클라인 벤치프레스</span>
                <span>덤벨 벤치프레스</span>
              </div>

              <div className="pf-exercise-list">
                {exerciseCatalog.map((exercise) => (
                  <article key={exercise.name} className="pf-exercise-item">
                    <div className="pf-exercise-item__thumb" />
                    <div>
                      <strong>{exercise.name}</strong>
                      <p>{exercise.en}</p>
                      <small>{exercise.tags.join(" · ")}</small>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="AI 사진 인식" subtitle="기구 사진으로 가능한 운동을 추천할 수 있습니다.">
            <div className="pf-camera-card">
              <div className="pf-camera-card__visual" />
              <strong>사진 업로드 또는 드래그 앤 드롭</strong>
              <p>운동 이름이 기억나지 않을 때 장비 사진을 올리면 가능한 운동을 추천해드립니다.</p>
            </div>
          </SectionCard>
        </div>
      </DashboardLayout>
    </AppShell>
  );
}
