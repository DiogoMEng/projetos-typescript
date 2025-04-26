
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAvailableDays = () => {
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [lastRefresh, setLastRefresh] = useState<number>(0);

  const refreshAvailableDays = useCallback(async (timestamp: number = Date.now()) => {
    try {
      console.log(`DIRECT DB QUERY: Refreshing available days with timestamp ${timestamp}`);
      
      await supabase.auth.refreshSession();
      
      const { data: shifts, error } = await supabase
        .from('professional_shifts')
        .select('day_of_week')
        .eq('is_active', true)
        .order('day_of_week');
        
      if (error) {
        console.error("Error fetching available days:", error);
        return false;
      }
      
      const uniqueDays = new Set<number>();
      shifts?.forEach(shift => {
        uniqueDays.add(shift.day_of_week);
      });
      
      const availableDayValues = Array.from(uniqueDays);
      setAvailableDays(availableDayValues);
      
      console.log("Available days updated:", availableDayValues);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar dias disponíveis:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    console.log("Form mounted - forcing refresh of available days");
    const timestamp = Date.now();
    refreshAvailableDays(timestamp);
    setLastRefresh(timestamp);
    
    const interval = setInterval(() => {
      const newTimestamp = Date.now();
      console.log("Auto-refreshing available days every 30 seconds");
      refreshAvailableDays(newTimestamp);
      setLastRefresh(newTimestamp);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refreshAvailableDays]);

  return {
    availableDays,
    lastRefresh,
    refreshAvailableDays
  };
};
