import { LoginScreenPage } from "@/components/stronger-site";
import { getCurrentViewer } from "@/lib/viewer";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    mode?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const viewer = await getCurrentViewer();

  return (
    <LoginScreenPage
      authError={resolvedSearchParams?.error ?? null}
      initialMode={resolvedSearchParams?.mode === "recovery" ? "recovery" : "login"}
      nextPath={resolvedSearchParams?.next ?? "/dashboard"}
      viewer={viewer}
    />
  );
}
