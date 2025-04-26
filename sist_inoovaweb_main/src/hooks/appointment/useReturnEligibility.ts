
import { useState, useEffect } from "react";
import { checkReturnEligibility } from "@/services/appointment";

export const useReturnEligibility = (appointmentType: string | undefined, name: string | undefined) => {
  const [returnCheck, setReturnCheck] = useState<{
    checking: boolean;
    message?: string;
    eligible?: boolean;
  }>({
    checking: false
  });

  useEffect(() => {
    const validateReturnEligibility = async () => {
      if (
        appointmentType === "Retorno" && 
        name && 
        name.trim().length >= 3
      ) {
        setReturnCheck({ checking: true });
        
        try {
          const result = await checkReturnEligibility(name);
          
          setReturnCheck({
            checking: false,
            eligible: result.eligible,
            message: result.message
          });
        } catch (error) {
          console.error("Error checking eligibility:", error);
          setReturnCheck({
            checking: false,
            eligible: false,
            message: "Erro ao verificar elegibilidade para retorno."
          });
        }
      } else if (appointmentType === "Consulta Nova") {
        setReturnCheck({ checking: false });
      }
    };
    
    validateReturnEligibility();
  }, [appointmentType, name]);

  return returnCheck;
};
