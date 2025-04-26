import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings2 } from "lucide-react";

export function ReturnPeriodManager() {
  const [days, setDays] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [settingId, setSettingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReturnPeriod();
  }, []);

  const fetchReturnPeriod = async () => {
    try {
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('*')
        .eq('key', 'return_period_days')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettingId(data.id);
        
        const valueObj = data.value as { days: number } | number;
        const periodDays = typeof valueObj === 'object' ? valueObj.days : valueObj;
        setDays(parseInt(periodDays.toString()));
      }
    } catch (error) {
      console.error('Error fetching return period:', error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        key: 'return_period_days',
        value: days
      };
      
      if (settingId) {
        Object.assign(payload, { id: settingId });
      }

      const { error } = await supabase
        .from('clinic_settings')
        .upsert(payload);

      if (error) throw error;

      toast({
        title: "Configuração salva",
        description: "O período de bloqueio foi atualizado com sucesso.",
      });
    } catch (error: any) {
      console.error('Error updating return period:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Settings2 className="h-5 w-5 text-medical-primary" />
          <CardTitle>Período de Retorno</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">
              Dias de bloqueio após a última consulta
            </label>
            <Input
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 30)}
              placeholder="Número de dias"
            />
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          O paciente só poderá marcar retorno após este período da última consulta.
        </p>
      </CardContent>
    </Card>
  );
}
