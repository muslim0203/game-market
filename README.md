# DigitalHub

Admin-only digital subscription accounts store (1shop-style): ChatGPT Plus, Gemini, Claude, Canva Pro, CapCut, Adobe va boshqa premium xizmatlar.

## Stack

- Next.js 14 + TypeScript + TailwindCSS
- PostgreSQL + Prisma ORM
- NextAuth.js (credentials, admin-only)
- Nodemailer (email delivery)
- AES-256-GCM encrypted credential storage

## Core Model

- `Product` — subscription products (price, duration, stock, active)
- `Account` — encrypted login/password pool for each product
- `Order` — UUID-based order lifecycle (`PENDING -> PAID -> DELIVERED`)
- `Admin` — dashboard credentials

## Main Routes

Public:
- `/` home
- `/products`
- `/products/[slug]`
- `/checkout/[id]`
- `/order/[id]`

Admin:
- `/admin` (login)
- `/admin/dashboard`
- `/admin/products`
- `/admin/orders`
- `/admin/accounts`

## API

Public:
- `GET /api/products`
- `GET /api/products/[slug]`
- `POST /api/orders`
- `GET /api/orders/[id]`
- `POST /api/payments/click`
- `POST /api/payments/payme`

Admin:
- `GET /api/admin/dashboard`
- `GET/POST /api/admin/products`
- `PUT/DELETE /api/admin/products/[id]`
- `POST /api/admin/accounts/bulk`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/[id]`
- `POST /api/admin/orders/[id]/deliver`

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Copy env and set values:

```bash
cp .env.example .env
```

3. Run prisma migrations:

```bash
npm run prisma:migrate
```

4. Start app:

```bash
npm run dev
```

## Admin Setup

Create an admin row manually (password must be bcrypt hash):

```sql
INSERT INTO "Admin" (email, password)
VALUES ('admin@example.com', '$2b$12$REPLACE_WITH_BCRYPT_HASH');
```

Tip: generate hash quickly with Node:

```bash
node -e "console.log(require('bcryptjs').hashSync('YourStrongPassword123', 12))"
```
