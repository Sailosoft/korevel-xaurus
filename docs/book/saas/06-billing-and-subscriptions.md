---
title: Billing, Subscriptions, and Stripe
description: Chapter 6 - how a solo founder implements subscriptions, plans, trials, and webhooks without losing money or trust.
---

Billing is the module that turns software into a business. It is also
the module founders most often build badly - not because the code is
hard, but because the *edge cases* are. Failed payments, proration,
taxes, upgrades mid-cycle, and refunds all conspire to make "just charge
a card" surprisingly deep.

The winning strategy for a solo founder is simple: **buy the payment
rail, own the entitlement logic.** Let Stripe or a similar provider
handle cards, taxes, and receipts, while you keep a clean internal model
of who is entitled to what.

## By the end of this chapter

You will understand how to model plans and subscriptions, how to map
provider events to internal state, how to handle trials, upgrades, and
dunning, and how to keep billing correct when webhooks arrive out of
order.

## Separate the rail from the rights

Your payment provider moves money. Your application decides access.
Keep these roles clean or you will find yourself querying Stripe on
every page load to ask "is this customer allowed in?"

| Concern | Owner | Why |
| --- | --- | --- |
| Card capture, 3D Secure | Provider | Commodity, PCI-sensitive |
| Taxes and invoices | Provider | Regulatory complexity |
| Subscription lifecycle events | Provider | Source of truth for payment |
| Entitlement (`plan`, `status`) | Your app | Product logic lives here |
| Access checks and feature gates | Your app | Speed and control |
| Dunning emails and UI | Shared | Provider data, your voice |

The clean pattern is a local `subscription` record per tenant that
mirrors the provider's state and is updated by webhooks. Your app reads
local state, never the provider, on the hot path.

## Model plans and subscriptions

Start with a small, explicit schema. Resist the urge to make plans
fully dynamic before you have ten customers.

| Field | Example | Notes |
| --- | --- | --- |
| `tenant_id` | `ten_123` | Billing attaches to tenants, not users |
| `plan_id` | `pro` | Maps to a plan definition |
| `status` | `active` | active, trialing, past_due, cancelled |
| `provider_customer_id` | `cus_abc` | Links to provider |
| `provider_sub_id` | `sub_xyz` | The subscription object |
| `current_period_end` | timestamp | Drives access expiry |
| `cancel_at_period_end` | boolean | Distinguish cancel now vs. later |
| `seats` | `12` | For per-seat pricing |

Keep plan definitions - limits, features, and prices - in your own
table or config, referenced by `plan_id`. This lets you change packaging
(chapter 7) without touching billing code.

:::tip

Always store the provider's subscription status alongside your own
access status. When a customer disputes a charge, you want to point at
the exact provider event that changed their access, not guess.

:::

## Treat webhooks as the source of truth

Subscriptions change asynchronously. The customer upgrades, a card
fails, a trial ends - all of these arrive as webhooks, and they do not
always arrive in order. Build for that reality.

- **Verify the webhook signature.** Reject anything unsigned.
- **Be idempotent.** The same event may arrive twice; process by event
  ID and ignore duplicates.
- **Handle out-of-order events.** Compare timestamps; do not let an old
  "trial ended" overwrite a newer "active."
- **Acknowledge fast, process safely.** Return 200 quickly, then do the
  work in a queue (chapter 14).
- **Log every event** with tenant, type, and timestamp for support.

The events that matter most:

| Event | Meaning | Your action |
| --- | --- | --- |
| `checkout.session.completed` | Customer paid | Activate subscription |
| `invoice.payment_failed` | Charge declined | Enter past_due, start dunning |
| `invoice.paid` | Renewal succeeded | Extend period, clear past_due |
| `customer.subscription.updated` | Plan or seat change | Update plan, apply proration |
| `customer.subscription.deleted` | Cancelled | Revoke access at period end |

:::caution

Never grant permanent access on a client-side "payment success"
redirect. The redirect can be forged or simply lost. Only a verified,
server-side webhook should activate a subscription. Treat the browser
as a hint, the webhook as the truth.

:::

## Trials, upgrades, and proration

Trials reduce friction but invite abuse and edge cases. Decide
deliberately:

- **Time-boxed trial with card required** - highest conversion, highest
  friction, least abuse.
- **Time-boxed trial without card** - easy entry, more tire-kickers.
- **Freemium tier** - free forever with limits; best for bottom-up
  adoption.

Cap abuse with email verification, device or IP heuristics, and clear
terms. If a team repeatedly resets trials, that is a signal, not a
crisis.

Upgrades and downgrades are where proration bites. Let the provider
calculate proration, then mirror the resulting period and amount
locally. Decide product behavior explicitly:

- **Upgrade now:** immediate access, prorated charge.
- **Downgrade at period end:** keep current features until the period
  closes, then switch.
- **Seat changes:** prorate the difference; make the new total visible
  before confirming.

## Dunning and involuntary churn

A large share of churn is not a decision - it is a declined card.
Dunning is the recovery process and one of the highest-ROI modules you
will ever build.

- **Retry smartly.** Provide retry schedules tuned by card type.
- **Email early and clearly.** Say what happened, what to do, and by
  when.
- **In-app banner.** Catch the admin who lives in your product.
- **Grace period.** Keep access during a short recovery window; revoke
  only after.

| Stage | Day | Access | Message tone |
| --- | --- | --- | --- |
| First failure | 0 | Full | "Quick fix needed" |
| Retry 1 | +3 | Full | "Still failing, here's how" |
| Retry 2 | +7 | Full | "Action required" |
| Final notice | +10 | Limited | "Access ends soon" |
| Cancelled | +14 | None | "Reactivate anytime" |

Recovered failed payments often cost a fraction of acquiring a new
customer. Treat dunning as a growth feature, not a chore.

## Billing checklist

- [ ] Model subscriptions per tenant with local `plan_id` and
      `status`.
- [ ] Keep plan limits and features in your own config.
- [ ] Verify webhook signatures and process idempotently.
- [ ] Handle out-of-order events with timestamp comparison.
- [ ] Never activate access from a client redirect alone.
- [ ] Define trial, upgrade, downgrade, and seat-change behavior
      explicitly.
- [ ] Build a dunning sequence with retries, email, and a grace
      period.
- [ ] Expose an admin view of the exact provider events for support.

## Key takeaways

- **Buy the payment rail, own the entitlement logic.**
- Keep a **local mirror** of subscription state; never query the
  provider on the hot path.
- Treat **webhooks as the source of truth** and design for duplicates
  and out-of-order delivery.
- Decide **trial, proration, and plan-change** behavior deliberately.
- Build **dunning** - much of churn is failed payments, not
  decisions.
- Log every provider event so support can explain any charge.

Billing handles *how* customers pay. The next chapter decides *what*
they pay for: pricing and packaging.
