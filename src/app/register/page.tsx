"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sprout, 
  Shield, 
  Eye,
  EyeOff, 
  ArrowRight,
  UserPlus,
  CheckCircle
} from "lucide-react";

/**
 * Renders the registration page for new agricultural producers.
 * Styled with ChacraChain AgriTech Design System from Stitch.
 * @returns Registration screen component.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Redirect logged-in users to dashboard
  useEffect(() => {
    const token = localStorage.getItem("chacrachain_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  /**
   * Validates that passwords match.
   */
  const validatePasswords = (): boolean => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  /**
   * Submits account registration and stores session token in localStorage.
   * @param event - Form submit event.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
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
        throw new Error(data.error ?? "Could not register account");
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
      setError(submitError instanceof Error ? submitError.message : "Unknown error");
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
              Join the agricultural revolution.
            </h2>
            <p className="text-lg text-[#a1d494] max-w-md">
              Register your harvests on the immutable Hedera ledger. Build trust with buyers through transparent, verifiable records.
            </p>

            {/* Features */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[#a1d494]" />
                </div>
                <span className="text-sm text-white">Create your free Hedera wallet automatically</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[#a1d494]" />
                </div>
                <span className="text-sm text-white">Register sales in seconds</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[#a1d494]" />
                </div>
                <span className="text-sm text-white">Access real-time market prices</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-[#a1d494]">
            © 2026 ChacraChain. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
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
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#154212]/10 rounded-2xl mb-4">
              <UserPlus className="w-7 h-7 text-[#154212]" />
            </div>
            <h1 className="text-3xl font-bold text-[#191c1c] mb-2">Create Account</h1>
            <p className="text-[#42493e]">Start registering your agricultural sales on Hedera.</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#191c1c] mb-2" htmlFor="email">
                Email
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#191c1c] mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setPasswordError(null);
                  }}
                  minLength={8}
                  required
                  className="w-full px-4 py-3 pl-11 pr-11 bg-[#f3f4f3] border-0 rounded-xl text-[#191c1c] placeholder-[#72796e] focus:outline-none focus:ring-2 focus:ring-[#154212] transition-all"
                   placeholder="Minimum 8 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#191c1c] mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setPasswordError(null);
                  }}
                  minLength={8}
                  required
                  className="w-full px-4 py-3 pl-11 pr-11 bg-[#f3f4f3] border-0 rounded-xl text-[#191c1c] placeholder-[#72796e] focus:outline-none focus:ring-2 focus:ring-[#154212] transition-all"
                   placeholder="Repeat your password"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-[#72796e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#72796e] hover:text-[#191c1c] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Match Error */}
            {passwordError ? (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {passwordError}
              </div>
            ) : null}

            {/* General Error */}
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="flex items-start gap-3 p-4 bg-[#f3f4f3] rounded-xl">
            <Shield className="w-5 h-5 text-[#154212] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#42493e]">
              Your wallet is automatically created on Hedera Testnet. No blockchain knowledge required.
            </p>
          </div>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-[#e1e3e2]">
            <p className="text-[#42493e]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-semibold text-[#154212] hover:text-[#2d5a27] transition-colors inline-flex items-center gap-1"
              >
                Sign in
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
