
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"; 
import { DaySchedule } from "./DaySchedule";
import { useWeeklySchedule } from "@/hooks/useWeeklySchedule";
import { Clock, Save } from "lucide-react";

export function WeeklySchedule() {
  const { shifts, isLoading, fetchShifts, handleSave, updateShift } = useWeeklySchedule();

  // Define weekday names for display
  const weekdayNames = [
    { value: "0", label: "Domingo" },
    { value: "1", label: "Segunda" },
    { value: "2", label: "Terça" },
    { value: "3", label: "Quarta" },
    { value: "4", label: "Quinta" },
    { value: "5", label: "Sexta" },
    { value: "6", label: "Sábado" }
  ];

  // Fetch shifts on component mount
  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-medical-primary" />
            <CardTitle className="text-xl font-bold text-gray-800">Horários de Atendimento</CardTitle>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-medical-primary hover:bg-medical-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="1" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-2 bg-muted/50 p-1">
            {weekdayNames.map((day) => (
              <TabsTrigger
                key={day.value}
                value={day.value}
                className="data-[state=active]:bg-medical-primary data-[state=active]:text-white"
              >
                {day.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {weekdayNames.map((day) => {
            const dayNumber = parseInt(day.value);
            const dayShift = shifts.find(s => s.day_of_week === dayNumber) || {
              day_of_week: dayNumber,
              start_time: '09:00',
              end_time: '17:00',
              is_active: false
            };
            
            return (
              <TabsContent key={day.value} value={day.value} className="mt-4 focus-visible:outline-none focus-visible:ring-0">
                <DaySchedule 
                  dayLabel={day.label}
                  dayValue={dayNumber} 
                  shift={dayShift}
                  onUpdate={updateShift}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
