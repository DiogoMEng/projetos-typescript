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

export default function BoxesPage() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTargetValue, setNewTargetValue] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchBoxes = () => {
    boxService.getAll()
      .then((r) => setBoxes(r.data.data || []))
      .catch(() => setBoxes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBoxes(); }, []);

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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : boxes.length === 0 ? (
        <EmptyState
          icon={<BoxIcon />}
          title="Nenhum caixa ainda"
          description="Crie seu primeiro caixa para organizar suas finanças."
          actionLabel="Criar Caixa"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {boxes.map((box, i) => (
            <motion.div
              key={box.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BoxIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">{box.name}</p>
                  {box.description && (
                    <p className="text-xs text-muted-foreground truncate">{box.description}</p>
                  )}
                </div>
              </div>
              {box.balance !== undefined && (
                <p className="text-lg font-bold text-foreground mt-2">{formatCurrency(box.balance)}</p>
              )}
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
