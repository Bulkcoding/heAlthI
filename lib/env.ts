function getEnv(name: string) {
  return process.env[name];
}

function requireEnv(name: string) {
  const value = getEnv(name);

  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`);
  }

  return value;
}

export function getAppUrl() {
  return getEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000";
}

export function getSupabasePublicEnv() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const publishableKey =
    getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ?? getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase 공개 환경변수가 비어 있습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요."
    );
  }

  return {
    url,
    publishableKey
  };
}

export function hasSupabasePublicEnv() {
  return Boolean(
    getEnv("NEXT_PUBLIC_SUPABASE_URL") &&
      (getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ?? getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"))
  );
}

export function getSupabaseServiceRoleKey() {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function getSupabaseStorageBucket() {
  return getEnv("SUPABASE_STORAGE_BUCKET") ?? "workout-media";
}
