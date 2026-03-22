"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutGrid, 
  ArrowLeft, 
  BadgeCheck, 
  Receipt, 
  Tractor, 
  List, 
  Sprout, 
  ExternalLink, 
  Clock, 
  PackageOpen,
  PlusCircle,
  Home,
  Store,
  User
} from "lucide-react";

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
 * Styled with ChacraChain AgriTech Design System from Stich.
 */
export default function MySalesPage() {
  const router = useRouter();
  const [salesWithHcs, setSalesWithHcs] = useState<SaleWithHcs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate totals
  const totalRegistradas = salesWithHcs.length;
  const volumenTotal = salesWithHcs.reduce((acc, { sale }) => acc + sale.cantidadKg, 0);

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
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-4 md:px-10 py-3">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-6 bg-primary text-white rounded flex items-center justify-center">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">My Sales</h2>
              <p className="text-primary/70 text-xs font-medium">ChacraChain x Hedera</p>
            </div>
          </div>
        </header>

        {/* Loading State */}
        <main className="flex-1 px-4 md:px-10 py-8 max-w-5xl mx-auto w-full">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 animate-pulse">
              <Sprout className="w-8 h-8 animate-spin" />
            </div>
            <p className="text-foreground/60 text-center">Loading your sales...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-4 md:px-10 py-3">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-6 bg-primary text-white rounded flex items-center justify-center">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">My Sales</h2>
              <p className="text-primary/70 text-xs font-medium">ChacraChain x Hedera</p>
            </div>
          </div>
        </header>

        {/* Error State */}
        <main className="flex-1 px-4 md:px-10 py-8 max-w-5xl mx-auto w-full">
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 px-6 py-4 rounded-xl text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="mr-2">⚠️</span>
               <p className="font-medium">Error loading sales</p>
            </div>
            <p className="text-sm mt-1 text-red-600/70">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-4 md:px-10 py-3">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-6 bg-primary text-white rounded flex items-center justify-center">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">My Sales</h2>
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
      <main className="flex-1 px-4 md:px-10 py-6 max-w-5xl mx-auto w-full">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-foreground tracking-tight text-3xl font-bold leading-tight">Sales History</h1>
          <p className="text-secondary text-sm font-normal mt-1 flex items-center gap-1">
            <BadgeCheck className="w-4 h-4 text-primary" />
            Immutable records on the Hedera Hashgraph network
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-primary/10 bg-surface-container-low shadow-sm">
            <div className="flex items-center justify-between">
               <p className="text-secondary text-sm font-medium">Total Registered</p>
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <p className="text-foreground tracking-tight text-3xl font-bold">{totalRegistradas}</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-primary/10 bg-surface-container-low shadow-sm">
            <div className="flex items-center justify-between">
               <p className="text-secondary text-sm font-medium">Total Volume</p>
              <Tractor className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-foreground tracking-tight text-3xl font-bold">{volumenTotal.toLocaleString()}</p>
              <p className="text-secondary text-lg font-semibold">kg</p>
            </div>
          </div>
        </div>

        {/* Sales List */}
        <div className="flex flex-col gap-4 pb-20">
          <h3 className="text-foreground text-lg font-bold flex items-center gap-2 mb-2">
            <List className="w-5 h-5 text-primary" />
             Recent Records
          </h3>

          {salesWithHcs.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5 mt-4">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h4 className="text-foreground text-xl font-bold mb-2">No sales registered yet</h4>
              <p className="text-secondary max-w-sm mb-6">All your transactions are secure and verifiable using the Hedera transaction ID.</p>
              <button
                onClick={() => router.push("/register-sale")}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                 Register new sale
              </button>
            </div>
          ) : (
            // Sales List
            salesWithHcs.map(({ sale, hcsEvent }) => {
              const totalVenta = sale.cantidadKg * sale.precioUnitarioPen;
              const fecha = new Date(sale.createdAt);
              const fechaStr = fecha.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const horaStr = fecha.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={sale.id}
                  className="bg-surface-container-low rounded-xl border border-primary/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition-all shadow-sm"
                >
                  {/* Left: Icon and Info */}
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Sprout className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-foreground font-bold text-lg">{sale.variedadCultivo}</p>
                      <p className="text-secondary text-sm">{fechaStr} • {horaStr}</p>
                    </div>
                  </div>

                  {/* Middle: Stats Grid */}
                  <div className="grid grid-cols-2 md:flex md:gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-surface-container-high">
                    <div>
                       <p className="text-secondary text-xs uppercase tracking-wider font-bold">Quantity</p>
                      <p className="text-foreground font-bold">{sale.cantidadKg.toLocaleString()} kg</p>
                    </div>
                    <div>
                       <p className="text-secondary text-xs uppercase tracking-wider font-bold">Unit Price</p>
                      <p className="text-foreground font-bold">S/ {sale.precioUnitarioPen.toFixed(2)}</p>
                    </div>
                    <div className="hidden lg:block">
                       <p className="text-secondary text-xs uppercase tracking-wider font-bold">Total</p>
                      <p className="text-primary font-bold">S/ {totalVenta.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>

                  {/* Right: HashScan Link */}
                  <div className="flex items-center">
                    {hcsEvent ? (
                      <a
                        href={`https://hashscan.io/testnet/transaction/${encodeURIComponent(hcsEvent.transactionId)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-primary text-sm font-bold bg-primary/5 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                         <span>View on HashScan</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-secondary text-xs bg-surface-container-high px-3 py-2 rounded-lg flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                         Confirming...
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* End of List CTA */}
          {salesWithHcs.length > 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5 mt-4">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
               <h4 className="text-foreground text-xl font-bold mb-2">End of history</h4>
               <p className="text-secondary max-w-sm mb-6">All your transactions are secure and verifiable using the Hedera transaction ID.</p>
              <button
                onClick={() => router.push("/register-sale")}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                 Register new sale
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-container border-t border-primary/10 py-3 px-6 md:hidden flex justify-around items-center z-50">
        <button onClick={() => router.push("/")} className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <Receipt className="w-5 h-5" />
          <span className="text-[10px] font-bold">Sales</span>
        </button>
        <button onClick={() => router.push("/check-price")} className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition">
          <Store className="w-5 h-5" />
          <span className="text-[10px] font-bold">Market</span>
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
