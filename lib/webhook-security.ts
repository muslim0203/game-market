import { createHash, timingSafeEqual } from "crypto";

type ClickPayload = {
  click_trans_id: string;
  service_id: string;
  merchant_trans_id: string;
  merchant_prepare_id?: string;
  amount: string;
  action: string;
  sign_time: string;
  sign_string: string;
};

function normalizeHex(value: string) {
  return value.trim().toLowerCase();
}

export function getRequesterIp(headers: Headers) {
  const fromForwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const fromRealIp = headers.get("x-real-ip")?.trim();

  return fromForwarded || fromRealIp || "unknown";
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

function md5(value: string) {
  return createHash("md5").update(value).digest("hex");
}

function parseTimestamp(value: string) {
  if (/^\d+$/.test(value)) {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
      return null;
    }

    return numeric > 10_000_000_000 ? numeric : numeric * 1000;
  }

  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const withZone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(normalized) ? normalized : `${normalized}Z`;
  const parsed = Date.parse(withZone);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export function assertIpWhitelist(headers: Headers, allowedIpsCsv?: string) {
  if (!allowedIpsCsv?.trim()) {
    return { allowed: true, ip: getRequesterIp(headers) };
  }

  const ip = getRequesterIp(headers);
  const allowed = allowedIpsCsv
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    allowed: allowed.includes(ip),
    ip
  };
}

export function verifyClickSignature(args: {
  payload: ClickPayload;
  secretKey: string;
  serviceId?: string;
  maxSkewSeconds?: number;
}) {
  const { payload, secretKey, serviceId } = args;

  if (serviceId && payload.service_id !== serviceId) {
    return { ok: false, reason: "SERVICE_ID_MISMATCH" as const };
  }

  const maxSkew = args.maxSkewSeconds ?? Number(process.env.CLICK_MAX_SKEW_SECONDS || 300);
  const timestamp = parseTimestamp(payload.sign_time);

  if (!timestamp) {
    return { ok: false, reason: "INVALID_SIGN_TIME" as const };
  }

  if (Math.abs(Date.now() - timestamp) > maxSkew * 1000) {
    return { ok: false, reason: "SIGN_TIME_EXPIRED" as const };
  }

  const prepareId = payload.merchant_prepare_id || "";
  const withPrepare = `${payload.merchant_trans_id}${prepareId}${payload.amount}${payload.action}${payload.sign_time}`;
  const withoutPrepare = `${payload.merchant_trans_id}${payload.amount}${payload.action}${payload.sign_time}`;

  // Some Click integrations include click_trans_id, others don't.
  const candidates = [
    md5(`${payload.click_trans_id}${payload.service_id}${secretKey}${withPrepare}`),
    md5(`${payload.click_trans_id}${payload.service_id}${secretKey}${withoutPrepare}`),
    md5(`${payload.service_id}${secretKey}${withPrepare}`),
    md5(`${payload.service_id}${secretKey}${withoutPrepare}`)
  ].map(normalizeHex);

  const provided = normalizeHex(payload.sign_string);
  const matches = candidates.some((candidate) => safeEqual(candidate, provided));

  if (!matches) {
    return { ok: false, reason: "INVALID_SIGNATURE" as const };
  }

  return { ok: true as const };
}

export function verifyPaymeBasicAuth(args: {
  headers: Headers;
  expectedLogin: string;
  expectedKey: string;
}) {
  const auth = args.headers.get("authorization");

  if (!auth?.startsWith("Basic ")) {
    return { ok: false, reason: "MISSING_AUTH_HEADER" as const };
  }

  const encoded = auth.slice("Basic ".length).trim();

  let decoded = "";
  try {
    decoded = Buffer.from(encoded, "base64").toString("utf8");
  } catch {
    return { ok: false, reason: "INVALID_AUTH_ENCODING" as const };
  }

  const separator = decoded.indexOf(":");

  if (separator < 0) {
    return { ok: false, reason: "INVALID_AUTH_FORMAT" as const };
  }

  const login = decoded.slice(0, separator);
  const key = decoded.slice(separator + 1);

  if (!safeEqual(login, args.expectedLogin) || !safeEqual(key, args.expectedKey)) {
    return { ok: false, reason: "INVALID_CREDENTIALS" as const };
  }

  return { ok: true as const };
}
