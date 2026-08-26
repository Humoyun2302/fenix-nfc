"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { acceptInvitationAction } from "./actions";

export function InviteActions({
  token,
  signedIn,
}: {
  token: string;
  signedIn: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!signedIn) {
    return (
      <div className="flex flex-col gap-2">
        <Link href={`/login?next=/invite/${token}`}>
          <Button variant="accent" size="lg" className="w-full">
            Sign in to accept
          </Button>
        </Link>
        <Link href={`/register?next=/invite/${token}`}>
          <Button variant="outline" size="lg" className="w-full">
            Create an account
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        variant="accent"
        size="lg"
        className="w-full"
        loading={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await acceptInvitationAction(token);
            if (res && !res.ok) setError(res.error ?? "Could not accept the invitation.");
          })
        }
      >
        Accept invitation
      </Button>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
