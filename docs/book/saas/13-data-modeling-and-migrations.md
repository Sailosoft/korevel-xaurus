---
title: Data Modeling, Schema, and Migrations
description: Chapter 13 - designing a resilient, tenant-aware schema and evolving it safely with migrations.
---

Your data model is the longest-lived part of your SaaS. UI frameworks
and hosting choices come and go, but the shape of your tables will
outlive them all. A well-designed schema makes new features cheap; a
bad one makes every change a fight. For a solo founder, schema
decisions are capital decisions.

This chapter covers tenant-aware modeling, keys, indexes, and the
discipline of migrations that never take your product down.

## By the end of this chapter

You will know how to design tenant-scoped tables, choose keys and
indexes that scale, denormalize deliberately, and run forward-only
migrations safely in production - including the ones that touch large
tables.

## Model tenants explicitly

Chapter 3 established the tenant as the unit of ownership. Make that
structural in the schema so isolation is enforced by the database, not
by developer memory.

- Every tenant-scoped table carries a `tenant_id` column, indexed.
- Consider **composite keys** like `(tenant_id, id)` so a row cannot be
  referenced without its tenant.
- Foreign keys should include the tenant, making cross-tenant
  references impossible at the schema level.
- Keep a **global** table (tenants, users, plans) separate from
  **tenant-scoped** tables so the boundary is obvious.

This structure means an accidental query that omits the tenant simply
returns nothing, rather than leaking another customer's data.

## Choose keys thoughtfully

Keys are forever. Changing them later is one of the most painful
migrations in software.

| Key choice | Pros | Cons |
| --- | --- | --- |
| Auto-increment integer | Simple, compact, fast | Guessable; leaks scale |
| UUIDv4 | Opaque, distributed | Random inserts fragment indexes |
| UUIDv7 / ULID | Opaque **and** time-ordered | Slightly newer tooling |
| Natural key (email) | Meaningful | Mutable; bad for references |

For most SaaS, **time-ordered opaque IDs (UUIDv7 or ULID)** are the
sweet spot: safe to expose, friendly to index locality, and stable
under distributed writes. Use natural keys only as unique constraints,
never as primary references.

:::tip

Expose an opaque `id` publicly and keep an internal numeric key
privately. Public IDs prevent enumeration and let you change internal
storage without breaking customer integrations.

:::

## Index for the queries you have

Indexes are the difference between a fast product and an outage.
Design them from real access patterns, not from guesswork.

- Index every foreign key and every `tenant_id`.
- Index columns used in `WHERE`, `ORDER BY`, and joins.
- Prefer **composite indexes** in the order of your filters, e.g.
  `(tenant_id, created_at)` for tenant-scoped time queries.
- Understand that every index slows writes - do not index everything.
- Review slow queries regularly and add indexes with evidence.

A query like "recent invoices for this tenant" wants
`(tenant_id, created_at DESC)`. Without it, you scan the whole table;
with it, you read a slice.

## Normalize first, denormalize deliberately

Start normalized - one fact in one place - because it prevents
contradictions. Then denormalize **only** when you have a measured
performance need, and keep the copy maintained with clear rules.

| Approach | Use when | Risk |
| --- | --- | --- |
| Normalized | Default for correctness | Joins cost time |
| Denormalized counters | Frequent aggregates | Drift from source |
| Materialized summaries | Reporting and dashboards | Staleness |
| Event log plus projection | Audit and rebuildability | Complexity |

Denormalized counters like `member_count` are fine if every mutation
updates them in the same transaction or via a reliable job. Unmaintained
counters are how dashboards start lying.

## Migrations must be forward-only and safe

Production migrations fail not because SQL is hard, but because they
lock tables or assume a schema state that is not true at deploy time.
Adopt a strict discipline:

1. **Migrations are versioned and forward-only.** Roll forward with a
   new migration; never roll back destructively.
2. **Separate schema changes from data backfills.** Change structure
   first, then move data in batches.
3. **Add nullable, backfill, then enforce.** Adding a `NOT NULL` column
   in one step locks and fails; add it nullable, fill it, then add the
   constraint.
4. **Rename with a bridge.** Add the new column, dual-write, migrate
   readers, then drop the old one.
5. **Avoid long locks.** Create indexes concurrently where supported;
   keep migrations small.
6. **Rehearse on a copy of production data.** A migration that works
   on empty tables can still lock a million-row table.

:::caution

Never run a destructive migration in the same deploy as the code that
depends on it. Deploy a schema that supports both old and new code,
migrate data safely, then remove the old path in a later deploy.
Reversibility in stages is what keeps deploys boring.

:::

## The expand-contract pattern

The safest way to change a schema for a live product is
**expand-contract**:

- **Expand:** add the new column or table; write to both old and new.
- **Migrate:** backfill historical data in batches; verify.
- **Shift reads:** switch the application to read from the new shape.
- **Contract:** stop writing the old shape and drop it after a safe
  window.

Each step is small, reversible in spirit, and independently deployable.
This is how you rename a column, split a table, or change a type
without downtime.

## Data modeling checklist

- [ ] Add `tenant_id` to every tenant-scoped table, indexed.
- [ ] Use composite keys where cross-tenant references must be
      impossible.
- [ ] Choose time-ordered opaque IDs; never expose sequential keys.
- [ ] Index foreign keys and common query patterns.
- [ ] Start normalized; denormalize only with evidence and maintenance
      rules.
- [ ] Keep migrations versioned, forward-only, and small.
- [ ] Separate schema changes from data backfills.
- [ ] Use expand-contract for every risky change.

## Key takeaways

- Your **data model outlives your stack**; treat schema as capital.
- Enforce tenancy **in the schema**, not just in code.
- Prefer **time-ordered opaque IDs** and never expose sequential
  keys.
- Index for real access patterns; understand the write cost.
- Normalize first, **denormalize with maintenance rules**.
- Migrate with **expand-contract**: add, backfill, shift, remove.

A solid schema is the substrate. The next chapter handles work that
should not run inside a request: background jobs and queues.
