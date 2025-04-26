
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createAppointment, checkReturnPeriod, checkPendingAppointmentsInMonth, checkBlockedDate } from "@/services/appointment";
import { AppointmentFormData } from "@/types/appointment";
import { sendToWebhook } from "@/services/appointment/webhookService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WarningState {
  open: boolean;
  title: string;
  message: string;
  variant: "warning" | "error";
}

export const useAppointmentSubmit = (
  formData: Partial<AppointmentFormData>,
  selectedDate: Date | undefined,
  setFormData: (data: Partial<AppointmentFormData>) => void,
  setSelectedDate: (date: Date | undefined) => void,
  setOtherInsurance: (value: boolean) => void,
  setFormErrors: (errors: Record<string, string>) => void,
  onSuccess?: () => void
) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [warning, setWarning] = useState<WarningState>({
    open: false,
    title: "",
    message: "",
    variant: "warning"
  });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = "Nome completo é obrigatório";
    }
    
    if (!formData.whatsapp || formData.whatsapp.replace(/\D/g, '').length < 10) {
      errors.whatsapp = "WhatsApp inválido";
    }
    
    if (!formData.appointmentType) {
      errors.appointmentType = "Selecione o tipo de consulta";
    }
    
    if (!formData.insuranceType) {
      errors.insuranceType = "Selecione o convênio";
    }
    
    if (!selectedDate) {
      errors.date = "Selecione uma data";
    }
    
    if (!formData.time) {
      errors.time = "Selecione um horário";
    }
    
    console.log("Form validation errors:", errors);
    console.log("Form data being validated:", { ...formData, selectedDate });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (!selectedDate || !formData.name || !formData.whatsapp || 
          !formData.appointmentType || !formData.insuranceType || !formData.time) {
        throw new Error("Campos obrigatórios não preenchidos");
      }
      
      // Verificar se a data está bloqueada
      const blockedDateCheck = await checkBlockedDate(selectedDate);
      if (blockedDateCheck.isBlocked) {
        setWarning({
          open: true,
          title: "Data bloqueada",
          message: `Esta data (${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}) está bloqueada: ${blockedDateCheck.reason || "Feriado ou data indisponível"}`,
          variant: "error"
        });
        setSubmitting(false);
        return;
      }
      
      if (formData.appointmentType === "Retorno") {
        const eligibility = await checkReturnPeriod(formData.name, selectedDate);
        
        if (!eligibility.eligible) {
          setWarning({
            open: true,
            title: "Retorno não permitido",
            message: eligibility.message || `Paciente não elegível para retorno. Necessário aguardar mais ${eligibility.waitDays} dias após a última consulta.`,
            variant: "error"
          });
          setSubmitting(false);
          return;
        }
      }
      
      const pendingCheck = await checkPendingAppointmentsInMonth(formData.name, selectedDate);
      
      if (!pendingCheck.canSchedule) {
        setWarning({
          open: true,
          title: "Agendamento não permitido",
          message: pendingCheck.message || "Já existe uma consulta pendente ou confirmada para este mês.",
          variant: "error"
        });
        setSubmitting(false);
        return;
      }
      
      const appointmentData = {
        name: formData.name,
        whatsapp: formData.whatsapp,
        appointmentType: formData.appointmentType,
        insuranceType: formData.insuranceType,
        date: selectedDate,
        time: formData.time,
        status: 'pendente' as const
      };
      
      const result = await createAppointment(appointmentData);
      
      if (result.success) {
        const webhookResult = await sendToWebhook(appointmentData);
        console.log("Webhook result:", webhookResult);
        
        if (onSuccess) {
          onSuccess();
        }
        
        setFormData({
          appointmentType: "Consulta Nova",
          insuranceType: "Particular"
        });
        setSelectedDate(undefined);
        setOtherInsurance(false);
      } else {
        setWarning({
          open: true,
          title: "Erro",
          message: result.message || "Ocorreu um erro ao processar seu agendamento.",
          variant: "error"
        });
      }
    } catch (error: any) {
      console.error("Erro ao criar agendamento:", error);
      setWarning({
        open: true,
        title: "Erro",
        message: "Ocorreu um erro ao processar seu agendamento.",
        variant: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    handleSubmit,
    warning,
    closeWarning: () => setWarning(prev => ({ ...prev, open: false }))
  };
};
