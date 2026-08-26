# Custom domains

Paid workspaces can connect their own domain to a published page. The domain
model tracks these states:

`pending` → `verification_required` → `verifying` → `active`
(`ssl_pending`, `failed`, `disconnected` as applicable).

## Workflow

1. The user enters a hostname in **Settings → Domains**. The format is
   validated before anything is saved.
2. A verification token is generated and DNS instructions are shown.
3. Ownership is verified via the DNS record.
4. The domain is connected to the chosen page.
5. SSL status is displayed; a domain is **never** shown as `active` before both
   verification and SSL succeed.

## Notes

- Custom domains are a paid-plan feature; the UI shows the plan requirement.
- Point DNS at the platform per the generated instructions, then trigger
  verification. Until verified, the public page remains reachable at its
  `/p/<slug>` URL.
