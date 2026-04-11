"use client";
import { useState, useEffect } from "react";
import { Wallet, LogIn, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Se o Joãozinho já logou ontem e tem o passe VIP guardado, joga pro Dashboard!
    if (localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Bate lá no seu AuthController do Spring Boot
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        // A mágica: Guardamos o Cofre JWT na memória do navegador do usuário
        localStorage.setItem("token", data.token);
        window.location.href = "/"; 
      } else {
        setError("Email ou senha incorretos.");
      }
    } catch (err) {
      setError("Falha de rede. O Servidor Java está rodando?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Luzes dinâmicas de fundo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/20 rounded-full blur-3xl -z-10 mix-blend-screen" />

      <div className="glass-panel w-full max-w-md p-8 md:p-10 rounded-[2rem] shadow-2xl scale-in-center border border-white/10 dark:border-white/5">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/20 p-4 rounded-2xl border border-primary/30 mb-5 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-center">Bem-vindo(a)</h1>
          <p className="text-foreground/50 text-sm mt-2 text-center">Faça login para continuar controlando o seu futuro</p>
        </div>

        {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-sm p-4 rounded-xl mb-6 text-center animate-pulse">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1 text-foreground/80">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition placeholder:text-foreground/30" 
              placeholder="seu@glorioso-email.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1 text-foreground/80">Senha secreta</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition placeholder:text-foreground/30" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 mt-6 disabled:opacity-70 disabled:hover:translate-y-0 text-base"
          >
            {loading ? "Decifrando cofres..." : <><LogIn className="h-5 w-5" /> Entrar no Cofre</>}
          </button>
        </form>

        <p className="text-center mt-10 text-sm text-foreground/50">
          Ainda não tem conta? <a href="/register" className="text-primary font-medium hover:underline inline-flex items-center gap-1 group">Criar uma agora <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" /></a>
        </p>
      </div>
    </div>
  );
}
