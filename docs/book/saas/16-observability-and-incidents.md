---
title: Observability, Logs, and Incidents
description: Chapter 16 - making a SaaS observable with logs, metrics, and traces, and responding to incidents calmly.
---

You cannot operate what you cannot see. Observability is the module
that answers "is the product healthy right now, and if not, why?" -
before your customers tell you. For a solo founder it is not optional:
there is no operations team to notice the fire. You are the on-call
engineer, and your tooling must do the noticing for you.

This chapter covers the three pillars of observability, tenant-aware
instrumentation, alerting that respects your sleep, and a small
incident process that keeps you calm when things break.

## By the end of this chapter

You will know how to instrument logs, metrics, and traces with tenant
context, define service-level indicators that match customer
experience, alert on symptoms rather than causes, and run a short,
effective incident response as a team of one.

## The three pillars

Observability rests on three complementary signals. Each answers a
different question, and you need all three.

| Pillar | Question | Example |
| --- | --- | --- |
| Logs | What happened in this case? | "Webhook signature failed for tenant X" |
| Metrics | How is the system trending? | Error rate, latency p95, queue depth |
| Traces | Where did this request spend time? | API call across DB, cache, provider |

Logs are for detail after something happens. Metrics are for detecting
and trending. Traces are for diagnosing where time or errors appear.
Start with structured logs and a few core metrics; add tracing when
latency or complexity demands it.

## Instrument with tenant context

In a multi-tenant SaaS, an unlabeled signal is nearly useless. Tag
everything with the tenant ID - and the request, user, and job IDs -
so you can answer "is this one customer or everyone?"

- **Structured logs** in JSON with consistent fields, not free-form
  strings.
- **Metrics** labeled by tenant where cardinality allows, or
  aggregated with a separate per-tenant view.
- **Traces** that include the tenant ID as a span attribute.
- **Correlation IDs** that link a user action across services and jobs.

Be careful with high-cardinality labels. Labeling a metric by tenant
can explode costs at scale; use per-tenant views or sampled traces for
deep dives.

:::tip

Log one structured line per request with method, route, status,
duration, tenant, and user. That single pattern answers most "what
happened?" questions without a tracing system, and it costs you one
middleware function.

:::

## Define service-level indicators

Do not alert on every metric. Define a few **service-level indicators
(SLIs)** that reflect what customers actually feel, and set objectives
(SLOs) around them.

| SLI | Measures | Target example |
| --- | --- | --- |
| Availability | Successful requests / total | 99.9% monthly |
| Latency | p95 response time | Under 300 ms |
| Error rate | 5xx / total requests | Under 0.5% |
| Job freshness | Time to process queue | Under 5 minutes |
| Login success | Successful / attempted | Above 99% |

When you set an SLO, you also set an **error budget**: the amount of
allowed failure. The budget turns "should we ship this risky change?"
into a data question - if you have burned most of your budget, slow
down.

:::caution

Alert on **symptoms**, not causes. "High CPU" is a cause that may or
may not affect customers; "checkout failing" is a symptom that always
matters. Symptom-based alerts prevent alert fatigue, which is the real
enemy - a founder who ignores alerts has no monitoring at all.

:::

## Build the monitoring stack

A practical, affordable stack for a solo founder:

1. **Structured logging** to a managed log service with search and
   retention.
2. **Metrics and dashboards** for the SLIs above, with one page for
   the whole system's health.
3. **Uptime checks** from outside your infrastructure, so you detect
   total outages.
4. **Error tracking** that groups exceptions and alerts on new ones.
5. **Job and queue monitoring** (chapter 14) with backlog and failure
   alerts.
6. **Alert routing** to a channel you actually watch, escalating to
   your phone only for the most critical signals.

Keep dashboards few and focused. One "system health" page beats twenty
charts no one reads.

## Run incidents calmly

When something breaks, process beats panic. A lightweight incident
workflow:

1. **Detect and declare.** If customers are affected, declare an
   incident in writing, even alone. Naming it focuses you.
2. **Mitigate first.** Stop the bleeding - roll back, disable a flag,
   scale up. Root cause comes later.
3. **Communicate.** Post a status page update and notify affected
   tenants; silence erodes trust more than the outage.
4. **Diagnose.** Use traces, logs, and recent changes to find the
   cause.
5. **Resolve and verify.** Confirm the fix with the SLIs, not with a
   feeling.
6. **Write a blameless postmortem.** Timeline, impact, cause, and
   follow-up actions with owners.

| Phase | Goal | Artifact |
| --- | --- | --- |
| Detect | Know it is happening | Alert or report |
| Mitigate | Restore service | Rollback or flag |
| Communicate | Maintain trust | Status update |
| Diagnose | Understand why | Traces and logs |
| Resolve | Confirm recovery | SLI returns to normal |
| Review | Prevent recurrence | Postmortem actions |

Support and observability meet here: when a customer reports an issue,
your logs and traces (with tenant context) let you answer quickly
instead of guessing.

## Observability checklist

- [ ] Emit structured logs with tenant, request, and user IDs.
- [ ] Track core metrics: availability, latency, errors, queue depth.
- [ ] Add traces for distributed or slow request paths.
- [ ] Define SLIs and SLOs with an error budget.
- [ ] Alert on symptoms, not causes, and route alerts deliberately.
- [ ] Add external uptime checks and error tracking.
- [ ] Keep few, focused dashboards.
- [ ] Run incidents with a written process and a blameless
      postmortem.

## Key takeaways

- **You cannot operate what you cannot see**; observability replaces
  the ops team you do not have.
- Use all three pillars: **logs for detail, metrics for trend, traces
  for location**.
- Tag every signal with **tenant context** for per-customer answers.
- Define a few **SLIs and SLOs**, and use the error budget to guide
  risk.
- Alert on **symptoms**, not causes, to avoid alert fatigue.
- Follow a calm **incident process**: mitigate, communicate, diagnose,
  review.

Visibility protects reliability. The next chapter protects the business
itself: security and compliance.
