import { LandingPage } from "@/components/stronger-site";
import { getCurrentViewer } from "@/lib/viewer";

export default async function HomePage() {
  const viewer = await getCurrentViewer();

  return <LandingPage viewer={viewer} />;
}
