"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

/**
 * Renders the login page for email/password authentication.
 * @returns Login screen component.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      };

      if (!response.ok || !data.token || !data.user) {
        throw new Error(data.error ?? "No se pudo iniciar sesión");
      }

      localStorage.setItem("chacrachain_token", data.token);
      localStorage.setItem("chacrachain_user", JSON.stringify(data.user));

      router.push("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] to-[#0F0F23]/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-[#8B5CF6]/20">
            <LogIn className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#F8FAFC]">Iniciar sesión</h1>
            <p className="text-sm text-[#F8FAFC]/70">Accedé con correo y contraseña</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[#F8FAFC]/90 mb-1" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-[#8B5CF6]/20 rounded-xl text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F8FAFC]/90 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
              className="w-full px-4 py-3 bg-white/10 border border-[#8B5CF6]/20 rounded-xl text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              placeholder="Tu contraseña"
            />
          </div>

          {error ? (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-xl p-3">{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 transition text-white rounded-xl py-3 font-semibold disabled:opacity-50"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/registro")}
          className="w-full mt-4 text-[#FBBF24] hover:text-[#FBBF24]/80 transition text-sm flex justify-center items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          ¿No tenés cuenta? Registrate
        </button>
      </div>
    </div>
  );
}
