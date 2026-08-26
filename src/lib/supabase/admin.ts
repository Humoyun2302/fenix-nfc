import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getServiceRoleKey, requireSupabaseEnv } from "@/lib/env";

export function createAdminClient() {
  const { url } = requireSupabaseEnv();
  const serviceRole = getServiceRoleKey();

  if (!serviceRole) {
    throw new Error("Supabase service role key is not configured.");
  }

  return createSupabaseClient<Database>(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
