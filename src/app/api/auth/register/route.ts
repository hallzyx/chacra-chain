import { NextResponse } from "next/server";
import {
  createAgricultorId,
  createSessionToken,
  encryptSensitiveValue,
  hashPassword,
  makeSessionExpiry,
} from "@/lib/auth";
import { makeId, readDb, writeDb } from "@/lib/db";
import { createHederaTestnetAccount } from "@/lib/hedera-server";

interface RegisterRequestBody {
  email?: string;
  password?: string;
}

/**
 * Registers a new user with email/password and creates a Hedera Testnet wallet.
 * @param request - HTTP request containing email and password.
 * @returns Created user + wallet info and session token.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as RegisterRequestBody;
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son obligatorios" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    const db = await readDb();
    const existingUser = db.users.find((item) => item.email === email);
    if (existingUser) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 });
    }

    const hederaAccount = await createHederaTestnetAccount();
    const userId = makeId();
    const walletId = makeId();
    const now = new Date().toISOString();

    db.wallets.push({
      id: walletId,
      userId,
      hederaAccountId: hederaAccount.accountId,
      encryptedPrivateKey: encryptSensitiveValue(hederaAccount.privateKey),
      publicKey: hederaAccount.publicKey,
      createdAt: now,
    });

    db.users.push({
      id: userId,
      email,
      passwordHash: hashPassword(password),
      agricultorId: createAgricultorId(),
      walletId,
      createdAt: now,
    });

    const token = createSessionToken();
    db.sessions.push({
      id: makeId(),
      userId,
      token,
      createdAt: now,
      expiresAt: makeSessionExpiry(),
    });

    await writeDb(db);

    const user = db.users.find((item) => item.id === userId);
    const wallet = db.wallets.find((item) => item.id === walletId);

    return NextResponse.json({
      token,
      user: {
        id: user?.id,
        email: user?.email,
        agricultorId: user?.agricultorId,
      },
      wallet: {
        hederaAccountId: wallet?.hederaAccountId,
        publicKey: wallet?.publicKey,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
