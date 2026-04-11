"use client";
import { useState, useEffect } from "react";
import { Plus, ArrowUpRight, ArrowDownRight, Wallet, Activity, LayoutDashboard, Settings, Trash2 } from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#6366f1", "#8b5cf6"];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    type: "EXPENSE",
    category: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
    } else {
        fetchData();
    }
  }, []);

  // Helper abstrato mágico pra sempre mandar o Token pro backend
  const getAuthHeaders = () => {
      const token = localStorage.getItem("token");
      return {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Essa é a pulseira VIP pra O Filter do Spring!
      };
  };

  const handleLogout = () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txRes, sumRes] = await Promise.all([
        fetch("http://localhost:8080/api/transactions", { headers: getAuthHeaders() }),
        fetch("http://localhost:8080/api/transactions/summary", { headers: getAuthHeaders() })
      ]);
      
      // Se a sessão expirou no backend (token inválido), voltamos pra login
      if (txRes.status === 403 || sumRes.status === 403) {
          handleLogout();
          return;
      }

      if (txRes.ok) {
        setTransactions(await txRes.json());
      }
      if (sumRes.ok) {
        setSummary(await sumRes.json());
      }
    } catch (error) {
      console.error("Falha de conexão com a API:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setFormErrors({});
    
    const payload = { ...formData, amount: parseFloat(formData.amount) };

    try {
      const res = await fetch("http://localhost:8080/api/transactions", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ description: "", amount: "", date: new Date().toISOString().split('T')[0], type: "EXPENSE", category: "" });
        fetchData();
      } else if (res.status === 400) { 
        setFormErrors(await res.json());
      } else if (res.status === 403) {
        handleLogout();
      }
    } catch (err) { console.error("Erro ao salvar", err); }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/transactions/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      fetchData();
    } catch(e) { console.error(e); }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if(!dateString) return "";
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("pt-BR");
  };

  // Prepare chart data dynamically
  const chartData = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      const cat = t.category || 'Outros';
      const existing = acc.find(item => item.name === cat);
      if (existing) { existing.value += t.amount; } 
      else { acc.push({ name: cat, value: t.amount }); }
      return acc;
    }, []);

  return (
    <div className="min-h-screen p-6 md:p-12 lg:px-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">FinTrack</h1>
        </div>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium text-foreground/70">
          <a href="#" className="text-primary flex items-center gap-2"><LayoutDashboard className="h-4 w-4"/> Dashboard</a>
          <a href="#" className="hover:text-foreground transition flex items-center gap-2"><Activity className="h-4 w-4"/> Relatórios</a>
          <a href="#" className="hover:text-foreground transition flex items-center gap-2"><Settings className="h-4 w-4"/> Ajustes</a>
        </nav>

        <div className="flex gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground font-medium px-4 py-2 rounded-full shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Nova
            </button>
            <button 
              onClick={handleLogout}
              className="bg-danger/10 text-danger border border-danger/30 font-medium px-4 py-2 rounded-full shadow-lg hover:bg-danger hover:text-white hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              Sair
            </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-6 rounded-2xl">
              <p className="text-sm text-foreground/60 mb-1">Saldo Atual</p>
              <h2 className="text-3xl font-bold">{formatCurrency(summary.balance)}</h2>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border-b-4 border-b-success/80">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Receitas</p>
                  <h2 className="text-2xl font-bold text-success">{formatCurrency(summary.income)}</h2>
                </div>
                <div className="bg-success/20 p-2 rounded-full">
                  <ArrowUpRight className="h-4 w-4 text-success" />
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-b-4 border-b-danger/80">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Despesas</p>
                  <h2 className="text-2xl font-bold text-danger">{formatCurrency(summary.expense)}</h2>
                </div>
                <div className="bg-danger/20 p-2 rounded-full">
                  <ArrowDownRight className="h-4 w-4 text-danger" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="glass-panel p-6 rounded-2xl h-80 flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
            {chartData.length > 0 ? (
              <div className="flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', background: 'var(--card)', backdropFilter: 'blur(10px)', color: 'var(--foreground)' }}/>
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-foreground/40 text-sm">Sem despesas registradas</div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col max-h-[600px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Transações Recentes</h3>
            <span className="text-xs text-foreground/50 bg-foreground/5 px-2 py-1 rounded-full">{transactions.length} Total</span>
          </div>
          
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {loading && <p className="text-sm text-primary text-center">Conectando API...</p>}
            
            {!loading && transactions.length === 0 && (
                <p className="text-center mt-10 text-sm text-foreground/50">Nenhuma transação cadastrada ainda.</p>
            )}

            {transactions.map((txn) => (
              <div key={txn.id} className="group flex justify-between items-center p-3 hover:bg-foreground/5 rounded-xl transition cursor-default border border-transparent hover:border-foreground/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${txn.type === 'INCOME' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                    {txn.type === 'INCOME' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{txn.description}</h4>
                    <p className="text-xs text-foreground/50">{txn.category || 'Geral'} • {formatDate(txn.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                    <p className={`font-semibold text-sm ${txn.type === 'INCOME' ? 'text-success' : 'text-danger'}`}>
                        {txn.type === 'INCOME' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </p>
                    </div>
                    {/* Delete Icon invisible until hover */}
                    <button onClick={() => handleDelete(txn.id)} className="opacity-0 group-hover:opacity-100 transition text-danger/70 hover:text-danger hover:bg-danger/10 p-2 rounded-lg">
                       <Trash2 className="h-4 w-4" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/50 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl shadow-2xl scale-in-center">
            <h2 className="text-xl font-bold mb-4">Nova Transação</h2>
            
            <form className="space-y-4" onSubmit={handleCreateTransaction}>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-foreground/5 border border-card-border rounded-lg px-4 py-2 outline-none focus:border-primary transition" placeholder="Ex: Mercado" />
                {formErrors.description && <p className="text-danger text-xs mt-1">{formErrors.description}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                  <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-foreground/5 border border-card-border rounded-lg px-4 py-2 outline-none focus:border-primary transition" placeholder="0,00" />
                  {formErrors.amount && <p className="text-danger text-xs mt-1">{formErrors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-foreground/5 border border-card-border rounded-lg px-4 py-2 outline-none focus:border-primary transition appearance-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-foreground/5 border border-card-border rounded-lg px-4 py-2 outline-none focus:border-primary transition">
                    <option value="EXPENSE">Despesa</option>
                    <option value="INCOME">Receita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-foreground/5 border border-card-border rounded-lg px-4 py-2 outline-none focus:border-primary transition" placeholder="Ex: Alimentação" />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium hover:bg-foreground/10 transition">
                  Cancelar
                </button>
                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium shadow hover:shadow-lg transition">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
