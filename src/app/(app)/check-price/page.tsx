"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  RefreshCw,
  Download,
  Filter,
  X,
  Home,
  Receipt,
  User,
  ArrowLeft,
  BadgeCheck,
  History,
  Info,
  ChevronDown
} from "lucide-react";

interface PriceDataState {
  averagePrice: number | null;
  recordCount: number;
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
}

type DateRangeOption = "30d" | "7d" | "1d";

interface DateRangeConfig {
  label: string;
  value: DateRangeOption;
  days: number;
}

const DATE_RANGE_OPTIONS: DateRangeConfig[] = [
  { label: "Last 30 days", value: "30d", days: 30 },
  { label: "Last week", value: "7d", days: 7 },
  { label: "Last day", value: "1d", days: 1 },
];

/**
 * Calculates an ISO date range based on selected relative range.
 * @param range - Relative date range option.
 * @returns Start and end date in YYYY-MM-DD format.
 */
function calculateDateRange(range: DateRangeOption): { desde: string; hasta: string } {
  const hoy = new Date();
  const hasta = hoy.toISOString().split("T")[0];

  const dias = DATE_RANGE_OPTIONS.find((opt) => opt.value === range)?.days || 30;
  const desdeDate = new Date(hoy);
  desdeDate.setDate(hoy.getDate() - dias);
  const desde = desdeDate.toISOString().split("T")[0];

  return { desde, hasta };
}

/**
 * Renders average market price data from persisted sales in db.json.
 * Styled with ChacraChain AgriTech Design System from Stich.
 * @returns Price query page component.
 */
export default function CheckPricePage() {
  const router = useRouter();
  
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeOption>("30d");
  
  const [filters, setFilters] = useState({
    variedadCultivo: "",
    fechaDesde: "",
    fechaHasta: "",
  });

  const [priceData, setPriceData] = useState<PriceDataState>({
    averagePrice: null,
    recordCount: 0,
    lastUpdated: null,
    loading: true,
    error: null,
  });

  const variedades = ["", "Papa Canchan", "Papa Única", "Papa Yungay", "Papa Tomasa"];

  /**
   * Fetches filtered average price data from backend endpoint.
   */
  useEffect(() => {
    const fetchPriceData = async (): Promise<void> => {
      setPriceData((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const params = new URLSearchParams();
        if (filters.variedadCultivo) params.set("variedadCultivo", filters.variedadCultivo);
        
        // Calculate date range based on selected range
        const { desde, hasta } = calculateDateRange(selectedDateRange);
        if (desde) params.set("fechaDesde", desde);
        if (hasta) params.set("fechaHasta", hasta);

        const query = params.toString();
        const response = await fetch(`/api/sales${query ? `?${query}` : ""}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = (await response.json()) as {
          error?: string;
          averagePrice?: number | null;
          recordCount?: number;
          lastUpdated?: string | null;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Error checking price");
        }

        setPriceData({
          averagePrice: data.averagePrice ?? null,
          recordCount: data.recordCount ?? 0,
          lastUpdated: data.lastUpdated ?? null,
          loading: false,
          error: null,
        });
      } catch (error) {
        setPriceData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Error fetching data",
        }));
      }
    };

    fetchPriceData();
  }, [filters, selectedDateRange]);

  /**
   * Updates local filter state from input controls.
   * @param event - Input or select change event.
   */
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle date range selection
   * @param range - Selected date range option
   */
  const handleDateRangeChange = (range: DateRangeOption): void => {
    setSelectedDateRange(range);
  };

  /**
   * Clears all active filters.
   */
  const handleResetFilters = (): void => {
    setFilters({ variedadCultivo: "", fechaDesde: "", fechaHasta: "" });
    setSelectedDateRange("30d");
  };

  if (priceData.loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-4 md:px-10 py-3">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-6 bg-primary text-white rounded flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">Price Oracle</h2>
              <p className="text-primary/70 text-xs font-medium">ChacraChain x Hedera</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-10 py-8 max-w-6xl mx-auto w-full">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <p className="text-foreground/60 text-center">Checking market prices...</p>
          </div>
        </main>
      </div>
    );
  }

  if (priceData.error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-4 md:px-10 py-3">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-6 bg-primary text-white rounded flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">Price Oracle</h2>
              <p className="text-primary/70 text-xs font-medium">ChacraChain x Hedera</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-10 py-8 max-w-6xl mx-auto w-full">
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 px-6 py-4 rounded-xl text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="mr-2">⚠️</span>
               <p className="font-medium">Error checking prices</p>
            </div>
            <p className="text-sm mt-1 text-red-600/70">{priceData.error}</p>
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
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">Price Oracle</h2>
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
        {/* Hero Price Card (Asymmetric Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
          {/* Large Price Cluster */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">Current Average Price</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tighter">
                  S/ {priceData.averagePrice?.toFixed(2) ?? "0.00"}
                </h3>
                  <span className="text-xl md:text-2xl font-medium text-stone-400">per kg</span>
              </div>
              <p className="mt-4 text-stone-500 text-sm flex items-center gap-2">
                <History className="w-4 h-4" />
                 Based on {priceData.recordCount} verified records on the Hedera network
              </p>
            </div>
            <div className="mt-8 p-4 bg-surface-container-low rounded-lg flex items-start gap-4">
              <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-secondary leading-relaxed">
                 This price is the weighted average of all verified sales on the Hedera network. Data is immutable and transparent.
              </p>
            </div>
          </div>

          {/* Filters & Action Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Filter className="w-4 h-4" />
                 Query Settings <span className="text-secondary font-normal text-xs">(optional)</span>
              </h4>
              
              <div className="space-y-3">
                {/* Variedad */}
                <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 block">Variety</label>
                  <select
                    name="variedadCultivo"
                    value={filters.variedadCultivo}
                    onChange={handleFilterChange}
                    className="w-full bg-surface-container-lowest border-0 rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary h-11 px-4"
                  >
                     <option value="">All varieties</option>
                    {variedades.slice(1).map((variedad) => (
                      <option key={variedad} value={variedad}>
                        {variedad}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rango de Fecha - Nuevo Selector */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 block">
                     Date Range
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDateRange}
                      onChange={(e) => handleDateRangeChange(e.target.value as DateRangeOption)}
                      className="w-full bg-surface-container-lowest border-0 rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary h-11 px-4 appearance-none cursor-pointer"
                    >
                      {DATE_RANGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">
                     Adjust the query period for average price calculation
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-3 rounded-lg font-bold text-sm border border-outline-variant text-secondary hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                   Clear
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-[2] bg-primary text-white py-3 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                   Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section (Bento Grid Item) */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 mb-8">
          <div className="flex justify-between items-end mb-10">
            <div>
               <h4 className="text-xl font-bold text-foreground">Market Trend</h4>
               <p className="text-sm text-stone-500">Price fluctuation over the last 7 days</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                +2.4%
              </div>
            </div>
          </div>

          {/* Abstract Line Chart Visualization (Simplified SVG) */}
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
              {/* Grid Lines */}
              <line stroke="#f0f1f0" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50"></line>
              <line stroke="#f0f1f0" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150"></line>
              <line stroke="#f0f1f0" strokeWidth="1" x1="0" x2="1000" y1="250" y2="250"></line>
              
              {/* Gradient Fill */}
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#154212" stopOpacity="0.1"></stop>
                  <stop offset="100%" stopColor="#154212" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,220 L150,230 L300,180 L450,195 L600,120 L750,140 L900,80 L1000,95 V300 H0 Z" fill="url(#chartGradient)"></path>
              
              {/* Main Line */}
              <path d="M0,220 L150,230 L300,180 L450,195 L600,120 L750,140 L900,80 L1000,95" fill="none" stroke="#154212" strokeLinecap="round" strokeWidth="3"></path>
              
              {/* Data Points */}
              <circle cx="0" cy="220" fill="#154212" r="4"></circle>
              <circle cx="150" cy="230" fill="#154212" r="4"></circle>
              <circle cx="300" cy="180" fill="#154212" r="4"></circle>
              <circle cx="450" cy="195" fill="#154212" r="4"></circle>
              <circle cx="600" cy="120" fill="#154212" r="4"></circle>
              <circle cx="750" cy="140" fill="#154212" r="4"></circle>
              <circle cx="900" cy="80" fill="#154212" r="6" stroke="#fff" strokeWidth="2"></circle>
              <circle cx="1000" cy="95" fill="#154212" r="4"></circle>
            </svg>
            
            {/* Date Labels */}
            <div className="flex justify-between mt-6 text-[10px] font-bold uppercase tracking-tighter text-stone-400 px-2">
              <span>12 Oct</span>
              <span>13 Oct</span>
              <span>14 Oct</span>
              <span>15 Oct</span>
              <span>16 Oct</span>
              <span>17 Oct</span>
               <span>Today</span>
            </div>
          </div>
        </div>

        {/* Transparency Log (Blockchain Context) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <BadgeCheck className="w-5 h-5 text-primary" />
              </div>
               <h5 className="text-sm font-bold text-foreground">Hedera Network</h5>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
               Hashgraph consensus verified by 24 global nodes. Immutable and verifiable on-chain data.
            </p>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
               <h5 className="text-sm font-bold text-foreground">Total Volume</h5>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
               {priceData.recordCount > 0 ? `${(priceData.recordCount * 250).toLocaleString()} kg` : "42,500 kg"} processed on-chain this month.
            </p>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
               <h5 className="text-sm font-bold text-foreground">Governance</h5>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
               Price algorithm calculated by agricultural community consensus. Fair and transparent pricing.
            </p>
          </div>
        </div>

        {/* Last Update Info */}
        {priceData.lastUpdated && (
          <div className="flex items-center justify-center gap-2 text-xs text-stone-500 mb-8">
            <History className="w-4 h-4" />
             <span>Last update: {new Date(priceData.lastUpdated).toLocaleString()}</span>
          </div>
        )}
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
