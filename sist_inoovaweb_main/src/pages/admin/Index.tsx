
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarCheck, FileText, CreditCard, Settings } from "lucide-react";
import AdminAppointmentList from '@/components/admin/AdminAppointmentList';
import { WeeklySchedule } from '@/components/admin/WeeklySchedule';
import { ServiceTypeManager } from '@/components/admin/ServiceTypeManager';
import { InsuranceTypeManager } from '@/components/admin/InsuranceTypeManager';
import { ReturnPeriodManager } from '@/components/admin/ReturnPeriodManager';
import { ReportsManager } from '@/components/admin/ReportsManager';
import { BlockedDatesManager } from '@/components/admin/BlockedDatesManager';
import { AppointmentSettingsManager } from '@/components/admin/AppointmentSettingsManager';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("Agendamentos");
  
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: totalAppointments } = await supabase
        .from('appointments')
        .select('id, servico, convenio', { count: 'exact' });
        
      const { data: todayAppointments } = await supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('data', today);
        
      const { data: completedAppointments } = await supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('status', 'realizado');

      // Count insurance types
      const insuranceTypes = totalAppointments?.reduce((acc: any, curr) => {
        acc[curr.convenio] = (acc[curr.convenio] || 0) + 1;
        return acc;
      }, {});

      // Count appointment types
      const appointmentTypes = totalAppointments?.reduce((acc: any, curr) => {
        acc[curr.servico] = (acc[curr.servico] || 0) + 1;
        return acc;
      }, {});

      // Get the most common insurance and appointment type
      const topInsurance = Object.entries(insuranceTypes || {})
        .sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || 'Nenhum';
      
      const topAppointment = Object.entries(appointmentTypes || {})
        .sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || 'Nenhum';

      return {
        total: totalAppointments?.length || 0,
        today: todayAppointments?.length || 0,
        completed: completedAppointments?.length || 0,
        topAppointment,
        topInsurance,
      };
    },
    refetchInterval: 5000 // Refresh every 5 seconds to keep data up to date
  });

  const renderContent = () => {
    switch (activeTab) {
      case "Agendamentos":
        return <AdminAppointmentList />;
      case "Horários de Atendimento":
        return (
          <div className="space-y-6">
            <WeeklySchedule />
            <AppointmentSettingsManager />
          </div>
        );
      case "Relatórios":
        return <ReportsManager />;
      default:
        return (
          <div className="space-y-6">
            <BlockedDatesManager />
            <ReturnPeriodManager />
            <ServiceTypeManager />
            <InsuranceTypeManager />
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset className="p-0">
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-medical-dark bg-gradient-to-r from-medical-primary to-medical-highlight bg-clip-text text-transparent">
                Painel Administrativo
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Appointments Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
                    <Calendar className="h-4 w-4 opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.total || 0}</div>
                    <p className="text-xs mt-1 opacity-75">Agendamentos ativos</p>
                  </CardContent>
                  <div className="absolute bottom-0 right-0 h-24 w-24 transform translate-x-6 translate-y-6">
                    <Calendar className="h-full w-full opacity-10" />
                  </div>
                </Card>

                {/* Today's Appointments Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
                    <CalendarCheck className="h-4 w-4 opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.today || 0}</div>
                    <p className="text-xs mt-1 opacity-75">Agendamentos do dia</p>
                  </CardContent>
                  <div className="absolute bottom-0 right-0 h-24 w-24 transform translate-x-6 translate-y-6">
                    <CalendarCheck className="h-full w-full opacity-10" />
                  </div>
                </Card>

                {/* Appointment Types Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tipos de Consulta</CardTitle>
                    <FileText className="h-4 w-4 opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold truncate">{stats?.topAppointment || '-'}</div>
                    <p className="text-xs mt-1 opacity-75">Tipo mais comum</p>
                  </CardContent>
                  <div className="absolute bottom-0 right-0 h-24 w-24 transform translate-x-6 translate-y-6">
                    <FileText className="h-full w-full opacity-10" />
                  </div>
                </Card>

                {/* Insurance Types Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-sky-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tipos de Convênio</CardTitle>
                    <CreditCard className="h-4 w-4 opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold truncate">{stats?.topInsurance || '-'}</div>
                    <p className="text-xs mt-1 opacity-75">Convênio mais utilizado</p>
                  </CardContent>
                  <div className="absolute bottom-0 right-0 h-24 w-24 transform translate-x-6 translate-y-6">
                    <CreditCard className="h-full w-full opacity-10" />
                  </div>
                </Card>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                {renderContent()}
              </div>
            </div>
          </div>
          <footer className="bg-medical-highlight text-white py-4 mt-8">
            <div className="container mx-auto px-4">
              <p className="text-center text-sm">
                © {new Date().getFullYear()} InoovaWeb | Sistema de Gerenciamento de Consultas
              </p>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
