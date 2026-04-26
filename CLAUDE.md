# cod-platform-api

NestJS Core API — the financial brain of the COD Platform. Owns all business logic, data persistence, and third-party integrations.

## What This Repo Is

The primary backend service. Every financial calculation, order state transition, stock reservation, and external sync runs through here. This is where the core moat lives.

## What It Owns

- `finance/` — margin calculation engine (pure functions, no HTTP)
- `products/` — Product, ProductVariant, Collection
- `batches/` — Batch, BatchItem (polymorphic: purchase | production)
- `stock/` — StockItem, reservation logic, stock checks
- `orders/` — Order state machines, OrderItem, CarrierShipment, ReturnDetail
- `integrations/` — Converty sync, Fast Delivery, Linkex, future carriers and platforms
- `store/` — Store, StoreMember, capability flags, can(member, permission) resolver
- `auth/` — AuthPort interface + MockAuthAdapter (dev) + JwtAuthAdapter (prod)

## Stack

- NestJS (TypeScript)
- Prisma ORM → PostgreSQL
- Redis (job queues, caching)
- Jest (unit + integration tests)

## Session Protocol

Every agent, every coder, every session — no exceptions:

1. **Read this file first.** Do not write a single line of code before reading CLAUDE.md in full.
2. **Check the active plan.** Open `docs/superpowers/plans/` and find the current plan file. If no plan exists, run `/brainstorming` before touching any code.
3. **One task at a time.** Pick the next uncompleted task from the plan, implement it, test it, commit it, mark it done. Do not batch tasks across commits.
4. **Scope change or new feature?** Stop. Run `/brainstorming` first. Update the plan. Then implement.
5. **End of session.** Commit all changes. Mark completed tasks in the plan file.

## Docs Structure

All documentation lives under `docs/`. Superpowers skills write to fixed paths — never move or rename these folders:

```
docs/
  superpowers/
    specs/    ← design specs from /brainstorming  (YYYY-MM-DD-<topic>-design.md)
    plans/    ← implementation plans from /writing-plans
```

No other doc location is valid. If a skill tries to write elsewhere, redirect it here.

## Key Rules (expand during planning)

- Financial calculations are pure functions — no side effects, no DB access inside the engine
- Batch unit cost is immutable after creation — never write a migration that touches historical unit costs
- `is_cash_collected` is the only thing that makes revenue real — no aggregation bypasses this
- `can(member, permission)` is the single auth enforcement point — never inline role checks
- Auth is a port — `MockAuthAdapter` is the default in dev, `JwtAuthAdapter` in prod
- Schema accommodates all capabilities from day one — UI gates them, not the schema
- Every function in `finance/` has a unit test before it ships

## Vault References

- `COD Platform/Architecture/Data Model.md` — entity ownership, financial rules
- `COD Platform/Architecture/Store Capabilities.md` — capability flags and their effects
- `COD Platform/Architecture/Tech Stack.md` — service boundaries and integration phases
- `COD Platform/Rules/Development Rules.md` — non-negotiables and decision log
- `COD Platform/Roadmap/Build Order.md` — phase scope and done criteria

## Docs

Implementation plans and specs live in `docs/` — written during planning sessions using superpowers skills before any code is written.
