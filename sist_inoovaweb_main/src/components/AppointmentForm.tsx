
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfoSection } from "./appointment/PersonalInfoSection";
import { DateTimeSection } from "./appointment/DateTimeSection";
import { FormActions } from "./appointment/FormActions";
import { FormHeader } from "./appointment/FormHeader";
import { WarningDialog } from "./appointment/WarningDialog";
import { SuccessDialog } from "./appointment/SuccessDialog";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import { useAppointmentSubmit } from "@/hooks/useAppointmentSubmit";
import { Toaster } from "@/components/ui/toaster";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const AppointmentForm: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  
  const {
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
    handleInputChange,
    handleTimeSelect,
    refreshAvailableDays,
  } = useAppointmentForm();

  const { submitting, handleSubmit, warning, closeWarning } = useAppointmentSubmit(
    formData,
    selectedDate,
    setFormData,
    setSelectedDate,
    setOtherInsurance,
    setFormErrors,
    () => setShowSuccess(true)
  );

  useEffect(() => {
    const initializeForm = async () => {
      console.log("INIT: Initializing appointment form and forcing database refresh");
      await refreshAvailableDays(Date.now());
      await fetchBlockedDates();
    };
    
    initializeForm();
    
    const refreshInterval = setInterval(() => {
      refreshAvailableDays(Date.now());
    }, 15000);
    
    return () => clearInterval(refreshInterval);
  }, [refreshAvailableDays]);
  
  const fetchBlockedDates = async () => {
    try {
      const { data, error } = await supabase
        .from('dias_bloqueados')
        .select('data');
        
      if (error) {
        console.error("Error fetching blocked dates:", error);
        return;
      }
      
      if (data) {
        setBlockedDates(data.map(d => d.data));
        console.log("Blocked dates loaded for calendar:", data.map(d => d.data));
      }
    } catch (err) {
      console.error("Exception fetching blocked dates:", err);
    }
  };

  const isDayDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return true;
    
    const dayOfWeek = date.getDay();
    const isAvailable = availableDays.includes(dayOfWeek);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const isBlocked = blockedDates.includes(formattedDate);
    
    console.log(`Calendar check for day ${dayOfWeek} (${['Dom','Seg','Ter','Qua','Qui','Sex','Sab'][dayOfWeek]}): Available=${isAvailable}, Blocked=${isBlocked}`);
    
    return !isAvailable || isBlocked;
  };

  const handleClearForm = () => {
    setFormData({
      appointmentType: "Consulta Nova",
      insuranceType: "Particular"
    });
    setSelectedDate(undefined);
    setOtherInsurance(false);
    setFormErrors({});
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <FormHeader />
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Preencha seus dados para agendarmos sua consulta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <PersonalInfoSection
              formData={formData}
              formErrors={formErrors}
              returnCheck={returnCheck}
              otherInsurance={otherInsurance}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
              setOtherInsurance={setOtherInsurance}
            />
            
            <DateTimeSection
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              timeSlots={timeSlots}
              isLoading={isLoading}
              formErrors={formErrors}
              handleTimeSelect={handleTimeSelect}
              isDayDisabled={isDayDisabled}
            />
          </CardContent>
          
          <CardFooter>
            <FormActions 
              onClear={handleClearForm}
              submitting={submitting}
              isReturnDisabled={returnCheck.eligible === false}
              appointmentType={formData.appointmentType || ""}
            />
          </CardFooter>
        </form>
      </Card>
      <WarningDialog
        open={warning.open}
        onClose={closeWarning}
        title={warning.title}
        message={warning.message}
        variant={warning.variant}
      />
      <SuccessDialog 
        open={showSuccess} 
        onClose={() => {
          setShowSuccess(false);
          handleClearForm();
        }} 
      />
      <Toaster />
    </div>
  );
};

export default AppointmentForm;
