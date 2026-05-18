import { LoginScreenPage } from "@/components/stronger-site";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <LoginScreenPage
      authError={resolvedSearchParams?.error ?? null}
      nextPath={resolvedSearchParams?.next ?? "/dashboard"}
    />
  );
}
