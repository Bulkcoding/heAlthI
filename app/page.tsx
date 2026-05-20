import { LoginScreenPage } from "@/components/stronger-site";
import { getCurrentViewer } from "@/lib/viewer";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const viewer = await getCurrentViewer();

  if (!viewer) {
    return <LoginScreenPage nextPath="/dashboard" />;
  }

  redirect("/dashboard");
}
