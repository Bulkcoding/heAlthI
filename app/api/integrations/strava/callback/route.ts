import { NextResponse } from "next/server";
import { getAppUrl, hasIntegrationsEncryptionKey, hasStravaEnv } from "@/lib/env";
import { verifyState } from "@/lib/integrations/crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { exchangeStravaCode } from "@/lib/strava/client";
import { saveStravaConnection } from "@/lib/strava/storage";

type CallbackState = {
  expiresAt: number;
  next: string;
  userId: string;
};

function redirectWithStatus(path: string, status: string) {
  const url = new URL(path, getAppUrl());
  url.searchParams.set("strava", status);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const error = requestUrl.searchParams.get("error");
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");

  if (!hasStravaEnv() || !hasIntegrationsEncryptionKey()) {
    return redirectWithStatus("/dashboard", "not_configured");
  }

  if (error || !code || !state) {
    return redirectWithStatus("/dashboard", "denied");
  }

  try {
    const parsedState = verifyState<CallbackState>(state);

    if (parsedState.expiresAt < Date.now()) {
      return redirectWithStatus(parsedState.next ?? "/dashboard", "expired");
    }

    const tokens = await exchangeStravaCode(code);
    const admin = createSupabaseAdminClient();
    const { data, error: userError } = await admin.auth.admin.getUserById(parsedState.userId);

    if (userError || !data.user) {
      return redirectWithStatus(parsedState.next ?? "/dashboard", "user_missing");
    }

    await saveStravaConnection({
      baseMetadata: data.user.user_metadata ?? undefined,
      tokens,
      userId: parsedState.userId
    });

    return redirectWithStatus(parsedState.next ?? "/dashboard", "connected");
  } catch {
    return redirectWithStatus("/dashboard", "failed");
  }
}
