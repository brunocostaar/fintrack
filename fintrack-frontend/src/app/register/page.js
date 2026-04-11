"use client";
import { useState, useEffect } from "react";
import { Wallet, UserPlus, ArrowLeft } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) window.location.href = "/";
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);
      } else {
        const errData = await res.json();
        // A API Spring pode retornar as validações (@NotBlank) e mostrar na tela
        setError(JSON.stringify(errData) || "Algo deu errado. E-mail possivelmente em uso.");
      }
    } catch (err) {
      setError("Erro de rede. A API não respondeu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 mix-blend-screen" />
      
      <div className="glass-panel w-full max-w-md p-8 md:p-10 rounded-[2rem] shadow-2xl scale-in-center border border-white/10 dark:border-white/5">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/20 p-4 rounded-2xl border border-primary/30 mb-5 text-primary">
            <UserPlus className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-center">Criar Conta</h1>
        </div>

        {error && <div className="bg-danger/10 border text-danger text-sm p-4 rounded-xl mb-6">{error}</div>}
        {success && <div className="bg-success/10 border border-success/30 text-success text-sm p-4 rounded-xl mb-6 text-center">Conta criada! Redirecionando...</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1 text-foreground/80">Como devemos te chamar?</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-foreground/5 border-foreground/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1" placeholder="Seu nome bonito" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1 text-foreground/80">Seu melhor E-mail</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-foreground/5 border-foreground/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1" placeholder="email@dominio.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1 text-foreground/80">Uma senha forte</label>
            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-foreground/5 border-foreground/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1" placeholder="Pelo menos 6 caracteres" />
          </div>

          <button type="submit" disabled={loading || success} className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl flex justify-center items-center gap-2 mt-6 transition hover:shadow-primary/40 hover:-translate-y-0.5">
            {loading ? "Registrando..." : "Confirmar e Registrar"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm">
          <a href="/login" className="text-foreground/50 hover:text-foreground font-medium inline-flex items-center gap-2 transition-colors"><ArrowLeft className="h-4 w-4"/> Voltar e fazer Login</a>
        </p>
      </div>
    </div>
  );
}
