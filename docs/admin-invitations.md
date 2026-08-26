# Admin & customer invitations

Fenix.nfc supports an agency-style workflow where an administrator prepares a
workspace and page **before** the customer has an account, then hands it over.

## Roles

Each workspace member has one role, enforced by RLS and mirrored in
`src/lib/permissions/roles.ts` for the UI:

| Role    | Capabilities                                                              |
| ------- | ------------------------------------------------------------------------ |
| Owner   | Everything: billing, members, ownership transfer, delete workspace       |
| Admin   | Manage pages, members (except ownership), NFC, forms, analytics, integrations |
| Editor  | Edit pages/blocks, upload media, publish when allowed                     |
| Viewer  | View pages, statistics, and permitted leads                              |

Platform super-admins (`profiles.is_platform_admin`) can operate across
workspaces; every such action is written to `audit_logs`.

## Invitation lifecycle

1. An owner/admin (or platform admin) creates an invitation for an email + role.
   A secure random token is generated and an `invitations` row is created with
   `status = pending` and an expiry.
2. The invitee opens `/invite/<token>`.
   - If not signed in, they are prompted to register or log in first.
   - If signed in, they can accept.
3. Accepting calls the `fx_accept_invitation` RPC, which validates the token
   (pending + not expired), adds the user as a member with the invited role
   (transferring ownership for ownership-claim invitations), and marks the
   invitation `accepted`.
4. Existing pages, blocks, analytics, and NFC assignments remain intact — the
   customer simply gains ownership.
5. The token is single-use; it cannot be replayed after acceptance.

Supported management actions: resend, cancel, change recipient, and full
invitation history. All invitation and ownership changes are audited.

## Customer claim (unclaimed workspaces)

An admin can build out a workspace/page and later send an ownership-claim
invitation to the customer's email. When the customer accepts, they become the
owner of the pre-built workspace without losing any content or history.
