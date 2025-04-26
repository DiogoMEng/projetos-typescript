
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, X, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BlockedDate {
  id: string;
  data: string;
  motivo: string;
}

export const BlockedDatesManager = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [reason, setReason] = useState('');
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch blocked dates when component mounts
  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const fetchBlockedDates = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching blocked dates...");
      
      // Ensure we have a fresh authentication session
      const { error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError) {
        console.error("Session refresh error:", sessionError);
        // Continue anyway, might still work for public data
      }
      
      const { data, error } = await supabase
        .from('dias_bloqueados')
        .select('*')
        .order('data');

      if (error) {
        console.error("Error fetching blocked dates:", error);
        toast({
          title: "Erro ao carregar dias bloqueados",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setBlockedDates(data || []);
      console.log("Blocked dates loaded:", data);
    } catch (err) {
      console.error("Exception fetching blocked dates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockDate = async () => {
    if (!selectedDate || !reason) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data e forneça um motivo",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Check if the date is already blocked
      const existingDate = blockedDates.find(date => date.data === formattedDate);
      if (existingDate) {
        toast({
          title: "Data já bloqueada",
          description: `${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} já está bloqueada`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      console.log("Blocking date:", formattedDate, "with reason:", reason);
      
      // Ensure we have a fresh authentication session
      const { error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError) {
        console.error("Session refresh error:", sessionError);
        toast({
          title: "Erro de autenticação",
          description: "Verifique se você está logado",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      const { error, data } = await supabase
        .from('dias_bloqueados')
        .insert([
          {
            data: formattedDate,
            motivo: reason
          }
        ])
        .select();

      if (error) {
        console.error("Error blocking date:", error);
        toast({
          title: "Erro ao bloquear data",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log("Date blocked successfully:", data);

      toast({
        title: "Data bloqueada com sucesso",
        description: `${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} foi bloqueado`
      });

      setSelectedDate(undefined);
      setReason('');
      fetchBlockedDates();
    } catch (err) {
      console.error("Exception blocking date:", err);
      toast({
        title: "Erro ao bloquear data",
        description: "Ocorreu um erro ao bloquear a data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockDate = async (id: string) => {
    setIsDeleting(id);
    try {
      console.log("Unblocking date with ID:", id);
      
      // Ensure we have a fresh authentication session
      const { error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError) {
        console.error("Session refresh error:", sessionError);
        toast({
          title: "Erro de autenticação",
          description: "Verifique se você está logado",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('dias_bloqueados')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error unblocking date:", error);
        toast({
          title: "Erro ao desbloquear data",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log("Date unblocked successfully");

      toast({
        title: "Data desbloqueada com sucesso"
      });

      // Update local state to reflect deletion
      setBlockedDates(current => current.filter(date => date.id !== id));
    } catch (err) {
      console.error("Exception unblocking date:", err);
      toast({
        title: "Erro ao desbloquear data",
        description: "Ocorreu um erro ao desbloquear a data",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Bloqueio de Datas</h3>
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1 space-y-2">
          <Label>Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                locale={ptBR}
                className="rounded-md border pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1 space-y-2">
          <Label>Motivo</Label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: Feriado nacional"
          />
        </div>
        <Button 
          onClick={handleBlockDate} 
          disabled={isLoading || !selectedDate || !reason}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : "Bloquear Data"}
        </Button>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Datas Bloqueadas</h4>
        <div className="rounded-md border divide-y">
          {isLoading && <p className="p-4 text-center">Carregando...</p>}
          
          {!isLoading && blockedDates.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground text-center">Nenhuma data bloqueada</p>
          )}
          
          {!isLoading && blockedDates.map((blockedDate) => (
            <div key={blockedDate.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">
                  {format(parseISO(blockedDate.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">{blockedDate.motivo}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleUnblockDate(blockedDate.id)}
                disabled={isDeleting === blockedDate.id}
              >
                {isDeleting === blockedDate.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
