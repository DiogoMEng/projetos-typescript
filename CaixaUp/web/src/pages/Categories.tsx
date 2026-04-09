import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Tag } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { MotionButton } from "@/components/MotionButton";
import { categoryService, type Category } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const PRESET_COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    categoryService.getAll()
      .then((r) => setCategories(r.data.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await categoryService.create({ name: newName, color: newColor });
      toast.success("Categoria criada!");
      setDialogOpen(false);
      setNewName("");
      fetchCategories();
    } catch {
      toast.error("Erro ao criar categoria.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Categorias</h1>
        <MotionButton size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nova
        </MotionButton>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Tag />}
          title="Nenhuma categoria"
          description="Categorias ajudam a organizar suas transações. Crie a primeira!"
          actionLabel="Criar Categoria"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border bg-card p-4 text-center hover:shadow-md transition-shadow"
            >
              <div
                className="h-10 w-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ background: cat.color + "20" }}
              >
                <Tag className="h-5 w-5" style={{ color: cat.color }} />
              </div>
              <p className="text-sm font-medium text-foreground truncate">{cat.name}</p>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-sm font-medium text-foreground">Nome</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Alimentação" className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Cor</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    className={`h-8 w-8 rounded-full transition-transform ${newColor === c ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <MotionButton onClick={handleCreate} className="w-full" disabled={saving}>
              {saving ? "Salvando..." : "Criar Categoria"}
            </MotionButton>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
