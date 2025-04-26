
// Atualize a exportação para incluir o novo serviço
import { 
  getAvailableTimeSlots, 
  getAvailableShiftDays 
} from './availability';
import { 
  createAppointment, 
  getAppointmentsByDate, 
  getAppointmentsByName, 
  updateAppointment, 
  deleteAppointment,
  getAllAppointments,
  updateAppointmentStatus 
} from './crud';
import { 
  checkReturnPeriod, 
  checkPendingAppointmentsInMonth, 
  checkReturnEligibility,
  checkBlockedDate 
} from './validation';

export {
  getAvailableTimeSlots,
  getAvailableShiftDays,
  createAppointment,
  getAppointmentsByDate,
  getAppointmentsByName,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  checkReturnPeriod,
  checkPendingAppointmentsInMonth,
  checkReturnEligibility,
  checkBlockedDate,
  updateAppointmentStatus
};
