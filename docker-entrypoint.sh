#!/bin/sh
set -e
# Production: migratsiyalarni deploy qilish (Railway va boshqa hostlar uchun)
if [ -n "$DATABASE_URL" ]; then
  npx prisma migrate deploy
fi
exec node server.js
