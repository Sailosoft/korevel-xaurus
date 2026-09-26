---
title: The Public API and Integrations
description: Chapter 11 - designing a public API and integration surface that a solo founder can maintain and charge for.
---

A public API is how your product stops being an island. Businesses
rarely adopt a tool in isolation - they want it to talk to their CRM,
their data warehouse, their internal scripts. An API and a small set of
integrations turn your SaaS from a destination into infrastructure, and
infrastructure is far stickier.

The catch for a solo founder is maintenance. Every public endpoint is a
promise you keep forever. This chapter designs an API surface small
enough to sustain and valuable enough to matter.

## By the end of this chapter

You will know how to design a versioned REST API, authenticate it
safely, build webhooks and a first integration, and decide what to
expose versus keep private - without creating a maintenance monster.

## Design principles for a sustainable API

Your API should be boring, consistent, and small. Consistency beats
cleverness, because the API is consumed by strangers who will not read
your source.

- **Resource-oriented, plural nouns:** `/invoices`, `/customers`,
  `/members`.
- **Standard verbs:** `GET` read, `POST` create, `PATCH` update,
  `DELETE` remove.
- **Predictable responses:** stable JSON shapes, consistent envelopes,
  meaningful HTTP status codes.
- **Pagination everywhere:** cursor-based for lists; never return
  unbounded results.
- **Ids are opaque strings:** do not leak sequential databases or
  internal structure.
- **Errors are structured:** a code, a message, and a field when
  relevant.

| Concern | Good practice |
| --- | --- |
| Versioning | `/v1/` in the path; additive changes within a version |
| Pagination | Cursor + `has_more` + `next_cursor` |
| Filtering | Explicit query params, whitelisted fields |
| Rate limits | Per key, per tenant; return `429` with `Retry-After` |
| Idempotency | `Idempotency-Key` header for unsafe creates |
| Timestamps | ISO 8601 UTC, always |

:::tip

Design your API for the integration you wish existed. If you are the
first consumer of your own API - building your own dashboard or CLI on
top of it - you will discover the awkward parts before your customers
do.

:::

## Authentication and scoping for the API

Public APIs are consumed by machines, so sessions and cookies are out.
Use keys and tokens with explicit scopes:

- **API keys** for server-to-server calls, stored hashed, shown once,
  and rotatable.
- **Scopes** that limit what each key can do, e.g. `invoices:read`,
  `customers:write`.
- **Tenant binding:** every key belongs to a tenant; requests can never
  cross tenants.
- **Per-key rate limits** so one runaway script cannot take down the
  platform.
- **Rotation and revocation** built into the UI from day one.

The API inherits the isolation rules from chapter 3 and the
authorization rules from chapter 4. An API key is an actor with a role;
treat it with the same rigor as a user.

## Webhooks: letting your product push

REST is pull; many integrations need push. Webhooks notify external
systems when things happen. Design them with the same care as your
inbound API:

- **Subscribe to specific event types:** `invoice.paid`,
  `customer.created`, not a firehose.
- **Sign payloads** so receivers can verify authenticity.
- **Include an event ID and timestamp** for idempotency and ordering.
- **Retry with backoff** on non-2xx responses; stop after a bounded
  window.
- **Keep payloads lean:** send IDs and minimal data; let receivers call
  back for detail.
- **Provide a delivery log** in your UI so customers can debug without
  contacting you.

Webhook reliability is a trust feature. A silently dropped webhook
looks like a broken integration to the customer, even when your product
is fine.

:::caution

Never expose an endpoint that lets a caller enumerate other tenants by
guessing IDs, and never trust a `tenant_id` passed in a request body.
Derive the tenant from the authenticated key, always. A single
tenant-isolation bug in a public API is a breach, not a bug report.

:::

## The first integrations

You cannot build every integration. Pick the two or three that unblock
your target customers and prove the pattern.

| Integration type | Examples | Why it pays |
| --- | --- | --- |
| Communication | Slack, Teams | Alerts where people work |
| Productivity | Sheets, Notion | Data in and out easily |
| CRM | HubSpot, Salesforce | Ties product to pipeline |
| Data | Webhooks, S3 export | Enterprise data needs |
| Auth | SAML/OIDC providers | Enterprise deal unlock |

Prefer **webhook-based and copy-paste** integrations first - they are
cheap to build and maintain - before investing in deep, two-way
platforms. Then let an integration directory grow as demand proves
itself.

## Documentation and developer experience

Your docs are part of the product. A great API with bad docs is
unusable. Provide:

- **A quickstart** that works in five minutes with a key.
- **Reference docs** generated from a spec (OpenAPI) so they stay
  accurate.
- **Copy-paste examples** in the languages your customers use.
- **A sandbox or test mode** so nobody experiments in production.
- **Status and changelog** pages for trust and transparency.

Good developer experience reduces support load and increases API
revenue, which is why many SaaS products bill for higher API usage on
upper tiers.

## API and integration checklist

- [ ] Version the API from day one (`/v1/`).
- [ ] Use consistent resources, verbs, pagination, and errors.
- [ ] Authenticate with scoped keys bound to a tenant.
- [ ] Rate limit per key and return proper `429` responses.
- [ ] Support idempotency for unsafe create operations.
- [ ] Sign webhooks, retry with backoff, and log deliveries.
- [ ] Derive tenant context from the key, never from the body.
- [ ] Generate reference docs from a spec and ship a quickstart.

## Key takeaways

- A public API turns your product into **infrastructure**, which is
  stickier.
- Keep the API **small, consistent, and versioned** - every endpoint
  is a permanent promise.
- Authenticate with **scoped, tenant-bound keys** and rate limit per
  key.
- Build **webhooks** with signatures, retries, and a delivery log.
- Start with **webhook and copy-paste integrations** before deep
  platforms.
- Treat **documentation as product**; generate it from a spec.

With an API and integrations in place, the next chapter keeps customers
informed: notifications, email, and inboxes.
