import { decryptJson, encryptJson } from "@/lib/integrations/crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { StoredStravaMetadata, StoredStravaTokens } from "@/lib/strava/types";

type AuthUserMetadata = {
  integrations?: {
    strava?: StoredStravaMetadata;
  };
  [key: string]: unknown;
};

export function getStravaMetadataFromUser(user: { user_metadata?: AuthUserMetadata | null }) {
  return user.user_metadata?.integrations?.strava ?? null;
}

export function decryptStoredStravaTokens(metadata: StoredStravaMetadata) {
  return decryptJson<StoredStravaTokens>(metadata.tokenCiphertext);
}

export async function saveStravaConnection(params: {
  baseMetadata?: AuthUserMetadata | null;
  tokens: StoredStravaTokens;
  userId: string;
}) {
  const admin = createSupabaseAdminClient();
  const integrations = {
    ...(params.baseMetadata?.integrations ?? {}),
    strava: {
      athleteId: params.tokens.athleteId,
      athleteName: params.tokens.athleteName,
      connectedAt: params.tokens.connectedAt,
      scopes: params.tokens.scopes,
      tokenCiphertext: encryptJson(params.tokens)
    }
  };

  const { error } = await admin.auth.admin.updateUserById(params.userId, {
    user_metadata: {
      ...(params.baseMetadata ?? {}),
      integrations
    }
  });

  if (error) {
    throw new Error("Strava 연결 정보를 저장하지 못했습니다.");
  }
}
