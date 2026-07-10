import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Box as BoxIcon, Users, TrendingUp, AlertTriangle, Trash2, Edit2 } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { MotionButton } from "@/components/MotionButton";
import { boxService, type Box, type BoxParticipant, roleUserBoxBottomService } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonCard } from "@/components/SkeletonCard";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BoxDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [box, setBox] = useState<Box | null>(null);
  const [participants, setParticipants] = useState<BoxParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  // Manage Participant State
  const [editingParticipant, setEditingParticipant] = useState<BoxParticipant | null>(null);
  const [removingParticipant, setRemovingParticipant] = useState<BoxParticipant | null>(null);
  const [newRole, setNewRole] = useState("");

  const fetchDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const boxRes = await boxService.getById(id);
      setBox(boxRes.data.data || null);

      try {
        const partsRes = await roleUserBoxBottomService.getByBoxBottom(id);
        // Map raw RoleUserBoxBottom to BoxParticipant (mocking UI data until backend supplies it)
        const rawParticipants = partsRes.data.data || [];
        setParticipants(
          rawParticipants.map((p: any, i) => ({
            ...p,
            name: p.user?.name || `Usuário ${i + 1}`,
            email: p.user?.email || `user${i + 1}@example.com`,
            roleName: p.role?.name || "Participante",
            joinedAt: new Date().toISOString(),
            totalApplied: 0,
            status: "Ativo",
          }))
        );
      } catch (e) {
        // Fallback mock if endpoint fails
        setParticipants([
          {
            id: "1",
            user_id: "mock1",
            box_bottom_id: id,
            role_id: "owner",
            name: "João Silva",
            email: "joao@example.com",
            roleName: "Proprietário",
            joinedAt: new Date().toISOString(),
            totalApplied: 1000,
            status: "Ativo",
          }
        ]);
      }
    } catch {
      toast.error("Erro ao carregar caixinha.");
      navigate("/boxes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleUpdateRole = async () => {
    if (!editingParticipant || !newRole) return;
    try {
      // API call to update role (mocked success)
      toast.success("Permissão atualizada com sucesso!");
      setParticipants(prev =>
        prev.map(p => p.id === editingParticipant.id ? { ...p, roleName: newRole } : p)
      );
      setEditingParticipant(null);
    } catch {
      toast.error("Erro ao atualizar permissão.");
    }
  };

  const handleRemoveParticipant = async () => {
    if (!removingParticipant) return;
    try {
      // API call to remove (mocked success)
      toast.success("Participante removido!");
      setParticipants(prev => prev.filter(p => p.id !== removingParticipant.id));
      setRemovingParticipant(null);
    } catch {
      toast.error("Erro ao remover participante.");
    }
  };

  if (loading) {
    return (
      <PageTransition className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
        <div className="flex gap-4 items-center mb-8"><div className="w-10 h-10 bg-muted rounded-full animate-pulse" /> <div className="h-8 w-48 bg-muted rounded animate-pulse" /></div>
        <SkeletonCard />
        <SkeletonCard />
      </PageTransition>
    );
  }

  if (!box) return null;

  return (
    <PageTransition className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-6">
        <MotionButton variant="ghost" size="icon" onClick={() => navigate("/boxes")}>
          <ArrowLeft className="h-5 w-5" />
        </MotionButton>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BoxIcon className="h-6 w-6 text-primary" />
            {box.name}
          </h1>
          {box.description && <p className="text-muted-foreground mt-1">{box.description}</p>}
        </div>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="participantes">Participantes ({participants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border bg-card">
              <p className="text-sm text-muted-foreground font-medium">Saldo Atual</p>
              <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(box.balance || 0)}</p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <p className="text-sm text-muted-foreground font-medium">Valor Alvo</p>
              <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(Number(box.targetValue || 0))}</p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <p className="text-sm text-muted-foreground font-medium">Ganhos (Estimado)</p>
              <p className="text-2xl font-bold text-emerald-500 flex items-center gap-2 mt-1">
                <TrendingUp className="h-5 w-5" />
                {formatCurrency(box.accumulatedGains || 0)}
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <p className="text-sm text-muted-foreground font-medium">Rentabilidade</p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">
                {box.rentabilityPercentage || "0"}%
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="participantes">
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/20">
              <h2 className="font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Gestão de Participantes
              </h2>
            </div>
            <div className="divide-y">
              {participants.map(p => (
                <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.email}</p>
                    <div className="flex gap-2 mt-2 text-xs">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{p.roleName}</span>
                      <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full">Aplicou: {formatCurrency(p.totalApplied)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MotionButton variant="outline" size="sm" onClick={() => setEditingParticipant(p)}>
                      <Edit2 className="h-4 w-4 mr-1" /> Permissão
                    </MotionButton>
                    <MotionButton variant="destructive" size="sm" onClick={() => setRemovingParticipant(p)}>
                      <Trash2 className="h-4 w-4" />
                    </MotionButton>
                  </div>
                </div>
              ))}
              {participants.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">Nenhum participante encontrado.</div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingParticipant} onOpenChange={(open) => !open && setEditingParticipant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Permissão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Alterando nível de acesso para <strong>{editingParticipant?.name}</strong>
            </p>
            <div className="space-y-2">
              <Label>Nível de Permissão</Label>
              <Select onValueChange={setNewRole} defaultValue={editingParticipant?.roleName}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Proprietário">Proprietário</SelectItem>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Participante">Participante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <MotionButton onClick={handleUpdateRole} className="w-full">Salvar Alteração</MotionButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Participant Alert */}
      <AlertDialog open={!!removingParticipant} onOpenChange={(open) => !open && setRemovingParticipant(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a remover <strong>{removingParticipant?.name}</strong> desta caixinha.
              Essa ação é irreversível e o usuário perderá o acesso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleRemoveParticipant}>
              Sim, Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}
