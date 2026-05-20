import { NextResponse } from "next/server";
import { hasIntegrationsEncryptionKey, hasStravaEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchRecentStravaActivities, refreshStravaTokens, summarizeStravaActivities } from "@/lib/strava/client";
import { decryptStoredStravaTokens, getStravaMetadataFromUser, saveStravaConnection } from "@/lib/strava/storage";

export async function GET() {
  const configured = hasStravaEnv() && hasIntegrationsEncryptionKey();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      configured,
      connected: false,
      summary: null
    });
  }

  const metadata = getStravaMetadataFromUser(user);

  if (!configured || !metadata) {
    return NextResponse.json({
      configured,
      connected: false,
      summary: null
    });
  }

  try {
    let tokens = decryptStoredStravaTokens(metadata);

    if (tokens.expiresAt * 1000 <= Date.now() + 5 * 60 * 1000) {
      const refreshedTokens = await refreshStravaTokens(tokens.refreshToken);
      tokens = {
        ...tokens,
        ...refreshedTokens,
        athleteId: refreshedTokens.athleteId || tokens.athleteId,
        athleteName: refreshedTokens.athleteName || tokens.athleteName,
        connectedAt: tokens.connectedAt
      };

      await saveStravaConnection({
        baseMetadata: user.user_metadata ?? undefined,
        tokens,
        userId: user.id
      });
    }

    const activities = await fetchRecentStravaActivities(tokens.accessToken);
    const summary = summarizeStravaActivities(
      {
        athleteId: metadata.athleteId,
        athleteName: metadata.athleteName
      },
      activities
    );

    return NextResponse.json({
      configured: true,
      connected: true,
      summary
    });
  } catch {
    return NextResponse.json(
      {
        configured,
        connected: false,
        error: "Strava 활동을 불러오지 못했습니다. 다시 연결이 필요할 수 있습니다.",
        summary: null
      },
      { status: 500 }
    );
  }
}
