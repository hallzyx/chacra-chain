"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, Upload, X } from "lucide-react";

interface PriceDataState {
  averagePrice: number | null;
  recordCount: number;
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Renders average market price data from persisted sales in db.json.
 * @returns Price query page component.
 */
export default function ConsultarPrecioPage() {
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
        if (filters.fechaDesde) params.set("fechaDesde", filters.fechaDesde);
        if (filters.fechaHasta) params.set("fechaHasta", filters.fechaHasta);

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
          throw new Error(data.error ?? "Error al consultar precio");
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
          error: error instanceof Error ? error.message : "Error al obtener datos",
        }));
      }
    };

    fetchPriceData();
  }, [filters]);

  /**
   * Updates local filter state from input controls.
   * @param event - Input or select change event.
   */
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Clears all active filters.
   */
  const handleResetFilters = (): void => {
    setFilters({ variedadCultivo: "", fechaDesde: "", fechaHasta: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] to-[#0F0F23]/50 flex flex-col">
      <header className="bg-[#0F0F23]/80 backdrop-blur-sm text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={() => window.history.back()} className="text-white/80 hover:text-white transition">
            <Upload className="h-5 w-5 mr-2" /> ← Volver
          </button>
          <h1 className="text-xl font-semibold text-[#F8FAFC]">Consultar Precio</h1>
          <span className="text-sm opacity-90 text-[#A78BFA]" />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 flex flex-col items-center pt-8 md:pt-12">
        <div className="w-full max-w-4xl space-y-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#F8FAFC]/90 mb-4">Filtros de consulta (opcional)</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#F8FAFC]/90 mb-1">Variedad de cultivo</label>
                <select
                  name="variedadCultivo"
                  value={filters.variedadCultivo}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#F8FAFC]"
                >
                  <option value="">Todas las variedades</option>
                  {variedades.slice(1).map((variedad) => (
                    <option key={variedad} value={variedad}>
                      {variedad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#F8FAFC]/90 mb-1">Desde fecha</label>
                <input
                  name="fechaDesde"
                  type="date"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#F8FAFC]/90 mb-1">Hasta fecha</label>
                <input
                  name="fechaHasta"
                  type="date"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#F8FAFC]"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleResetFilters}
                className="text-sm text-[#F8FAFC]/70 hover:text-[#F8FAFC] transition inline-flex items-center gap-2"
              >
                <X className="h-4 w-4" /> Limpiar filtros
              </button>
            </div>
          </div>

          {priceData.loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-pulse h-16 w-16 text-[#FBBF24]">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
              <p className="mt-4 text-[#F8FAFC]/80 text-center">Calculando precio promedio...</p>
            </div>
          ) : priceData.error ? (
            <div className="bg-[#F87171]/10 border border-[#F87171]/30 text-[#F87171] px-6 py-4 rounded-xl mb-6 text-center">
              <p className="font-medium">Error al obtener datos de precios</p>
              <p className="text-sm mt-1 text-[#F8FAFC]/70">{priceData.error}</p>
            </div>
          ) : priceData.averagePrice === null ? (
            <div className="bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-[#FBBF24] px-6 py-4 rounded-xl mb-6 text-center">
              <p className="font-medium">Todavía no hay ventas para calcular promedio</p>
              <p className="text-sm mt-1 text-[#F8FAFC]/70">Registrá ventas para construir el oráculo de precios.</p>
            </div>
          ) : (
            <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#FBBF24] px-6 py-8 rounded-xl mb-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Download className="h-5 w-5 mr-2 text-[#FBBF24]" />
                <h2 className="text-3xl font-bold text-[#F8FAFC]">S/ {priceData.averagePrice.toFixed(2)}</h2>
              </div>
              <p className="text-lg mb-2 text-[#F8FAFC]/90">por kg</p>
              <p className="text-gray-300 mb-4">Precio promedio basado en ventas registradas</p>
              <div className="flex flex-col items-center space-y-2 text-sm">
                <div className="text-center">
                  Basado en <strong>{priceData.recordCount}</strong> registros verificados en cadena
                </div>
                <div className="text-center">
                  Última actualización:{" "}
                  <span className="font-mono text-[#F8FAFC]/70">
                    {priceData.lastUpdated ? new Date(priceData.lastUpdated).toLocaleString() : "-"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-[#0F0F23]/80 backdrop-blur-sm text-white text-center p-4">
        <p className="text-sm text-[#F8FAFC]/70">Datos leídos desde db.json con eventos persistidos de HCS</p>
      </footer>
    </div>
  );
}
