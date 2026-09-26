---
title: Security and Compliance Basics
description: Chapter 17 - the security posture and compliance foundations a solo SaaS founder must have before the first enterprise deal.
---

Security is not a feature you add at the end. It is a property of how
you built every module in this book. Compliance is the paperwork that
proves it to customers. For a solo founder, the goal is not a perfect
security program - it is a **defensible baseline** that protects
customer data and survives a buyer's security review.

This chapter covers the practical security controls that matter most,
how multi-tenancy connects to security, and the compliance basics that
unlock enterprise deals.

## By the end of this chapter

You will know the minimum viable security controls for a B2B SaaS, how
to prepare for a customer security questionnaire, what SOC 2 and GDPR
really require of a small team, and how to build a security habit
instead of a one-time project.

## Start from the threat model

You cannot defend against everything, so defend against what is likely.
For a small B2B SaaS, the realistic threats are:

| Threat | Likelihood | Primary defense |
| --- | --- | --- |
| Cross-tenant data leak | High | Isolation, RLS, tenant context |
| Stolen credentials | High | MFA, short sessions, rotation |
| Injection and XSS | Medium | Parameterized queries, output encoding |
| Dependency vulnerabilities | Medium | Patching, scanning |
| Insider misuse | Low-medium | Least privilege, audit logs |
| Data loss | Medium | Backups, tested restores |

Notice the top threat is the one this book has focused on since
chapter 3: tenant isolation. In multi-tenant SaaS, a leak between
customers is your most damaging and most likely failure, so most of
your energy belongs there.

:::tip

Write your threat model on one page and revisit it quarterly. A short,
honest list of what could go wrong and what you do about it is worth
more than an untouched security policy document, and it becomes
straightforward answers in security reviews.

:::

## The minimum viable controls

These controls cover the bulk of real-world risk and are achievable
solo:

- **Enforce MFA** on your own accounts and offer it to customers; make
  it mandatory for tenant admins.
- **Encrypt in transit and at rest** - TLS everywhere, encrypted
  database and backups.
- **Hash and salt credentials**; never store secrets in plaintext.
- **Apply least privilege** to both users (chapter 5) and your own
  infrastructure access.
- **Patch dependencies** continuously and scan them automatically.
- **Validate all input** and use parameterized queries to prevent
  injection.
- **Audit sensitive actions** - logins, permission changes, data
  exports, admin console actions.
- **Back up and test restores**; an untested backup is not a backup.

| Control | Effort | Why it matters |
| --- | --- | --- |
| MFA | Low | Blocks most account takeover |
| Encryption | Low (managed) | Protects data at rest and transit |
| RLS / tenant checks | Medium | Prevents the worst SaaS breach |
| Audit logging | Medium | Detection and accountability |
| Dependency scanning | Low | Catches known vulnerabilities |
| Tested backups | Low | Survives ransomware and mistakes |

## Multi-tenancy is a security control

Revisit the isolation work from chapters 3 and 13 with a security lens:

- **Defense in depth:** UI, API, service, and database each enforce
  isolation.
- **Deny by default:** a query without tenant context returns nothing.
- **Test isolation:** write automated tests that attempt cross-tenant
  access and expect failure.
- **Monitor for anomalies:** alert when a tenant's access patterns
  change suspiciously.
- **Audit impersonation:** every support action is logged (chapter 10).

An isolation test that runs in CI is one of the highest-value security
investments a small SaaS can make. It turns a latent disaster into a
failed build.

:::caution

Never treat "we are too small to be a target" as a security strategy.
Automated scanners and credential-stuffing bots do not discriminate by
company size. Most breaches of small SaaS products are opportunistic,
not targeted - and an enterprise buyer will walk away the moment your
security questionnaire reveals gaps.

:::

## Preparing for security reviews

Enterprise buyers send questionnaires (often based on the CAIQ or
similar). You do not need to answer perfectly; you need to answer
**honestly and completely**, and show a plan where you have gaps.

Assemble a **security pack** once and reuse it:

1. Architecture overview with the tenant-isolation model.
2. Data flow and a data-retention summary.
3. Control list mapped to common frameworks.
4. Incident-response and breach-notification process.
5. Subprocessor and hosting list.
6. Backup, encryption, and access-control descriptions.
7. A short roadmap for gaps you have not closed.

Having these ready turns a two-week sales delay into a two-day form.

## Compliance fundamentals

You do not need certifications to start, but you must handle the rules
that apply to you.

**SOC 2** is the enterprise trust standard. It requires documented
controls, evidence, and periodic audits. You do not need it on day
one, but you should design toward it: policy documents, access reviews,
change management, and monitoring all map to controls you can
implement now.

**GDPR and privacy laws** require a lawful basis for processing,
data-subject rights (access, deletion, portability), a data-processing
agreement with customers, and breach notification procedures. For a
multi-tenant SaaS, ensure you can **export and delete a tenant's data
completely** on request.

| Requirement | Practical action |
| --- | --- |
| Data subject access | Provide tenant data export |
| Right to erasure | Implement tenant deletion |
| Breach notification | Document process and timelines |
| Processing agreement | Template DPA ready |
| Subprocessors | Maintain a public list |

Note how closely compliance aligns with features you already built:
tenant deletion is both a privacy right and a churn offboarding flow.

## Build a security habit

Security degrades without routine. Make it recurring:

- **Quarterly:** review access, rotate secrets, revisit the threat
  model.
- **Monthly:** review dependency and vulnerability reports, patch.
- **Per release:** run the isolation tests and audit-log checks in CI.
- **On change:** update the security pack when architecture shifts.
- **On incident:** postmortem, then fix the control that failed.

Security is not a launch milestone. It is a maintenance discipline that
compounds, exactly like retention.

## Security checklist

- [ ] Write and revisit a one-page threat model quarterly.
- [ ] Enforce MFA for admins; offer it to all users.
- [ ] Encrypt data in transit and at rest.
- [ ] Apply least privilege to users and infrastructure.
- [ ] Automate dependency scanning and patch promptly.
- [ ] Run automated cross-tenant isolation tests in CI.
- [ ] Log and review sensitive and administrative actions.
- [ ] Prepare a reusable security pack and privacy documentation.

## Key takeaways

- Build a **defensible baseline**: MFA, encryption, least privilege,
  patching, audit logs, and tested backups.
- **Tenant isolation is your top security concern**; test it
  continuously.
- Prepare a **security pack** so enterprise reviews become a routine
  form.
- Design toward **SOC 2** and satisfy **privacy laws** with features
  like export and deletion.
- Treat security as a **recurring habit**, not a one-time project.
- Honesty about gaps, plus a roadmap, wins more deals than a perfect
  answer.

With the product trustworthy, the next chapter makes it lovable:
support and customer success.
