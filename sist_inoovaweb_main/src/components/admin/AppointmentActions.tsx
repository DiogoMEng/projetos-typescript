
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Check } from "lucide-react";
import { deleteAppointment, updateAppointmentStatus } from "@/services/appointment";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppointmentActionsProps {
  appointmentId: string;
  currentStatus: string;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: () => void;
}

export const AppointmentActions = ({ 
  appointmentId, 
  currentStatus, 
  onEdit, 
  onDelete,
  onStatusChange
}: AppointmentActionsProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteAppointment(appointmentId);
      
      if (result.success) {
        toast({
          title: "Agendamento excluído",
          description: "O agendamento foi excluído com sucesso",
        });
        onDelete();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: 'confirmado' | 'pendente' | 'cancelado' | 'realizado') => {
    try {
      const result = await updateAppointmentStatus(appointmentId, newStatus);
      
      if (result.success) {
        toast({
          title: "Status atualizado",
          description: `O status foi alterado para ${newStatus}`,
        });
        onStatusChange();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Check className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => handleStatusChange('confirmado')} 
            disabled={currentStatus === 'confirmado'}
            className={currentStatus === 'confirmado' ? "bg-green-50" : ""}
          >
            Confirmado
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleStatusChange('pendente')} 
            disabled={currentStatus === 'pendente'}
            className={currentStatus === 'pendente' ? "bg-yellow-50" : ""}
          >
            Pendente
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleStatusChange('realizado')} 
            disabled={currentStatus === 'realizado'}
            className={currentStatus === 'realizado' ? "bg-purple-50" : ""}
          >
            Realizado
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleStatusChange('cancelado')} 
            disabled={currentStatus === 'cancelado'}
            className={currentStatus === 'cancelado' ? "bg-red-50" : ""}
          >
            Cancelado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
