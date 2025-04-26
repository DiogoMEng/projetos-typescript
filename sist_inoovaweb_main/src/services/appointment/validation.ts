
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, differenceInDays, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export const checkReturnPeriod = async (name: string, appointmentDate: Date): Promise<{
  eligible: boolean;
  waitDays?: number;
  lastAppointment?: Date;
  message?: string;
}> => {
  try {
    // Get configured return period from settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('clinic_settings')
      .select('value')
      .eq('key', 'return_period_days')
      .single();
    
    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error("Error fetching return period:", settingsError);
      return { eligible: true }; // Default to eligible if error
    }

    // Default to 30 days if not configured
    const returnPeriodDays = settingsData?.value ? 
                    (typeof settingsData.value === 'number' ? settingsData.value : 
                    (typeof settingsData.value === 'object' ? (settingsData.value as any).days || 30 : 30)) : 30;
                    
    console.log(`[RETURN CHECK] Configured return period days: ${returnPeriodDays}`);

    // Get patient's last appointment that was COMPLETED ("realizado") using full name
    const { data: lastAppt, error: apptError } = await supabase
      .from('appointments')
      .select('data, status')
      .eq('nome', name.trim())
      .eq('status', 'realizado')
      .order('data', { ascending: false })
      .limit(1);
    
    if (apptError) {
      console.error("Error checking last appointment:", apptError);
      return { eligible: true }; // Default to eligible if error
    }

    // If no previous completed appointment, patient is eligible for return
    if (!lastAppt || lastAppt.length === 0) {
      console.log("[RETURN CHECK] No previous completed appointment found for patient:", name);
      return { eligible: true };
    }

    const lastAppointmentDate = parseISO(lastAppt[0].data);
    const daysSinceLastAppt = differenceInDays(appointmentDate, lastAppointmentDate);
    
    console.log(`[RETURN CHECK] Last completed appointment for ${name}: ${format(lastAppointmentDate, 'yyyy-MM-dd')}`);
    console.log(`[RETURN CHECK] Days since last appointment: ${daysSinceLastAppt}`);
    console.log(`[RETURN CHECK] Required wait period: ${returnPeriodDays} days`);

    if (daysSinceLastAppt < returnPeriodDays) {
      console.log(`[RETURN CHECK] Patient not eligible, needs to wait ${returnPeriodDays - daysSinceLastAppt} more days`);
      return { 
        eligible: false, 
        waitDays: returnPeriodDays - daysSinceLastAppt,
        lastAppointment: lastAppointmentDate,
        message: `Retorno não permitido. Última consulta foi no ${format(lastAppointmentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}. O retorno é de ${returnPeriodDays} dias da ultima consulta realizada. Aguarde mais ${returnPeriodDays - daysSinceLastAppt} dias para agendar seu retorno.`
      };
    }

    console.log(`[RETURN CHECK] Patient eligible for return, ${daysSinceLastAppt} days have passed since last appointment`);
    return { 
      eligible: true,
      lastAppointment: lastAppointmentDate
    };
    
  } catch (error) {
    console.error("[RETURN CHECK] Error in checkReturnPeriod:", error);
    return { eligible: true }; // Default to eligible in case of errors
  }
};

export const checkPendingAppointmentsInMonth = async (name: string, appointmentDate: Date): Promise<{
  canSchedule: boolean;
  message?: string;
}> => {
  try {
    const startMonth = startOfMonth(appointmentDate);
    const endMonth = endOfMonth(appointmentDate);
    
    const startMonthStr = format(startMonth, 'yyyy-MM-dd');
    const endMonthStr = format(endMonth, 'yyyy-MM-dd');
    
    console.log(`[PENDING CHECK] Checking pending appointments for patient ${name} between ${startMonthStr} and ${endMonthStr}`);
    
    // Check for any pending or confirmed appointments in the same month using full name
    const { data: pendingAppointments, error } = await supabase
      .from('appointments')
      .select('id, data')
      .eq('nome', name.trim())
      .in('status', ['pendente', 'confirmado'])
      .gte('data', startMonthStr)
      .lte('data', endMonthStr);
      
    if (error) {
      console.error("[PENDING CHECK] Error checking pending appointments:", error);
      return { canSchedule: true };
    }
    
    console.log(`[PENDING CHECK] Found ${pendingAppointments?.length || 0} pending appointments in this month for ${name}`);
    
    if (pendingAppointments && pendingAppointments.length > 0) {
      const formattedDate = format(parseISO(pendingAppointments[0].data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      return {
        canSchedule: false,
        message: `Já existe uma consulta pendente/confirmada para ${formattedDate}. Não é possível agendar mais de uma consulta no mesmo mês.`
      };
    }
    
    return { canSchedule: true };
  } catch (error) {
    console.error("[PENDING CHECK] Error in checkPendingAppointmentsInMonth:", error);
    return { canSchedule: true };
  }
};

export const checkReturnEligibility = async (name: string): Promise<{
  eligible: boolean;
  message?: string;
}> => {
  try {
    if (!name || name.trim().length < 3) {
      return {
        eligible: false,
        message: "Nome do paciente é necessário para verificar elegibilidade para retorno."
      };
    }

    const today = new Date();
    
    const { eligible, waitDays, lastAppointment, message } = await checkReturnPeriod(name, today);
    
    if (!eligible && message) {
      return { 
        eligible: false, 
        message
      };
    }
    
    // Now also check if there are pending appointments in the current month
    const { canSchedule, message: pendingMessage } = await checkPendingAppointmentsInMonth(name, today);
    
    if (!canSchedule) {
      return {
        eligible: false,
        message: pendingMessage
      };
    }

    if (eligible) {
      return { 
        eligible: true, 
        message: "Paciente elegível para retorno."
      };
    } else {
      const formattedDate = lastAppointment ? 
        format(lastAppointment, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 
        "data desconhecida";
      
      return { 
        eligible: false, 
        message: `Paciente não elegível. Última consulta em ${formattedDate}. Aguarde mais ${waitDays} dias.`
      };
    }
  } catch (error) {
    console.error("Erro ao verificar elegibilidade para retorno:", error);
    return { 
      eligible: false,
      message: "Erro ao verificar elegibilidade para retorno."
    };
  }
};

export const checkBlockedDate = async (date: Date): Promise<{
  isBlocked: boolean;
  reason?: string;
}> => {
  try {
    console.log(`[BLOCKED CHECK] Checking if date ${format(date, 'yyyy-MM-dd')} is blocked`);
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Force a fresh authentication session
    try {
      await supabase.auth.refreshSession();
    } catch (error) {
      console.error("[BLOCKED CHECK] Error refreshing session:", error);
      // Continue anyway as this might be public data
    }
    
    const { data, error } = await supabase
      .from('dias_bloqueados')
      .select('*')
      .eq('data', formattedDate)
      .maybeSingle();
    
    if (error) {
      console.error("[BLOCKED CHECK] Error checking blocked date:", error);
      return { isBlocked: false };
    }
    
    if (data) {
      console.log(`[BLOCKED CHECK] Date ${formattedDate} is blocked. Reason: ${data.motivo}`);
      return { 
        isBlocked: true,
        reason: data.motivo
      };
    }
    
    console.log(`[BLOCKED CHECK] Date ${formattedDate} is not blocked`);
    return { isBlocked: false };
  } catch (error) {
    console.error("[BLOCKED CHECK] Error in checkBlockedDate:", error);
    return { isBlocked: false };
  }
};
