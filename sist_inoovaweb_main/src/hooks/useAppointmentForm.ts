
import { useState, useCallback } from "react";
import { useFormData } from "./appointment/useFormData";
import { useReturnEligibility } from "./appointment/useReturnEligibility";
import { useTimeSlots } from "./appointment/useTimeSlots";
import { useAvailableDays } from "./appointment/useAvailableDays";

export const useAppointmentForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const {
    formData,
    setFormData,
    otherInsurance,
    setOtherInsurance,
    formErrors,
    setFormErrors,
    handleInputChange
  } = useFormData();
  
  const returnCheck = useReturnEligibility(formData.appointmentType, formData.whatsapp);
  
  const {
    timeSlots,
    isLoading,
    handleTimeSelect
  } = useTimeSlots(selectedDate, setFormData); // Pass setFormData here
  
  const {
    availableDays,
    lastRefresh,
    refreshAvailableDays
  } = useAvailableDays();
  
  const forceRefresh = () => {
    window.location.reload();
  };

  return {
    formData,
    setFormData,
    selectedDate,
    setSelectedDate,
    timeSlots,
    isLoading,
    returnCheck,
    otherInsurance,
    setOtherInsurance,
    formErrors,
    setFormErrors,
    availableDays,
    lastRefresh,
    handleInputChange,
    handleTimeSelect,
    refreshAvailableDays,
    forceRefresh
  };
};
