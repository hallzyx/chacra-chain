"use client";

import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutGrid,
  Sprout,
  TrendingUp,
  Receipt,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

/**
 * App Layout with SideNavBar Drawer
 * Shared layout for authenticated pages (excludes root route "/")
 * Uses Next.js route groups pattern: (app)
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Agricultor");

  // Load user info on mount
  useEffect(() => {
    const userRaw = localStorage.getItem("chacrachain_user");
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw) as { agricultorId?: string; email?: string };
        setUserName(user.agricultorId || "Agricultor");
      } catch {
        // ignore
      }
    }
  }, []);

  // Don't show drawer on root route
  if (pathname === "/") {
    return <>{children}</>;
  }

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { 
      label: "Panel", 
      icon: LayoutGrid, 
      href: "/dashboard",
      active: pathname === "/dashboard" 
    },
    { 
      label: "Registrar", 
      icon: Sprout, 
      href: "/registrar-venta",
      active: pathname === "/registrar-venta" 
    },
    { 
      label: "Precios", 
      icon: TrendingUp, 
      href: "/consultar-precio",
      active: pathname === "/consultar-precio" 
    },
    { 
      label: "Ventas", 
      icon: Receipt, 
      href: "/mis-ventas",
      active: pathname === "/mis-ventas" 
    },
  ];

  const bottomItems = [
    { label: "Ajustes", icon: Settings, href: "/ajustes" },
    { label: "Salir", icon: LogOut, href: "/login", danger: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container border-b border-outline-variant/10 flex items-center justify-between px-4 z-30 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-secondary hover:text-primary transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-foreground text-sm">ChacraChain</h1>
            <p className="text-[10px] text-secondary uppercase tracking-wider">Hedera Mainnet</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-secondary hover:text-primary transition">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </header>

      {/* SideNavBar Drawer */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-surface-container border-r border-outline-variant/10 flex flex-col transition-all duration-300 ease-in-out z-50 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-outline-variant/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="font-bold text-foreground text-sm">ChacraChain</h1>
                  <p className="text-[10px] text-secondary uppercase tracking-wider">Hedera Mainnet</p>
                </div>
              )}
            </div>
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 text-secondary hover:text-primary"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                item.active 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-secondary hover:bg-surface-container-high hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? "text-white" : ""}`} />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {item.active && !isCollapsed && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* Collapse Toggle - Desktop Only */}
        <div className="p-4 border-t border-outline-variant/10 hidden lg:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-secondary hover:bg-surface-container-high hover:text-foreground transition-colors"
          >
            {isCollapsed ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Colapsar</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-outline-variant/10 space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.label}
              onClick={() => item.href === "/logout" ? router.push("/login") : router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.danger 
                  ? "text-red-500 hover:bg-red-50" 
                  : "text-secondary hover:bg-surface-container-high hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`min-h-screen transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        } pt-16 lg:pt-0`}
      >
        {children}
      </main>
    </div>
  );
}
