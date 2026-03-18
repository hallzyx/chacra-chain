import { NextResponse } from "next/server";
import { createSessionToken, makeSessionExpiry, verifyPassword } from "@/lib/auth";
import { makeId, readDb, writeDb } from "@/lib/db";

interface LoginRequestBody {
  email?: string;
  password?: string;
}

/**
 * Logs in a user using email/password and creates a session token.
 * @param request - HTTP request containing login credentials.
 * @returns Authenticated user profile with token.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as LoginRequestBody;
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son obligatorios" }, { status: 400 });
    }

    const db = await readDb();
    const user = db.users.find((item) => item.email === email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = createSessionToken();
    const now = new Date().toISOString();

    db.sessions.push({
      id: makeId(),
      userId: user.id,
      token,
      createdAt: now,
      expiresAt: makeSessionExpiry(),
    });

    await writeDb(db);

    const wallet = db.wallets.find((item) => item.id === user.walletId);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        agricultorId: user.agricultorId,
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
