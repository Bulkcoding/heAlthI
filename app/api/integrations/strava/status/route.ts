import { NextResponse } from "next/server";
import { hasIntegrationsEncryptionKey, hasStravaEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStravaMetadataFromUser } from "@/lib/strava/storage";

export async function GET() {
  const configured = hasStravaEnv() && hasIntegrationsEncryptionKey();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      configured,
      connected: false
    });
  }

  const metadata = getStravaMetadataFromUser(user);

  return NextResponse.json({
    athleteName: metadata?.athleteName ?? null,
    configured,
    connected: Boolean(metadata),
    scopes: metadata?.scopes ?? []
  });
}
