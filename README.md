# GameMarket

Full-stack marketplace MVP for ToS-compliant game asset trading.

## Stack

- Next.js 14 + TypeScript + TailwindCSS
- PostgreSQL + Prisma ORM
- NextAuth.js (Credentials, Google, Discord, Email magic link)
- Stripe checkout + escrow flow
- AES-256-GCM encryption for order credentials

## Features Implemented

- Auth routes: `/api/auth/register`, `/api/auth/login`, NextAuth at `/api/auth/[...nextauth]`
- Listings CRUD routes and UI pages
- Escrow-aware order creation and status transitions
- Review system with seller rating aggregation
- Stripe checkout + webhook endpoint
- Dashboard, profile, orders, chat, and admin pages
- Rate limiting + zod validation + input sanitization

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Generate Prisma client and run migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start app:

```bash
npm run dev
```

## Important Compliance Note

Only allow listings compliant with game publishers' Terms of Service. Accounts/items that violate ToS should be moderated and suspended.
