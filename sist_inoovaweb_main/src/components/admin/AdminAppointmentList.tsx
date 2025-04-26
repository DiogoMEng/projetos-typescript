import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointment';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppointmentFilters } from '@/hooks/useAppointmentFilters';
import { AppointmentActions } from './AppointmentActions';
import { useToast } from '@/hooks/use-toast';
import { NewAppointmentDialog } from './NewAppointmentDialog';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import { EditAppointmentDialog } from './EditAppointmentDialog';

const AdminAppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [serviceTypes, setServiceTypes] = useState<{ id: string; nome: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    showTodayOnly,
    setShowTodayOnly,
    filteredAppointments
  } = useAppointmentFilters(appointments);

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('data', { ascending: true });
    
    if (error) {
      toast({
        title: "Erro ao carregar agendamentos",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    if (data) {
      setAppointments(data.map(app => {
        const appointmentDate = app.data ? new Date(`${app.data}T12:00:00`) : new Date();
        
        return {
          id: app.id,
          name: app.nome,
          whatsapp: app.whatsapp,
          appointmentType: app.servico as 'Consulta Nova' | 'Retorno',
          insuranceType: app.convenio,
          date: appointmentDate,
          time: app.hora,
          status: app.status as 'confirmado' | 'cancelado' | 'pendente' | 'realizado',
          createdAt: new Date(app.created_at)
        };
      }));
    }
  };

  const fetchServiceTypes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('nome', { ascending: true });
        
      if (error) {
        console.error("Erro ao carregar tipos de consulta:", error);
      } else {
        setServiceTypes(data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchServiceTypes();
  }, []);

  const handleEdit = (appointmentId: string) => {
    const appointmentToEdit = appointments.find(app => app.id === appointmentId);
    if (appointmentToEdit) {
      setCurrentAppointment(appointmentToEdit);
      setIsEditDialogOpen(true);
    } else {
      toast({
        title: "Erro",
        description: "Agendamento não encontrado.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = () => {
    fetchAppointments(); // Refresh the list after deletion
  };

  const handleStatusChange = () => {
    fetchAppointments(); // Refresh the list after status change
  };

  const handleNewAppointmentSuccess = () => {
    fetchAppointments();
    setIsDialogOpen(false);
  };

  const handleEditSuccess = () => {
    fetchAppointments();
    setIsEditDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pendente: 'bg-yellow-500',
      confirmado: 'bg-green-500',
      cancelado: 'bg-red-500',
      realizado: 'bg-purple-500'
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nome do paciente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant={showTodayOnly ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setShowTodayOnly(!showTodayOnly)}
          >
            <CalendarCheck className="w-4 h-4 mr-2" />
            Hoje
          </Button>
          <div className="w-[180px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="realizado">Realizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[180px]">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : serviceTypes.length > 0 ? (
                  serviceTypes.map(service => (
                    <SelectItem key={service.id} value={service.nome}>
                      {service.nome}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="Consulta Nova">Consulta Nova</SelectItem>
                    <SelectItem value="Retorno">Retorno</SelectItem>
                    <SelectItem value="Exames">Exames</SelectItem>
                    <SelectItem value="Procedimento">Procedimento</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <NewAppointmentDialog onSuccess={handleNewAppointmentSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {currentAppointment && (
            <EditAppointmentDialog 
              appointment={currentAppointment}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de agendamentos</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.name}</TableCell>
                <TableCell>{appointment.whatsapp}</TableCell>
                <TableCell>{appointment.appointmentType}</TableCell>
                <TableCell>
                  {format(appointment.date, "dd 'de' MMMM", { locale: ptBR })}
                </TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell className="text-right">
                  <AppointmentActions
                    appointmentId={appointment.id}
                    currentStatus={appointment.status}
                    onEdit={() => handleEdit(appointment.id)}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAppointmentList;
