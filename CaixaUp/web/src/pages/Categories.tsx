import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Tag, Search, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { MotionButton } from "@/components/MotionButton";
import { categoryService, type Category } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog State (Create / Edit)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"receita" | "despesa">("despesa");
  const [saving, setSaving] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Delete State
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = () => {
    // A busca também está preparada no `categoryService.getAll({ search })` 
    // mas o filtro local é mantido para fornecer resposta instantânea na UI.
    categoryService.getAll()
      .then((r) => setCategories(r.data.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  // Filter categories locally
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const openCreateDialog = () => {
    setCategoryToEdit(null);
    setNewName("");
    setNewType("despesa");
    setDialogOpen(true);
  };

  const openEditDialog = (cat: Category) => {
    setCategoryToEdit(cat);
    setNewName(cat.name);
    setNewType(cat.type);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      if (categoryToEdit) {
        await categoryService.update(categoryToEdit.id, { name: newName, type: newType });
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await categoryService.create({ name: newName, type: newType });
        toast.success("Categoria criada com sucesso!");
      }
      setDialogOpen(false);
      fetchCategories();
    } catch {
      toast.error(categoryToEdit ? "Erro ao atualizar categoria." : "Erro ao criar categoria.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await categoryService.delete(categoryToDelete.id);
      toast.success("Categoria excluída com sucesso!");
      setCategoryToDelete(null);
      fetchCategories();
    } catch {
      toast.error("Erro ao excluir categoria.");
    } finally {
      setIsDeleting(false);
    }
  };

  const typeColor = (cat: Category) => {
    if (cat.color) return cat.color;
    return cat.type === "receita" ? "#22c55e" : "#ef4444";
  };

  return (
    <PageTransition className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
        <MotionButton onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" /> Nova Categoria
        </MotionButton>
      </div>

      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar categoria..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-card border-border/50 focus-visible:ring-primary/20"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          icon={<Tag />}
          title={searchQuery ? "Nenhuma categoria encontrada" : "Nenhuma categoria"}
          description={searchQuery ? "Tente buscar por outro termo." : "Categorias ajudam a organizar suas transações. Crie a primeira!"}
          actionLabel={searchQuery ? "Limpar Busca" : "Criar Categoria"}
          onAction={searchQuery ? () => setSearchQuery("") : openCreateDialog}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group relative rounded-xl border border-border/50 bg-card p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => openEditDialog(cat)} className="cursor-pointer">
                      <Edit2 className="h-4 w-4 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setCategoryToDelete(cat)} 
                      className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className="h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: typeColor(cat) + "15" }}
              >
                <Tag className="h-6 w-6" style={{ color: typeColor(cat) }} />
              </div>
              <p className="text-sm font-semibold text-foreground truncate">{cat.name}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize font-medium">{cat.type}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{categoryToEdit ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nome da Categoria</Label>
              <Input 
                id="name"
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Ex: Alimentação, Salário..." 
                className="bg-accent/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de Movimentação</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as "receita" | "despesa")}>
                <SelectTrigger className="bg-accent/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="despesa">Despesa (Saída)</SelectItem>
                  <SelectItem value="receita">Receita (Entrada)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <MotionButton onClick={handleSave} className="w-full mt-2" disabled={saving || !newName.trim()}>
              {saving ? "Salvando..." : "Salvar Categoria"}
            </MotionButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              A categoria <strong>{categoryToDelete?.name}</strong> será excluída permanentemente. 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Sim, Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </PageTransition>
  );
}
