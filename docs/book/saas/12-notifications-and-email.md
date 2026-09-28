---
title: Notifications, Email, and Inboxes
description: Chapter 12 - designing transactional email, in-app notifications, and preferences that keep users informed without spamming them.
---

Notifications are how a SaaS product stays present between sessions.
They bring users back, warn them about problems, and confirm important
actions. They are also the fastest way to train users to ignore you.
The discipline is to send the fewest messages that deliver the most
value, through the right channel, at the right time.

This chapter covers transactional email, in-app notifications, and the
preferences model that keeps everything from collapsing into noise.

## By the end of this chapter

You will understand which messages are transactional versus
promotional, how to build reliable email delivery with a provider, how
to design in-app notification centers, and how to give users meaningful
control without letting them accidentally silence critical alerts.

## Classify every message

Before you send anything, classify it. The rules, compliance
requirements, and delivery expectations differ.

| Class | Examples | Can user disable? |
| --- | --- | --- |
| Critical transactional | Password reset, payment failure | No |
| Transactional | Receipt, invitation, assignment | Mostly no |
| Lifecycle | Onboarding tips, activation nudges | Yes, grouped |
| Digest | Weekly summary, usage report | Yes |
| Promotional | New feature, upgrade offer | Yes, with consent |

Critical transactional messages must always arrive - they are part of
the product's contract. Everything else should be controllable. Mixing
the two is how a password-reset email lands in a spam folder because a
user unsubscribed from "all emails."

:::caution

Never route critical transactional email through the same
unsubscribe mechanism as marketing. A user who opts out of product news
must still receive their password reset and payment failure notices.
Separate streams, separate consent, or you will lock people out of
their own accounts.

:::

## Build reliable email delivery

Email is deceptively hard. Deliverability depends on domain reputation,
authentication, and content. Outsource the sending, own the content and
timing.

- **Use a transactional email provider** for sending and delivery
  analytics.
- **Authenticate your domain** with SPF, DKIM, and DMARC so mailbox
  providers trust you.
- **Send from a consistent domain,** and keep a separate subdomain for
  marketing if you do both.
- **Track bounces and complaints** and act on them; never keep sending
  to hard bounces.
- **Templatize** messages so content changes never touch code paths.
- **Queue sends** so a provider outage does not fail the user's action.

| Concern | Practice |
| --- | --- |
| Domain trust | SPF, DKIM, DMARC configured |
| Bounces | Suppress hard bounces immediately |
| Complaints | Auto-unsubscribe on complaint |
| Rendering | Test in major clients; keep HTML simple |
| Timing | Send at the recipient's reasonable hour |

## Design transactional flows

A handful of flows carry most of the value. Build them deliberately:

1. **Verification and password reset.** Fast, single-purpose, with a
   clear expiry and one big action button.
2. **Invitation.** Names the tenant and inviter, states the role, and
   expires cleanly.
3. **Assignment or mention.** Tells the user exactly what needs them
   and links straight to it.
4. **Billing events.** Receipt, payment failed, plan changed - plus a
   link to fix problems.
5. **Security alerts.** New device, password change, key created.

Each should answer three questions in the first two lines: what
happened, why it matters, and what to do next.

:::tip

Add a "why am I getting this?" line and a single primary action to
every transactional email. It reduces support tickets and improves
click-through more than any subject-line tweak.

:::

## In-app notifications and the notification center

Not every event deserves an email. In-app notifications are cheaper,
less intrusive, and perfect for activity within the product.

- **A bell or inbox** showing recent notifications per user.
- **Read and unread state** that syncs across devices.
- **Deep links** that jump to the exact record.
- **Grouping** so ten mentions become one grouped entry.
- **Real-time updates** where it matters (mentions, assignments),
  polling where it does not.

For B2B, also consider **tenant-level notifications** - alerts to
admins about team activity, seat limits, or health warnings. Keep them
distinct from personal notifications so individuals are not buried.

## Respect preferences and quiet hours

Control is what separates helpful from hostile. Give users a preferences
page with grouped categories:

| Category | Channels | Default |
| --- | --- | --- |
| Security alerts | Email, in-app | On, not disableable |
| Assignments and mentions | Email, in-app, push | On |
| Team activity | In-app | On |
| Weekly digest | Email | On |
| Product news | Email | Off until opted in |

Add **quiet hours** and **digest batching** so messages respect the
recipient's time. Many users do not want fewer messages; they want them
**grouped and predictable**. A daily digest at 8 a.m. often beats five
real-time emails.

## Measure and prune

Notifications have metrics too. Track them or they will grow
uncontrollably:

- **Delivery and open rates** per message type.
- **Click-through** to the intended action.
- **Unsubscribe rates** - a spike means you are over-sending.
- **Notification fatigue signals:** users disabling categories en
  masse.

Prune ruthlessly. If a notification has a low click rate and a high
disable rate, delete it. Fewer, better messages protect the channel for
the ones that matter.

## Notifications checklist

- [ ] Classify every message as critical transactional, transactional,
      lifecycle, digest, or promotional.
- [ ] Separate critical transactional sending from marketing consent.
- [ ] Authenticate your domain with SPF, DKIM, and DMARC.
- [ ] Use a provider with bounce and complaint handling.
- [ ] Build verification, invitation, assignment, and billing flows.
- [ ] Add an in-app notification center with read state and deep
      links.
- [ ] Provide grouped preferences and quiet hours.
- [ ] Measure open, click, and unsubscribe rates, and prune low-value
      messages.

## Key takeaways

- Send the **fewest messages that deliver the most value**, on the
  right channel.
- **Classify messages**; critical transactional alerts must never be
  unsubscribable.
- Outsource sending, **own content and timing**, and authenticate your
  domain.
- Build core flows - verification, invitation, assignment, billing -
  with a clear next action.
- Use an **in-app notification center** for activity that does not
  warrant email.
- Give users **grouped preferences and quiet hours**, and prune
  relentlessly.

Notifications connect users to events. The next chapter builds the
foundation beneath all of it: data modeling and migrations.
