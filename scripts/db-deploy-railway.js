/**
 * Railway (yoki boshqa Postgres) ga migrate + seed.
 * .env da DATABASE_URL=postgresql://...?sslmode=require qo'yib ishga tushiring:
 *   node scripts/db-deploy-railway.js
 * Yoki: npx prisma migrate deploy && npx prisma db seed
 */
if (!process.env.DATABASE_URL?.startsWith("postgresql://") && !process.env.DATABASE_URL?.startsWith("postgres://")) {
  console.error("DATABASE_URL .env da postgresql://... bo'lishi kerak (Railway DATABASE_PUBLIC_URL + ?sslmode=require)");
  process.exit(1);
}

const path = require("path");
const { execSync } = require("child_process");
const root = path.resolve(__dirname, "..");
const env = { ...process.env, DATABASE_URL: process.env.DATABASE_URL };
execSync("npx prisma migrate deploy", { stdio: "inherit", cwd: root, env });
execSync("npx prisma db seed", { stdio: "inherit", cwd: root, env });
console.log("Migrate va seed tugadi.");
