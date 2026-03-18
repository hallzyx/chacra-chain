"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, ExternalLink, Upload, X } from "lucide-react";

interface SaleWithHcs {
  sale: {
    id: string;
    agricultorId: string;
    variedadCultivo: string;
    cantidadKg: number;
    precioUnitarioPen: number;
    fechaTransaccion: string;
    createdAt: string;
  };
  hcsEvent: {
    id: string;
    topicId: string;
    transactionId: string;
    consensusTimestamp: string;
    message: string;
    createdAt: string;
  } | null;
}

/**
 * Page showing user's sales records with HashScan links for verification.
 */
export default function MisVentasPage() {
  const router = useRouter();
  const [salesWithHcs, setSalesWithHcs] = useState<SaleWithHcs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's sales with HCS data
  useEffect(() => {
    const loadUserSales = async () => {
      setLoading(true);
      setError(null);
      try {
        // Check if user is authenticated
        const userStr = localStorage.getItem("chacrachain_user");
        if (!userStr) {
          router.push("/login");
          return;
        }
        const user = JSON.parse(userStr) as { agricultorId?: string; email?: string };
        if (!user?.agricultorId) {
          router.push("/login");
          return;
        }

        // Fetch user's sales with associated HCS events
        const token = localStorage.getItem("chacrachain_token");
        const response = await fetch("/api/user/sales", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user sales");
        }

        const data = (await response.json()) as {
          sales: SaleWithHcs[];
          error?: string;
        };

        if (data.error) {
          throw new Error(data.error);
        }

        setSalesWithHcs(data.sales || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadUserSales();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] to-[#0F0F23]/50 flex flex-col">
        <header className="bg-[#0F0F23]/80 backdrop-blur-sm text-white p-6 shadow-md">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button onClick={() => window.history.back()} className="text-white/80 hover:text-white transition">
              <Upload className="h-5 w-5 mr-2" /> ← Volver
            </button>
            <h1 className="text-xl font-semibold text-[#F8FAFC]">Mis Ventas Registradas</h1>
            <span className="text-sm opacity-90 text-[#A78BFA]" />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse h-16 w-16 text-[#FBBF24]">
              <Download className="h-6 w-6 animate-spin" />
            </div>
            <p className="mt-4 text-[#F8FAFC]/80 text-center">Cargando tus ventas...</p>
          </div>
        </main>

        <footer className="bg-[#0F0F23]/80 backdrop-blur-sm text-white text-center p-4">
          <p className="text-sm text-[#F8FAFC]/70">
            Tus ventas están registradas de forma inmutable en Hedera Consensus Service
          </p>
        </footer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] to-[#0F0F23]/50 flex flex-col">
        <header className="bg-[#0F0F23]/80 backdrop-blur-sm text-white p-6 shadow-md">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button onClick={() => window.history.back()} className="text-white/80 hover:text-white transition">
              <Upload className="h-5 w-5 mr-2" /> ← Volver
            </button>
            <h1 className="text-xl font-semibold text-[#F8FAFC]">Mis Ventas Registradas</h1>
            <span className="text-sm opacity-90 text-[#A78BFA]" />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-[#F87171]/10 border border-[#F87171]/30 text-[#F87171] px-6 py-4 rounded-xl mb-6 text-center">
            <div className="flex items-center mb-2">
              <X className="h-4 w-4 mr-2 text-[#F87171]" />
              <p className="font-medium">Error al cargar ventas</p>
            </div>
            <p className="text-sm mt-1 text-[#F8FAFC]/70">{error}</p>
          </div>
        </main>

        <footer className="bg-[#0F0F23]/80 backdrop-blur-sm text-white text-center p-4">
          <p className="text-sm text-[#F8FAFC]/70">
            Tus ventas están registradas de forma inmutable en Hedera Consensus Service
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] to-[#0F0F23]/50 flex flex-col">
      <header className="bg-[#0F0F23]/80 backdrop-blur-sm text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={() => window.history.back()} className="text-white/80 hover:text-white transition">
            <Upload className="h-5 w-5 mr-2" /> ← Volver
          </button>
          <h1 className="text-xl font-semibold text-[#F8FAFC]">Mis Ventas Registradas</h1>
          <span className="text-sm opacity-90 text-[#A78BFA]" />
        </div>
      </header>

      <main className="flex-1 p-6">
        {salesWithHcs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#F8FAFC]/70">
              Aún no has registrado ninguna venta. ¡Comienza tu primer registro en ChacraChain!
            </p>
            <div className="mt-6">
              <a
                href="/registrar-venta"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 text-white py-2.5 px-4 font-medium transition"
              >
                <Upload className="w-4 h-4" /> Registrar Primera Venta
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#F8FAFC]/90 mb-4">
              Tus {salesWithHcs.length} venta{salesWithHcs.length === 1 ? "" : "s"} registrada{salesWithHcs.length === 1 ? "" : "s"}
            </h2>
            <div className="space-y-4">
              {salesWithHcs.map(({ sale, hcsEvent }) => (
                <div key={sale.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-[#8B5CF6]/20">
                        <Download className="w-5 h-5 text-[#8B5CF6]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#F8FAFC]">Venta #{sale.id.substring(0, 8)}...</h3>
                        <p className="text-sm text-[#F8FAFC]/70">
                          {new Date(sale.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]/90">Agricultor</p>
                      <p className="text-lg font-semibold text-[#F8FAFC]">{sale.agricultorId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]/90">Variedad</p>
                      <p className="text-lg font-semibold text-[#F8FAFC]">{sale.variedadCultivo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]/90">Cantidad</p>
                      <p className="text-lg font-semibold text-[#F8FAFC]">
                        {sale.cantidadKg.toLocaleString()} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]/90">Precio Unitario</p>
                      <p className="text-lg font-semibold text-[#F8FAFC]">
                        S/ {sale.precioUnitarioPen.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]/90">Fecha Transacción</p>
                      <p className="text-lg font-mono text-[#F8FAFC]/90">
                        {new Date(sale.fechaTransaccion).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]/90">Total Venta</p>
                      <p className="text-lg font-semibold text-[#F8FAFC]">
                        S/ {(sale.cantidadKg * sale.precioUnitarioPen).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  {hcsEvent ? (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-[#FBBF24]/20">
                          <ExternalLink className="w-5 h-5 text-[#FBBF24]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#F8FAFC]">Verificación en Cadena</h3>
                          <p className="text-sm text-[#F8FAFC]/70">
                            Esta venta fue registrada en Hedera Consensus Service
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-[#F8FAFC]/90">ID de Transacción</p>
                          <p className="text-xs font-mono text-[#F8FAFC]/70 break-all">
                            {hcsEvent.transactionId}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#F8FAFC]/90">Timestamp de Consenso</p>
                          <p className="text-xs font-mono text-[#F8FAFC]/70 break-all">
                            {hcsEvent.consensusTimestamp}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#F8FAFC]/90">Tópico HCS</p>
                          <p className="text-xs font-mono text-[#F8FAFC]/70">
                            {hcsEvent.topicId}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <a
                            href={`https://hashscan.io/testnet/transaction/${encodeURIComponent(
                              hcsEvent.transactionId
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white/10 border border-white/20 rounded hover:bg-white/20 transition"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver en HashScan
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-lg">
                      <p className="text-sm text-[#FBBF24]">
                        Esperando confirmación de la red Hedera...
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#0F0F23]/80 backdrop-blur-sm text-white text-center p-4">
        <p className="text-sm text-[#F8FAFC]/70">
          Cada venta tiene un registro inmutable verificable en HashScan
        </p>
      </footer>
    </div>
  );
}