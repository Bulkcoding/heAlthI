import { TodayWorkoutScreenPage } from "@/components/stronger-site";
import { getCurrentViewer } from "@/lib/viewer";

export default async function TodayWorkoutPage() {
  const viewer = await getCurrentViewer();

  return <TodayWorkoutScreenPage viewer={viewer} />;
}
