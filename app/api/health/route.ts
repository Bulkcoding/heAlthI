function toHost(url?: string) {
  if (!url) {
    return null;
  }

  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export async function GET() {
  const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasPublishableKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return Response.json({
    ok: true,
    service: "repforge-web",
    timestamp: new Date().toISOString(),
    runtime: {
      nodeEnv: process.env.NODE_ENV ?? null,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      vercelUrl: process.env.VERCEL_URL ?? null,
      appUrlHost: toHost(process.env.NEXT_PUBLIC_APP_URL),
      supabaseUrlHost: toHost(process.env.NEXT_PUBLIC_SUPABASE_URL)
    },
    env: {
      hasSupabaseUrl,
      hasPublishableKey,
      hasAnonKey,
      hasServiceRoleKey,
      hasAnyPublicSupabaseKey: hasPublishableKey || hasAnonKey
    }
  });
}
