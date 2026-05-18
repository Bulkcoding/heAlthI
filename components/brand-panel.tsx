import Link from "next/link";

export function BrandPanel() {
  return (
    <div className="brand-panel">
      <div className="brand-panel__overlay" />
      <div className="brand-panel__content">
        <div>
          <p className="brand-panel__eyebrow">STRONGER</p>
          <h1>기록이 성장을 만든다.</h1>
          <p>
            운동 기록, AI 추천, 방식별 분석, 소셜 동기부여를 하나의 흐름으로
            연결하는 근력운동 플랫폼입니다.
          </p>
        </div>

        <div className="brand-panel__chips">
          <span>AI 추천 루틴</span>
          <span>운동 분석</span>
          <span>장비 인식</span>
        </div>

        <div className="brand-panel__actions">
          <Link href="/dashboard" className="button button--secondary">
            데모 보기
          </Link>
          <Link href="/login" className="button button--ghost">
            바로 시작
          </Link>
        </div>
      </div>
    </div>
  );
}
