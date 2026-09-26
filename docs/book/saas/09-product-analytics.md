---
title: Product Analytics and Event Tracking
description: Chapter 9 - instrumenting a B2B SaaS to measure activation, retention, and account health.
---

You cannot run a subscription business on vibes. Every claim about
activation, retention, and expansion must trace back to events your
product actually recorded. Product analytics is the module that turns
user behavior into decisions - and for a solo founder, it is the
difference between steering and guessing.

This chapter is about instrumenting your product with **event tracking**
that answers specific questions, keeping the data model tidy, and
building the handful of dashboards that matter.

## By the end of this chapter

You will know how to define an event taxonomy, track the metrics that
drive a B2B SaaS, avoid the common traps of over-tracking, and build
account-level health signals that predict churn and expansion.

## Start with questions, not events

Founders often instrument everything and analyze nothing. Reverse the
process: list the questions you need answered, then define the minimum
events to answer them.

| Question | Metric | Events needed |
| --- | --- | --- |
| Are new users activating? | Activation rate | `signup`, `activation` |
| Do they come back? | Retention | `session_start` |
| Are they using the core? | Feature adoption | Core action events |
| Are teams expanding? | Seats, workspaces | `member_invited` |
| Are accounts healthy? | Account health score | Aggregated usage |
| Where do users drop? | Funnel conversion | Step events |

Every event should exist to answer a question someone will act on. If
no decision depends on an event, do not track it.

## Define an event taxonomy

A messy event stream is worse than none - it silently misleads. Adopt a
consistent naming convention from day one.

- **Use `object_action` names in past tense:** `invoice_sent`,
  `member_invited`, `report_exported`.
- **Keep one canonical name per action.** `clicked_export` and
  `export_clicked` are two events that should be one.
- **Attach stable properties:** `tenant_id`, `user_id`, `plan`,
  `role`, `source`, and relevant entity IDs.
- **Version the schema.** Note when an event changes meaning; do not
  silently mutate it.
- **Document each event** in a lightweight catalog your future self
  will thank you for.

| Property | Always include? | Why |
| --- | --- | --- |
| `tenant_id` | Yes | Every B2B metric is account-scoped |
| `user_id` | Yes | Distinguish users within a tenant |
| `plan` | Yes | Compare behavior by tier |
| `timestamp` | Yes | Ordering and cohorts |
| `source` | When applicable | Web, mobile, API, integration |

:::tip

In B2B, **group every event by tenant first**, then by user. A metric
that looks healthy per-user can hide a single account carrying the
product, or an account silently dying. Account-level views are where
churn shows up first.

:::

## Track the metrics that matter for SaaS

You do not need hundreds of charts. A focused set covers the business:

| Metric | Definition | Why it matters |
| --- | --- | --- |
| Activation rate | Signups reaching the activation event | Onboarding quality |
| Time to value | Median hours to activation | Friction |
| Weekly active tenants | Tenants with a real action this week | Habit |
| Feature adoption | % of tenants using a feature | Value delivery |
| Retention (logo) | Tenants active in period N+1 | Durability |
| Net revenue retention | Revenue from cohort over time | Expansion health |

Retention curves are the most honest signal in SaaS. If a cohort's
retention flattens, you have a durable product. If it decays toward
zero, no acquisition effort will save you.

## Build account health signals

B2B churn is rarely sudden. Accounts telegraph risk through declining
usage, missing champions, and support friction. Combine a few signals
into a health score you can act on:

- **Usage trend:** sessions and core actions over the last 30 days
  versus the prior 30.
- **Breadth:** how many seats are active out of those purchased.
- **Depth:** are they using the features that correlate with retention?
- **Engagement:** logins per active user, invites sent.
- **Sentiment:** support tickets and their resolution.

| Health band | Signal | Action |
| --- | --- | --- |
| Green | Growing usage, most seats active | Ask for a testimonial, upsell |
| Yellow | Flat or declining usage | Reach out, offer help |
| Red | Steep decline, single user, complaints | Escalate, save play |

A simple red/yellow/green health column in your admin dashboard
(chapter 10) turns analytics into a daily worklist.

:::caution

Beware vanity metrics: raw page views, total signups, and cumulative
counts only ever go up. They feel good and inform nothing. Prefer
**cohort**, **per-tenant**, and **rate** metrics that can actually get
worse, because those are the ones that warn you early.

:::

## Keep the pipeline simple

You do not need a data platform on day one. A pragmatic stack:

1. **Emit events** from the app (server-side for truth, client-side for
   context) to a queue or a provider.
2. **Store** them in your own database table if you want control, or in
   an analytics tool if you want speed.
3. **Aggregate** nightly into summary tables per tenant and per day.
4. **Visualize** a single dashboard with the six metrics above.
5. **Alert** when an account crosses into red or activation drops.

Server-side events are more trustworthy for revenue and lifecycle
events; client-side events are richer for UI behavior. Use both,
labeled.

## Privacy and consent

Even B2B analytics carries obligations. Minimize personally
identifiable information, avoid capturing sensitive record contents,
honor deletion requests by removing tenant data from your event store,
and document what you collect. Trust is a retention feature.

## Analytics checklist

- [ ] List the decisions you need to make, then define events to
      answer them.
- [ ] Adopt one naming convention and stick to it.
- [ ] Attach `tenant_id`, `user_id`, and `plan` to every event.
- [ ] Document events in a lightweight catalog.
- [ ] Build one dashboard with activation, retention, and adoption.
- [ ] Add per-tenant health scoring with color bands.
- [ ] Aggregate nightly into summary tables.
- [ ] Minimize PII and support tenant deletion.

## Key takeaways

- Start analytics from **questions**, not from tracking everything.
- A consistent **event taxonomy** is the difference between insight
  and noise.
- In B2B, **group by tenant first** - account health predicts churn.
- Track a focused set: activation, time to value, weekly active
  tenants, adoption, retention, and net revenue retention.
- Build **red/yellow/green health signals** and turn them into a daily
  worklist.
- Avoid vanity metrics; keep the pipeline simple and privacy-aware.

Analytics tells you what happens. The next chapter gives you the console
to act on it: the admin dashboard.
