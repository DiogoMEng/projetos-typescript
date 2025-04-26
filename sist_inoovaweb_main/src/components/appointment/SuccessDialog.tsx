
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SuccessDialog = ({ open, onClose }: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-2 py-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <DialogTitle className="text-xl font-semibold text-center mt-4">
              ✅ Agendamento realizado com sucesso!
            </DialogTitle>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
