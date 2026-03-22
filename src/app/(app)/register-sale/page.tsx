"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle, 
  ExternalLink, 
  Upload, 
  XCircle,
  ArrowLeft,
  Sprout,
  TrendingUp,
  Home,
  Receipt,
  User,
  Info,
  Leaf,
  Hash
} from "lucide-react";

/**
 * Page for registering agricultural sales and sending them to Hedera HCS.
 * Styled with ChacraChain AgriTech Design System from Stich.
 * @returns Sale registration page component.
 */
export default function RegisterSalePage() {
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

  const variedades = ["Papa Canchan", "Papa Única", "Papa Yungay", "Papa Tomasa", "Papa Amarilla", "Otro"];

  // Precios sugeridos por variedad (en S/ por kg)
  const preciosSugeridos: Record<string, number> = {
    "Papa Canchan": 1.45,
    "Papa Única": 1.62,
    "Papa Yungay": 1.38,
    "Papa Tomasa": 1.25,
    "Papa Amarilla": 1.85,
    "Otro": 1.30,
  };

  // Obtener el precio sugerido según la variedad seleccionada
  const getPrecioSugerido = (): number => {
    if (!formData.variedadCultivo) return 1.45; // Default
    return preciosSugeridos[formData.variedadCultivo] ?? 1.45;
  };

  const isAuthChecked = useRef(false);

  /**
   * Loads authenticated user info and pre-fills agricultor ID.
   */
  useEffect(() => {
    if (isAuthChecked.current) return;
    isAuthChecked.current = true;

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
      setErrorMessage("Please complete all fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("submitting");

    try {
      const token = localStorage.getItem("chacrachain_token");
      if (!token) {
        throw new Error("No active session. Please sign in again.");
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
        throw new Error(data.error ?? "Could not register the sale on HCS");
      }

      setTxHash(data.hcs.transactionId);
      setConsensusTimestamp(data.hcs.consensusTimestamp);
      setHashscanUrl(data.hashscanUrl ?? null);
      setSubmitStatus("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-4 md:px-10 py-3">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-6 bg-primary text-white rounded flex items-center justify-center">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">Register Sale</h2>
            <p className="text-primary/70 text-xs font-medium">ChacraChain x Hedera</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center rounded h-10 bg-primary/10 text-primary hover:bg-primary/20 transition-all px-4 gap-2 text-sm font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-10 py-6 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <header className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">New Transaction</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-none">Sale Registration</h1>
          <p className="mt-4 text-secondary max-w-xl leading-relaxed">
            Record your harvest on the Hedera ledger. Every entry creates a transparent certificate of origin for the global market.
          </p>
        </header>

        {/* Bento Grid Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form Card */}
          <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
            {submitStatus === "success" && txHash && consensusTimestamp ? (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="size-12 bg-primary rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Sale registered on-chain!</h3>
                    <p className="text-sm text-secondary">Transaction confirmed on Hedera Consensus Service</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                    <span className="text-sm text-secondary">Transaction ID</span>
                    <span className="text-sm font-mono text-foreground">{txHash.substring(0, 35)}...</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                    <span className="text-sm text-secondary">Consensus Timestamp</span>
                    <span className="text-sm font-mono text-foreground">{consensusTimestamp}</span>
                  </div>
                </div>

                {hashscanUrl && (
                  <a
                    href={hashscanUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                  >
                     View on HashScan <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={resetForm}
                  className="mt-6 w-full bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition"
                >
                   Register another sale
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Agricultor ID */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider">Farmer ID</label>
                    <div className="bg-surface-container-low px-4 py-3 rounded-lg text-foreground font-mono text-sm border-l-4 border-primary">
                      {formData.agricultorId || "Loading..."}
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider">Registration Date</label>
                    <div className="bg-surface-container-low px-4 py-3 rounded-lg text-foreground font-medium text-sm">
                      {new Date().toLocaleDateString("en-US", { 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric" 
                      })}
                    </div>
                  </div>

                  {/* Variedad */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider">Crop Variety</label>
                    <select
                      value={formData.variedadCultivo}
                      onChange={(e) => setFormData({ ...formData, variedadCultivo: e.target.value })}
                      className="w-full bg-surface-container-high border-0 focus:ring-1 focus:ring-primary rounded-lg py-4 px-4 text-foreground font-semibold appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select a variety</option>
                      {variedades.map((variedad) => (
                        <option key={variedad} value={variedad}>
                          {variedad}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cantidad */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider">Quantity (kg)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.cantidadKg}
                        onChange={(e) => setFormData({ ...formData, cantidadKg: e.target.value })}
                        className="w-full bg-surface-container-high border-0 focus:ring-1 focus:ring-primary rounded-lg py-4 px-4 text-foreground font-semibold pr-16"
                        placeholder="0.00"
                        required
                        min="0"
                        step="0.01"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">KG</span>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider">Unit Price (S/.)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">S/.</span>
                      <input
                        type="number"
                        value={formData.precioUnitarioPen}
                        onChange={(e) => setFormData({ ...formData, precioUnitarioPen: e.target.value })}
                        className="w-full bg-surface-container-high border-0 focus:ring-1 focus:ring-primary rounded-lg py-4 pl-12 pr-4 text-foreground font-semibold"
                        placeholder="0.00"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Message */}
                <div className="text-sm text-secondary bg-surface-container-low p-4 rounded-lg flex items-start gap-3">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>The data will be sent as a real message to Hedera Consensus Service. Once confirmed, the transaction will be immutable and verifiable.</p>
                </div>

                {/* Status Messages */}
                {submitStatus === "submitting" && (
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-center">
                      <Upload className="w-5 h-5 mr-3 text-primary animate-pulse" />
                       <span className="text-foreground font-medium">Registering sale on-chain...</span>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <div className="flex items-center">
                      <XCircle className="w-5 h-5 mr-3 text-red-500" />
                      <span className="text-red-600 font-medium">{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white px-6 py-5 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="w-5 h-5 animate-spin" />
                       <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                       <span>Confirm On-Chain Registration</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </section>

          {/* Sidebar Info/Bento Secondary */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Blockchain Status Card */}
            <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
              <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Network Protocol
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-secondary">Network</span>
                  <span className="font-bold text-foreground">Hedera Testnet</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-secondary">Estimated Fee</span>
                  <span className="font-bold text-primary">~0.001 HBAR</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-secondary">Finality Time</span>
                  <span className="font-bold text-foreground">&lt; 5s</span>
                </div>
              </div>
            </div>

            {/* Agricultural Insight Card - Dynamic Price */}
            <div className="bg-primary text-white rounded-xl p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Suggested Price</h3>
                </div>
                <p className="text-3xl font-black mb-1">S/ {getPrecioSugerido().toFixed(2)}</p>
                <p className="text-[10px] opacity-70 uppercase font-bold">
                  {formData.variedadCultivo 
                    ? `Oracle-based - ${formData.variedadCultivo}` 
                    : "Select a variety to view the price"}
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <Leaf className="w-24 h-24" />
              </div>
            </div>

            {/* Guidance Card */}
            <div className="bg-secondary/10 rounded-xl p-6 border border-secondary/20">
              <h3 className="text-xs font-bold uppercase mb-3 text-secondary flex items-center gap-2">
                <Info className="w-4 h-4" />
                Quality Guide
              </h3>
              <p className="text-xs leading-relaxed text-secondary">
                Ensure the registered weight matches the digital weighing ticket to avoid discrepancies in supply chain audits.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-container border-t border-primary/10 py-3 px-6 md:hidden flex justify-around items-center z-50">
        <button onClick={() => router.push("/")} className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => router.push("/my-sales")} className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition">
          <Receipt className="w-5 h-5" />
          <span className="text-[10px] font-bold">Sales</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <Sprout className="w-5 h-5" />
          <span className="text-[10px] font-bold">Register</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
