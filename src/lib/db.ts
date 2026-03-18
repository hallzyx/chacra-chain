import { promises as fs } from "fs";
import path from "path";

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  agricultorId: string;
  walletId: string;
  createdAt: string;
}

export interface WalletRecord {
  id: string;
  userId: string;
  hederaAccountId: string;
  encryptedPrivateKey: string;
  publicKey: string;
  createdAt: string;
}

export interface HcsEventRecord {
  id: string;
  topicId: string;
  transactionId: string;
  consensusTimestamp: string;
  message: string;
  createdAt: string;
}

export interface SaleRecord {
  id: string;
  userId: string;
  agricultorId: string;
  variedadCultivo: string;
  cantidadKg: number;
  precioUnitarioPen: number;
  fechaTransaccion: string;
  hcsEventId: string;
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
}

export interface DbSchema {
  users: UserRecord[];
  wallets: WalletRecord[];
  sales: SaleRecord[];
  hcsEvents: HcsEventRecord[];
  sessions: SessionRecord[];
}

const DB_FILE = path.join(process.cwd(), "db.json");

/**
 * Returns an empty database structure when the file does not exist.
 * @returns Empty database schema with all collections initialized.
 */
function getEmptyDb(): DbSchema {
  return {
    users: [],
    wallets: [],
    sales: [],
    hcsEvents: [],
    sessions: [],
  };
}

/**
 * Reads the local JSON database from disk.
 * @returns Parsed DB schema.
 */
export async function readDb(): Promise<DbSchema> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<DbSchema>;

    return {
      users: parsed.users ?? [],
      wallets: parsed.wallets ?? [],
      sales: parsed.sales ?? [],
      hcsEvents: parsed.hcsEvents ?? [],
      sessions: parsed.sessions ?? [],
    };
  } catch {
    return getEmptyDb();
  }
}

/**
 * Writes the local JSON database atomically to disk.
 * @param db - Database schema to persist.
 */
export async function writeDb(db: DbSchema): Promise<void> {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

/**
 * Generates a new unique identifier for persisted records.
 * @returns UUID v4 string.
 */
export function makeId(): string {
  return crypto.randomUUID();
}
