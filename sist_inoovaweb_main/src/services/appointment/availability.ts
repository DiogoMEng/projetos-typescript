
import { supabase } from '@/integrations/supabase/client';
import { format, addMinutes, parse, isWithinInterval, parseISO } from 'date-fns';
import { TimeSlot } from '@/types/appointment';
import { checkBlockedDate } from './validation';
import { getAppointmentInterval } from '@/utils/dateUtils';

export const getAvailableTimeSlots = async (date: Date): Promise<TimeSlot[]> => {
  try {
    // Verificar se a data está bloqueada
    const blockedDateCheck = await checkBlockedDate(date);
    if (blockedDateCheck.isBlocked) {
      console.log(`Date ${format(date, 'yyyy-MM-dd')} is blocked. Reason: ${blockedDateCheck.reason}`);
      return []; // Retornar lista vazia se a data estiver bloqueada
    }

    const dayOfWeek = date.getDay();
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    console.log(`Fetching time slots for date: ${formattedDate}, day of week: ${dayOfWeek}`);
    
    // Buscar o intervalo configurado de minutos
    const intervalMinutes = await getAppointmentInterval();
    console.log(`Using configured appointment interval: ${intervalMinutes} minutes`);
    
    // Buscar as configurações de horários para o dia da semana
    const { data: shiftData } = await supabase
      .from('professional_shifts')
      .select('*')
      .eq('day_of_week', dayOfWeek);
    
    // Verificar se há um turno ativo para este dia da semana  
    const activeShift = shiftData?.find(shift => shift.is_active);
    
    if (!activeShift) {
      console.log(`No active shift found for day of week: ${dayOfWeek}`);
      return [];
    }
    
    console.log(`Active shift found: ${activeShift.start_time} - ${activeShift.end_time}`);
    
    // Buscar agendamentos existentes para o dia
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('data', formattedDate)
      .in('status', ['pendente', 'confirmado']);
    
    console.log(`Found ${existingAppointments?.length || 0} existing appointments for date: ${formattedDate}`);
    
    // Gerar slots de tempo disponíveis com base no turno e no intervalo
    const slots: TimeSlot[] = [];
    
    // Parse das strings de tempo para objetos Date
    const startDate = parse(activeShift.start_time, 'HH:mm', date);
    const endDate = parse(activeShift.end_time, 'HH:mm', date);
    
    let currentSlot = startDate;
    
    while (currentSlot < endDate) {
      const timeSlot = format(currentSlot, 'HH:mm');
      
      // Verificar se este slot está livre (não tem agendamentos)
      const isBooked = existingAppointments?.some(
        appointment => appointment.hora === timeSlot
      );
      
      slots.push({
        time: timeSlot,
        available: !isBooked,
        selected: false
      });
      
      // Avançar para o próximo slot com base no intervalo configurado
      currentSlot = addMinutes(currentSlot, intervalMinutes);
    }
    
    console.log(`Generated ${slots.length} time slots, ${slots.filter(s => s.available).length} available using interval of ${intervalMinutes} minutes`);
    
    return slots;
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return [];
  }
};

export const getAvailableShiftDays = async (): Promise<number[]> => {
  try {
    const { data: shiftData } = await supabase
      .from('professional_shifts')
      .select('day_of_week')
      .eq('is_active', true)
      .order('day_of_week')
      .limit(7);
    
    return shiftData.map(shift => shift.day_of_week);
  } catch (error) {
    console.error('Error fetching available shift days:', error);
    return [];
  }
};
