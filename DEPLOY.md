# Vercelga deploy qilish

## 1. PostgreSQL baza

Vercel serverless da SQLite ishlamaydi. Bepul PostgreSQL uchun:

- **[Neon](https://neon.tech)** — bepul tier, tez ro‘yxatdan o‘tish
- **[Vercel Postgres](https://vercel.com/storage/postgres)** — Vercel ichida

Bazani yaratgach, **Connection string** ni nusxalang (masalan: `postgresql://user:pass@host/db?sslmode=require`).

## 2. GitHub ga yuklash

Loyihani GitHub repoga push qiling (agar yo‘q bo‘lsa, repo yarating):

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 3. Vercel da loyihani ulash

1. [vercel.com](https://vercel.com) ga kiring → **Add New** → **Project**
2. GitHub reponi tanlang va **Import** bosing
3. **Environment Variables** qo‘shing:

| O‘zgaruvchi         | Qiymat |
|---------------------|--------|
| `DATABASE_URL`      | Neon yoki Vercel Postgres connection string |
| `NEXTAUTH_URL`      | `https://YOUR_PROJECT.vercel.app` (deploy dan keyin yangilaysiz) |
| `NEXTAUTH_SECRET`   | Istalgan uzoq tasodifiy matn (masalan: `openssl rand -base64 32`) |

4. **Deploy** bosing.

## 4. Birinchi deploy dan keyin

1. **NEXTAUTH_URL** ni Production da to‘g‘ri domen bilan yangilang: `https://your-project.vercel.app`
2. Baza bo‘sh bo‘lsa, mahsulotlar va admin yaratish uchun **bir marta** lokalda seed ishlating (o‘sha `DATABASE_URL` bilan):

```bash
# .env da DATABASE_URL=postgresql://... (production URL) qo‘ying, keyin:
npx prisma db seed
```

Shundan keyin saytda admin bilan kirish: **admin@digitalhub.uz** / **admin1234**

---

## Muammo: "prisma migrate deploy" build da xato beradi

### Railway + Vercel

Agar baza **Railway** da, build esa **Vercel** da bo‘lsa:

- Vercel **public** (tashqi) URL dan foydalanishi kerak. `postgres.railway.internal` faqat Railway ichida ishlaydi.
- Railway → PostgreSQL → **Variables** dan **public** connection string ni oling (host `*.railway.app` yoki `*.proxy.rlwy.net` bo‘ladi).
- Vercel da `DATABASE_URL` ni shu public URL ga qo‘ying va oxiriga `?sslmode=require` qo‘shing:
  ```
  postgresql://postgres:PAROL@roundhouse.proxy.rlwy.net:12345/railway?sslmode=require
  ```

### Build ni migratsiyasiz ishlatish (ixtiyoriy)

Agar build da `prisma migrate deploy` baribir ulanish xatosi bersa:

1. **Bir marta** migratsiyalarni lokalda ishga tushiring (`.env` da production `DATABASE_URL` bilan):
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
2. Vercel da **Settings** → **General** → **Build & Development Settings** → **Build Command** ni o‘zgartiring:
   - **Override** qiling va qiymatga yozing: `npm run build:vercel`
3. **Redeploy** qiling. Keyingi buildlar baza ga ulanishsiz o‘tadi.
