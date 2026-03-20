import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { readDb } from "@/lib/db";

/**
 * Returns all sales records for the authenticated user, with associated HCS event data.
 * @param request - Authenticated request.
 * @returns Sales records with HCS metadata for verification.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await readDb();

    // Find sales for this user
    const userSales = db.sales.filter(sale => sale.userId === authUser.userId);

    // For each sale, fetch the corresponding hcsEvent to get transactionId and consensusTimestamp
    const salesWithHcs = await Promise.all(
      userSales.map(async (sale) => {
        const hcsEvent = db.hcsEvents.find(event => event.id === sale.hcsEventId);
        return {
          sale,
          hcsEvent: hcsEvent || null,
        };
      })
    );

    return NextResponse.json({ sales: salesWithHcs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
