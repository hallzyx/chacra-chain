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
  const [userName, setUserName] = useState<string>("Farmer");
  const [userEmail, setUserEmail] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Load user info on mount
  useEffect(() => {
    const userRaw = localStorage.getItem("chacrachain_user");
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw) as { 
          agricultorId?: string; 
          email?: string;
          walletAddress?: string;
        };
        setUserName(user.agricultorId || "Farmer");
        setUserEmail(user.email || "");
        setWalletAddress(user.walletAddress || "");
      } catch {
        // ignore
      }
    }
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen && !(event.target as Element).closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("chacrachain_token");
    localStorage.removeItem("chacrachain_user");
    setIsUserMenuOpen(false);
    router.push("/login");
  };

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
      label: "Dashboard", 
      icon: LayoutGrid, 
      href: "/dashboard",
      active: pathname === "/dashboard" 
    },
    { 
      label: "Register", 
      icon: Sprout, 
      href: "/registrar-venta",
      active: pathname === "/registrar-venta" 
    },
    { 
      label: "Prices", 
      icon: TrendingUp, 
      href: "/consultar-precio",
      active: pathname === "/consultar-precio" 
    },
    { 
      label: "Sales", 
      icon: Receipt, 
      href: "/mis-ventas",
      active: pathname === "/mis-ventas" 
    },
  ];

  const bottomItems = [
    { label: "Settings", icon: Settings, href: "/ajustes" },
    { label: "Sign Out", icon: LogOut, href: "/login", danger: true },
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
            <p className="text-[10px] text-secondary uppercase tracking-wider">Hedera</p>
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

      {/* Desktop Header */}
      <header className="hidden lg:flex fixed top-0 right-0 h-16 bg-surface-container border-b border-outline-variant/10 items-center justify-end px-6 z-30" style={{ left: isCollapsed ? '5rem' : '16rem' }}>
        <div className="flex items-center gap-4">
          <button className="p-2 text-secondary hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="relative user-menu">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-secondary">{userEmail}</p>
              </div>
              <svg
                className={`w-4 h-4 text-secondary transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-surface-container border border-outline-variant/10 rounded-lg shadow-lg py-2 z-50">
                {walletAddress ? (
                  <div className="px-4 py-2 border-b border-outline-variant/10 mb-1">
                    <p className="text-xs text-secondary mb-1">Wallet Address</p>
                    <p className="text-xs font-mono text-foreground break-all">{walletAddress}</p>
                  </div>
                ) : (
                  <div className="px-4 py-2 text-sm text-secondary border-b border-outline-variant/10 mb-1">
                    Wallet not configured
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
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
                  <p className="text-[10px] text-secondary uppercase tracking-wider">Hedera</p>
                </div>
              )}
            </div>
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 text-secondary hover:text-primary"
            >
              <span className="sr-only">Close</span>
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
                <span className="text-sm font-medium">Collapse</span>
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
