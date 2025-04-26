
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface Shift {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export const useWeeklySchedule = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Use a valid UUID for the professional ID instead of a string '1'
  const professionalId = "a09afb6d-9118-459c-bcfb-1cd9f48cce42"; // Fixed UUID

  const fetchShifts = async () => {
    setIsLoading(true);
    try {
      // Force a fresh fetch from the server by refreshing the session first
      try {
        await supabase.auth.refreshSession();
      } catch (error) {
        console.log("Session refresh failed, continuing with fetch:", error);
      }
      
      const { data, error } = await supabase
        .from('professional_shifts')
        .select('*')
        .eq('professional_id', professionalId);

      if (error) {
        console.error("Error fetching shifts:", error);
        toast({
          title: "Erro ao carregar horários",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log("Shifts data fetched in useWeeklySchedule:", data);
      
      if (!data || data.length === 0) {
        console.log("No shifts found, creating default");
        const defaultShifts = Array.from({ length: 7 }, (_, index) => ({
          day_of_week: index,
          start_time: '09:00',
          end_time: '17:00',
          is_active: false
        }));
        setShifts(defaultShifts);
      } else {
        // Remove any duplicate days to prevent conflicts
        const uniqueShifts: Shift[] = [];
        const processedDays = new Set<number>();
        
        data.forEach(shift => {
          if (!processedDays.has(shift.day_of_week)) {
            uniqueShifts.push(shift);
            processedDays.add(shift.day_of_week);
          }
        });
        
        setShifts(uniqueShifts);
      }
    } catch (err: any) {
      console.error("Exception fetching shifts:", err);
      toast({
        title: "Erro ao carregar horários",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndCreateProfessional = async () => {
    try {
      // Check if professional exists
      const { data, error } = await supabase
        .from('professionals')
        .select('id')
        .eq('id', professionalId);
      
      if (error) throw error;
      
      // If professional doesn't exist, create it
      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('professionals')
          .insert({
            id: professionalId,
            name: 'Doctor',
            active: true,
          });
          
        if (insertError) throw insertError;
        
        toast({
          title: "Médico criado",
          description: "Um registro de médico foi criado com sucesso",
        });
      }
      
      return true;
    } catch (error: any) {
      console.error("Error checking/creating professional:", error);
      toast({
        title: "Erro ao verificar médico",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // First check and create professional if needed
      const professionalExists = await checkAndCreateProfessional();
      if (!professionalExists) {
        throw new Error("Não foi possível criar o registro do médico");
      }
      
      // Log the shifts being saved
      console.log("Saving shifts:", shifts);
      
      // First delete any existing shifts to avoid duplication
      const { error: deleteError } = await supabase
        .from('professional_shifts')
        .delete()
        .eq('professional_id', professionalId);
        
      if (deleteError) {
        console.error("Error deleting old shifts:", deleteError);
        throw deleteError;
      }
      
      console.log("Deleted old shifts, inserting new ones");
      
      // Then insert the new shifts
      const { data, error } = await supabase
        .from('professional_shifts')
        .insert(
          shifts.map(shift => ({
            professional_id: professionalId,
            ...shift
          }))
        )
        .select();

      if (error) {
        console.error("Error saving shifts:", error);
        throw error;
      }

      console.log("Saved shifts successfully:", data);

      toast({
        title: "Horários salvos",
        description: "Os horários foram atualizados com sucesso. As mudanças serão refletidas no agendamento.",
      });
      
    } catch (error: any) {
      console.error("Exception saving shifts:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateShift = (dayOfWeek: number, field: keyof Shift, value: any) => {
    console.log(`Updating shift day ${dayOfWeek}, field ${field} to ${value}`);
    setShifts(currentShifts =>
      currentShifts.map(shift =>
        shift.day_of_week === dayOfWeek
          ? { ...shift, [field]: value }
          : shift
      )
    );
  };

  return {
    shifts,
    isLoading,
    fetchShifts,
    handleSave,
    updateShift
  };
};
