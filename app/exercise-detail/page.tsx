import { ExerciseDetailScreenPage } from "@/components/stronger-site";
import { getCurrentViewer } from "@/lib/viewer";

export default async function ExerciseDetailPage() {
  const viewer = await getCurrentViewer();

  return <ExerciseDetailScreenPage viewer={viewer} />;
}
