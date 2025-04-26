
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeSlot } from "@/types/appointment";
import { formatDate } from "@/utils/dateUtils";

interface DateTimeSectionProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  timeSlots: TimeSlot[];
  isLoading: boolean;
  formErrors: Record<string, string>;
  handleTimeSelect: (time: string) => void;
  isDayDisabled: (date: Date) => boolean;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  selectedDate,
  setSelectedDate,
  timeSlots,
  isLoading,
  formErrors,
  handleTimeSelect,
  isDayDisabled
}) => {
  // Find selected time slot for visual feedback
  const selectedTimeSlot = timeSlots.find(slot => slot.selected);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="date">
          Data da Consulta <span className="text-red-500">*</span>
        </Label>
        <div className={cn(formErrors.date && "border-red-500 rounded-md")}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                  formErrors.date && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDayDisabled}
                initialFocus
                locale={ptBR}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        {formErrors.date && (
          <p className="text-sm text-red-500">{formErrors.date}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          * Consultas disponíveis nos dias configurados
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>
          Horário <span className="text-red-500">*</span>
          {selectedTimeSlot && (
            <span className="ml-2 text-green-600 text-sm">
              (Selecionado: {selectedTimeSlot.time})
            </span>
          )}
        </Label>
        <div className={cn("border rounded-md p-3", formErrors.time && "border-red-500")}>
          {isLoading ? (
            <div className="text-center p-4">
              <p className="text-sm text-gray-500">Carregando horários disponíveis...</p>
            </div>
          ) : timeSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={cn(
                    "time-slot",
                    slot.available 
                      ? slot.selected 
                        ? "time-slot-selected bg-green-100 border-green-500" 
                        : "time-slot-available" 
                      : "time-slot-unavailable"
                  )}
                  onClick={() => {
                    if (slot.available) {
                      handleTimeSelect(slot.time);
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    {slot.selected ? <CheckCircle size={14} className="text-green-600" /> : <Clock size={14} />}
                    <span>{slot.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <div className="text-center p-4">
              <p className="text-sm text-gray-500">Nenhum horário disponível na data selecionada.</p>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-sm text-gray-500">Selecione uma data para ver os horários disponíveis.</p>
            </div>
          )}
        </div>
        {formErrors.time && (
          <p className="text-sm text-red-500">{formErrors.time}</p>
        )}
      </div>
    </div>
  );
};
