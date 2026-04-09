import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PageTransition } from "@/components/PageTransition";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { MotionButton } from "@/components/MotionButton";
import { useAuthStore } from "@/stores/authStore";
import { transactionService, type Transaction } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "hsl(152, 55%, 42%)",
  "hsl(38, 92%, 50%)",
  "hsl(210, 70%, 55%)",
  "hsl(340, 65%, 55%)",
  "hsl(270, 50%, 55%)",
  "hsl(20, 80%, 55%)",
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionService
      .getAll()
      .then((res) => setTransactions(res.data.data || []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const name = t.category?.name || "Sem categoria";
      acc[name] = (acc[name] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const recent = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const firstName = user?.name?.split(" ")[0] || "Usuário";

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground">Aqui está o resumo das suas finanças.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
        >
          <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Wallet className="h-4 w-4" />
              <span className="text-xs font-medium">Saldo Atual</span>
            </div>
            <p className={cn("text-xl font-bold", balance >= 0 ? "text-income-foreground" : "text-expense-foreground")}>
              {formatCurrency(balance)}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-xl border border-income-border bg-income p-4">
            <div className="flex items-center gap-2 text-income-foreground mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Entradas</span>
            </div>
            <p className="text-xl font-bold text-income-foreground">{formatCurrency(totalIncome)}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-xl border border-expense-border bg-expense p-4">
            <div className="flex items-center gap-2 text-expense-foreground mb-2">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs font-medium">Saídas</span>
            </div>
            <p className="text-xl font-bold text-expense-foreground">{formatCurrency(totalExpense)}</p>
          </motion.div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Despesas por Categoria</h2>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
              Nenhuma despesa registrada ainda
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          {chartData.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {chartData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  {d.name}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent transactions */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Últimas Transações</h2>
            <button
              onClick={() => navigate("/transactions")}
              className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
            >
              Ver todas <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {recent.length === 0 ? (
            <EmptyState
              icon={<Plus />}
              title="Nenhuma transação ainda"
              description="Que tal registrar a primeira?"
              actionLabel="Nova Transação"
              onAction={() => navigate("/transactions/new")}
            />
          ) : (
            <div className="space-y-2">
              {recent.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold",
                      t.type === "income" ? "bg-income text-income-foreground" : "bg-expense text-expense-foreground"
                    )}
                  >
                    {t.type === "income" ? "+" : "-"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
                  </div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      t.type === "income" ? "text-income-foreground" : "text-expense-foreground"
                    )}
                  >
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Mobile FAB label */}
      <div className="md:hidden fixed bottom-24 right-4 z-40">
        <MotionButton size="lg" onClick={() => navigate("/transactions/new")} className="rounded-full shadow-lg">
          <Plus className="h-5 w-5 mr-1" /> Nova
        </MotionButton>
      </div>
    </PageTransition>
  );
}
