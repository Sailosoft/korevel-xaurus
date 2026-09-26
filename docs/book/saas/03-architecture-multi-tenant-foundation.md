---
title: Multi-Tenant Architecture Foundations
description: Chapter 3 - how a solo founder designs multi-tenancy so every later module stays correct.
---

Every B2B SaaS is also a multi-tenant system, whether or not the founder
uses that word. One deployment serves many customers, and the most
expensive bugs in SaaS are the ones that leak one customer's data into
another's view. This chapter gives you the foundation that makes
authentication, billing, analytics, and permissions safe to build on
top of.

If you get multi-tenancy wrong, you will discover it in the worst way: a
support ticket that says "why can I see another company's invoice?"
Tenancy is not a feature. It is the floor your whole house stands on.

## By the end of this chapter

You will understand the tenant models available to a solo founder, how
to choose one without over-engineering, how to enforce tenant isolation
at the data layer, and how to keep tenant context from being forgotten
in any request path.

## What a tenant is

A **tenant** is the customer unit that owns data. In B2B it is usually a
company or organization, not an individual. Users belong to a tenant,
and every row that matters belongs to exactly one tenant.

Nail three definitions early:

- **Tenant:** the paying entity. All data is scoped to it.
- **User:** a person who authenticates and acts within one or more
  tenants.
- **Membership:** the link between a user and a tenant, carrying roles
  and status.

Keeping these three separate saves you enormous pain later. When users
can belong to multiple tenants - agencies, consultants, contractors -
membership is what makes that possible without duplicating accounts.

## Choose the isolation model

There are three common models. Each trades operational simplicity for
isolation strength.

| Model | Isolation | Complexity | Best for |
| --- | --- | --- | --- |
| Shared DB, shared schema | Weakest | Lowest | Solo founders, early stage |
| Shared DB, schema per tenant | Medium | Medium | Mid-stage, some compliance |
| Database per tenant | Strongest | Highest | Enterprise, regulated |

For a solo founder, start with **shared database, shared schema**, and
add a `tenant_id` column to every tenant-scoped table. It is the
cheapest to operate, the easiest to migrate, and it is what most
successful small SaaS products run on for years.

:::tip

You can defer the database-per-tenant model without regret. Design your
data access so every query goes through a tenant-scoped layer, and
migrating to stronger isolation later becomes a contained project
instead of a rewrite.

:::

## Enforce isolation at the data layer

A `tenant_id` column means nothing if developers can forget it. Push
enforcement down one layer so it is impossible to query without a
tenant. Three patterns, in increasing strength:

1. **A repository layer.** Every query takes a tenant context and
   appends the filter automatically. Developers never write raw
   tenant-scoped SQL by hand.
2. **Row-level security.** PostgreSQL policies filter rows by a session
   variable. Even a mistaken query cannot cross tenants because the
   database refuses to return other rows.
3. **Composite keys.** Make `(tenant_id, id)` the primary key so a row
   is meaningless without its tenant. Foreign keys include the tenant,
   and cross-tenant references fail at the schema level.

If you use Postgres, row-level security is the highest-value hour you
will spend this quarter. It converts a class of catastrophic bugs into
permission errors.

## Always carry tenant context

Isolation is only as good as the context in every request. Adopt a
strict rule: **no tenant-scoped operation happens without an explicit
tenant context object.** That context flows from the authenticated
session to every layer.

- Derive the tenant from the authenticated membership, never from a
  client-supplied parameter alone.
- Pass the context explicitly through service functions; avoid mutable
  globals that can leak between requests.
- In background jobs and webhooks, resolve the tenant from immutable
  identifiers (an order ID, a subscription ID) rather than trusting a
  payload field.
- In logs and traces, tag every entry with the tenant ID so you can
  diagnose per-customer issues.

:::caution

Never let the client choose which tenant to act on by passing a raw
`tenant_id` that you trust blindly. Always verify the authenticated user
has an active membership in that tenant. Tenant confusion and privilege
escalation are the same bug wearing different hats.

:::

## Designing the tenant record

Keep a single source of truth for the tenant. A minimal tenants table
carries the fields every other module needs:

| Field | Purpose |
| --- | --- |
| `id` | Stable identifier used across all modules |
| `slug` | Human-friendly URL segment, e.g. `/t/acme` |
| `name` | Display name |
| `status` | active, trialing, suspended, cancelled |
| `plan_id` | Link to the billing module |
| `created_at` | Lifecycle and analytics |

Notice that `status` and `plan_id` are the bridge to billing and access
control. Keeping them here, rather than scattered, means one place
answers "is this tenant allowed to use the product right now?"

## Tenancy and the rest of the book

Every later module inherits these decisions:

- **Auth** issues sessions bound to a membership, not just a user.
- **Billing** attaches subscriptions to tenants, never to individuals.
- **Analytics** groups every event by tenant for retention and health.
- **Admin** shows tenant-level controls and usage.
- **Security** audits cross-tenant access attempts.
- **Support** needs a tenant view to debug safely without seeing
  everything.

Decide tenancy once and the rest of the system falls into place. Skip
it and every module becomes a place where isolation can fail.

## A migration path, not a wall

You do not have to pick the perfect model forever. Plan a path:

- Start shared-schema with enforced `tenant_id`.
- Add read replicas and per-tenant rate limits as you grow.
- Move noisy or regulated tenants to dedicated schemas or databases.
- Keep the data-access layer identical so the move is invisible to
  product code.

The goal is a system where strengthening isolation is routine, not
traumatic.

## Starter checklist

- [ ] Define tenant, user, and membership as separate entities.
- [ ] Add `tenant_id` to every tenant-scoped table.
- [ ] Route all tenant-scoped queries through one enforced layer.
- [ ] Turn on row-level security if your database supports it.
- [ ] Derive tenant context from authenticated membership, never from
      client input alone.
- [ ] Tag logs, traces, and metrics with the tenant ID.
- [ ] Document your isolation model and the migration path away from
      it.

## Key takeaways

- Multi-tenancy is **the floor**, not a feature - every module depends
  on it.
- Model **tenant, user, and membership** separately; membership enables
  multi-tenant users cleanly.
- Start with **shared database, shared schema** and a mandatory
  `tenant_id`.
- Enforce isolation in a single data-access layer, ideally with
  **row-level security**.
- Always derive tenant context from authenticated membership, and never
  trust a client-supplied tenant ID.
- Design a **migration path** to stronger isolation so growth is
  routine.

With the tenancy floor poured, the next chapter builds the front door:
authentication and authorization.
