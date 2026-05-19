import { DashboardScreenPage } from "@/components/stronger-site";
import { getCurrentViewer } from "@/lib/viewer";

export default async function DashboardPage() {
  const viewer = await getCurrentViewer();

  return <DashboardScreenPage viewer={viewer} />;
}
