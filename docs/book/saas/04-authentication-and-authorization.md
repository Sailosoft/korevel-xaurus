---
title: Authentication and Authorization
description: Chapter 4 - the auth module for a solo B2B SaaS, from sessions and SSO to least-privilege authorization.
---

Authentication answers "who are you?" Authorization answers "what may
you do?" Founders often blur the two, then ship a product where logging
in is safe but permissions are a house of cards. This chapter separates
them cleanly and gives a solo founder a buildable, buyable auth module.

The good news: authentication is a solved commodity. You should almost
never build it from scratch. The interesting, differentiating work is
authorization - deciding what each role can see and do inside a tenant.

## By the end of this chapter

You will know which auth pieces to buy, how sessions and tokens should
work, how to layer authorization on top of membership, and how to add
enterprise expectations like SSO and MFA without derailing your roadmap.

## Buy authentication, own authorization

Authentication is a security-critical commodity. Rolling your own
password hashing, email verification, and session management is a
liability, not a virtue. Off-the-shelf providers handle the hard parts:
credential storage, bot and breach defenses, MFA, and social or
enterprise identity.

Authorization is the opposite. It encodes your product's rules about
roles, plans, and data. No provider can know that a "billing manager"
can see invoices but not user management. Own this layer.

| Concern | Buy (provider/library) | Build (your code) |
| --- | --- | --- |
| Password storage, hashing | Yes | No |
| Email verification, reset | Yes | No |
| MFA, social login | Yes | Configure only |
| SSO/SAML for enterprise | Yes | Configure only |
| Session issuance | Yes | Maybe |
| Roles and permissions | No | Yes |
| Plan-based feature gates | No | Yes |
| Per-tenant access rules | No | Yes |

:::tip

If building in-house, at minimum use a battle-tested library for
hashing and sessions and never store plaintext credentials. The
cheapest secure path is a managed identity provider with a generous
free tier while you are small.

:::

## Sessions, tokens, and the tenant context

A login is not the end of authentication; it is the beginning of a
session. Two shapes dominate:

- **Server sessions (cookies).** The server stores session state and the
  browser holds an opaque cookie. Easy to revoke, ideal for web apps.
- **Stateless tokens (JWT).** The token carries claims and is verified
  without a lookup. Great for APIs and services, but revocation is
  harder.

Most B2B SaaS ends up with both: cookies for the web app, tokens for the
API. Whichever you use, bind the session to a **membership**, not just a
user, and include the active tenant and role as claims. That is what
lets chapter 5's permissions work without an extra lookup on every
request.

Watch the token lifetimes:

| Token type | Lifetime | Stored where | Revocable |
| --- | --- | --- | --- |
| Web session cookie | Hours to days | Server session store | Yes |
| Access token | Minutes | Memory | Short-lived |
| Refresh token | Days to weeks | Secure httpOnly storage | Yes |
| API key | Until rotated | Hashed in DB | Yes |

:::caution

Never put secrets or full permission lists in a client-readable JWT and
then trust them blindly. Claims go stale: a user removed from a tenant
keeps access until the token expires. For sensitive actions, re-check
the membership server-side rather than trusting the token.

:::

## Model authorization in layers

Authorization becomes manageable when you separate three questions:

1. **Global role.** Are you a platform admin, or a regular user?
2. **Tenant role.** What is your role in this specific tenant?
3. **Resource rule.** Does this specific record allow your role to act?

Answering them in order keeps logic clear. A platform admin can
impersonate for support; a tenant owner can manage billing; a member can
edit their own records but not others'. Each layer narrows the previous.

Use a permission table rather than scattering role checks:

| Role | Read data | Write data | Manage users | Manage billing |
| --- | --- | --- | --- | --- |
| Owner | Yes | Yes | Yes | Yes |
| Admin | Yes | Yes | Yes | No |
| Member | Yes | Yes | No | No |
| Viewer | Yes | No | No | No |

Storing this as data, not as `if (role === 'admin')` scattered across
the codebase, means you can add roles and plans without hunting down
every branch.

## Least privilege and defense in depth

Authorization is not one gate at the front door. Apply it at every
layer, because any single layer can be bypassed by a mistake elsewhere:

- **UI:** hide actions the role cannot perform - convenience, not
  security.
- **API:** reject unauthorized actions - the real boundary.
- **Service layer:** re-check before mutating tenant data.
- **Database:** row-level security as the final backstop.

Each layer assumes the others might fail. This is defense in depth, and
it is how solo founders survive a single bug without a data breach.

## Enterprise expectations come early

You will meet a prospect who asks about SSO long before you expect.
Enterprise buyers treat identity as a security requirement. You do not
need to build SSO - you need to be able to switch it on.

Keep the door open by:

- Storing users by verified email so an identity provider can match
  them later.
- Separating authentication from authorization so adding SAML or OIDC
  changes only the front door.
- Supporting MFA and session revocation from the start, because
  security reviews will ask.
- Recording an audit log of auth events (logins, failures, role
  changes).

You are not building enterprise features yet; you are refusing to build
anything that blocks them.

## Practical auth checklist

- [ ] Use a managed provider or vetted library for credentials, MFA,
      and resets.
- [ ] Bind sessions to memberships with tenant and role claims.
- [ ] Keep access tokens short-lived and refresh tokens revocable.
- [ ] Store roles and permissions as data, not hard-coded branches.
- [ ] Enforce authorization at the API and service layers, not just the
      UI.
- [ ] Add row-level security as a backstop.
- [ ] Log auth and permission events for audit and security reviews.
- [ ] Keep the identity model SSO-ready from day one.

## Key takeaways

- **Buy authentication, own authorization** - one is commodity, the
  other is your product.
- Bind sessions to **memberships**, and carry tenant and role as
  claims.
- Understand trade-offs between revocable sessions and stateless
  tokens; re-check sensitive actions server-side.
- Model authorization in **layers**: global, tenant, and resource.
- Apply **defense in depth** across UI, API, service, and database.
- Design for **enterprise identity** early by keeping the model
  SSO-ready without building it prematurely.

Authentication gets users in the door. The next chapter handles what
they are inside the door: users, roles, and access control.
