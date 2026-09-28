---
title: Infrastructure and DevOps for Solo Founders
description: Chapter 15 - choosing and operating infrastructure that a single person can run reliably.
---

Infrastructure is where solo founders either gain leverage or drown. A
managed platform lets one person operate a product serving thousands;
a hand-rolled cluster can consume every hour you have. The goal is not
the most impressive stack - it is the stack you can deploy, monitor,
and fix alone at 2 a.m.

This chapter is about choosing boring infrastructure, automating
deploys, managing environments and secrets, and planning for the day
you outgrow your first setup.

## By the end of this chapter

You will know how to select infrastructure for operability over
novelty, run one-command deployments, separate environments and secrets
safely, and build a scaling path that does not require a rewrite.

## Optimize for operability, not novelty

The best infrastructure for a solo founder is the one with the fewest
moving parts that still meets your needs. Every additional service is
another thing to patch, monitor, and pay for.

| Choice | Solo-friendly | Why |
| --- | --- | --- |
| Managed Postgres | Yes | Backups, failover, patching included |
| Managed app platform | Yes | Deploys, TLS, scaling handled |
| Self-managed Kubernetes | Rarely | High operational burden |
| Managed queue/cache | Usually | Reliable, low effort |
| Object storage | Yes | Durable, cheap, no servers |
| Serverless for spiky work | Sometimes | Great fit for bursts |

Start at the managed end of every spectrum. Move down only when a
specific limitation forces you, not because a blog post said so.

:::tip

Prefer platforms that make **deploys and rollbacks one command** and
**backups automatic**. Your ability to recover quickly matters far
more than your peak efficiency. Boring infrastructure that heals beats
clever infrastructure that needs you.

:::

## Establish environments

You need at least three states: local, staging, and production. Never
debug in production.

- **Local:** fast iteration with seed data; no real customer data.
- **Staging:** production-like, used to validate migrations and
  releases before they touch customers.
- **Production:** real customers; change it through deploys, not by
  hand.

Keep environment configuration in code and versioned, so a new
environment is reproducible. The rule that saves weekends: **no manual
changes in production.** If a fix is needed, it goes through the same
deploy pipeline as any change.

## Automate the pipeline

Continuous delivery (covered in the development handbook) is your
safety net. For a SaaS specifically, the pipeline must also handle
migrations and rollouts:

1. **Build once** and promote the same artifact across environments.
2. **Run tests** on every change.
3. **Migrate the database** in a controlled step (chapter 13).
4. **Deploy with a rollback path** - one command back to the last good
   version.
5. **Smoke test** after deploy and alert on failure.
6. **Release behind feature flags** so risky changes can be disabled
   without a redeploy.

| Stage | Must pass before next |
| --- | --- |
| Build | Compiles, dependencies locked |
| Test | Unit, integration, migration check |
| Stage | Smoke tests with prod-like data |
| Deploy | Health checks, error-rate watch |
| Post-deploy | Alerts silent, metrics normal |

## Manage secrets and configuration

Secrets are the easiest way to turn a small mistake into a breach.

- **Never commit secrets** to version control - not even in "temporary"
  files.
- **Use a secret manager** or your platform's encrypted store.
- **Scope secrets per environment** so staging keys cannot touch
  production data.
- **Rotate on a schedule** and immediately when someone leaves or a
  leak is suspected.
- **Audit access** to secrets, and prefer short-lived credentials to
  long-lived keys.

Configuration that is not secret belongs in versioned files with
sensible defaults. The fewer places behavior can differ between
environments, the fewer "works on staging" mysteries you will chase.

## Plan the scaling path

You do not need to scale on day one, but you should know the next step
before you need it. A typical solo progression:

| Stage | Signal | Move |
| --- | --- | --- |
| Single server | Launch | Managed platform, one instance |
| Vertical | Slow responses | Bigger instance, add indexes |
| Read replicas | Read-heavy load | Offload reads, add cache |
| Horizontal | Traffic grows | Multiple app instances, session store |
| Separated services | Specific bottleneck | Extract jobs, search, or analytics |

Each step should be **incremental**, not a rewrite. That is the payoff
of the modular design in this book: auth, billing, jobs, and analytics
are already separated, so you can scale or extract them independently.

:::caution

Beware premature infrastructure. Kubernetes, microservices, and
multi-region setups before product-market fit are expensive hobbies
dressed as engineering. The scalable choice at zero customers is
almost always the simpler one; keep the scaling path in mind, but do
not pay for it early.

:::

## Cost and continuity

Infrastructure decisions are financial decisions. Watch three numbers:

- **Monthly run rate** per environment, and which services dominate it.
- **Cost per tenant** at your current scale - does it fall as you grow?
- **Recovery cost** - what would an outage or data loss actually cost?

Set spend alerts, tag resources by environment, and delete abandoned
ones. For continuity, verify that **backups are tested** by restoring
them, and keep an off-provider copy of critical data. An untested
backup is a hope, not a plan.

## Infrastructure checklist

- [ ] Choose managed services wherever they meet your needs.
- [ ] Maintain local, staging, and production environments.
- [ ] Ban manual production changes; everything goes through deploys.
- [ ] Build one-command deploy and rollback.
- [ ] Run migrations as a controlled pipeline step.
- [ ] Store secrets in a manager, scoped per environment, rotated.
- [ ] Document the next scaling step before you need it.
- [ ] Test backups by restoring them, and keep an off-provider copy.

## Key takeaways

- Optimize infrastructure for **operability**, not novelty.
- Maintain **local, staging, and production**, and never change
  production by hand.
- Automate one-command **deploy and rollback**, with migrations as a
  pipeline step.
- Manage **secrets** in a scoped, rotated manager - never in version
  control.
- Know your **scaling path**; scale incrementally, not by rewrite.
- Watch **cost per tenant** and test your backups.

Reliable infrastructure still fails sometimes. The next chapter makes
failures visible and fixable: observability and incidents.
