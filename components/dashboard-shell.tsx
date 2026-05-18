import Link from "next/link";
import { ReactNode } from "react";

const navigation = [
  { href: "/dashboard", label: "대시보드" },
  { href: "#workouts", label: "운동 기록" },
  { href: "#analysis", label: "운동 분석" },
  { href: "#recommendation", label: "추천 루틴" },
  { href: "#equipment", label: "장비 인식" },
  { href: "#friends", label: "친구" },
  { href: "#achievements", label: "성취" },
  { href: "#settings", label: "설정" }
];

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand">
          <div className="app-sidebar__logo">S</div>
          <div>
            <p className="app-sidebar__title">STRONGER</p>
            <p className="app-sidebar__subtitle">AI Strength OS</p>
          </div>
        </div>

        <nav className="app-sidebar__nav">
          {navigation.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={index === 0 ? "nav-link nav-link--active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="app-sidebar__profile">
          <div className="avatar">홍</div>
          <div>
            <p className="app-sidebar__user">홍길동</p>
            <p className="app-sidebar__level">Lv.23 · Premium</p>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <div>
            <p className="app-header__eyebrow">오늘의 준비</p>
            <h2>다음 성장 포인트가 정리되어 있습니다.</h2>
          </div>
          <Link href="#start" className="button button--primary">
            오늘의 운동 시작
          </Link>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
