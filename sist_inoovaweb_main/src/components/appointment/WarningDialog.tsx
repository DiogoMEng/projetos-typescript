
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WarningDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: "warning" | "error";
}

export const WarningDialog = ({
  open,
  onClose,
  title,
  message,
  variant = "warning"
}: WarningDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle
              className={variant === "warning" ? "text-orange-500" : "text-red-500"}
              size={24}
            />
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <DialogDescription className="py-4 text-base">
          {message}
        </DialogDescription>
        
        <DialogFooter>
          <Button 
            onClick={onClose}
            className={
              variant === "warning" 
                ? "bg-orange-500 hover:bg-orange-600" 
                : "bg-red-500 hover:bg-red-600"
            }
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
