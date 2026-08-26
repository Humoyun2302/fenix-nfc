"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import {
  updateProfileAction,
  changePasswordAction,
  requestAccountDeletionAction,
  type SettingsState,
} from "./actions";

const initial: SettingsState = { ok: false };

export function AccountForms({
  email,
  fullName,
  username,
}: {
  email: string;
  fullName: string;
  username: string;
}) {
  const toast = useToast();
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfileAction,
    initial,
  );
  const [pwState, pwAction, pwPending] = useActionState(
    changePasswordAction,
    initial,
  );
  const [deletePending, startDelete] = useTransition();

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-4 font-medium text-ink">Profile</h2>
        <form action={profileAction} className="space-y-4" noValidate>
          <Field label="Email" htmlFor="email" hint="Contact support to change your email.">
            <Input id="email" value={email} disabled />
          </Field>
          <Field label="Full name" htmlFor="fullName">
            <Input id="fullName" name="fullName" defaultValue={fullName} required />
          </Field>
          <Field
            label="Username"
            htmlFor="username"
            hint="Used for your public profile URL."
          >
            <Input id="username" name="username" defaultValue={username} required />
          </Field>
          {profileState.error ? (
            <p role="alert" className="text-sm text-danger">
              {profileState.error}
            </p>
          ) : null}
          {profileState.ok && profileState.message ? (
            <p className="text-sm text-success">{profileState.message}</p>
          ) : null}
          <Button type="submit" variant="accent" loading={profilePending}>
            Save profile
          </Button>
        </form>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-4 font-medium text-ink">Change password</h2>
        <form action={pwAction} className="space-y-4" noValidate>
          <Field label="New password" htmlFor="password" hint="At least 8 characters.">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
          </Field>
          {pwState.error ? (
            <p role="alert" className="text-sm text-danger">
              {pwState.error}
            </p>
          ) : null}
          {pwState.ok && pwState.message ? (
            <p className="text-sm text-success">{pwState.message}</p>
          ) : null}
          <Button type="submit" variant="outline" loading={pwPending}>
            Update password
          </Button>
        </form>
      </section>

      <section className="rounded-xl border border-danger/30 bg-surface p-5">
        <h2 className="font-medium text-danger">Danger zone</h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Request permanent deletion of your account and personal data.
        </p>
        <Button
          variant="outline"
          className="mt-4 border-danger/40 text-danger"
          loading={deletePending}
          onClick={() =>
            startDelete(async () => {
              if (!confirm("Request account deletion? This will be processed within 30 days.")) return;
              const res = await requestAccountDeletionAction();
              if (res.ok) toast.success("Deletion requested", res.message);
              else toast.error("Couldn't submit request", res.error);
            })
          }
        >
          Request account deletion
        </Button>
      </section>
    </div>
  );
}
