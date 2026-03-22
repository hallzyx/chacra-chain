"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  LayoutGrid,
  Sprout,
  TrendingUp,
  User,
  ArrowLeft,
  BadgeCheck,
  Search,
  Bell,
  Loader2
} from "lucide-react";

interface Sale {
  id: string;
  agricultorId: string;
  variedadCultivo: string;
  cantidadKg: number;
  precioUnitarioPen: number;
  fechaTransaccion: string;
  hcsEventId: string;
  createdAt: string;
}

// API returns { sales: [{ sale: {...}, hcsEvent: {...} }] }
interface SaleWithHcs {
  sale: Sale;
  hcsEvent: {
    id: string;
    transactionId: string;
    consensusTimestamp: string;
  } | null;
}

interface DashboardStats {
  totalKg: number;
  totalVentas: number;
  precioPromedio: number;
}

/**
 * Dashboard Panel de Control - Main landing page after login.
 * Styled with ChacraChain AgriTech Design System from Stich.
 * @returns Dashboard page component.
 */
export default function DashboardPage() {
  const router = useRouter();
  const [sales, setSales] = useState<SaleWithHcs[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalKg: 0, totalVentas: 0, precioPromedio: 0 });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Farmer");

  // Fetch user sales and calculate stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("chacrachain_token");
        const userRaw = localStorage.getItem("chacrachain_user");
        
        if (userRaw) {
          const user = JSON.parse(userRaw);
          setUserName(user.agricultorId || "Farmer");
        }

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/user/sales", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("chacrachain_token");
          localStorage.removeItem("chacrachain_user");
          router.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          const userSales: SaleWithHcs[] = data.sales || [];
          setSales(userSales);

          // Extract actual sale data and calculate stats
          const actualSales = userSales.map(item => item.sale);
          const totalKg = actualSales.reduce((sum, s) => sum + (s.cantidadKg || 0), 0);
          const totalVentas = actualSales.length;
          const precioPromedio = actualSales.length > 0
            ? actualSales.reduce((sum, s) => sum + (s.precioUnitarioPen || 0), 0) / actualSales.length
            : 0;

          setStats({ totalKg, totalVentas, precioPromedio });
        }
      } catch (error) {
        console.error("Error fetching sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "short" }).toUpperCase();
  };

  // Get top 5 recent sales
  const recentSales = sales.slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-4 md:px-10 py-3">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-6 bg-primary text-white rounded flex items-center justify-center">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">Dashboard</h2>
            <p className="text-primary/70 text-xs font-medium">ChacraChain x Hedera</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-secondary hover:text-primary transition">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-secondary hover:text-primary transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded h-10 bg-primary/10 text-primary hover:bg-primary/20 transition-all px-4 gap-2 text-sm font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <header className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">Welcome back</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-none">Hi, {userName}!</h1>
          <p className="mt-4 text-secondary max-w-xl leading-relaxed">
            Manage your harvests and ensure transparent sales on the Hedera network.
            Every record is a step toward a fairer agricultural market.
          </p>
        </header>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-sm">
            <p className="text-secondary font-medium text-xs uppercase tracking-wider mb-2">Total Registered (kg)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">{stats.totalKg.toLocaleString("es-PE")}</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">kg</span>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-sm">
            <p className="text-secondary font-medium text-xs uppercase tracking-wider mb-2">Average Price (S/.)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">{stats.precioPromedio.toFixed(2)}</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">S/./kg</span>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-sm">
            <p className="text-secondary font-medium text-xs uppercase tracking-wider mb-2">Transactions</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">{stats.totalVentas}</span>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-sm">
            <p className="text-secondary font-medium text-xs uppercase tracking-wider mb-2">Network Status</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xl font-extrabold text-primary">Active</span>
            </div>
          </div>
        </div>

        {/* Primary Actions: Asymmetric Bento Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 text-slate-100">
          {/* Large Primary Card: Registrar Venta */}
          <button 
            onClick={() => router.push("/register-sale")}
            className="lg:col-span-8 group relative overflow-hidden bg-primary p-10 rounded-xl flex flex-col justify-between items-start text-left min-h-[320px] active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-primary/20 cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-20 -mr-20 -mt-20 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
            <div className="z-10 bg-on-primary/10 p-4 rounded-xl mb-6">
              <Sprout className="w-10 h-10 text-on-primary" />
            </div>
            <div className="z-10">
              <h2 className="text-3xl font-extrabold text-on-primary mb-3">Register Sale</h2>
              <p className="text-on-primary/70 max-w-md font-body text-lg">Record your harvest on the distributed ledger. Guarantee origin and quality instantly.</p>
            </div>
            <div className="z-10 mt-8 flex items-center gap-2 text-on-primary font-bold group-hover:translate-x-2 transition-transform">
              <span>Start registration</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </div>
          </button>

          {/* Second Primary Card: Consultar Precio */}
          <button 
            onClick={() => router.push("/check-price")}
            className="lg:col-span-4 group relative overflow-hidden bg-secondary p-8 rounded-xl flex flex-col justify-between items-start text-left min-h-[320px] active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-secondary/20 cursor-pointer"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary-container opacity-10 -mb-10 -mr-10 rounded-full blur-2xl"></div>
            <div className="z-10 bg-on-secondary/10 p-4 rounded-xl mb-6">
              <TrendingUp className="w-8 h-8 text-on-secondary" />
            </div>
            <div className="z-10">
              <h2 className="text-2xl font-extrabold text-on-secondary mb-3">Check Price</h2>
              <p className="text-on-secondary/70 font-body">Access real-time price oracle data for the national market.</p>
            </div>
            <div className="z-10 mt-8 flex items-center gap-2 text-on-secondary font-bold group-hover:translate-x-1 transition-transform">
              <span>View market</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </div>
          </button>
        </section>

        {/* Recent Activity: Editorial List */}
        <section className="max-w-5xl">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Recent Activity</h3>
              <p className="text-secondary text-sm">Immutable records on-chain</p>
            </div>
            <button 
              onClick={() => router.push("/my-sales")}
              className="text-primary font-bold text-sm hover:underline"
            >
              View full history
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : recentSales.length === 0 ? (
            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 text-center">
              <Sprout className="w-12 h-12 text-secondary/30 mx-auto mb-4" />
              <p className="text-secondary font-medium">You have no sales registered yet</p>
              <p className="text-secondary/70 text-sm mt-1">Start by registering your first sale</p>
              <button
                onClick={() => router.push("/register-sale")}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition"
              >
                Register Sale
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSales.map((saleWithHcs) => (
                <div 
                  key={saleWithHcs.sale.id}
                  className="bg-surface-container-low group hover:bg-white transition-colors p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-outline-variant/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{saleWithHcs.sale.variedadCultivo}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-secondary font-medium">{formatRelativeTime(saleWithHcs.sale.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-10">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{saleWithHcs.sale.cantidadKg.toLocaleString("es-PE")} kg</p>
                      <p className="text-xs text-secondary font-medium">
                          S/. {(saleWithHcs.sale.cantidadKg * saleWithHcs.sale.precioUnitarioPen).toFixed(2)} total
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary/40">
                      <BadgeCheck className="w-4 h-4" />
                      <span className="text-[10px] font-mono tracking-tighter hidden sm:block">
                        {saleWithHcs.sale.hcsEventId.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-container border-t border-primary/10 py-3 px-6 md:hidden flex justify-around items-center z-50">
        <button className="flex flex-col items-center gap-1 text-primary">
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-bold">Dashboard</span>
        </button>
        <button onClick={() => router.push("/register-sale")} className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition">
          <Sprout className="w-5 h-5" />
          <span className="text-[10px] font-bold">Sale</span>
        </button>
        <button onClick={() => router.push("/check-price")} className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition">
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-bold">Price</span>
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
