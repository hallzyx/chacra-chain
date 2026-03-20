"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sprout, 
  Shield, 
  MapPin, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle
} from "lucide-react";

/**
 * Renders the login page for email/password authentication.
 * Styled with ChacraChain AgriTech Design System from Stitch.
 * @returns Login screen component.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Submits user credentials and stores auth token in localStorage.
   * @param event - Form submit event.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as {
        error?: string;
        token?: string;
        user?: { agricultorId: string; email: string };
        wallet?: { hederaAccountId?: string; publicKey?: string };
      };

      if (!response.ok || !data.token || !data.user) {
        throw new Error(data.error ?? "No se pudo iniciar sesión");
      }

      localStorage.setItem("chacrachain_token", data.token);
      localStorage.setItem(
        "chacrachain_user",
        JSON.stringify({
          ...data.user,
          walletAddress: data.wallet?.hederaAccountId || "",
          publicKey: data.wallet?.publicKey || "",
        })
      );

      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-[#154212] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#2d5a27]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-[#79573f]/20 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ChacraChain</span>
          </div>

          {/* Tagline */}
          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Transparency from soil to shelf.
            </h2>
            <p className="text-lg text-[#a1d494] max-w-md">
              Connecting Peruvian agricultural heritage with the clinical precision of the Hedera network.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Shield className="w-4 h-4 text-[#a1d494]" />
                <span className="text-sm text-white">Hedera Mainnet Secured</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <MapPin className="w-4 h-4 text-[#a1d494]" />
                <span className="text-sm text-white">Andean Region</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-[#a1d494]">
            © 2026 ChacraChain. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#f9f9f8]">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#154212] rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#191c1c]">ChacraChain</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-[#191c1c] mb-2">Welcome Back</h1>
            <p className="text-[#42493e]">Access your harvest data and market insights.</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#191c1c] mb-2" htmlFor="email">
                Email/Phone
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full px-4 py-3 pl-11 bg-[#f3f4f3] border-0 rounded-xl text-[#191c1c] placeholder-[#72796e] focus:outline-none focus:ring-2 focus:ring-[#154212] transition-all"
                  placeholder="your@email.com"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-[#72796e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#191c1c]" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-[#154212] hover:text-[#2d5a27] font-medium"
                >
                  Olvidé mi contraseña
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                  className="w-full px-4 py-3 pl-11 pr-11 bg-[#f3f4f3] border-0 rounded-xl text-[#191c1c] placeholder-[#72796e] focus:outline-none focus:ring-2 focus:ring-[#154212] transition-all"
                  placeholder="Your password"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-[#72796e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#72796e] hover:text-[#191c1c] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="w-5 h-5 rounded-lg border-2 border-[#c2c9bb] text-[#154212] focus:ring-[#154212] focus:ring-2 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-3 text-sm text-[#42493e] cursor-pointer">
                Keep me logged in
              </label>
            </div>

            {/* Error */}
            {error ? (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            ) : null}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#154212] hover:bg-[#2d5a27] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Ingresando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="flex items-start gap-3 p-4 bg-[#f3f4f3] rounded-xl">
            <Shield className="w-5 h-5 text-[#154212] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#42493e]">
              Secure login protected by Hedera. Your data is encrypted and recorded on the immutable ledger.
            </p>
          </div>

          {/* Register Link */}
          <div className="text-center pt-4 border-t border-[#e1e3e2]">
            <p className="text-[#42493e]">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/registro")}
                className="font-semibold text-[#154212] hover:text-[#2d5a27] transition-colors inline-flex items-center gap-1"
              >
                Register as a producer
                <ArrowRight className="w-4 h-4" />
              </button>
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#72796e] pt-4">
            <Link href="#" className="hover:text-[#154212] transition-colors">Network Status</Link>
            <span className="text-[#c2c9bb]">•</span>
            <Link href="#" className="hover:text-[#154212] transition-colors">Support</Link>
            <span className="text-[#c2c9bb]">•</span>
            <Link href="#" className="hover:text-[#154212] transition-colors">Privacy</Link>
          </div>

          <p className="text-center text-xs text-[#72796e]">
            Powered by Hedera Hashgraph | v1.0.4
          </p>
        </div>
      </div>
    </div>
  );
}
