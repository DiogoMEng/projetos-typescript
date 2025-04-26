
import { useState, useEffect } from "react";
import { TimeSlot } from "@/types/appointment";
import { getAvailableTimeSlots } from "@/services/appointment";

export const useTimeSlots = (selectedDate: Date | undefined, setFormData?: (data: any) => void) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadTimeSlots = async (date: Date) => {
    setIsLoading(true);
    try {
      console.log(`Loading time slots for date: ${date.toISOString().split('T')[0]}`);
      const slots = await getAvailableTimeSlots(date);
      setTimeSlots(slots);
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeSelect = (selectedTime: string) => {
    // Update the time slots state to mark the selected time
    setTimeSlots(timeSlots.map(slot => ({
      ...slot,
      selected: slot.time === selectedTime
    })));
    
    // Also update the form data if setFormData is provided
    if (setFormData) {
      console.log("Updating form data with selected time:", selectedTime);
      setFormData((prevData: any) => ({
        ...prevData,
        time: selectedTime
      }));
    }
  };

  return {
    timeSlots,
    isLoading,
    handleTimeSelect
  };
};
