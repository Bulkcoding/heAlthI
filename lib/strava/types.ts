export type StoredStravaTokens = {
  accessToken: string;
  athleteId: number;
  athleteName: string;
  connectedAt: string;
  expiresAt: number;
  refreshToken: string;
  scopes: string[];
};

export type StoredStravaMetadata = {
  athleteId: number;
  athleteName: string;
  connectedAt: string;
  scopes: string[];
  tokenCiphertext: string;
};

export type StravaActivity = {
  average_heartrate?: number;
  distance?: number;
  elapsed_time?: number;
  id: number;
  max_heartrate?: number;
  moving_time?: number;
  name: string;
  sport_type?: string;
  start_date?: string;
  start_date_local?: string;
  total_elevation_gain?: number;
  type?: string;
};

export type CardioInsight = {
  emphasis: "lower" | "neutral";
  message: string;
  severity: "high" | "low" | "moderate";
};

export type CardioLoadSummary = {
  activities: StravaActivity[];
  connectedAthlete: null | {
    athleteId: number;
    athleteName: string;
  };
  insight: null | CardioInsight;
  last7Days: {
    activityCount: number;
    distanceKm: number;
    movingHours: number;
  };
  last24Hours: {
    activityCount: number;
    distanceKm: number;
    movingMinutes: number;
  };
};
