---
title: Finding a Narrow, Painful Problem
description: Chapter 2 - how a solo founder finds a small, urgent, B2B problem worth paying for.
---

You can build every module in this book perfectly and still fail if you
solve a problem nobody has. The single highest-leverage activity of a
solo founder is choosing the right problem before choosing the right
architecture. This chapter is about narrowing - not brainstorming.

Most first-time founders pick problems that are *interesting* to them
rather than *urgent* to a buyer. Interesting problems produce elegant
software with no customers. Urgent problems produce ugly software with a
waiting list. Pick urgent, then make it elegant over time.

## By the end of this chapter

You will have a repeatable method for discovering, filtering, and
validating a narrow B2B problem, plus a scoring model you can apply to
three candidates this week without writing any code.

## The narrow problem thesis

A good SaaS problem for a solo founder is narrow enough that one person
can serve it, painful enough that a business pays to make it stop, and
frequent enough that the payment recurs. Narrowness is not a limitation;
it is the reason you can win.

Consider the difference:

| Problem | Narrow? | Painful? | Recurring? | Verdict |
| --- | --- | --- | --- | --- |
| "Project management" | No | Sometimes | Yes | Crowded, undifferentiated |
| "Asana for enterprises" | No | Yes | Yes | Funded incumbents |
| "Shift handoff notes for dental clinics" | Yes | Yes | Daily | Strong candidate |
| "Invoicing for freelance illustrators" | Somewhat | Yes | Monthly | Viable niche |
| "A better todo app" | No | Low | Weak | Hobby project |

The winning rows are small enough to name a specific buyer and specify
where they hang out. If you cannot name the buyer's job title and the
tool they currently use to cope, you are not narrow enough yet.

## Where narrow problems hide

You do not need a stroke of genius. You need to listen in the right
places. Five reliable sources:

1. **Your own work.** The spreadsheet your team maintains by hand, the
   process that breaks every month, the thing you wish existed. You are
   your easiest first customer.
2. **Complaint channels.** Subreddits, niche forums, Slack communities,
   and review sites for incumbents. Sort reviews by one and two stars -
   complaints are demand.
3. **Service businesses disguised as software.** Consultants doing
   repeatable work by hand are pre-paying customers for automation.
4. **Spreadsheet archaeology.** A shared spreadsheet held together with
   macros is a business process waiting to become a product.
5. **The "second tool" gap.** Look at what people use *alongside* an
   existing tool. Integrations and gaps are where new products live.

:::tip

The best validation is a person who currently pays money - or time - to
cope with the problem. If they are spending budget or hours on it today,
you do not need to educate them about the problem; you only need to be
better and easier.

:::

## The scoring model

Once you have candidates, rank them. Score each from 1 (weak) to 5
(strong) on six dimensions. Total the scores; anything under 20 is a
hobby, 20-26 is viable, and 27+ is worth committing to.

| Dimension | Question | Weight |
| --- | --- | --- |
| Urgency | Does it hurt this week, not someday? | x2 |
| Frequency | Does the pain recur daily or weekly? | x2 |
| Willingness to pay | Is there an existing budget line? | x2 |
| Reachability | Can I find these buyers cheaply? | x1 |
| Solo-serviceable | Can one person deliver the outcome? | x1 |
| Defensibility | Does usage create a wedge over time? | x1 |

Weighting urgency, frequency, and willingness to pay twice signals the
truth of B2B: a rare, mild, free problem is never a business, no matter
how much you love the technology.

## Validate before you build

Validation is not asking friends if they like your idea. It is
collecting evidence that someone will change their behavior - ideally
their wallet - for a solution. Run a ladder of cheap tests, cheapest
first:

- **Problem interviews (20-30 min, 10-15 people).** Ask about the last
  time they faced the problem, what they did, and what it cost. Never
  pitch. You are collecting stories, not compliments.
- **A landing page with a real call to action.** "Join the waitlist" is
  weak; "Book a 20-minute call" or "pay $1 to reserve" is signal.
- **Concierge delivery.** Solve the problem by hand for one customer.
  If you cannot deliver the outcome manually, software will not save
  you.
- **A paid pilot.** Even a small payment separates polite interest from
  demand. The first dollar is the hardest and the most informative.

:::caution

Beware the validation trap of enthusiastic non-buyers. People love to
say "I would totally use that" while never opening their calendar or
wallet. Treat interest without a scheduled next step as a polite no.

:::

## Define the smallest sellable outcome

Once validated, write one sentence: "With this product, [buyer] can
[achieve outcome] in [time] instead of [current painful way]." This
sentence is your North Star. It constrains your entire first release.

If your sentence is "help teams collaborate better," rewrite it. If your
sentence is "let a dental office close shift handoffs in four minutes
instead of thirty, with zero lost notes," you are ready. The second
sentence tells you exactly what to build first - and, just as
importantly, what to ignore.

Your first release should be the smallest thing that delivers the
outcome end to end, even if it is ugly and manual behind the scenes.
Sellable beats polished.

## Signals to walk away

Good founders kill weak ideas fast. Walk away when:

- Nobody currently spends time, money, or workaround effort on the
  problem.
- The buyer is enthusiastic but has no authority to pay.
- The problem requires changing behavior across a whole organization.
- You cannot reach the buyers without an enterprise sales team.
- The only reason you like it is the technology.

Walking away from a bad problem in week two costs you two weeks. Walking
away in month twelve costs you a year. Discipline here is leverage later.

## This week's checklist

- [ ] List five problems you have personally experienced or observed
      paying customers cope with.
- [ ] Score each against the six-dimension model.
- [ ] Pick the top candidate and name its buyer by job title and the
      tool they use today.
- [ ] Schedule five problem interviews this week; ask about past
      behavior, not future intent.
- [ ] Write the one-sentence outcome statement and define the smallest
      sellable version.
- [ ] Decide in advance what evidence would make you walk away.

## Key takeaways

- Choose a **narrow, painful, recurring** problem before choosing
  architecture.
- Find problems where budgets and workarounds already exist.
- Score candidates on urgency, frequency, willingness to pay,
  reachability, solo-serviceability, and defensibility.
- Validate with behavior - interviews, landing pages, concierge
  delivery, paid pilots - not compliments.
- Write a one-sentence outcome statement and ship the smallest
  sellable version.
- **Kill weak ideas fast**; discipline in problem selection is your
  greatest solo advantage.

With a validated problem in hand, the next chapter turns to the
architectural backbone that makes every later module possible:
multi-tenancy.
