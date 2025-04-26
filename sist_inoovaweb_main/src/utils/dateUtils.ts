import { format, addMinutes, parse, isAfter, isBefore, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayAvailability, TimeSlot } from "../types/appointment";
import { supabase } from "@/integrations/supabase/client";

// Função para buscar dias disponíveis do banco de dados diretamente sem cache
export const getAvailableDays = async (): Promise<DayAvailability> => {
  console.log("BYPASS CACHE: Fetching available days from database using timestamp");
  
  // Forçar uma nova sessão para evitar cache
  await supabase.auth.refreshSession();
  
  // Adicionar timestamp para forçar nova requisição
  const timestamp = new Date().getTime();
  
  // Consulta direta ignorando cache
  const { data: shifts, error } = await supabase
    .from('professional_shifts')
    .select('day_of_week, start_time, end_time')
    .eq('is_active', true);

  if (error) {
    console.error("Error fetching shifts:", error);
    return {};
  }

  console.log("FRESH DATA from database timestamp:", timestamp, "Shifts:", shifts);

  // Criar mapa de dias disponíveis
  const daysMap: DayAvailability = {};
  
  // Usar Set para evitar duplicatas
  const processedDays = new Set<number>();
  
  if (shifts && shifts.length > 0) {
    shifts.forEach(shift => {
      // Só adicionar se este dia ainda não foi processado
      if (!processedDays.has(shift.day_of_week)) {
        daysMap[shift.day_of_week] = {
          start: shift.start_time,
          end: shift.end_time
        };
        processedDays.add(shift.day_of_week);
        console.log(`ADDED DAY ${shift.day_of_week} (${['Dom','Seg','Ter','Qua','Qui','Sex','Sab'][shift.day_of_week]}) to available days`);
      }
    });
  } else {
    console.log("NO SHIFTS FOUND in database! Calendar will show all days as unavailable");
  }
  
  console.log("Final processed available days (no duplicates):", Object.keys(daysMap));
  
  return daysMap;
};

// Verificar se o dia é disponível diretamente no banco
export const isDayAvailable = async (date: Date): Promise<boolean> => {
  try {
    // Forçar nova sessão
    await supabase.auth.refreshSession();
    
    const timestamp = new Date().getTime();
    const dayOfWeek = date.getDay();
    
    // Consulta direta ao banco para o dia específico
    const { data: shifts, error } = await supabase
      .from('professional_shifts')
      .select('day_of_week')
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .limit(1);
      
    if (error) {
      console.error("Error checking day availability:", error);
      return false;
    }
    
    const isAvailable = Boolean(shifts && shifts.length > 0);
    console.log(`DIRECT CHECK: Day ${dayOfWeek} (${['Dom','Seg','Ter','Qua','Qui','Sex','Sab'][dayOfWeek]}) available:`, isAvailable);
    
    return isAvailable;
  } catch (error) {
    console.error("Error in isDayAvailable:", error);
    return false;
  }
};

// Formatar data para exibição
export const formatDate = (date: Date): string => {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

// Função para obter o intervalo entre consultas da tabela de configurações
export const getAppointmentInterval = async (): Promise<number> => {
  try {
    // Force a fresh authentication session
    await supabase.auth.refreshSession();
    
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('value')
      .eq('key', 'appointment_settings')
      .single();
      
    if (error) {
      console.error("Error getting appointment interval:", error);
      return 30; // Valor padrão caso ocorra erro
    }
    
    // Extract interval value from data
    if (!data || !data.value) return 30;
    
    const intervalValue = typeof data.value === 'object' && data.value !== null ? 
                         (data.value as any).interval_minutes || 30 : 30;
                         
    console.log("Retrieved appointment interval:", intervalValue);
    return intervalValue;
  } catch (error) {
    console.error("Error fetching appointment interval:", error);
    return 30; // Valor padrão caso ocorra erro
  }
};

// Gerar horários disponíveis para um dia específico
export const generateTimeSlots = async (date: Date): Promise<TimeSlot[]> => {
  try {
    // Forçar nova sessão
    await supabase.auth.refreshSession();
    
    const dayOfWeek = date.getDay();
    
    // Consulta direta ao banco para o dia específico
    const { data: shift, error } = await supabase
      .from('professional_shifts')
      .select('start_time, end_time')
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .single();
      
    if (error || !shift) {
      console.error("Error getting shift details:", error);
      return [];
    }
    
    console.log(`Generating slots for day ${dayOfWeek} with shift:`, shift);
    
    const { start_time, end_time } = shift;
    
    // Criar data base para o dia selecionado
    const baseDate = new Date(date.setHours(0, 0, 0, 0));
    const startTime = parse(start_time, "HH:mm", baseDate);
    const endTime = parse(end_time, "HH:mm", baseDate);
    
    const slots: TimeSlot[] = [];
    let currentTime = startTime;
    
    // Obter intervalo da tabela de configurações
    const intervalMinutes = await getAppointmentInterval();
    console.log(`Using appointment interval of ${intervalMinutes} minutes`);
    
    // Gerar horários com intervalo configurado
    while (isBefore(currentTime, endTime)) {
      slots.push({
        time: format(currentTime, "HH:mm"),
        available: true
      });
      currentTime = addMinutes(currentTime, intervalMinutes);
    }
    
    return slots;
  } catch (error) {
    console.error("Error generating time slots:", error);
    return [];
  }
};

// Verificar se já passaram 15 dias desde a data passada
export const hasPassedMinimumDays = (lastAppointmentDate: Date, minDays: number = 15): boolean => {
  const today = new Date();
  return differenceInDays(today, lastAppointmentDate) >= minDays;
};

// Filtrar horários já agendados
export const filterUnavailableSlots = (
  slots: TimeSlot[], 
  bookedAppointments: { time: string }[]
): TimeSlot[] => {
  if (!bookedAppointments || bookedAppointments.length === 0) {
    return slots;
  }
  
  return slots.map(slot => {
    const isBooked = bookedAppointments.some(app => app.time === slot.time);
    return {
      ...slot,
      available: !isBooked
    };
  });
};

// Formatar número de telefone
export const formatPhoneNumber = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numericValue = value.replace(/\D/g, '');
  
  // Aplica a formatação
  if (numericValue.length <= 2) {
    return numericValue;
  } else if (numericValue.length <= 7) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
  } else if (numericValue.length <= 11) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
  } else {
    // Limita a 11 dígitos (formato brasileiro)
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
  }
};
