import { NextResponse } from "next/server";
import { getAppUrl, hasIntegrationsEncryptionKey, hasStravaEnv } from "@/lib/env";
import { signState } from "@/lib/integrations/crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStravaAuthorizeUrl } from "@/lib/strava/client";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (!hasStravaEnv() || !hasIntegrationsEncryptionKey()) {
    return NextResponse.redirect(new URL(`${next}?strava=not_configured`, getAppUrl()));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", getAppUrl());
    loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  const state = signState({
    expiresAt: Date.now() + 15 * 60 * 1000,
    next,
    userId: user.id
  });

  return NextResponse.redirect(getStravaAuthorizeUrl(state));
}
