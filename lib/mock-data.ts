export const dashboardMetrics = [
  { label: "이번 주 운동", value: "4 / 5회", meta: "목표 달성까지 1회", accent: "blue" },
  { label: "총 운동 시간", value: "5h 32m", meta: "주 평균보다 18분 많음", accent: "green" },
  { label: "총 볼륨", value: "12,450 kg", meta: "지난주 대비 +9.2%", accent: "gold" },
  { label: "소모 칼로리", value: "3,250 kcal", meta: "하체 세션 영향이 큼", accent: "red" }
] as const;

export const latestWorkout = {
  date: "2026.05.13",
  title: "상체 Push",
  duration: "68분",
  volume: "4,250 kg",
  bodyFocus: ["가슴", "전면 삼각근", "삼두"],
  lines: [
    { name: "벤치프레스", detail: "5세트", result: "80kg x 5" },
    { name: "인클라인 덤벨프레스", detail: "4세트", result: "30kg x 8" },
    { name: "딥스", detail: "4세트", result: "체중 x 10" },
    { name: "케이블 푸시다운", detail: "3세트", result: "32kg x 12" }
  ]
};

export const aiFeedback = {
  score: 85,
  headline: "좋은 세션이었어요.",
  summary: "벤치프레스 총 볼륨이 지난 세션보다 증가했고, 보조 운동 집중도도 안정적이었습니다.",
  strengths: ["메인 리프트 중량 상승", "푸시 운동 볼륨 균형 유지", "휴식 간격 안정적"],
  cautions: ["후반 삼두 피로 누적", "다음 상체 날은 어깨 볼륨 과다 주의", "수면 부족 시 중량 유지 권장"]
};

export const recommendation = {
  title: "내일 하체 Pull",
  eta: "예상 70분",
  notes: [
    "지난 하체 세션 성공률이 높아 스쿼트 중량을 소폭 올립니다.",
    "총 운동 가능 시간이 70분이라 보조 운동 1개를 압축했습니다.",
    "허리 피로 누적을 고려해 RDL 볼륨은 유지합니다."
  ],
  items: [
    { name: "스쿼트", prescription: "5세트 x 5회", weight: "87.5kg (+2.5kg)" },
    { name: "루마니안 데드리프트", prescription: "4세트 x 6회", weight: "97.5kg" },
    { name: "레그프레스", prescription: "4세트 x 10회", weight: "120kg" },
    { name: "레그컬", prescription: "3세트 x 12회", weight: "32kg" }
  ]
};

export const weeklyVolumeTrend = [4200, 6800, 6100, 8900, 10200, 9850, 12450];

export const friendActivities = [
  { name: "김민수", action: "벤치프레스 100kg 달성", time: "12분 전" },
  { name: "이예진", action: "스쿼트 120kg 기록 갱신", time: "41분 전" },
  { name: "박지훈", action: "데드리프트 150kg 달성", time: "1시간 전" },
  { name: "최나영", action: "4주 연속 운동 배지 획득", time: "2시간 전" }
];

export const achievementHighlights = [
  { title: "4주 연속 운동", detail: "Consistency Badge", tone: "sage" },
  { title: "벤치 볼륨 +10%", detail: "Weekly Progress", tone: "cobalt" },
  { title: "첫 10회 기록 완료", detail: "Milestone", tone: "gold" }
];

export const equipmentRecognition = {
  equipmentName: "레그프레스",
  confidence: "92%",
  machineType: "Plate Loaded Machine",
  matchedExercises: ["레그프레스", "카프 레이즈", "싱글 레그 프레스"]
};
