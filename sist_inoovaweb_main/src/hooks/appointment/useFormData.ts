
import { useState } from "react";
import { AppointmentFormData } from "@/types/appointment";
import { formatPhoneNumber } from "@/utils/dateUtils";

export const useFormData = () => {
  const [formData, setFormData] = useState<Partial<AppointmentFormData>>({
    appointmentType: "Consulta Nova",
    insuranceType: "Particular"
  });
  const [otherInsurance, setOtherInsurance] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "whatsapp") {
      setFormData({
        ...formData,
        [name]: formatPhoneNumber(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };

  return {
    formData,
    setFormData,
    otherInsurance,
    setOtherInsurance,
    formErrors,
    setFormErrors,
    handleInputChange
  };
};
