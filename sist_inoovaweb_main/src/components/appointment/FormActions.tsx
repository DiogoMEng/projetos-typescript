
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface FormActionsProps {
  onClear: () => void;
  submitting: boolean;
  isReturnDisabled: boolean;
  appointmentType: string;
}

export const FormActions = ({
  onClear,
  submitting,
  isReturnDisabled,
  appointmentType
}: FormActionsProps) => {
  return (
    <div className="w-full space-y-2">
      {isReturnDisabled && appointmentType === 'Retorno' && (
        <div className="flex items-center gap-2 text-red-500 text-sm mb-2">
          <AlertCircle size={16} />
          <span>Agendamento de retorno não permitido</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-4 justify-end w-full">
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          disabled={submitting}
        >
          Limpar
        </Button>
        
        <Button
          type="submit"
          disabled={submitting || (isReturnDisabled && appointmentType === 'Retorno')}
        >
          {submitting ? "Enviando..." : "Agendar Consulta"}
        </Button>
      </div>
    </div>
  );
};
