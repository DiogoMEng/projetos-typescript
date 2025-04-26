
export interface AdminWebhookPayload {
  name: string;
  whatsapp: string;
  appointmentType: string;
  insuranceType: string;
  date: Date;
  time: string;
}

export async function sendAdminWebhook(payload: AdminWebhookPayload) {
  const webhookData = {
    nome_completo: payload.name,
    whatsapp: payload.whatsapp,
    tipo_de_consulta: payload.appointmentType === "Consulta Nova" ? "Primeira consulta" : "Retorno",
    convenio: payload.insuranceType,
    data_da_consulta: payload.date instanceof Date ? payload.date.toISOString().split('T')[0] : payload.date,
    horario: payload.time
  };

  try {
    // Enviando para o webhook original
    try {
      const response1 = await fetch("https://webhook.inoovaweb.com.br/webhook/c4f502ff-09d6-4367-aa33-8ad60912f172", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(webhookData)
      });
      
      if (!response1.ok) {
        console.warn("Resposta do webhook original não foi OK:", await response1.text());
      }
    } catch (error) {
      console.warn("Erro ao enviar para webhook original:", error);
      // Continue para o próximo webhook mesmo se este falhar
    }

    // Enviando para o novo webhook do admin
    try {
      const response2 = await fetch("https://webhook.inoovaweb.com.br/webhook/novo_agendamento_adm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(webhookData)
      });
      
      if (!response2.ok) {
        console.warn("Resposta do webhook admin não foi OK:", await response2.text());
        return false;
      }
      
      console.log("Webhook admin enviado com sucesso:", webhookData);
      return true;
    } catch (error) {
      console.error("Erro ao enviar para webhook admin:", error);
      return false;
    }
  } catch (error: any) {
    console.error("Erro geral ao enviar para webhooks:", error);
    return false;
  }
}
