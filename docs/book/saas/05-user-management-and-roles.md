---
title: User Management, Roles, and RBAC
description: Chapter 5 - managing users, invitations, roles, and permissions inside a multi-tenant B2B SaaS.
---

Authentication gets a person logged in. User management decides who
belongs, what they can do, and who controls the roster. For a B2B
product this is a core module, not an afterthought - the buyer's first
administrative job after signing up is usually "add my team."

This chapter covers invitations, membership lifecycle, roles, and the
access-control model that keeps permissions sane as you grow from three
roles to thirty.

## By the end of this chapter

You will know how to design invitations and memberships, how to build a
role-based access control (RBAC) system that survives feature growth,
and how to avoid the permission sprawl that turns admin panels into
liability.

## Users are global; memberships are per tenant

Chapter 3 established the distinction. Here is the practical
consequence: a single user record can belong to many tenants through
memberships, and each membership carries its own role and status.

| Entity | Scope | Holds |
| --- | --- | --- |
| User | Global | Identity, email, profile |
| Membership | Per tenant | Role, status, joined date |
| Invitation | Per tenant | Email, proposed role, expiry |

This model means an accountant who works for five clients uses one
login and switches tenants, rather than juggling five accounts. It also
means removing a user from one tenant never touches their other
relationships.

## Invitations are the onboarding moment

Most B2B customers never sign up alone - they are invited. Your
invitation flow is the first administrative experience a buyer has, so
make it clean:

1. **An authorized member invites by email** and selects a role up
   front.
2. **You send a signed, expiring link** scoped to that tenant and role.
3. **The invitee accepts**, creating or matching a user record.
4. **A membership is created** with the proposed role and active
   status.

Track invitations as first-class records with status and expiry. Support
empty invitations, resend, revocation, and role changes before
acceptance. Small touches - "Acme invited you" in the subject, a clear
tenant name on the accept page - prevent a surprising amount of
confusion.

:::tip

Send a daily digest of pending invitations to tenant admins. Most
"our teammate never got access" tickets are actually pending
invitations the admin forgot to resend. A digest removes a recurring
support burden for free.

:::

## The membership lifecycle

A membership moves through states, and every state must be handled
explicitly or you will create zombie access.

| Status | Meaning | Can log in | Counts toward billing |
| --- | --- | --- | --- |
| Invited | Invitation sent | No | No |
| Active | Normal member | Yes | Usually yes |
| Suspended | Temporarily blocked | No | Depends |
| Removed | Off the roster | No | No |

Decide early whether suspended and removed members count toward seat
billing. Whichever you choose, make it visible on the billing page so
customers are not surprised. Ambiguity here generates disputes.

## RBAC: roles as data, not branches

Role-based access control assigns permissions to roles, and roles to
memberships. The naive version - `if (user.role === 'admin')` in
twenty files - collapses the moment you add a "finance" role.

Do it properly with a small permission catalog:

- **Permission:** a verb plus a resource, e.g. `invoice:read`,
  `user:invite`, `billing:manage`.
- **Role:** a named bundle of permissions, e.g. `Owner`, `Admin`,
  `Member`, `Viewer`.
- **Membership:** references a role within a tenant.

Now granting a new capability is a data change, not a code change. You
can add a "Support" role, expose custom roles to larger customers, and
audit who can do what, all from configuration.

| Permission | Viewer | Member | Admin | Owner |
| --- | --- | --- | --- | --- |
| `record:read` | Yes | Yes | Yes | Yes |
| `record:write` | No | Yes | Yes | Yes |
| `user:invite` | No | No | Yes | Yes |
| `billing:manage` | No | No | No | Yes |
| `tenant:delete` | No | No | No | Yes |

:::caution

Protect the last owner. If the only owner leaves or is removed, the
tenant is orphaned with no one able to manage billing or roles. Enforce
that at least one active owner always remains, and give platform support
a safe, audited recovery path.

:::

## Guardrails for permissions

RBAC is powerful and easy to over-apply. Keep it disciplined:

- **Start with four roles.** Owner, Admin, Member, Viewer cover most
  B2B needs; resist building a role builder on day one.
- **Default to least privilege.** New members get the minimum, and
  admins elevate deliberately.
- **Never mix plan limits and roles.** "Can this role do X" is
  authorization; "does this plan include X" is entitlement. Keep them
  separate or you will fight bugs in both forever.
- **Make permission checks explicit.** A helper like
  `can(actor, 'invoice:read', invoice)` beats ad-hoc conditionals.
- **Log role changes.** Who granted what, to whom, and when - essential
  for support and security.

## Admin ergonomics

Your buyer's admin experience is a competitive feature. A few
high-leverage touches:

- A single team page listing members, roles, and status with inline
  edits.
- Clear messaging when an action is blocked by role or plan.
- Bulk operations for larger teams (invite several emails at once).
- A visible "last active" column to spot unused seats.
- In-app explanation of what each role can do.

Supporting enterprise expectations means remembering that the person
paying you is often not the person using the product daily. Give the
buyer control, and give the user a frictionless experience.

## Practical checklist

- [ ] Model users globally and memberships per tenant.
- [ ] Treat invitations as first-class records with expiry and status.
- [ ] Define a permission catalog and map roles to permissions as
      data.
- [ ] Enforce at least one active owner per tenant.
- [ ] Separate authorization (roles) from entitlement (plan limits).
- [ ] Default new members to least privilege.
- [ ] Log all role and membership changes.
- [ ] Give admins a clear, ergonomic team page.

## Key takeaways

- **Users are global; memberships are per tenant** - this keeps
  multi-tenant users sane.
- Invitations are the buyer's first admin experience; make them
  reliable and clear.
- Handle the **full membership lifecycle** or you create zombie
  access.
- Build **RBAC as data** - permissions, roles, and memberships - not
  scattered branches.
- **Protect the last owner** and keep role changes audited.
- Separate **authorization from entitlement** to avoid compounding
  bugs.

With identity and access in place, the next chapter turns to how the
product makes money: billing and subscriptions.
