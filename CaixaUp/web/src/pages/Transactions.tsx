import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { SkeletonList } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { transactionService, type Transaction } from "@/lib/api";
import { formatCurrency, formatDate, groupByDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    transactionService
      .getAll()
      .then((res) => setTransactions(res.data.data || []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter((t) =>
    t.description.toLowerCase().includes(search.toLowerCase())
  );
  const grouped = groupByDate(filtered.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()));

  return (
    <PageTransition className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">Transações</h1>
        <button
          onClick={() => navigate("/transactions/new")}
          className="hidden md:flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Plus className="h-4 w-4" /> Nova
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar transações..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <SkeletonList count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Filter />}
          title="Nenhuma transação encontrada"
          description="Você ainda não tem transações este mês. Que tal registrar a primeira?"
          actionLabel="Registrar Transação"
          onAction={() => navigate("/transactions/new")}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([dateKey, items]) => (
            <div key={dateKey}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {formatDate(items[0].transactionDate)}
              </p>
              <div className="space-y-1.5">
                {items.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/transactions/${t.id}`)}
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                        t.movementType === "inflow" ? "bg-income text-income-foreground" : "bg-expense text-expense-foreground"
                      )}
                    >
                      {t.movementType === "inflow" ? "↑" : "↓"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">{t.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.category?.name || "Sem categoria"} · {t.box?.name || ""}
                      </p>
                    </div>
                    <p
                      className={cn(
                        "text-sm font-bold tabular-nums",
                        t.movementType === "inflow" ? "text-income-foreground" : "text-expense-foreground"
                      )}
                    >
                      {t.movementType === "inflow" ? "+" : "-"}{formatCurrency(t.value)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
