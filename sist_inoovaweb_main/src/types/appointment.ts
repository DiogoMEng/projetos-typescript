
export interface Appointment {
  id: string;
  name: string;
  whatsapp: string;
  appointmentType: string;  // Made flexible to accommodate any service type
  insuranceType: string;
  date: Date;
  time: string;
  status: 'confirmado' | 'cancelado' | 'pendente' | 'realizado';
  createdAt: Date;
  lembrete?: string; // Optional reminder date/time in format DD/MM/YYYY HH:mm
}

export type AppointmentFormData = Omit<Appointment, 'id' | 'createdAt'> & {
  status?: 'confirmado' | 'cancelado' | 'pendente' | 'realizado';
};

export interface TimeSlot {
  time: string;
  available: boolean;
  selected?: boolean;
}

export type DayAvailability = {
  [key: number]: { // 1 = Monday, 3 = Wednesday, 5 = Friday
    start: string;
    end: string;
  }
}

// Extend the appointment type with database field names to help with mapping
export interface DatabaseAppointment {
  id: string;
  nome: string;           // name
  whatsapp: string;
  servico: string;        // appointmentType
  convenio: string;       // insuranceType
  data: string;           // date
  hora: string;           // time
  status: 'confirmado' | 'cancelado' | 'pendente' | 'realizado';
  created_at: string;     // createdAt
  lembrete?: string;      // reminder date/time
}
