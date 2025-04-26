import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  createAppointment, 
  checkReturnPeriod, 
  checkPendingAppointmentsInMonth,
  checkBlockedDate 
} from "@/services/appointment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentFormData } from "@/types/appointment";
import { getAvailableTimeSlots } from "@/services/appointment";
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from "lucide-react";
import { sendAdminWebhook } from "@/services/appointment/sendAdminWebhook";

interface NewAppointmentDialogProps {
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  whatsapp: z.string().min(10, { message: "WhatsApp inválido" }),
  appointmentType: z.string().min(1, { message: "Tipo de consulta obrigatório" }),
  insuranceType: z.string().min(1, { message: "Selecione o convênio" }),
  date: z.date({
    required_error: "Selecione uma data",
  }),
  time: z.string().min(1, { message: "Selecione um horário" }),
});

export const NewAppointmentDialog: React.FC<NewAppointmentDialogProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<{id: string; nome: string}[]>([]);
  const [insuranceTypes, setInsuranceTypes] = useState<{id: string; nome: string}[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [returnEligibilityCheck, setReturnEligibilityCheck] = useState<{
    checking: boolean;
    message?: string;
    eligible?: boolean;
  }>({
    checking: false
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointmentType: "",
      insuranceType: "",
    },
  });

  const watchDate = form.watch("date");
  const watchAppointmentType = form.watch("appointmentType");
  const watchWhatsapp = form.watch("whatsapp");
  
  useEffect(() => {
    const checkEligibility = async () => {
      if (
        watchAppointmentType === "Retorno" &&
        watchWhatsapp && 
        watchWhatsapp.replace(/\D/g, '').length >= 10
      ) {
        setReturnEligibilityCheck({ checking: true });
        
        try {
          const result = await checkReturnPeriod(watchWhatsapp, new Date());
          setReturnEligibilityCheck({
            checking: false,
            eligible: result.eligible,
            message: result.message
          });
        } catch (error) {
          console.error("Error checking eligibility:", error);
          setReturnEligibilityCheck({
            checking: false,
            eligible: false,
            message: "Erro ao verificar elegibilidade para retorno."
          });
        }
      } else if (watchAppointmentType !== "Retorno") {
        setReturnEligibilityCheck({ checking: false });
      }
    };
    
    checkEligibility();
  }, [watchAppointmentType, watchWhatsapp]);
  
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      
      try {
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('nome', { ascending: true });
        
        if (servicesError) {
          console.error("Erro ao carregar tipos de consulta:", servicesError);
        } else {
          setServiceTypes(services || []);
          if (services && services.length > 0) {
            form.setValue('appointmentType', services[0].nome);
          }
        }
        
        const { data: insurances, error: insurancesError } = await supabase
          .from('insurances')
          .select('*')
          .order('nome', { ascending: true });
        
        if (insurancesError) {
          console.error("Erro ao carregar convênios:", insurancesError);
        } else {
          setInsuranceTypes(insurances || []);
          if (insurances && insurances.length > 0) {
            form.setValue('insuranceType', insurances[0].nome);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchData();
  }, [form]);
  
  useEffect(() => {
    if (watchDate) {
      loadTimeSlots(watchDate);
    }
  }, [watchDate]);
  
  const loadTimeSlots = async (date: Date) => {
    setIsLoading(true);
    try {
      const slots = await getAvailableTimeSlots(date);
      setAvailableTimeSlots(slots);
    } catch (error) {
      toast({
        title: "Erro ao carregar horários",
        description: "Não foi possível carregar os horários disponíveis",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const blockedDateCheck = await checkBlockedDate(values.date);
      if (blockedDateCheck.isBlocked) {
        toast({
          title: "Data bloqueada",
          description: `Esta data (${format(values.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}) está bloqueada: ${blockedDateCheck.reason || "Feriado ou data indisponível"}`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      if (values.appointmentType === "Retorno") {
        const eligibility = await checkReturnPeriod(values.whatsapp, values.date);
        
        if (!eligibility.eligible) {
          toast({
            title: "Retorno não permitido",
            description: eligibility.message || `Paciente não elegível para retorno. Necessário aguardar mais ${eligibility.waitDays} dias após a última consulta.`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }
      
      const pendingCheck = await checkPendingAppointmentsInMonth(values.whatsapp, values.date);
      
      if (!pendingCheck.canSchedule) {
        toast({
          title: "Agendamento não permitido",
          description: pendingCheck.message || "Já existe uma consulta pendente ou confirmada para este mês.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      const appointmentData: Omit<AppointmentFormData, 'id' | 'createdAt'> & { status: 'confirmado' | 'pendente' | 'cancelado' } = {
        name: values.name,
        whatsapp: values.whatsapp,
        appointmentType: values.appointmentType,
        insuranceType: values.insuranceType,
        date: values.date,
        time: values.time,
        status: 'pendente'
      };
      
      const result = await createAppointment(appointmentData);
      
      try {
        const webhookResult = await sendAdminWebhook({
          name: values.name,
          whatsapp: values.whatsapp,
          appointmentType: values.appointmentType,
          insuranceType: values.insuranceType,
          date: values.date,
          time: values.time
        });
  
        if (webhookResult) {
          toast({
            title: "Webhook disparado",
            description: "Dados enviados para a secretaria.",
          });
        } else {
          toast({
            title: "Aviso",
            description: "Agendamento criado MAS não foi possível notificar o Webhook.",
            variant: "destructive",
          });
        }
      } catch (webhookError) {
        console.error("Erro ao enviar para webhook:", webhookError);
        toast({
          title: "Aviso",
          description: "Agendamento criado MAS não foi possível notificar o Webhook.",
          variant: "destructive",
        });
      }

      if (result.success) {
        toast({
          title: "Agendamento criado",
          description: "Novo agendamento criado com sucesso",
        });
        form.reset();
        onSuccess();
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar agendamento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isDayDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="p-4 pt-0">
      <h2 className="text-2xl font-semibold mb-6">Novo Agendamento</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Paciente</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="appointmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Consulta</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dataLoading ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : serviceTypes.length > 0 ? (
                        serviceTypes.map((service) => (
                          <SelectItem key={service.id} value={service.nome}>
                            {service.nome}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="Consulta Nova">Consulta Nova</SelectItem>
                          <SelectItem value="Retorno">Retorno</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  
                  {watchAppointmentType === "Retorno" && returnEligibilityCheck.message && (
                    <div className={`flex items-center gap-2 text-sm mt-2 ${!returnEligibilityCheck.eligible ? 'text-red-500' : 'text-green-500'}`}>
                      <AlertCircle size={16} />
                      <span>{returnEligibilityCheck.message}</span>
                    </div>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="insuranceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convênio</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o convênio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dataLoading ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : insuranceTypes.length > 0 ? (
                        insuranceTypes.map((insurance) => (
                          <SelectItem key={insurance.id} value={insurance.nome}>
                            {insurance.nome}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="Particular">Particular</SelectItem>
                          <SelectItem value="Unimed">Unimed</SelectItem>
                          <SelectItem value="Amil">Amil</SelectItem>
                          <SelectItem value="SulAmérica">SulAmérica</SelectItem>
                          <SelectItem value="Bradesco Saúde">Bradesco Saúde</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Consulta</FormLabel>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={isDayDisabled}
                  locale={ptBR}
                  className="border rounded-md p-3 mx-auto"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableTimeSlots.map((slot) => (
                    <Button
                      type="button"
                      key={slot.time}
                      variant={field.value === slot.time ? "default" : "outline"}
                      onClick={() => field.onChange(slot.time)}
                      disabled={!slot.available || isLoading}
                      className={`
                        ${!slot.available ? "opacity-50" : ""}
                        ${field.value === slot.time ? "bg-medical-primary" : ""}
                      `}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
                <FormDescription>
                  {watchDate ? (
                    availableTimeSlots.length === 0 ? (
                      isLoading ? "Carregando horários..." : "Nenhum horário disponível"
                    ) : ""
                  ) : (
                    "Selecione uma data para ver os horários disponíveis"
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || (watchAppointmentType === "Retorno" && returnEligibilityCheck.eligible === false)}
            >
              {isLoading ? "Salvando..." : "Salvar Agendamento"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
