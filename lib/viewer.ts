import { hasSupabasePublicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Viewer = {
  displayName: string;
  email: string;
  initials: string;
};

function getDisplayName(email: string, metadata: Record<string, unknown> | null | undefined) {
  const rawName = metadata?.full_name ?? metadata?.name ?? metadata?.user_name;

  if (typeof rawName === "string" && rawName.trim()) {
    return rawName.trim();
  }

  const [localPart] = email.split("@");
  return localPart || "회원";
}

function getInitials(displayName: string, email: string) {
  const source = displayName.trim() || email.trim();
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export async function getCurrentViewer(): Promise<null | Viewer> {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return null;
    }

    const displayName = getDisplayName(user.email, user.user_metadata);

    return {
      displayName,
      email: user.email,
      initials: getInitials(displayName, user.email)
    };
  } catch {
    return null;
  }
}
