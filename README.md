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

## Docker (lokal)

```bash
docker compose up --build
```

Brauzerda: http://localhost:3000. PostgreSQL `localhost:5432` da ishlaydi (parol: `postgres`).

## Railway deploy

1. [Railway](https://railway.app) da yangi loyiha oching, GitHub repo ulang.
2. **PostgreSQL** qo‘shing: Add Service → Database → PostgreSQL. Railway avtomatik `DATABASE_URL` ni beradi.
3. **Web Service** qo‘shing: repo tanlang; build avtomatik `Dockerfile` orqali ishlaydi.
4. Web servisga PostgreSQL ni ulang (Variables → Add Reference → `DATABASE_URL`).
5. O‘zgaruvchilarni to‘ldiring:
   - `NEXTAUTH_URL` = Railway domen (masalan `https://your-app.railway.app`)
   - `NEXTAUTH_SECRET` = `openssl rand -base64 32` natijasi
   - `ENCRYPTION_SECRET` = 32+ belgili maxfiy kalit
   - Qolganlar: `.env.example` dagi SMTP, Click, Payme va boshqalar (ixtiyoriy).
6. Deploy: har commit pushda avtomatik build va deploy bo‘ladi. Migratsiyalar container ishga tushganda `prisma migrate deploy` orqali bajariladi.

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

## Payment Webhook Security

`/api/payments/click`:
- Verifies Click callback signature (`sign_string`) using `CLICK_SECRET_KEY` (+ `CLICK_SERVICE_ID` check)
- Rejects stale callbacks by `sign_time` with configurable `CLICK_MAX_SKEW_SECONDS`
- Optional source IP whitelist via `CLICK_ALLOWED_IPS`

`/api/payments/payme`:
- Supports Payme JSON-RPC methods (`CheckPerformTransaction`, `CreateTransaction`, `PerformTransaction`, `CancelTransaction`, `CheckTransaction`)
- Verifies `Authorization: Basic ...` against `PAYME_MERCHANT_LOGIN` and `PAYME_SECRET_KEY`
- Optional source IP whitelist via `PAYME_ALLOWED_IPS`

Note:
- In `NODE_ENV=production`, invalid or unsigned webhook payloads are rejected.
- In development, a simple mock payload format is still accepted for quick local testing.
