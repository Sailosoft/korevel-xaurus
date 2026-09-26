---
title: Background Jobs and Queues
description: Chapter 14 - moving slow, retryable, and scheduled work out of the request path with jobs and queues.
---

Some work should never happen while a user waits. Sending emails,
generating reports, syncing integrations, processing webhooks, and
running nightly aggregations all belong in the background. Without a job
system, a solo founder either blocks users with slow requests or loses
work when requests fail. Jobs and queues are how a SaaS stays both fast
and reliable.

This chapter covers how to choose what moves off the request path, how
to design jobs for reliability, and how to keep background work
tenant-safe.

## By the end of this chapter

You will know when to use background jobs, how to make them idempotent
and safely retryable, how to schedule recurring work, and how to
observe and dead-letter failures so nothing disappears silently.

## Decide what belongs in the background

A request should do the minimum needed to respond, then hand off the
rest. Move work to a job when it is slow, unreliable, or needs retries.

| Work | In request? | Background? |
| --- | --- | --- |
| Return a list of invoices | Yes | No |
| Send a receipt email | No | Yes |
| Generate a large PDF report | No | Yes |
| Charge a card via webhook | No | Yes |
| Sync data with a CRM | No | Yes |
| Nightly usage aggregation | No | Yes |
| Validate a form field | Yes | No |

The rule of thumb: if it touches another system, takes more than a
moment, or might fail and need a retry, it belongs in a job.

:::tip

Return a **job ID** to the user and show progress in the UI. "Your
report is being generated - we will email you" is a far better
experience than a spinner that times out, and it makes long work
feel intentional.

:::

## Design jobs to be idempotent

Queues deliver **at least once**, so any job can run twice. Build every
job so running it multiple times is harmless - this single discipline
prevents duplicated charges, emails, and records.

- **Use idempotency keys** for external calls (chapter 6 webhooks
  already rely on this).
- **Check-then-act with a unique constraint** so a duplicate insert
  fails safely.
- **Record processed event IDs** and skip repeats.
- **Make updates absolute, not incremental**, where possible -
  "set status to paid" beats "increment counter."

| Pattern | Bad | Good |
| --- | --- | --- |
| Email send | Send on every run | Record sent, skip duplicates |
| Counter update | Increment blindly | Recompute from source |
| Payment | Charge each attempt | Idempotency key at provider |
| Import | Insert duplicates | Upsert by external ID |

Idempotency is not optional in distributed systems; it is the price of
reliability.

## Model retries, backoff, and failure

A job system is only as good as its failure handling. Design it up
front:

1. **Retries with exponential backoff** for transient failures (network,
   rate limits, provider outages).
2. **Bounded attempts** so a permanently broken job does not loop
   forever.
3. **Dead-letter queue** for jobs that exhaust retries, preserved for
   inspection and manual replay.
4. **Distinguish retryable from fatal.** A validation error will never
   succeed; do not waste retries on it.
5. **Alert on dead letters.** A quiet dead-letter queue is a silent
   data-loss bug.

:::caution

Never let a failed job vanish without a trace. The worst background
failures are the invisible ones: a customer assumes an email was sent,
an integration stayed in sync, or a report was delivered. Every failure
must land somewhere a human can see.

:::

## Scheduled and recurring jobs

Some work is time-based rather than event-based. Handle it with a
scheduler that is itself reliable:

| Schedule | Job | Purpose |
| --- | --- | --- |
| Every few minutes | Process queued webhooks | Timeliness |
| Hourly | Retry failed integrations | Recovery |
| Nightly | Aggregate usage and metrics | Reporting |
| Daily | Send digests and health checks | Engagement |
| Monthly | Billing reconciliation | Correctness |

Two cautions for scheduled work. First, ensure **only one instance
runs** a given schedule; distributed cron without locking causes
duplicate work. Second, make scheduled jobs idempotent too - a scheduler
that fires twice should not double-charge or double-email.

## Tenant safety in background work

Background jobs are where tenant isolation is easiest to forget,
because there is no logged-in user providing context. Enforce the same
rules as the request path:

- **Resolve tenant from immutable IDs** in the job payload (an order
  ID, a subscription ID) - never trust a mutable `tenant_id` field
  alone.
- **Load the full tenant context** at the start of the job and pass it
  through explicitly.
- **Tag logs and metrics with the tenant ID** so you can trace per
  customer.
- **Respect per-tenant limits** in batch jobs so one large tenant
  cannot starve others.

A job that runs without tenant context is a latent cross-tenant bug.

## Observability for jobs

Jobs need the same visibility as requests:

- **Queue depth** - a growing backlog is your first warning.
- **Job latency** - time from enqueue to completion.
- **Success, retry, and failure rates** by job type.
- **Dead-letter contents** with enough context to replay.
- **Per-tenant fairness** - is one customer dominating the queue?

Add a simple internal page listing recent failures with a **replay**
button. Support and debugging become trivial when you can retry a job
from the console (chapter 10).

## Background jobs checklist

- [ ] Move slow, external, or retryable work out of the request path.
- [ ] Return a job ID and show progress to users.
- [ ] Make every job idempotent with keys or unique constraints.
- [ ] Retry with exponential backoff and bounded attempts.
- [ ] Route exhausted jobs to a dead-letter queue with alerts.
- [ ] Ensure scheduled jobs run once and are idempotent.
- [ ] Resolve tenant context from immutable IDs in every job.
- [ ] Monitor queue depth, latency, and failure rates, with replay.

## Key takeaways

- Keep requests fast; push **slow, unreliable, and scheduled** work to
  jobs.
- Design for **at-least-once delivery**: every job must be idempotent.
- Use **backoff, bounded retries, and a dead-letter queue** - and alert
  on failures.
- Make **scheduled jobs single-instance and idempotent**.
- Carry **tenant context from immutable IDs** in background work.
- Give jobs the same **observability and replay** as requests.

Jobs keep the system responsive and reliable. The next chapter builds
and runs the infrastructure that hosts all of this.
