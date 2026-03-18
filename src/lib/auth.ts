import { createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { readDb } from "@/lib/db";
import { PrivateKey } from "@hashgraph/sdk";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export interface AuthenticatedUser {
  userId: string;
  email: string;
  agricultorId: string;
}

/**
 * Hashes a plaintext password with a random salt using scrypt.
 * @param password - Raw password from user input.
 * @returns Encoded hash in the format `salt:derivedKey`.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

/**
 * Verifies a plaintext password against a stored scrypt hash.
 * @param password - Raw password provided by the user.
 * @param storedHash - Stored hash in `salt:derivedKey` format.
 * @returns True when password matches the stored hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalKey] = storedHash.split(":");
  if (!salt || !originalKey) {
    return false;
  }

  const originalBuffer = Buffer.from(originalKey, "hex");
  const currentBuffer = scryptSync(password, salt, 64);

  if (originalBuffer.length !== currentBuffer.length) {
    return false;
  }

  return timingSafeEqual(originalBuffer, currentBuffer);
}

/**
 * Creates a cryptographically secure session token.
 * @returns Random session token in hex format.
 */
export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Computes an expiration ISO timestamp for new sessions.
 * @returns ISO date string representing session expiration.
 */
export function makeSessionExpiry(): string {
  return new Date(Date.now() + SESSION_DURATION_MS).toISOString();
}

/**
 * Builds a deterministic agricultor ID for user-facing identification.
 * @returns Formatted agricultor ID such as `AGR-1234`.
 */
export function createAgricultorId(): string {
  const number = Math.floor(1000 + Math.random() * 9000);
  return `AGR-${number}`;
}

/**
 * Encrypts sensitive values using AES-256-GCM.
 * @param plainText - Sensitive content to encrypt.
 * @returns Base64 payload containing IV, authTag and ciphertext.
 * @throws {Error} When APP_ENCRYPTION_KEY is missing.
 */
export function encryptSensitiveValue(plainText: string): string {
  const keySeed = process.env.APP_ENCRYPTION_KEY;
  if (!keySeed) {
    throw new Error("APP_ENCRYPTION_KEY is required for secure storage");
  }

  const key = createHash("sha256").update(keySeed).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, ciphertext]).toString("base64");
}

/**
 * Decrypts a value encrypted by `encryptSensitiveValue`.
 * @param encodedValue - Base64 payload with IV, authTag and ciphertext.
 * @returns Decrypted plaintext.
 * @throws {Error} When APP_ENCRYPTION_KEY is missing.
 */
export function decryptSensitiveValue(encodedValue: string): string {
  const keySeed = process.env.APP_ENCRYPTION_KEY;
  if (!keySeed) {
    throw new Error("APP_ENCRYPTION_KEY is required for secure storage");
  }

  const key = createHash("sha256").update(keySeed).digest();
  const payload = Buffer.from(encodedValue, "base64");
  const iv = payload.subarray(0, 12);
  const authTag = payload.subarray(12, 28);
  const ciphertext = payload.subarray(28);

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

/**
 * Resolves the authenticated user from the Authorization header.
 * @param request - Next.js request object.
 * @returns Authenticated user identity when token is valid; otherwise null.
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }

  const token = header.replace("Bearer ", "").trim();
  const db = await readDb();
  const now = Date.now();

  const session = db.sessions.find((item) => item.token === token);
  if (!session) {
    return null;
  }

  if (new Date(session.expiresAt).getTime() < now) {
    return null;
  }

  const user = db.users.find((item) => item.id === session.userId);
  if (!user) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    agricultorId: user.agricultorId,
  };
}

/**
 * Gets the decrypted user wallet credentials for signing transactions.
 * @param userId - The user ID to get wallet credentials for.
 * @returns The wallet credentials including accountId and PrivateKey.
 */
export async function getUserWalletCredentials(userId: string): Promise<{
  accountId: string;
  privateKey: PrivateKey;
} | null> {
  const db = await readDb();
  const wallet = db.wallets.find(w => w.userId === userId);
  if (!wallet) {
    return null;
  }

  try {
    const decryptedPrivateKey = decryptSensitiveValue(wallet.encryptedPrivateKey);
    const privateKey = PrivateKey.fromString(decryptedPrivateKey);
    return {
      accountId: wallet.hederaAccountId,
      privateKey: privateKey,
    };
  } catch (error) {
    console.error("Failed to decrypt wallet private key:", error);
    return null;
  }
}
