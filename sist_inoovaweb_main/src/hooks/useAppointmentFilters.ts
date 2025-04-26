
import { useState, useMemo } from 'react';
import { Appointment } from '@/types/appointment';
import { isToday } from 'date-fns';

export const useAppointmentFilters = (appointments: Appointment[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = appointment.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesType = typeFilter === 'all' || appointment.appointmentType === typeFilter;
      const matchesToday = !showTodayOnly || isToday(appointment.date);
      
      return matchesSearch && matchesStatus && matchesType && matchesToday;
    });
  }, [appointments, searchQuery, statusFilter, typeFilter, showTodayOnly]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    showTodayOnly,
    setShowTodayOnly,
    filteredAppointments
  };
};
