import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { makeId, readDb, writeDb } from "@/lib/db";
import { submitSaleToHcs } from "@/lib/hedera-server";

interface RegisterSaleRequestBody {
  variedadCultivo?: string;
  cantidadKg?: number | string;
  precioUnitarioPen?: number | string;
  fechaTransaccion?: string;
}

/**
 * Registers an agricultural sale and publishes it to Hedera HCS.
 * @param request - Authenticated request with sale details.
 * @returns Sale record and HCS metadata.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = (await request.json()) as RegisterSaleRequestBody;
    const variedadCultivo = body.variedadCultivo?.trim() ?? "";
    const cantidadKg = Number(body.cantidadKg);
    const precioUnitarioPen = Number(body.precioUnitarioPen);
    const fechaTransaccion = body.fechaTransaccion?.trim() ?? "";

    if (!variedadCultivo || !cantidadKg || !precioUnitarioPen || !fechaTransaccion) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const payload = {
      agricultor_id: authUser.agricultorId,
      variedad_cultivo: variedadCultivo,
      cantidad_kg: cantidadKg,
      precio_unitario_pen: precioUnitarioPen,
      fecha_transaccion: fechaTransaccion,
    };

    const serializedPayload = JSON.stringify(payload);
    const hcsResult = await submitSaleToHcs(serializedPayload);

    const db = await readDb();
    const now = new Date().toISOString();
    const hcsEventId = makeId();
    const saleId = makeId();

    db.hcsEvents.push({
      id: hcsEventId,
      topicId: hcsResult.topicId,
      transactionId: hcsResult.transactionId,
      consensusTimestamp: hcsResult.consensusTimestamp,
      message: serializedPayload,
      createdAt: now,
    });

    db.sales.push({
      id: saleId,
      userId: authUser.userId,
      agricultorId: authUser.agricultorId,
      variedadCultivo,
      cantidadKg,
      precioUnitarioPen,
      fechaTransaccion,
      hcsEventId,
      createdAt: now,
    });

    await writeDb(db);

    return NextResponse.json({
      ok: true,
      sale: {
        id: saleId,
        payload,
      },
      hcs: hcsResult,
      hashscanUrl: `https://hashscan.io/testnet/transaction/${encodeURIComponent(hcsResult.transactionId)}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Returns aggregated average price information from local persisted sales.
 * @returns Average price and records count with optional filtering.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const query = request.nextUrl.searchParams;
    const variedadCultivo = query.get("variedadCultivo")?.trim() ?? "";
    const fechaDesde = query.get("fechaDesde")?.trim() ?? "";
    const fechaHasta = query.get("fechaHasta")?.trim() ?? "";

    const db = await readDb();

    const filteredSales = db.sales.filter((sale) => {
      const matchVariedad = variedadCultivo ? sale.variedadCultivo === variedadCultivo : true;
      const dateMs = new Date(sale.fechaTransaccion).getTime();
      const fromMs = fechaDesde ? new Date(fechaDesde).getTime() : Number.NEGATIVE_INFINITY;
      const toMs = fechaHasta
        ? new Date(`${fechaHasta}T23:59:59.999`).getTime()
        : Number.POSITIVE_INFINITY;

      const matchDate = dateMs >= fromMs && dateMs <= toMs;

      return matchVariedad && matchDate;
    });

    if (filteredSales.length === 0) {
      return NextResponse.json({
        averagePrice: null,
        recordCount: 0,
        lastUpdated: null,
      });
    }

    const total = filteredSales.reduce((sum, sale) => sum + sale.precioUnitarioPen, 0);
    const averagePrice = Number((total / filteredSales.length).toFixed(2));

    return NextResponse.json({
      averagePrice,
      recordCount: filteredSales.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
