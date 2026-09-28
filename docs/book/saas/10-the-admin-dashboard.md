---
title: The Admin Dashboard
description: Chapter 10 - building two admin surfaces for a SaaS: the customer's tenant admin and your platform operations console.
---

The word "admin" hides two very different products. One is the
**customer-facing admin** your buyers use to manage their team, billing,
and settings. The other is the **platform operations console** you use
to support customers, diagnose issues, and run the business. Confusing
them produces a console that is either too risky for customers or too
clumsy for you.

This chapter designs both, with the rule that separates them: customers
manage their own tenant; you manage the platform, carefully and
auditably.

## By the end of this chapter

You will understand what belongs in each admin surface, how to design a
safe platform console with impersonation and audit trails, how to expose
tenant settings without overwhelming users, and how to avoid the
security pitfalls that make internal tools dangerous.

## Two surfaces, two jobs

| Attribute | Customer tenant admin | Platform ops console |
| --- | --- | --- |
| Audience | Tenant owners and admins | You and your support staff |
| Scope | Their tenant only | All tenants |
| Priorities | Self-service, clarity | Diagnosis, control, safety |
| Risk | Low blast radius | High blast radius |
| Access | Role-gated in product | Restricted, audited, MFA |

Keep them physically and logically separate. The customer admin lives
at a normal product route; the platform console lives behind stronger
auth, a distinct URL, and ideally a separate deployment or network
boundary.

## The customer tenant admin

Your buyers expect to self-serve. A clean tenant admin covers the jobs
they will actually do:

- **Team management:** members, roles, invitations, status (chapter 5).
- **Billing:** plan, usage, invoices, payment method, cancellation.
- **Settings:** company profile, branding, timezone, integrations.
- **Security:** sessions, MFA, SSO configuration, audit log.
- **Usage:** seats used, limits, and what happens when they are hit.

Design principles:

- **Group by job, not by database table.** "Manage billing" beats
  "Subscriptions entity."
- **Explain limits before they are hit.** Show usage against the plan
  so upgrades feel intentional, not punitive.
- **Make destructive actions deliberate.** Requiring the tenant name to
  confirm deletion prevents accidents.

:::tip

Give every settings screen a short plain-language explanation of what
it changes and who is affected. Most B2B support tickets are "I did not
know what that toggle did," and one sentence per setting eliminates
them.

:::

## The platform operations console

Your console exists so you can help customers without asking them to
share screenshots. Build it early - it pays for itself in the first
month.

Core capabilities:

- **Search by tenant, user, email, or ID.** One search box across all
  entities, with clear tenant context on every result.
- **Tenant detail view:** plan, status, usage, members, recent events,
  health band from chapter 9.
- **Billing inspection:** provider events, invoices, and the local
  subscription mirror for support.
- **Impersonation for support:** act as a user to reproduce a bug.
- **Feature flags and entitlements:** toggle behavior per tenant.
- **Audit log:** every action you take, by whom and when.

Everything you do in the console should be logged and attributable.
Internal tools are a privilege, and the audit trail is what keeps them
safe.

## Impersonation, done safely

Impersonation is the most useful and most dangerous console feature.
Treat it like a loaded tool:

- **Require a reason.** Capture a ticket or note before borrowing a
  session.
- **Show a persistent banner.** Anyone impersonating should never
  forget they are in someone else's account.
- **Limit scope.** Read-only by default; write only when necessary and
  still logged.
- **Never expose passwords.** Impersonate sessions, not credentials.
- **Time-box access.** Sessions expire quickly and are revocable.
- **Notify on sensitive actions.** Flag when support changes data.

:::caution

Never let the platform console become a shared admin password or a
tool that bypasses tenant isolation silently. Every action must be tied
to a named operator and recorded. An unaudited superuser is the single
biggest internal security risk in a small SaaS.

:::

## Data exposure and least privilege

The console sees everything, so it must expose almost nothing by
default:

- **Mask sensitive fields** unless explicitly revealed, and log
  reveals.
- **Default to metadata** - see that a field exists, not its value.
- **Scope staff access by role** - not every operator needs billing or
  deletion rights.
- **Provide read-only modes** for junior support staff.
- **Separate dangerous operations** (data deletion, refunds, plan
  overrides) behind elevated approval.

Design the console so that the safe path is the easy path. If seeing
sensitive data requires friction, people will avoid unnecessary
exposure.

## Keeping both surfaces in sync

The customer admin and platform console read the same underlying data.
Avoid duplicated logic by:

- Sharing service-layer functions between both surfaces.
- Making the console a first-class consumer of the same APIs the
  product uses, plus internal-only endpoints.
- Centralizing entitlement checks so the console cannot grant access
  the product would deny.

When both surfaces read from one source, support and product never
disagree about what a customer should see.

## Admin checklist

- [ ] Separate the customer admin from the platform console.
- [ ] Put the platform console behind stronger auth, MFA, and a
      distinct URL.
- [ ] Group customer settings by job, not by table.
- [ ] Show usage against plan limits before customers hit them.
- [ ] Provide cross-entity search with clear tenant context.
- [ ] Implement impersonation with reasons, banners, and audit
      logging.
- [ ] Default the console to metadata and mask sensitive fields.
- [ ] Share service logic between both surfaces.

## Key takeaways

- "Admin" is **two products**: a customer self-service admin and your
  internal operations console.
- Keep them separated by audience, scope, and security posture.
- Design customer settings **by job**, and explain limits early.
- Build a console with **search, tenant detail, billing inspection,
  and feature flags**.
- Make **impersonation safe**: reasons, banners, scoping, expiry, and
  audit.
- Default to **least privilege and masked data**; log every action.

The admin console helps you operate the product. The next chapter opens
your product to others' systems: the public API and integrations.
