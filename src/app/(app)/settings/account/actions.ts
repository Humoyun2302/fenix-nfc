"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { passwordSchema } from "@/lib/validation/auth";

export type SettingsState = { ok: boolean; error?: string; message?: string };

const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(120),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(32)
    .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers and underscores"),
});

export async function updateProfileAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    username: formData.get("username"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  // Ensure the username is available.
  const { data: taken } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", parsed.data.username)
    .neq("id", user.id)
    .maybeSingle();
  if (taken) return { ok: false, error: "That username is already taken." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName, username: parsed.data.username })
    .eq("id", user.id);
  if (error) return { ok: false, error: "Could not update your profile." };

  revalidatePath("/settings/account");
  return { ok: true, message: "Profile updated." };
}

export async function changePasswordAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const parsed = passwordSchema.safeParse(formData.get("password"));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) return { ok: false, error: "Could not update your password." };

  return { ok: true, message: "Password updated." };
}

export async function requestAccountDeletionAction(): Promise<SettingsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  // Record a deletion request for an admin/automation to process. Actual
  // deletion runs server-side with the service role to respect data policies.
  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action: "account.deletion_requested",
    target_type: "user",
    target_id: user.id,
  });

  return {
    ok: true,
    message: "Deletion requested. Our team will process it within 30 days.",
  };
}
