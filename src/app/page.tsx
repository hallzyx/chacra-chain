"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  TrendingUp,
  Wallet,
  Upload,
  Sprout,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Leaf,
  Database,
  ExternalLink,
} from "lucide-react";

/**
 * ChacraChain Landing Page
 * AgriTech Web3 platform for Peruvian agricultural producers
 * Design System: "The Digital Agronomist" - High-end editorial feel
 */
export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Redirect logged-in users to dashboard
  useEffect(() => {
    const token = localStorage.getItem("chacrachain_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  // Track scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8]">
      {/* Navigation Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#f9f9f8]/95 backdrop-blur-md shadow-sm border-b border-[#e1e3e2]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#154212] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#191c1c] tracking-tight">
                ChacraChain
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-sm font-medium text-[#42493e] hover:text-[#154212] transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-sm font-medium text-[#42493e] hover:text-[#154212] transition-colors"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection("technology")}
                className="text-sm font-medium text-[#42493e] hover:text-[#154212] transition-colors"
              >
                Technology
              </button>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2.5 text-sm font-medium text-[#154212] hover:text-[#2d5a27] transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-5 py-2.5 bg-[#154212] text-white text-sm font-semibold rounded-xl hover:bg-[#2d5a27] transition-all hover:shadow-lg hover:shadow-[#154212]/20"
              >
                Get started free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#191c1c]"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#f9f9f8] border-t border-[#e1e3e2]">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left py-2 text-[#42493e] font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block w-full text-left py-2 text-[#42493e] font-medium"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection("technology")}
                className="block w-full text-left py-2 text-[#42493e] font-medium"
              >
                Technology
              </button>
              <div className="pt-3 border-t border-[#e1e3e2] space-y-2">
                <button
                  onClick={() => router.push("/login")}
                  className="block w-full py-2.5 text-center text-[#154212] font-medium"
                >
                  Sign in
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="block w-full py-2.5 bg-[#154212] text-white text-center font-semibold rounded-xl"
                >
                  Get started free
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f3f4f3] via-[#f9f9f8] to-[#e7e8e7]" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#154212]/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#79573f]/5 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#154212]/10 rounded-full mb-6">
                <Sprout className="w-4 h-4 text-[#154212]" />
                <span className="text-sm font-medium text-[#154212]">
                  AgriTech Web3 for Peru
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#191c1c] leading-tight tracking-tight mb-6">
                ChacraChain
                <span className="block text-[#154212] mt-2">
                  The immutable record of your harvest
                </span>
              </h1>

              <p className="text-lg text-[#42493e] leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                The first Web3 platform for Peruvian farmers. Register
                your sales immutably and check average market prices
                in real time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => router.push("/register")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#154212] text-white font-semibold rounded-xl hover:bg-[#2d5a27] transition-all hover:shadow-xl hover:shadow-[#154212]/20 group"
                >
                  Start now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#f3f4f3] text-[#154212] font-semibold rounded-xl hover:bg-[#e7e8e7] transition-all border border-[#c2c9bb]"
                >
                  View demo
                </button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 bg-gradient-to-br from-[#154212] to-[#2d5a27] rounded-3xl p-8 shadow-2xl">
                <div className="bg-[#f9f9f8] rounded-2xl p-6 space-y-4">
                  {/* Mock UI Card */}
                  <div className="flex items-center gap-4 pb-4 border-b border-[#e1e3e2]">
                    <div className="w-12 h-12 bg-[#154212]/10 rounded-xl flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-[#154212]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#42493e]">Sale registered</p>
                      <p className="text-lg font-bold text-[#191c1c]">
                        Papa Canchan
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f3f4f3] rounded-xl p-4">
                      <p className="text-xs text-[#42493e] uppercase tracking-wide">
                         Quantity
                      </p>
                      <p className="text-xl font-bold text-[#191c1c]">5,000 kg</p>
                    </div>
                    <div className="bg-[#f3f4f3] rounded-xl p-4">
                      <p className="text-xs text-[#42493e] uppercase tracking-wide">
                         Price
                      </p>
                      <p className="text-xl font-bold text-[#154212]">
                        S/ 1.20
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#154212]">
                    <CheckCircle className="w-4 h-4" />
                    <span>Registered on Hedera HCS</span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#79573f]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#154212]/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#154212]/10 rounded-full mb-6">
              <Database className="w-4 h-4 text-[#154212]" />
              <span className="text-sm font-medium text-[#154212]">
                 Web3 Technology
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#191c1c] mb-6">
               Key features
            </h2>
            <p className="text-lg text-[#42493e]">
               Designed specifically for Peruvian agricultural producers,
               combining Web2 ease of use with Web3 security.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-[#f9f9f8] rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-[#e1e3e2] hover:border-[#154212]/20">
              <div className="w-14 h-14 bg-[#154212] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#191c1c] mb-3">
                 Immutable Records
              </h3>
              <p className="text-[#42493e] leading-relaxed">
                 Every sale is permanently recorded on Hedera
                 Hashgraph. Cryptographic proof verifiable forever.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-[#f9f9f8] rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-[#e1e3e2] hover:border-[#154212]/20">
              <div className="w-14 h-14 bg-[#154212] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#191c1c] mb-3">
                 Price Oracle
              </h3>
              <p className="text-[#42493e] leading-relaxed">
                 Check average market prices based on
                 verifiable historical data. Make informed decisions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-[#f9f9f8] rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-[#e1e3e2] hover:border-[#154212]/20">
              <div className="w-14 h-14 bg-[#154212] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#191c1c] mb-3">
                 Frictionless Web3
              </h3>
              <p className="text-[#42493e] leading-relaxed">
                 No wallets or seed phrases needed. Traditional
                 authentication with invisible Web3 technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-[#f3f4f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#191c1c] mb-6">
               How does it work?
            </h2>
            <p className="text-lg text-[#42493e]">
               Three simple steps to start recording your sales
               immutably.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-20 h-20 bg-[#154212] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#154212]/20">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-10 left-1/2 w-full h-0.5 bg-[#c2c9bb] hidden md:block -z-10" />
              <h3 className="text-xl font-bold text-[#191c1c] mb-3">
                 Register your sale
              </h3>
              <p className="text-[#42493e]">
                 Fill in your agricultural transaction details: potato variety,
                 quantity, price, and date.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-20 h-20 bg-[#154212] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#154212]/20">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-10 left-1/2 w-full h-0.5 bg-[#c2c9bb] hidden md:block -z-10" />
              <h3 className="text-xl font-bold text-[#191c1c] mb-3">
                 Stored on Hedera
              </h3>
              <p className="text-[#42493e]">
                 Information is immutably recorded in Hedera
                 Consensus Service with cryptographic timestamp.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="w-20 h-20 bg-[#154212] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#154212]/20">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#191c1c] mb-3">
                 Check anytime
              </h3>
              <p className="text-[#42493e]">
                 Access your complete history and check market prices
                 updated in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20 lg:py-28 bg-[#154212] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <Shield className="w-4 h-4 text-[#a1d494]" />
                <span className="text-sm font-medium text-[#a1d494]">
                   Enterprise Technology
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                 Powered by Hedera Hashgraph
              </h2>

              <p className="text-lg text-[#a1d494] leading-relaxed mb-8">
                 We use Hedera Consensus Service (HCS) to guarantee the
                 immutability of your records. Microscopic costs ($0.0001 USD
                 per message), near-instant finality (2-3 seconds), and consensus
                 verified by 24 global nodes.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-2xl font-bold text-white">$0.0001</p>
                   <p className="text-sm text-[#a1d494]">Cost per message</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-2xl font-bold text-white">2-3s</p>
                   <p className="text-sm text-[#a1d494]">Finality</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-2xl font-bold text-white">24</p>
                   <p className="text-sm text-[#a1d494]">Global nodes</p>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="bg-[#f9f9f8] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#e1e3e2]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#154212] rounded-xl flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-[#191c1c]">
                        ChacraChain
                      </span>
                    </div>
                    <span className="text-xs text-[#42493e]">Hedera HCS</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#42493e]">Topic ID</span>
                      <span className="font-mono text-[#191c1c]">
                        0.0.8269985
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#42493e]">Transaction</span>
                      <span className="font-mono text-[#191c1c]">
                        0.0.7974...
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#42493e]">Timestamp</span>
                      <span className="font-mono text-[#191c1c]">
                        2026-03-18
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-[#e1e3e2]">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-[#154212] font-medium">
                       Consensus reached in 2.3 seconds
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#a1d494]/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#79573f]/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-[#f3f4f3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-[#e1e3e2]">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#154212]/10 rounded-2xl mb-6">
              <Sprout className="w-8 h-8 text-[#154212]" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#191c1c] mb-4">
               Join the digital agricultural revolution
            </h2>

            <p className="text-lg text-[#42493e] mb-8 max-w-2xl mx-auto">
               Be part of the first network of Peruvian farmers with
               immutable transaction records. Start free today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/register")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#154212] text-white font-semibold rounded-xl hover:bg-[#2d5a27] transition-all hover:shadow-xl hover:shadow-[#154212]/20 group"
              >
                 Create free account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="mt-6 text-sm text-[#42493e]">
               Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-[#154212] font-semibold hover:underline"
              >
                 Sign in here
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#191c1c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#154212] rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ChacraChain</span>
              </Link>
              <p className="text-[#a1d494] text-sm leading-relaxed">
                 The first Web3 platform for Peruvian farmers.
                 Immutable records on Hedera Hashgraph.
              </p>
            </div>

            {/* Links */}
            <div>
               <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-[#a1d494] hover:text-white transition-colors text-sm"
                  >
                     Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="text-[#a1d494] hover:text-white transition-colors text-sm"
                  >
                     How it works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("technology")}
                    className="text-[#a1d494] hover:text-white transition-colors text-sm"
                  >
                     Technology
                  </button>
                </li>
              </ul>
            </div>

            <div>
               <h4 className="font-semibold mb-4 text-white">Application</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/register-sale"
                    className="text-[#a1d494] hover:text-white transition-colors text-sm"
                  >
                     Register sale
                  </Link>
                </li>
                <li>
                  <Link
                    href="/check-price"
                    className="text-[#a1d494] hover:text-white transition-colors text-sm"
                  >
                     Check prices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-sales"
                    className="text-[#a1d494] hover:text-white transition-colors text-sm"
                  >
                     My sales
                  </Link>
                </li>
              </ul>
            </div>

            <div>
               <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-3">
                <li className="text-[#a1d494] text-sm">
                  contacto@chacra.chain
                </li>
                 <li className="text-[#a1d494] text-sm">Lima, Peru</li>
              </ul>
              <div className="flex gap-4 mt-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#a1d494] text-sm">
               © 2026 ChacraChain. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[#a1d494] text-sm">
              <span>Powered by</span>
              <span className="font-semibold text-white">Hedera</span>
              <span>Hashgraph</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
