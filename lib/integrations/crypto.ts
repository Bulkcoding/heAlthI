import { createCipheriv, createDecipheriv, createHmac, createHash, randomBytes } from "node:crypto";
import { getIntegrationsEncryptionKey } from "@/lib/env";

function toBase64Url(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));

  return Buffer.from(`${normalized}${padding}`, "base64");
}

function getKeyBuffer() {
  const rawKey = getIntegrationsEncryptionKey();

  return createHash("sha256").update(rawKey).digest();
}

export function encryptJson(payload: unknown) {
  const iv = randomBytes(12);
  const key = getKeyBuffer();
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const serialized = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(serialized, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [toBase64Url(iv), toBase64Url(authTag), toBase64Url(encrypted)].join(".");
}

export function decryptJson<T>(payload: string): T {
  const [ivPart, authTagPart, encryptedPart] = payload.split(".");

  if (!ivPart || !authTagPart || !encryptedPart) {
    throw new Error("암호화된 통합 데이터 형식이 올바르지 않습니다.");
  }

  const decipher = createDecipheriv("aes-256-gcm", getKeyBuffer(), fromBase64Url(ivPart));
  decipher.setAuthTag(fromBase64Url(authTagPart));
  const decrypted = Buffer.concat([decipher.update(fromBase64Url(encryptedPart)), decipher.final()]).toString("utf8");

  return JSON.parse(decrypted) as T;
}

export function signState(payload: Record<string, unknown>) {
  const body = toBase64Url(JSON.stringify(payload));
  const signature = toBase64Url(createHmac("sha256", getKeyBuffer()).update(body).digest());

  return `${body}.${signature}`;
}

export function verifyState<T>(signedState: string): T {
  const [body, signature] = signedState.split(".");

  if (!body || !signature) {
    throw new Error("state 값이 올바르지 않습니다.");
  }

  const expected = toBase64Url(createHmac("sha256", getKeyBuffer()).update(body).digest());

  if (signature !== expected) {
    throw new Error("state 서명이 유효하지 않습니다.");
  }

  return JSON.parse(fromBase64Url(body).toString("utf8")) as T;
}
