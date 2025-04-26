
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const WEBHOOK_URL = "https://webhook.inoovaweb.com.br/webhook/7b5a01ae-0026-4527-b7b0-c4f47d3ce5e2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Lidar com solicitações de preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Webhook chamado");
    const appointment = await req.json();
    
    // Formatar os dados conforme especificação
    const formattedData = {
      nome: appointment.name,
      whatsapp: appointment.whatsapp,
      tipo_consulta: appointment.appointmentType === "Consulta Nova" ? "Consulta Inicial" : "Retorno",
      tipo_convenio: appointment.insuranceType,
      observacoes: appointment.observacoes || "",
      data: typeof appointment.date === 'string' ? appointment.date : appointment.date.split('T')[0], // Formato YYYY-MM-DD
      horario: appointment.time
    };
    
    console.log("Dados formatados para envio:", JSON.stringify(formattedData));

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData)
    });

    const responseText = await response.text();
    console.log("Resposta do webhook:", response.status, responseText);

    if (!response.ok) {
      throw new Error(`Webhook falhou com status ${response.status}: ${responseText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao enviar webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
