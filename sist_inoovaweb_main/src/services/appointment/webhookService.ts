
export const sendToWebhook = async (appointmentData: any) => {
  try {
    const webhookData = {
      nome_completo: appointmentData.name,
      whatsapp: appointmentData.whatsapp,
      tipo_de_consulta: appointmentData.appointmentType === "Consulta Nova" ? "Primeira consulta" : "Retorno",
      convenio: appointmentData.insuranceType,
      data_da_consulta: appointmentData.date.toISOString().split('T')[0],
      horario: appointmentData.time
    };

    console.log("Enviando dados para webhook:", webhookData);

    const response = await fetch('https://webhook.inoovaweb.com.br/webhook/SISTEMA_AGENDAMENTO', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });
    
    if (!response.ok) {
      console.error("Erro ao enviar para webhook:", await response.text());
      return false;
    }
    
    console.log("Webhook enviado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao enviar para webhook:", error);
    return false;
  }
};
