"use client";

import { useRouter } from "next/navigation";
import { 
  LayoutGrid,
  Home,
  Sprout,
  TrendingUp,
  Receipt,
  User,
  ArrowLeft,
  BadgeCheck,
  Info,
  Hash,
  Leaf,
  Scale,
  DollarSign,
  Calendar,
  TrendingDown,
  Package,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Search,
  Bell,
  Settings,
  LogOut
} from "lucide-react";

/**
 * Dashboard Panel de Control - Main landing page after login.
 * Styled with ChacraChain AgriTech Design System from Stich.
 * @returns Dashboard page component.
 */
export default function DashboardPage() {
  const router = useRouter();

  // Mock data for recent activity
  const recentActivity = [
    {
      id: "T-982",
      variedad: "Papa Amarilla",
      cantidad: 5200,
      precioTotal: 15080,
      fecha: "Hace 2 horas",
      tipo: "premium",
    },
    {
      id: "T-981",
      variedad: "Papa Canchan",
      cantidad: 3150,
      precioTotal: 7875,
      fecha: "Ayer",
      tipo: "estandar",
    },
    {
      id: "T-980",
      variedad: "Papa Huamantanga",
      cantidad: 4100,
      precioTotal: 12300,
      fecha: "02 OCT",
      tipo: "premium",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-4 md:px-10 py-3">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-6 bg-primary text-white rounded flex items-center justify-center">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">Panel de Control</h2>
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
            <span className="hidden md:inline">Volver</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <header className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">Bienvenido de vuelta</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-none">¡Hola, Agricultor!</h1>
          <p className="mt-4 text-secondary max-w-xl leading-relaxed">
            Gestiona tus cosechas y asegura la transparencia de tus ventas en la red Hedera. 
            Cada registro es un paso hacia un mercado agrícola más justo.
          </p>
        </header>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-sm">
            <p className="text-secondary font-medium text-xs uppercase tracking-wider mb-2">Ventas del mes (kg)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">12,450</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+12%</span>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-sm">
            <p className="text-secondary font-medium text-xs uppercase tracking-wider mb-2">Precio Promedio (S/.)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">2.85</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">S/./kg</span>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-sm">
            <p className="text-secondary font-medium text-xs uppercase tracking-wider mb-2">Transacciones</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">48</span>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-sm">
            <p className="text-secondary font-medium text-xs uppercase tracking-wider mb-2">Status Red</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xl font-extrabold text-primary">Activo</span>
            </div>
          </div>
        </div>

        {/* Primary Actions: Asymmetric Bento Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 text-slate-100">
          {/* Large Primary Card: Registrar Venta */}
          <button 
            onClick={() => router.push("/registrar-venta")}
            className="lg:col-span-8 group relative overflow-hidden bg-primary p-10 rounded-xl flex flex-col justify-between items-start text-left min-h-[320px] active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-primary/20 cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-20 -mr-20 -mt-20 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
            <div className="z-10 bg-on-primary/10 p-4 rounded-xl mb-6">
              <Sprout className="w-10 h-10 text-on-primary" />
            </div>
            <div className="z-10">
              <h2 className="text-3xl font-extrabold text-on-primary mb-3">Registrar Venta</h2>
              <p className="text-on-primary/70 max-w-md font-body text-lg">Inmortaliza tu cosecha en el ledger distribuido. Garantiza origen y calidad de forma instantánea.</p>
            </div>
            <div className="z-10 mt-8 flex items-center gap-2 text-on-primary font-bold group-hover:translate-x-2 transition-transform">
              <span>Empezar registro</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </div>
          </button>

          {/* Second Primary Card: Consultar Precio */}
          <button 
            onClick={() => router.push("/consultar-precio")}
            className="lg:col-span-4 group relative overflow-hidden bg-secondary p-8 rounded-xl flex flex-col justify-between items-start text-left min-h-[320px] active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-secondary/20 cursor-pointer"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary-container opacity-10 -mb-10 -mr-10 rounded-full blur-2xl"></div>
            <div className="z-10 bg-on-secondary/10 p-4 rounded-xl mb-6">
              <TrendingUp className="w-8 h-8 text-on-secondary" />
            </div>
            <div className="z-10">
              <h2 className="text-2xl font-extrabold text-on-secondary mb-3">Consultar Precio</h2>
              <p className="text-on-secondary/70 font-body">Accede al oráculo de precios en tiempo real para el mercado nacional.</p>
            </div>
            <div className="z-10 mt-8 flex items-center gap-2 text-on-secondary font-bold group-hover:translate-x-1 transition-transform">
              <span>Ver mercado</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </div>
          </button>
        </section>

        {/* Recent Activity: Editorial List */}
        <section className="max-w-5xl">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Actividad Reciente</h3>
              <p className="text-secondary text-sm">Registros inmutables en la cadena</p>
            </div>
            <a className="text-primary font-bold text-sm hover:underline" href="#">Ver historial completo</a>
          </div>
          <div className="space-y-4">
            {/* Activity Item 1 */}
            <div className="bg-surface-container-low group hover:bg-white transition-colors p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Papa Amarilla • T-982</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Premium</span>
                    <span className="text-xs text-secondary font-medium">HACE 2 HORAS</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-10">
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">5,200 kg</p>
                  <p className="text-xs text-secondary font-medium">S/. 14,820 total</p>
                </div>
                <div className="flex items-center gap-2 text-primary/40">
                  <BadgeCheck className="w-4 h-4" />
                  <span className="text-[10px] font-mono tracking-tighter hidden sm:block">0.0.12543...</span>
                </div>
              </div>
            </div>

            {/* Activity Item 2 */}
            <div className="bg-surface-container-low group hover:bg-white transition-colors p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Papa Canchán • T-981</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Estándar</span>
                    <span className="text-xs text-secondary font-medium">AYER</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-10">
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">3,150 kg</p>
                  <p className="text-xs text-secondary font-medium">S/. 7,875 total</p>
                </div>
                <div className="flex items-center gap-2 text-primary/40">
                  <BadgeCheck className="w-4 h-4" />
                  <span className="text-[10px] font-mono tracking-tighter hidden sm:block">0.0.12542...</span>
                </div>
              </div>
            </div>

            {/* Activity Item 3 */}
            <div className="bg-surface-container-low group hover:bg-white transition-colors p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Papa Huamantanga • T-980</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Premium</span>
                    <span className="text-xs text-secondary font-medium">02 OCT</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-10">
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">4,100 kg</p>
                  <p className="text-xs text-secondary font-medium">S/. 12,300 total</p>
                </div>
                <div className="flex items-center gap-2 text-primary/40">
                  <BadgeCheck className="w-4 h-4" />
                  <span className="text-[10px] font-mono tracking-tighter hidden sm:block">0.0.12540...</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-container border-t border-primary/10 py-3 px-6 md:hidden flex justify-around items-center z-50">
        <button className="flex flex-col items-center gap-1 text-primary">
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-bold">Panel</span>
        </button>
        <button onClick={() => router.push("/registrar-venta")} className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition">
          <Sprout className="w-5 h-5" />
          <span className="text-[10px] font-bold">Venta</span>
        </button>
        <button onClick={() => router.push("/consultar-precio")} className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition">
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-bold">Precio</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Perfil</span>
        </button>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
