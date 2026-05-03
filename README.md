# cod-platform-api

NestJS Core API — the financial brain of the COD Platform.

## Purpose

Owns all business logic, data persistence, and third-party integrations for the COD Platform. Every financial calculation, order state transition, stock reservation, and external sync runs through here.

## Setup

```bash
npm install
npx prisma generate
```

## Run

```bash
# development (watch mode)
npm run start:dev

# production
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `AUTH_ADAPTER` | `mock` (dev) or `jwt` (prod) |
| `MOCK_USER_ID` | UUID used by MockAuthAdapter (required when `AUTH_ADAPTER=mock`) |
| `MOCK_STORE_ID` | Default store UUID for mock auth |

## Stack

- NestJS + TypeScript
- Prisma ORM → PostgreSQL
- Redis (queues, caching)
- Jest (unit + e2e tests)
