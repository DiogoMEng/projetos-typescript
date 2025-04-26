import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { AppointmentFormData } from "@/types/appointment";

export const createAppointment = async (data: Partial<AppointmentFormData>) => {
  try {
    if (!data.date || !data.name || !data.whatsapp || !data.appointmentType || !data.insuranceType || !data.time) {
      throw new Error("Dados incompletos para criar agendamento");
    }
    
    const formattedDate = format(data.date, 'yyyy-MM-dd');
    
    const { error, data: appointment } = await supabase
      .from('appointments')
      .insert([
        {
          nome: data.name,
          whatsapp: data.whatsapp,
          servico: data.appointmentType,
          convenio: data.insuranceType,
          data: formattedDate,
          hora: data.time,
          status: data.status || 'pendente'
          // Note: lembrete field will be auto-populated by Supabase trigger
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    return { 
      success: true, 
      data: appointment 
    };
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return { 
      success: false, 
      message: error.message || 'Erro ao criar agendamento'
    };
  }
};

export const deleteAppointment = async (appointmentId: string) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    return { 
      success: false, 
      message: error.message || 'Erro ao excluir agendamento'
    };
  }
};

export const updateAppointment = async (appointmentId: string, data: Partial<Omit<AppointmentFormData, 'date'>> & { data?: string }) => {
  try {
    const dbData: any = {};
    
    if (data.name) dbData.nome = data.name;
    if (data.whatsapp) dbData.whatsapp = data.whatsapp;
    if (data.appointmentType) dbData.servico = data.appointmentType;
    if (data.insuranceType) dbData.convenio = data.insuranceType;
    if (data.time) dbData.hora = data.time;
    if (data.status) dbData.status = data.status;
    if (data.data) dbData.data = data.data;
    
    const { error } = await supabase
      .from('appointments')
      .update(dbData)
      .eq('id', appointmentId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return { 
      success: false, 
      message: error.message || 'Erro ao atualizar agendamento'
    };
  }
};

export const updateAppointmentStatus = async (
  appointmentId: string, 
  status: 'confirmado' | 'cancelado' | 'pendente' | 'realizado'
) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating appointment status:', error);
    return { 
      success: false, 
      message: error.message || 'Erro ao atualizar status'
    };
  }
};

export const getAppointmentsByDate = async (date: string) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('data', date)
      .order('hora');
      
    if (error) throw error;
    
    return { 
      success: true, 
      data: data || [] 
    };
  } catch (error: any) {
    console.error('Error getting appointments by date:', error);
    return { 
      success: false, 
      data: [],
      message: error.message || 'Erro ao buscar agendamentos'
    };
  }
};

export const getAppointmentsByName = async (name: string) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .ilike('nome', `%${name}%`)
      .order('data', { ascending: false });
      
    if (error) throw error;
    
    return { 
      success: true, 
      data: data || [] 
    };
  } catch (error: any) {
    console.error('Error getting appointments by name:', error);
    return { 
      success: false, 
      data: [],
      message: error.message || 'Erro ao buscar agendamentos'
    };
  }
};

export const getAllAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('data', { ascending: false });
      
    if (error) throw error;
    
    return { 
      success: true, 
      data: data || [] 
    };
  } catch (error: any) {
    console.error('Error getting all appointments:', error);
    return { 
      success: false, 
      data: [],
      message: error.message || 'Erro ao buscar agendamentos'
    };
  }
};
