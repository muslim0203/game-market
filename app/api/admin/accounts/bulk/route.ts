import { NextResponse } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { encryptValue } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import { bulkAccountsSchema } from "@/lib/validations";

type ParsedRow = {
  login: string;
  password: string;
  extraInfo?: string;
};

function parseCsv(csv: string): ParsedRow[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const hasHeader = /^login\s*,\s*password/i.test(lines[0]);
  const rows = hasHeader ? lines.slice(1) : lines;

  const parsedRows: ParsedRow[] = [];

  for (const line of rows) {
    const [loginRaw, passwordRaw, ...rest] = line.split(",");

    if (!loginRaw || !passwordRaw) {
      continue;
    }

    parsedRows.push({
      login: loginRaw.trim(),
      password: passwordRaw.trim(),
      extraInfo: rest.join(",").trim() || undefined
    });
  }

  return parsedRows;
}

export async function POST(request: Request) {
  const session = await assertAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = bulkAccountsSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const rows = parseCsv(parsed.data.csv);

  if (!rows.length) {
    return NextResponse.json({ error: "No valid CSV rows found" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const payload = rows.map((row) => ({
    productId: parsed.data.productId,
    login: encryptValue(row.login),
    password: encryptValue(row.password),
    extraInfo: row.extraInfo ? encryptValue(row.extraInfo) : null
  }));

  await prisma.$transaction([
    prisma.account.createMany({ data: payload }),
    prisma.product.update({
      where: { id: parsed.data.productId },
      data: {
        stock: {
          increment: payload.length
        }
      }
    })
  ]);

  return NextResponse.json({
    data: {
      inserted: payload.length,
      productId: parsed.data.productId
    }
  });
}
