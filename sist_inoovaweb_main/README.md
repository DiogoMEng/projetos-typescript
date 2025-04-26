
# Sistema de Agendamento de Consultas - InoovaWeb

Este é um sistema de gerenciamento de consultas médicas desenvolvido com React, TypeScript, e Supabase. O sistema permite agendamento online, gerenciamento de horários, pacientes, e convênios, com um painel administrativo completo.

![Painel Administrativo](https://i.imgur.com/yourimageurl.png)

## Índice

- [Recursos](#recursos)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
  - [Requisitos](#requisitos)
  - [Configuração Local](#configuração-local)
  - [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
  - [Customização](#customização)
- [Deploy](#deploy)
  - [Deploy na Hostinger](#deploy-na-hostinger)
- [Personalizando](#personalizando)
  - [Webhooks](#webhooks)
  - [Cores e Logo](#cores-e-logo)
  - [Tabelas do Banco de Dados](#tabelas-do-banco-de-dados)
- [Referência da API](#referência-da-api)
- [Licença](#licença)

## Recursos

- Agendamento online de consultas
- Painel administrativo completo
- Gestão de horários de atendimento
- Bloqueio de datas específicas
- Configuração de tipos de serviço e convênios
- Relatórios detalhados
- Integração com webhooks para notificações

## Tecnologias

- React.js + TypeScript
- Tailwind CSS
- Shadcn UI
- Supabase (Auth, Database, Functions)
- Vite
- React Query

## Instalação

### Requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase (gratuito para iniciar)

### Configuração Local

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/inoovaweb-agendamentos.git
   cd inoovaweb-agendamentos
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Crie um arquivo `.env.local` na raiz do projeto:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

### Configuração do Banco de Dados

1. Acesse o [Supabase](https://supabase.com) e crie uma nova conta ou faça login
2. Crie um novo projeto e anote a URL e a chave anon
3. Execute os scripts SQL abaixo no Editor SQL do Supabase:

```sql
-- Tabela de Agendamentos
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmado',
  observacoes TEXT,
  lembrete TEXT,
  tipo_consulta TEXT NOT NULL DEFAULT 'Consulta Nova',
  convenio TEXT DEFAULT 'Particular',
  hora TEXT NOT NULL,
  servico TEXT NOT NULL,
  data DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  professional_id UUID
);

-- Tabela de Configurações da Clínica
CREATE TABLE clinic_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Dias Bloqueados
CREATE TABLE dias_bloqueados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL,
  motivo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Convênios
CREATE TABLE insurances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Profissionais
CREATE TABLE professionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  working_days INTEGER[] DEFAULT '{1,2,3,4,5}',
  appointment_duration INTEGER,
  appointment_interval INTEGER DEFAULT 30,
  custom_time_slots JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Turnos dos Profissionais
CREATE TABLE professional_shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Serviços
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Serviços por Profissional
CREATE TABLE professional_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL,
  service_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Horários Disponíveis
CREATE TABLE time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL,
  hora TEXT NOT NULL,
  disponivel BOOLEAN NOT NULL DEFAULT TRUE,
  professional_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Função para calcular lembretes (2 horas antes da consulta)
CREATE OR REPLACE FUNCTION calculate_lembrete()
RETURNS TRIGGER AS $$
DECLARE
  appointment_date DATE;
  appointment_time TEXT;
  reminder_datetime TIMESTAMP;
  formatted_reminder TEXT;
BEGIN
  appointment_date := NEW.data::DATE;
  appointment_time := NEW.hora;
  
  -- Parse o tempo e combine com a data
  reminder_datetime := (appointment_date || ' ' || appointment_time)::TIMESTAMP - INTERVAL '2 hours';
  
  -- Formate o lembrete como DD/MM/YYYY HH:MM
  formatted_reminder := TO_CHAR(reminder_datetime, 'DD/MM/YYYY HH24:MI');
  
  -- Define o campo lembrete
  NEW.lembrete := formatted_reminder;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para calcular lembretes automaticamente
CREATE TRIGGER set_lembrete
BEFORE INSERT OR UPDATE OF data, hora ON appointments
FOR EACH ROW
EXECUTE FUNCTION calculate_lembrete();
```

4. Configure as Edge Functions do Supabase para os webhooks (opcional)

### Customização

Veja a seção [Personalizando](#personalizando) para detalhes sobre como adaptar o sistema às suas necessidades.

## Deploy

### Deploy na Hostinger

Para fazer o deploy do sistema na [Hostinger](https://hostinger.com.br), siga os passos abaixo:

1. Faça o build do projeto:
   ```bash
   npm run build
   # ou
   yarn build
   ```

2. Comprima a pasta `dist` em um arquivo .zip

3. Acesse o painel da sua hospedagem na Hostinger

4. Navegue até "Websites" > Seu Site > "File Manager"

5. Crie uma pasta para o projeto (Ex: "agendamentos") ou use a pasta raiz

6. Faça upload do arquivo .zip e extraia-o

7. Configure um subdomínio ou domínio para apontar para a pasta do projeto

8. Para aplicações React SPA, configure o redirecionamento no .htaccess:
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## Personalizando

### Webhooks

Para alterar os webhooks do sistema, localize os seguintes arquivos:

1. `src/services/appointment/sendAdminWebhook.ts` - Para o webhook administrativo
   - Altere as URLs dos webhooks nas linhas onde você vê:
     ```typescript
     // URLs para personalizar:
     "https://webhook.inoovaweb.com.br/webhook/c4f502ff-09d6-4367-aa33-8ad60912f172"
     "https://webhook.inoovaweb.com.br/webhook/novo_agendamento_adm"
     ```

2. `supabase/functions/appointment-webhook/index.ts` - Para o webhook do cliente
   - Altere a constante `WEBHOOK_URL` no início do arquivo

### Cores e Logo

1. Para alterar as cores do tema, edite o arquivo `tailwind.config.ts`:
   - Procure a seção `theme.extend.colors.medical` para ajustar as cores principais

2. Para trocar a logo:
   - Substitua os arquivos de logo em `/public`
   - Atualize as referências no componente de cabeçalho

### Tabelas do Banco de Dados

O sistema utiliza as seguintes tabelas:

- `appointments` - Armazena os agendamentos
- `clinic_settings` - Configurações gerais da clínica
- `dias_bloqueados` - Datas que não devem ter agendamentos
- `insurances` - Lista de convênios aceitos
- `professionals` - Profissionais disponíveis
- `professional_shifts` - Turnos de cada profissional
- `services` - Serviços oferecidos
- `professional_services` - Serviços por profissional
- `time_slots` - Horários disponíveis para agendamento

Para modificar a estrutura das tabelas, acesse o Editor SQL no Supabase.

## Referência da API

### Supabase Client

Configurado em `src/integrations/supabase/client.ts`

### APIs de Agendamento

- `src/services/appointment/crud.ts` - Operações CRUD de agendamentos
- `src/services/appointment/availability.ts` - Verificação de disponibilidade
- `src/services/appointment/validation.ts` - Validação de dados
- `src/services/appointment/webhookService.ts` - Serviços de webhook

## Licença

Este projeto é open source, disponível sob a licença MIT. Sinta-se à vontade para modificar e reutilizar de acordo com suas necessidades.

&copy; 2023-2025 InoovaWeb - Sistema de Gerenciamento de Consultas
