import { getStravaEnv, getStravaScopes } from "@/lib/env";
import type { CardioInsight, CardioLoadSummary, StravaActivity, StoredStravaTokens } from "@/lib/strava/types";

type StravaTokenExchangeResponse = {
  access_token: string;
  athlete?: {
    firstname?: string;
    id: number;
    lastname?: string;
    username?: string;
  };
  expires_at: number;
  refresh_token: string;
};

function getAthleteName(athlete: StravaTokenExchangeResponse["athlete"]) {
  if (!athlete) {
    return "Strava Athlete";
  }

  const fullName = [athlete.firstname, athlete.lastname].filter(Boolean).join(" ").trim();

  return fullName || athlete.username || "Strava Athlete";
}

export function getStravaAuthorizeUrl(state: string) {
  const { clientId, redirectUri } = getStravaEnv();
  const params = new URLSearchParams({
    approval_prompt: "auto",
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: getStravaScopes(),
    state
  });

  return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

export async function exchangeStravaCode(code: string): Promise<StoredStravaTokens> {
  const { clientId, clientSecret } = getStravaEnv();
  const response = await fetch("https://www.strava.com/oauth/token", {
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code"
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("Strava 인증 코드 교환에 실패했습니다.");
  }

  const data = (await response.json()) as StravaTokenExchangeResponse;

  return {
    accessToken: data.access_token,
    athleteId: data.athlete?.id ?? 0,
    athleteName: getAthleteName(data.athlete),
    connectedAt: new Date().toISOString(),
    expiresAt: data.expires_at,
    refreshToken: data.refresh_token,
    scopes: getStravaScopes().split(",").map((scope) => scope.trim()).filter(Boolean)
  };
}

export async function refreshStravaTokens(refreshToken: string): Promise<StoredStravaTokens> {
  const { clientId, clientSecret } = getStravaEnv();
  const response = await fetch("https://www.strava.com/oauth/token", {
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("Strava 토큰 갱신에 실패했습니다.");
  }

  const data = (await response.json()) as StravaTokenExchangeResponse;

  return {
    accessToken: data.access_token,
    athleteId: data.athlete?.id ?? 0,
    athleteName: getAthleteName(data.athlete),
    connectedAt: new Date().toISOString(),
    expiresAt: data.expires_at,
    refreshToken: data.refresh_token,
    scopes: getStravaScopes().split(",").map((scope) => scope.trim()).filter(Boolean)
  };
}

export async function fetchRecentStravaActivities(accessToken: string, perPage = 12) {
  const params = new URLSearchParams({
    page: "1",
    per_page: `${perPage}`
  });

  const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  });

  if (!response.ok) {
    throw new Error("Strava 최근 활동을 가져오지 못했습니다.");
  }

  return (await response.json()) as StravaActivity[];
}

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function buildInsight(last24HoursDistanceKm: number, last24HoursMovingMinutes: number, last7DaysMovingHours: number): CardioInsight | null {
  if (last24HoursDistanceKm >= 8 || last24HoursMovingMinutes >= 70) {
    return {
      emphasis: "lower",
      message: "최근 24시간 유산소 부하가 높아서 다음 하체 세션은 세트 수를 1개 줄이거나 중량을 2.5~5% 낮추는 편이 안전합니다.",
      severity: "high"
    };
  }

  if (last7DaysMovingHours >= 4.5) {
    return {
      emphasis: "lower",
      message: "최근 7일 유산소 시간이 꽤 높아서 하체 볼륨은 보수적으로, 상체 세션은 정상 강도로 진행하는 쪽이 좋습니다.",
      severity: "moderate"
    };
  }

  return {
    emphasis: "neutral",
    message: "최근 유산소 부하는 안정적입니다. 상체 푸시 데이나 벤치 progression을 그대로 적용해도 무리가 적어 보입니다.",
    severity: "low"
  };
}

export function summarizeStravaActivities(
  athlete: null | {
    athleteId: number;
    athleteName: string;
  },
  activities: StravaActivity[]
): CardioLoadSummary {
  const now = Date.now();
  const last24HoursMs = 24 * 60 * 60 * 1000;
  const last7DaysMs = 7 * 24 * 60 * 60 * 1000;

  const normalized = activities.filter((activity) => activity.start_date || activity.start_date_local);

  const last24Hours = normalized.filter((activity) => {
    const startedAt = new Date(activity.start_date ?? activity.start_date_local ?? 0).getTime();
    return now - startedAt <= last24HoursMs;
  });

  const last7Days = normalized.filter((activity) => {
    const startedAt = new Date(activity.start_date ?? activity.start_date_local ?? 0).getTime();
    return now - startedAt <= last7DaysMs;
  });

  const last24HoursDistanceKm = round(last24Hours.reduce((sum, activity) => sum + (activity.distance ?? 0), 0) / 1000);
  const last24HoursMovingMinutes = Math.round(
    last24Hours.reduce((sum, activity) => sum + (activity.moving_time ?? activity.elapsed_time ?? 0), 0) / 60
  );
  const last7DaysMovingHours = round(
    last7Days.reduce((sum, activity) => sum + (activity.moving_time ?? activity.elapsed_time ?? 0), 0) / 3600
  );

  return {
    activities: normalized.slice(0, 6),
    connectedAthlete: athlete,
    insight: buildInsight(last24HoursDistanceKm, last24HoursMovingMinutes, last7DaysMovingHours),
    last24Hours: {
      activityCount: last24Hours.length,
      distanceKm: last24HoursDistanceKm,
      movingMinutes: last24HoursMovingMinutes
    },
    last7Days: {
      activityCount: last7Days.length,
      distanceKm: round(last7Days.reduce((sum, activity) => sum + (activity.distance ?? 0), 0) / 1000),
      movingHours: last7DaysMovingHours
    }
  };
}
