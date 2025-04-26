import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Appointment } from '@/types/appointment';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  whatsapp: z.string().min(10, { message: "WhatsApp inválido" }),
  appointmentType: z.string().min(1, { message: "Tipo de consulta obrigatório" }),
  insuranceType: z.string().min(1, { message: "Selecione o convênio" }),
  time: z.string().min(1, { message: "Selecione um horário" }),
  status: z.enum(["confirmado", "pendente", "cancelado", "realizado"]),
});

interface EditAppointmentDialogProps {
  appointment: Appointment;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EditAppointmentDialog: React.FC<EditAppointmentDialogProps> = ({ 
  appointment, 
  onSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [serviceTypes, setServiceTypes] = useState<{id: string; nome: string}[]>([]);
  const [insuranceTypes, setInsuranceTypes] = useState<{id: string; nome: string}[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [lembrete, setLembrete] = useState<string>(appointment.lembrete || '');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: appointment.name,
      whatsapp: appointment.whatsapp,
      appointmentType: appointment.appointmentType,
      insuranceType: appointment.insuranceType,
      time: appointment.time,
      status: appointment.status
    },
  });

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
        }
        
        const { data: insurances, error: insurancesError } = await supabase
          .from('insurances')
          .select('*')
          .order('nome', { ascending: true });
        
        if (insurancesError) {
          console.error("Erro ao carregar convênios:", insurancesError);
        } else {
          setInsuranceTypes(insurances || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    const time = form.watch('time');
    if (time && time !== appointment.time) {
      console.log("Time changed, lembrete will be updated by database trigger");
    }
  }, [form.watch('time')]);
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const updatedAppointment = {
        nome: data.name,
        whatsapp: data.whatsapp,
        servico: data.appointmentType,
        convenio: data.insuranceType,
        hora: data.time,
        status: data.status
      };

      const { error } = await supabase
        .from('appointments')
        .update(updatedAppointment)
        .eq('id', appointment.id);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Agendamento atualizado",
        description: "As informações foram atualizadas com sucesso."
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar Agendamento</DialogTitle>
        <DialogDescription>
          Edite as informações do agendamento para {appointment.name} em {format(appointment.date, 'dd/MM/yyyy')}
          {appointment.lembrete && (
            <div className="mt-2">
              <span className="font-semibold">Lembrete agendado para:</span> {appointment.lembrete}
            </div>
          )}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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

          <div className="grid grid-cols-2 gap-4">
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
                          <SelectItem value="Ipasgo">Ipasgo</SelectItem>
                          <SelectItem value="Amil">Amil</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="realizado">Realizado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
