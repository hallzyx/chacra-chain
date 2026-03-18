"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ExternalLink, Upload, XCircle } from "lucide-react";

/**
 * Page for registering agricultural sales and sending them to Hedera HCS.
 * @returns Sale registration page component.
 */
export default function RegistrarVentaPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    agricultorId: "",
    variedadCultivo: "",
    cantidadKg: "",
    precioUnitarioPen: "",
    fechaTransaccion: new Date().toISOString(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [consensusTimestamp, setConsensusTimestamp] = useState<string | null>(null);
  const [hashscanUrl, setHashscanUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const variedades = ["Papa Canchan", "Papa Única", "Papa Yungay", "Papa Tomasa", "Otro"];

  /**
   * Loads authenticated user info and pre-fills agricultor ID.
   */
  useEffect(() => {
    const token = localStorage.getItem("chacrachain_token");
    const userRaw = localStorage.getItem("chacrachain_user");

    if (!token || !userRaw) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userRaw) as { agricultorId?: string };
      setFormData((prev) => ({ ...prev, agricultorId: user.agricultorId ?? "" }));
    } catch {
      router.push("/login");
    }
  }, [router]);

  /**
   * Sends a sale record to backend which submits to Hedera HCS.
   * @param event - Form submit event.
   */
  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    if (!formData.variedadCultivo || !formData.cantidadKg || !formData.precioUnitarioPen || !formData.fechaTransaccion) {
      setErrorMessage("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("submitting");

    try {
      const token = localStorage.getItem("chacrachain_token");
      if (!token) {
        throw new Error("No hay sesión activa. Iniciá sesión nuevamente.");
      }

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          variedadCultivo: formData.variedadCultivo,
          cantidadKg: Number(formData.cantidadKg),
          precioUnitarioPen: Number(formData.precioUnitarioPen),
          fechaTransaccion: formData.fechaTransaccion,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        hcs?: { transactionId: string; consensusTimestamp: string };
        hashscanUrl?: string;
      };

      if (!response.ok || !data.hcs) {
        throw new Error(data.error ?? "No se pudo registrar la venta en HCS");
      }

      setTxHash(data.hcs.transactionId);
      setConsensusTimestamp(data.hcs.consensusTimestamp);
      setHashscanUrl(data.hashscanUrl ?? null);
      setSubmitStatus("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setErrorMessage(message);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resets current form while preserving the authenticated agricultor ID.
   */
  const resetForm = (): void => {
    setSubmitStatus("idle");
    setTxHash(null);
    setConsensusTimestamp(null);
    setHashscanUrl(null);
    setErrorMessage(null);
    setFormData((prev) => ({
      agricultorId: prev.agricultorId,
      variedadCultivo: "",
      cantidadKg: "",
      precioUnitarioPen: "",
      fechaTransaccion: new Date().toISOString(),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] to-[#0F0F23]/50 flex flex-col">
      <header className="bg-[#0F0F23]/80 backdrop-blur-sm text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={() => window.history.back()} className="text-white/80 hover:text-white transition">
            <Upload className="h-5 w-5 mr-2" /> ← Volver
          </button>
          <h1 className="text-xl font-semibold text-[#F8FAFC]">Registrar Venta</h1>
          <span className="text-sm opacity-90 text-[#A78BFA]" />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 flex justify-center items-start pt-8 md:pt-12">
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
          {submitStatus === "success" && txHash && consensusTimestamp ? (
            <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#FBBF24] px-6 py-4 rounded-xl mb-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 mr-2 text-[#FBBF24]" />
                <h2 className="font-bold text-[#F8FAFC]">¡Venta registrada en cadena!</h2>
              </div>
              <p className="mb-2 text-[#F8FAFC]/90">Transacción confirmada en Hedera Consensus Service</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="w-24">TX ID:</span>
                  <span className="font-mono text-xs text-[#F8FAFC]/70">{txHash.substring(0, 26)}...</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24">Timestamp:</span>
                  <span className="font-mono text-xs text-[#F8FAFC]/70">{consensusTimestamp}</span>
                </div>
                {hashscanUrl ? (
                  <a
                    href={hashscanUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#FBBF24] hover:text-[#FBBF24]/80"
                  >
                    Ver en HashScan <ExternalLink className="w-4 h-4" />
                  </a>
                ) : null}
              </div>
              <button
                onClick={resetForm}
                className="mt-4 w-full bg-[#8B5CF6] text-white px-4 py-2 rounded hover:bg-[#8B5CF6]/80 transition"
              >
                Registrar otra venta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#F8FAFC]/90 mb-1">Agricultor ID</label>
                <input
                  type="text"
                  value={formData.agricultorId}
                  readOnly
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#F8FAFC] placeholder-[#F8FAFC]/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#F8FAFC]/90 mb-1">Variedad de cultivo</label>
                <select
                  value={formData.variedadCultivo}
                  onChange={(event) => setFormData({ ...formData, variedadCultivo: event.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#F8FAFC] placeholder-[#F8FAFC]/60"
                >
                  <option value="">Selecciona una variedad</option>
                  {variedades.map((variedad) => (
                    <option key={variedad} value={variedad}>
                      {variedad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#F8FAFC]/90 mb-1">Cantidad (kg)</label>
                  <input
                    type="number"
                    value={formData.cantidadKg}
                    onChange={(event) => setFormData({ ...formData, cantidadKg: event.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#F8FAFC] placeholder-[#F8FAFC]/60"
                    placeholder="Ej: 5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F8FAFC]/90 mb-1">Precio unitario (S/.)</label>
                  <input
                    type="number"
                    value={formData.precioUnitarioPen}
                    onChange={(event) => setFormData({ ...formData, precioUnitarioPen: event.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#F8FAFC] placeholder-[#F8FAFC]/60"
                    placeholder="Ej: 1.20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#F8FAFC]/90 mb-1">Fecha y hora de transacción</label>
                <input
                  type="datetime-local"
                  value={formData.fechaTransaccion.slice(0, 16)}
                  onChange={(event) => setFormData({ ...formData, fechaTransaccion: `${event.target.value}:00` })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#F8FAFC] placeholder-[#F8FAFC]/60"
                />
              </div>

              <div className="text-sm text-[#F8FAFC]/70">Los datos se enviarán como mensaje real a Hedera Consensus Service.</div>

              {submitStatus === "submitting" ? (
                <div className="bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-[#FBBF24] px-4 py-3 rounded-xl">
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 mr-2 text-[#FBBF24]" />
                    <span>Registrando venta en cadena...</span>
                  </div>
                </div>
              ) : null}

              {submitStatus === "error" ? (
                <div className="bg-[#F87171]/10 border border-[#F87171]/30 text-[#F87171] px-4 py-3 rounded-xl">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 mr-2 text-[#F87171]" />
                    <span>{errorMessage ?? "Error al enviar. Verifica tu conexión e intenta de nuevo."}</span>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8B5CF6] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#8B5CF6]/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    <span>Enviando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Confirmar Registro</span>
                  </div>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="bg-[#0F0F23]/80 backdrop-blur-sm text-white text-center p-4">
        <p className="text-sm text-[#F8FAFC]/70">Registro real en Hedera Testnet vía HCS</p>
      </footer>
    </div>
  );
}
