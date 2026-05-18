import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px"
      }}
    >
      <div
        style={{
          width: "min(480px, 100%)",
          padding: "32px",
          borderRadius: "24px",
          border: "1px solid rgba(128,128,128,0.18)",
          background: "var(--pf-surface)",
          boxShadow: "var(--pf-shadow)"
        }}
      >
        <p style={{ color: "var(--pf-text-muted)", marginBottom: 12 }}>Authentication Error</p>
        <h1 style={{ marginBottom: 12 }}>로그인 연결에 실패했습니다.</h1>
        <p style={{ color: "var(--pf-text-muted)", lineHeight: 1.7, marginBottom: 24 }}>
          Supabase OAuth 설정이나 Redirect URL이 아직 맞지 않을 수 있습니다. 설정을 확인한 뒤 다시
          시도해주세요.
        </p>
        <Link href="/login" style={{ fontWeight: 700 }}>
          로그인 화면으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
