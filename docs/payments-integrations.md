# Payments & integrations

## Subscription plans

Plans (Free, Pro, Business, Lifetime, Custom) live in the `plans` table and are
seeded by migration `0012_platform_data.sql`. Each plan carries a JSON `limits`
object (pages, NFC tags, team members, storage, forms, leads, analytics
history, custom domains, custom CSS, branding removal, payment blocks,
integrations, advanced templates). Limits are enforced on the backend; the UI
surfaces a clear message when a limit is reached rather than failing silently.

## Billing

The billing architecture supports manual payments, Click, Payme, Stripe, and
administrator-managed subscriptions. Payment statuses: `pending`, `processing`,
`paid`, `failed`, `canceled`, `refunded`.

- Payments are **never** simulated as successful. A payment is only `paid` when
  the provider confirms it (via webhook / callback).
- When a provider's credentials are not configured, the UI shows
  **Configuration required** instead of a broken payment flow.
- In the current slice, subscriptions are administrator-managed; connecting a
  live gateway is an outward expansion step.

## Integrations

Initial integrations: Telegram, email notifications, webhooks, Google
Analytics, Google Tag Manager, Meta Pixel, TikTok Pixel.

Each integration stores credentials securely (server-side), and is designed to
support: validation, a test action with a success/failure result, disconnect,
and error logging. Configure them under **Settings → Integrations**.

### Telegram

To receive lead/notification events in Telegram, connect the Telegram
integration with your bot token and target chat ID, then use the test action to
confirm delivery before relying on it.
