"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type InviteState = { ok: boolean; error?: string };

export async function acceptInvitationAction(token: string): Promise<InviteState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=/invite/${token}`);
  }

  const { data, error } = await supabase.rpc("fx_accept_invitation", {
    p_token: token,
  });
  if (error || !data) {
    return { ok: false, error: "This invitation is invalid, expired, or already used." };
  }

  redirect(`/dashboard?ws=${data}`);
}
