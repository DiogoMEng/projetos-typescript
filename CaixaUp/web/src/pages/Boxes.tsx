import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Box as BoxIcon } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { MotionButton } from "@/components/MotionButton";
import { boxService, type Box } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function BoxesPage() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTargetValue, setNewTargetValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Search and Sort State
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("recentes");
  const navigate = useNavigate();

  const fetchBoxes = () => {
    boxService.getAll()
      .then((r) => setBoxes(r.data.data || []))
      .catch(() => setBoxes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBoxes(); }, []);

  // Filter and Sort Logic (useMemo for performance)
  const filteredAndSortedBoxes = React.useMemo(() => {
    let result = [...boxes];

    // Search by name or description
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOrder) {
        case "alfabetica":
          return a.name.localeCompare(b.name);
        case "maior_ganho":
          return (b.accumulatedGains || 0) - (a.accumulatedGains || 0);
        case "menor_ganho":
          return (a.accumulatedGains || 0) - (b.accumulatedGains || 0);
        case "recentes":
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    return result;
  }, [boxes, search, sortOrder]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await boxService.create({
        name: newName,
        description: newDesc,
        targetValue: newTargetValue || "0",
      });
      toast.success("Caixa criado!");
      setDialogOpen(false);
      setNewName("");
      setNewDesc("");
      setNewTargetValue("");
      fetchBoxes();
    } catch {
      toast.error("Erro ao criar caixa.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Caixas</h1>
        <MotionButton size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Novo Caixa
        </MotionButton>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar caixinhas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recentes">Mais recentes</SelectItem>
            <SelectItem value="alfabetica">Ordem Alfabética</SelectItem>
            <SelectItem value="maior_ganho">Maior Ganho</SelectItem>
            <SelectItem value="menor_ganho">Menor Ganho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredAndSortedBoxes.length === 0 ? (
        <EmptyState
          icon={<BoxIcon />}
          title={search ? "Nenhuma caixinha encontrada" : "Nenhum caixa ainda"}
          description={search ? "Tente alterar os termos da busca." : "Crie seu primeiro caixa para organizar suas finanças."}
          actionLabel={search ? "Limpar Busca" : "Criar Caixa"}
          onAction={() => search ? setSearch("") : setDialogOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredAndSortedBoxes.map((box, i) => (
            <motion.div
              key={box.id}
              onClick={() => navigate(`/boxes/${box.id}`)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BoxIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">{box.name}</p>
                  {box.description && (
                    <p className="text-xs text-muted-foreground truncate">{box.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-end justify-between mt-2">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Saldo Atual</p>
                  {box.balance !== undefined && (
                    <p className="text-lg font-bold text-foreground">{formatCurrency(box.balance)}</p>
                  )}
                </div>

                {/* Visual gains indicator */}
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Ganhos</p>
                  <p className={`text-sm font-bold flex items-center gap-1 ${(box.accumulatedGains || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {(box.accumulatedGains || 0) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {formatCurrency(box.accumulatedGains || 0)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Caixa</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-sm font-medium text-foreground">Nome</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Conta Principal" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Descrição</Label>
              <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Ex: Meu banco principal" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Valor Meta (R$)</Label>
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={newTargetValue}
                onChange={(e) => setNewTargetValue(e.target.value)}
                placeholder="Ex: 3500.00"
                className="mt-1"
              />
            </div>
            <MotionButton onClick={handleCreate} className="w-full" disabled={saving}>
              {saving ? "Salvando..." : "Criar Caixa"}
            </MotionButton>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
