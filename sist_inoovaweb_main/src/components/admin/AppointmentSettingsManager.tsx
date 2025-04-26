
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Define an interface for our settings structure
interface AppointmentSettings {
  interval_minutes: number;
  split_shift: boolean;
}

export function AppointmentSettingsManager() {
  const [intervalMinutes, setIntervalMinutes] = useState<number>(30);
  const [splitShift, setSplitShift] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  // Parse JSON value safely
  const parseSettingsValue = (value: Json): AppointmentSettings => {
    const defaultSettings: AppointmentSettings = {
      interval_minutes: 30,
      split_shift: false
    };
    
    if (!value) return defaultSettings;
    
    try {
      if (typeof value === 'string') {
        // If it's a string, try to parse it as JSON
        const parsed = JSON.parse(value);
        return {
          interval_minutes: parsed?.interval_minutes ?? defaultSettings.interval_minutes,
          split_shift: parsed?.split_shift ?? defaultSettings.split_shift
        };
      } else if (typeof value === 'object' && value !== null) {
        // If it's already an object, use it directly
        return {
          interval_minutes: (value as any).interval_minutes ?? defaultSettings.interval_minutes,
          split_shift: (value as any).split_shift ?? defaultSettings.split_shift
        };
      }
    } catch (error) {
      console.error('Error parsing settings:', error);
    }
    
    return defaultSettings;
  };

  const loadSettings = async () => {
    try {
      // Forçar uma nova sessão para evitar cache
      await supabase.auth.refreshSession();
      
      const { data: settings, error } = await supabase
        .from('clinic_settings')
        .select('*')
        .eq('key', 'appointment_settings')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      if (settings) {
        const parsedSettings = parseSettingsValue(settings.value);
        console.log('Loaded settings:', parsedSettings);
        setIntervalMinutes(parsedSettings.interval_minutes);
        setSplitShift(parsedSettings.split_shift);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving settings:', { interval_minutes: intervalMinutes, split_shift: splitShift });
      
      // Verificar se o registro já existe
      const { data: existingSettings, error: checkError } = await supabase
        .from('clinic_settings')
        .select('id')
        .eq('key', 'appointment_settings')
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking settings:', checkError);
        throw checkError;
      }

      // Preparar os dados para upsert
      const settingsData = {
        key: 'appointment_settings',
        value: {
          interval_minutes: intervalMinutes,
          split_shift: splitShift
        }
      };
      
      // Se o registro existir, atualize-o incluindo o ID
      if (existingSettings?.id) {
        settingsData['id'] = existingSettings.id;
      }
      
      // Agora fazemos o upsert com o ID se existir
      const { error } = await supabase
        .from('clinic_settings')
        .upsert(settingsData);

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "As configurações de agendamento foram atualizadas com sucesso.",
      });
      
      // Recarregar as configurações após salvar para confirmar
      await loadSettings();
      
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-medical-primary" />
            <CardTitle className="text-xl font-bold text-gray-800">
              Configurações de Agendamento
            </CardTitle>
          </div>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-medical-primary hover:bg-medical-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="interval">Intervalo entre consultas (minutos)</Label>
          <Input
            id="interval"
            type="number"
            min={5}
            max={120}
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(Number(e.target.value))}
            className="w-full max-w-[200px]"
          />
          <p className="text-sm text-gray-500">
            Define o intervalo de tempo entre uma consulta e outra
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="split-shift"
            checked={splitShift}
            onCheckedChange={setSplitShift}
          />
          <Label htmlFor="split-shift">Habilitar turnos separados (manhã/tarde)</Label>
        </div>
      </CardContent>
    </Card>
  );
}
