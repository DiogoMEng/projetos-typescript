
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppointmentFormData } from "@/types/appointment";
import { supabase } from "@/integrations/supabase/client";

interface PersonalInfoSectionProps {
  formData: Partial<AppointmentFormData>;
  formErrors: Record<string, string>;
  returnCheck: {
    checking: boolean;
    message?: string;
    eligible?: boolean;
  };
  otherInsurance: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: (data: Partial<AppointmentFormData>) => void;
  setOtherInsurance: (value: boolean) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  formErrors,
  returnCheck,
  otherInsurance,
  handleInputChange,
  setFormData,
  setOtherInsurance
}) => {
  const [serviceTypes, setServiceTypes] = useState<{id: string; nome: string}[]>([]);
  const [insuranceTypes, setInsuranceTypes] = useState<{id: string; nome: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Buscar tipos de serviço
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('nome', { ascending: true });
        
        if (servicesError) {
          console.error("Erro ao carregar tipos de consulta:", servicesError);
        } else {
          setServiceTypes(services || []);
        }
        
        // Buscar tipos de convênios
        const { data: insurances, error: insurancesError } = await supabase
          .from('insurances')
          .select('*')
          .order('nome', { ascending: true });
        
        if (insurancesError) {
          console.error("Erro ao carregar convênios:", insurancesError);
        } else {
          setInsuranceTypes(insurances || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">
          Nome Completo <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Digite seu nome completo"
          value={formData.name || ""}
          onChange={handleInputChange}
          className={cn(formErrors.name && "border-red-500")}
        />
        {formErrors.name && (
          <p className="text-sm text-red-500">{formErrors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="whatsapp">
          WhatsApp <span className="text-red-500">*</span>
        </Label>
        <Input
          id="whatsapp"
          name="whatsapp"
          placeholder="(00) 00000-0000"
          value={formData.whatsapp || ""}
          onChange={handleInputChange}
          className={cn(formErrors.whatsapp && "border-red-500")}
        />
        {formErrors.whatsapp && (
          <p className="text-sm text-red-500">{formErrors.whatsapp}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointmentType">
          Tipo de Consulta <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.appointmentType}
          onValueChange={(value) => {
            setFormData({
              ...formData,
              appointmentType: value as "Consulta Nova" | "Retorno"
            });
          }}
        >
          <SelectTrigger id="appointmentType" className={cn(formErrors.appointmentType && "border-red-500")}>
            <SelectValue placeholder="Selecione o tipo de consulta" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>Carregando...</SelectItem>
            ) : serviceTypes.length > 0 ? (
              serviceTypes.map((service) => (
                <SelectItem key={service.id} value={service.nome}>
                  {service.nome}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="Consulta Nova">Consulta Nova</SelectItem>
                <SelectItem value="Retorno">Retorno</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
        {formErrors.appointmentType && (
          <p className="text-sm text-red-500">{formErrors.appointmentType}</p>
        )}
        
        {formData.appointmentType === "Retorno" && (
          <div className="mt-2">
            {returnCheck.checking ? (
              <p className="text-sm text-gray-500">Verificando elegibilidade para retorno...</p>
            ) : returnCheck.message ? (
              <div className={`flex items-start gap-2 text-sm ${returnCheck.eligible ? "text-green-600" : "text-red-500"}`}>
                {returnCheck.eligible ? (
                  <span className="mt-0.5">✓</span>
                ) : (
                  <AlertCircle size={16} className="mt-0.5" />
                )}
                <span>{returnCheck.message}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="insuranceType">
          Convênio <span className="text-red-500">*</span>
        </Label>
        
        {!otherInsurance ? (
          <Select
            value={formData.insuranceType}
            onValueChange={(value) => {
              if (value === "Outro") {
                setOtherInsurance(true);
                setFormData({
                  ...formData,
                  insuranceType: ""
                });
              } else {
                setFormData({
                  ...formData,
                  insuranceType: value
                });
              }
            }}
          >
            <SelectTrigger id="insuranceType" className={cn(formErrors.insuranceType && "border-red-500")}>
              <SelectValue placeholder="Selecione seu convênio" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>Carregando...</SelectItem>
              ) : insuranceTypes.length > 0 ? (
                <>
                  {insuranceTypes.map((insurance) => (
                    <SelectItem key={insurance.id} value={insurance.nome}>
                      {insurance.nome}
                    </SelectItem>
                  ))}
                  <SelectItem value="Outro">Outro</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="Particular">Particular</SelectItem>
                  <SelectItem value="Amil">Amil</SelectItem>
                  <SelectItem value="Bradesco Saúde">Bradesco Saúde</SelectItem>
                  <SelectItem value="SulAmérica">SulAmérica</SelectItem>
                  <SelectItem value="Unimed">Unimed</SelectItem>
                  <SelectItem value="Porto Seguro">Porto Seguro</SelectItem>
                  <SelectItem value="NotreDame Intermédica">NotreDame Intermédica</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        ) : (
          <div className="space-y-2">
            <Input
              id="insuranceType"
              name="insuranceType"
              placeholder="Digite o nome do convênio"
              value={formData.insuranceType || ""}
              onChange={handleInputChange}
              className={cn(formErrors.insuranceType && "border-red-500")}
            />
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => {
                setOtherInsurance(false);
                setFormData({
                  ...formData,
                  insuranceType: "Particular"
                });
              }}
            >
              Voltar para lista
            </button>
          </div>
        )}
        
        {formErrors.insuranceType && (
          <p className="text-sm text-red-500">{formErrors.insuranceType}</p>
        )}
      </div>
    </div>
  );
};
