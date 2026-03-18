"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, Download, LogIn, UserPlus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Main ChacraChain page component.
 * Displays options to register sale or consult price.
 */
export default function ChacraChainPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return Boolean(localStorage.getItem("chacrachain_token"));
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const user = localStorage.getItem("chacrachain_user");
    if (!user) {
      return null;
    }

    try {
      const parsed = JSON.parse(user) as { email?: string };
      return parsed.email ?? null;
    } catch {
      return null;
    }
  });

  // Simulate loading state for demo
  useEffect(() => {
    // Simulate initial load
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const syncSession = setTimeout(() => {
      const token = localStorage.getItem("chacrachain_token");
      const user = localStorage.getItem("chacrachain_user");
      setIsAuthenticated(Boolean(token));

      if (user) {
        try {
          const parsed = JSON.parse(user) as { email?: string };
          setUserEmail(parsed.email ?? null);
        } catch {
          setUserEmail(null);
        }
      }
    }, 0);

    return () => {
      clearTimeout(syncSession);
    };
  }, []);

  /**
   * Removes auth data from localStorage and redirects to login.
   */
  const handleLogout = (): void => {
    localStorage.removeItem("chacrachain_token");
    localStorage.removeItem("chacrachain_user");
    setIsAuthenticated(false);
    setUserEmail(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] to-[#0F0F23]/50 flex flex-col">
      {/* Header */}
      <header className="bg-[#0F0F23]/80 backdrop-blur-sm text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Organic leaf icon - using Upload as placeholder for organic feel */}
            <Upload className="text-2xl text-[#FBBF24]" />
            <h1 className="text-2xl font-bold text-[#F8FAFC]">ChacraChain</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm opacity-90 text-[#A78BFA] hidden md:block">AgriTech Web3 Demo</span>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-[#F8FAFC] hover:bg-white/20 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Salir</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {isLoading ? (
          <div className="text-5xl font-bold text-[#FBBF24] animate-pulse">
            ChacraChain
          </div>
        ) : (
          <>
            <p className="text-xl text-[#F8FAFC]/90 mb-8 text-center max-w-xl">
              Registra tus ventas agrícolas de forma inmutable y consulta precios promedio verificados en cadena
            </p>

            {!isAuthenticated ? (
              <div className="mb-8 w-full max-w-md bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl p-5">
                <p className="text-[#F8FAFC]/80 text-sm text-center mb-4">
                  Para registrar ventas reales en Hedera Testnet, primero ingresá o creá tu cuenta.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 text-white py-2.5 font-medium transition"
                  >
                    <LogIn className="w-4 h-4" /> Ingresar
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/registro")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBBF24]/90 hover:bg-[#FBBF24] text-[#0F0F23] py-2.5 font-medium transition"
                  >
                    <UserPlus className="w-4 h-4" /> Crear cuenta
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-8 text-center text-sm text-[#F8FAFC]/70">
                Sesión activa: <span className="text-[#FBBF24]">{userEmail}</span>
              </div>
            )}

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
              {/* Registrar Venta Card */}
              <Link
                href={isAuthenticated ? "/registrar-venta" : "/login"}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 flex flex-col border border-[#8B5CF6]/30 group"
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="p-4 bg-[#8B5CF6]/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-[#8B5CF6]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">
                    Registrar Venta
                  </h2>
                  <p className="text-[#F8FAFC]/70 mb-8 flex-1">
                    Crea un registro inmutable de tu transacción agrícola en Hedera Consensus Service.
                  </p>
                  <span className="text-[#FBBF24] font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Comenzar →
                  </span>
                </div>
              </Link>

              {/* Consultar Precio Card */}
              <Link
                href="/consultar-precio"
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 flex flex-col border border-[#8B5CF6]/30 group"
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="p-4 bg-[#8B5CF6]/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                    <Download className="w-10 h-10 text-[#8B5CF6]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">
                    Consultar Precio
                  </h2>
                  <p className="text-[#F8FAFC]/70 mb-8 flex-1">
                    Obtén precios promedio de mercado basados en datos históricos verificados en cadena.
                  </p>
                  <span className="text-[#FBBF24] font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Ver precios →
                  </span>
                </div>
              </Link>

              {/* Mis Ventas Card */}
              <Link
                href="/mis-ventas"
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 flex flex-col border border-[#8B5CF6]/30 group"
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="p-4 bg-[#8B5CF6]/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                    <Download className="w-10 h-10 text-[#8B5CF6]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">
                    Mis Ventas
                  </h2>
                  <p className="text-[#F8FAFC]/70 mb-8 flex-1">
                    Revisa el historial de todas tus ventas registradas en cadena.
                  </p>
                  <span className="text-[#FBBF24] font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Ver historial →
                  </span>
                </div>
              </Link>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0F0F23]/80 backdrop-blur-sm text-white text-center p-4">
        <p className="text-sm text-[#F8FAFC]/70">
          Demo en Hedera Testnet • Potenciado por Hashgraph Consensus Service
        </p>
      </footer>
    </div>
  );
}
