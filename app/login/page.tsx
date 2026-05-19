import { LoginScreenPage } from "@/components/stronger-site";
import { getCurrentViewer } from "@/lib/viewer";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const viewer = await getCurrentViewer();

  return (
    <LoginScreenPage
      authError={resolvedSearchParams?.error ?? null}
      nextPath={resolvedSearchParams?.next ?? "/dashboard"}
      viewer={viewer}
    />
  );
}
