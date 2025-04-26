
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface DayScheduleProps {
  dayLabel: string;
  dayValue: number;
  shift: {
    start_time: string;
    end_time: string;
    is_active: boolean;
  };
  onUpdate: (dayOfWeek: number, field: string, value: any) => void;
}

export const DaySchedule = ({ dayLabel, dayValue, shift, onUpdate }: DayScheduleProps) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border ${shift.is_active ? 'bg-medical-highlight/5 border-medical-highlight/20' : 'bg-white border-gray-200'} rounded-lg shadow-sm transition-all duration-200`}>
      <div className="flex items-center gap-3">
        <Checkbox
          id={`day-${dayValue}`}
          checked={shift.is_active}
          onCheckedChange={(checked) =>
            onUpdate(dayValue, 'is_active', checked)
          }
          className={shift.is_active ? "border-medical-primary text-medical-primary" : ""}
        />
        <Label 
          htmlFor={`day-${dayValue}`} 
          className={`font-medium w-24 ${shift.is_active ? 'text-gray-900' : 'text-gray-500'}`}
        >
          {dayLabel}
        </Label>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pl-8 md:pl-0">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Clock className="h-4 w-4 text-gray-500" />
          <Label className={`text-sm ${shift.is_active ? 'text-gray-700' : 'text-gray-400'}`}>Início:</Label>
          <Input
            type="time"
            value={shift.start_time}
            onChange={(e) =>
              onUpdate(dayValue, 'start_time', e.target.value)
            }
            disabled={!shift.is_active}
            className={`w-32 ${!shift.is_active ? 'opacity-50' : 'border-gray-200 focus:border-medical-primary'}`}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Clock className="h-4 w-4 text-gray-500" />
          <Label className={`text-sm ${shift.is_active ? 'text-gray-700' : 'text-gray-400'}`}>Fim:</Label>
          <Input
            type="time"
            value={shift.end_time}
            onChange={(e) =>
              onUpdate(dayValue, 'end_time', e.target.value)
            }
            disabled={!shift.is_active}
            className={`w-32 ${!shift.is_active ? 'opacity-50' : 'border-gray-200 focus:border-medical-primary'}`}
          />
        </div>
      </div>
    </div>
  );
};
