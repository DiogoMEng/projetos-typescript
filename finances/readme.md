# 📘 Documentação do Projeto Backend - Sistema de Gestão Financeira

## 🧾 Índice

1. [Descrição do Projeto](#descrição-do-projeto)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Arquitetura do Projeto](#arquitetura-do-projeto)
4. [Instalação e Configuração](#instalação-e-configuração)
5. [Scripts de Desenvolvimento](#scripts-de-desenvolvimento)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Rotas da API](#rotas-da-api)
8. [Modelos e Banco de Dados](#modelos-e-banco-de-dados)
9. [Autenticação e Autorização](#autenticação-e-autorização)
10. [Testes](#testes)
11. [Boas Práticas e Convenções](#boas-práticas-e-convenções)
12. [CI/CD](#cicd)
13. [Logs e Monitoramento](#logs-e-monitoramento)
14. [FAQ / Problemas Comuns](#faq--problemas-comuns)
15. [Licença](#licença)

## 📌 Descrição do Projeto

Este projeto é uma API RESTful para gerenciamento de finanças pessoais. O sistema permite que usuários autenticados controlem suas receitas e despesas, categorizem transações e acompanhem sua situação financeira de forma organizada e segura.

**Principais funcionalidades:**
- Cadastro e autenticação de usuários
- Gerenciamento de receitas (entradas)
- Gerenciamento de despesas (saídas)
- Categorização de transações
- Controle de métodos de pagamento
- Relatórios financeiros por usuário

## 🧰 Tecnologias Utilizadas

- **Linguagem:** Node.js com TypeScript
- **Framework:** Express.js
- **Banco de dados:** MySQL
- **ORM:** Sequelize
- **Autenticação:** JWT (JSON Web Tokens)
- **Validação:** Joi
- **Criptografia:** bcryptjs
- **Containerização:** Docker + Docker Compose
- **Desenvolvimento:** Nodemon, ts-node
- **Middleware:** CORS, express-async-errors

## 🏗 Arquitetura do Projeto

O projeto segue o padrão **MVC (Model-View-Controller)** com separação clara de responsabilidades:

```bash
src/
├── controllers/          # Controladores da aplicação
│   ├── user.controller.ts
│   ├── income.controller.ts
│   ├── expense.controller.ts
│   └── token.controller.ts
├── database/            # Configurações do banco de dados
│   ├── config/
│   │   └── database.ts
│   ├── models/          # Modelos Sequelize
│   │   ├── index.ts
│   │   ├── User.ts
│   │   ├── Income.ts
│   │   └── Expense.ts
│   ├── migrations/      # Scripts de migração
│   └── seeders/         # Scripts de seed
├── interfaces/          # Interfaces TypeScript
│   └── user.protocol.ts
├── middlewares/         # Middlewares customizados
├── routes/             # Definição das rotas
│   └── routes.ts
├── schemas/            # Esquemas de validação Joi
│   ├── user.schema.ts
│   ├── income.schema.ts
│   └── expense.schema.ts
├── services/           # Lógica de negócio
├── app.ts             # Configuração do Express
└── server.ts          # Ponto de entrada da aplicação
```

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- MySQL (versão 8.0 ou superior)
- npm ou yarn

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/diogomello/finances-backend.git

# Acesse a pasta do projeto
cd finances-backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Configure o banco de dados no arquivo .env
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=sua_senha
# DB_NAME=finances

# Execute as migrações do banco de dados
npx sequelize-cli db:create
npx sequelize-cli db:migrate

# Execute os seeders (opcional)
npx sequelize-cli db:seed:all
```

## 📜 Scripts de Desenvolvimento

```bash
# Iniciar o servidor em modo desenvolvimento
npm run dev

# Compilar TypeScript para JavaScript
npm run build

# Executar testes
npm test

# Executar migrações do banco
npx sequelize-cli db:migrate

# Reverter última migração
npx sequelize-cli db:migrate:undo

# Executar seeders
npx sequelize-cli db:seed:all

# Criar nova migração
npx sequelize-cli migration:generate --name nome-da-migracao

# Criar novo seeder
npx sequelize-cli seed:generate --name nome-do-seeder
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# Configurações do servidor
PORT=3000

# Configurações do banco de dados MySQL
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha_mysql
DB_NAME=finances

# Configurações de autenticação JWT
JWT_PASS=sua_chave_secreta_jwt_super_segura

# Configurações do ambiente
NODE_ENV=development
```

## 🌐 Rotas da API

### Autenticação

| Método | Endpoint | Descrição | Autenticado |
|--------|----------|-----------|-------------|
| POST | `/tokens` | Login de usuário | ❌ |

### Usuários

| Método | Endpoint | Descrição | Autenticado |
|--------|----------|-----------|-------------|
| GET | `/users` | Listar usuários | ✅ |
| POST | `/users` | Criar usuário | ❌ |
| PUT | `/users/:id` | Atualizar usuário | ✅ |
| DELETE | `/users/:id` | Deletar usuário | ✅ |

### Receitas (Income)

| Método | Endpoint | Descrição | Autenticado |
|--------|----------|-----------|-------------|
| GET | `/incomes` | Listar receitas do usuário | ✅ |
| POST | `/incomes` | Criar nova receita | ✅ |
| PUT | `/incomes/:id` | Atualizar receita | ✅ |
| DELETE | `/incomes/:id` | Deletar receita | ✅ |

### Despesas (Expenses)

| Método | Endpoint | Descrição | Autenticado |
|--------|----------|-----------|-------------|
| GET | `/expense` | Listar despesas do usuário | ✅ |
| POST | `/expense` | Criar nova despesa | ✅ |
| PUT | `/expense/:id` | Atualizar despesa | ✅ |
| DELETE | `/expense/:id` | Deletar despesa | ✅ |

### Categorias

| Método | Endpoint | Descrição | Autenticado |
|--------|----------|-----------|-------------|
| GET | `/category` | Listar categorias | ✅ |
| POST | `/category` | Criar categoria | ✅ |
| PUT | `/category/:id` | Atualizar categoria | ✅ |
| DELETE | `/category/:id` | Deletar categoria | ✅ |

### Métodos de Pagamento

| Método | Endpoint | Descrição | Autenticado |
|--------|----------|-----------|-------------|
| GET | `/paymentmethod` | Listar métodos de pagamento | ✅ |
| POST | `/paymentmethod` | Criar método de pagamento | ✅ |
| PUT | `/paymentmethod/:id` | Atualizar método de pagamento | ✅ |
| DELETE | `/paymentmethod/:id` | Deletar método de pagamento | ✅ |

### Metas Mensais

| Método | Endpoint | Descrição | Autenticado |
|--------|----------|-----------|-------------|
| GET | `/monthlygoal` | Listar metas mensais | ✅ |
| POST | `/monthlygoal` | Criar meta mensal | ✅ |
| PUT | `/monthlygoal/:id` | Atualizar meta mensal | ✅ |
| DELETE | `/monthlygoal/:id` | Deletar meta mensal | ✅ |

## 🗃 Modelos e Banco de Dados

### Entidades Principais:

- **User** - Usuários do sistema
- **Income** - Receitas/Entradas financeiras
- **Expense** - Despesas/Saídas financeiras
- **Category** - Categorias de transações
- **PaymentMethod** - Métodos de pagamento
- **MonthlyGoal** - Metas mensais de gastos

### Relacionamentos:

- Um usuário possui muitas receitas (1:N)
- Um usuário possui muitas despesas (1:N)
- Um usuário possui muitas metas mensais (1:N)
- Uma receita pertence a uma categoria (N:1)
- Uma despesa pertence a uma categoria (N:1)
- Uma despesa possui um método de pagamento (N:1)

### Campos Principais:

**User:**
- `userId` - ID único do usuário
- `name` - Nome completo
- `email` - Email único
- `password` - Senha hasheada

**Income:**
- `description` - Descrição da receita (mín. 3 chars, não apenas números)
- `value` - Valor da receita (positivo, 2 casas decimais)
- `dateReceipt` - Data de recebimento (YYYY-MM-DD)
- `type` - Tipo da receita
- `userId` - ID do usuário proprietário

**Expense:**
- `description` - Descrição da despesa (mín. 3 chars, não apenas números)
- `value` - Valor da despesa (positivo, 2 casas decimais)
- `date` - Data da despesa (YYYY-MM-DD com validação completa)
- `observation` - Observações adicionais
- `situation` - Status da despesa (pago/pendente)
- `userId` - ID do usuário proprietário
- `categoryId` - ID da categoria (sistema)
- `paymentMethodId` - ID do método de pagamento (sistema)

## 🔐 Autenticação e Autorização

- **JWT Token** com expiração de 7 dias
- **Middleware de autenticação** em todas as rotas protegidas
- **Hash de senhas** usando bcryptjs
- **Isolamento de dados** por usuário (cada usuário acessa apenas seus dados)

### Fluxo de Autenticação:

1. Usuário faz login com email/senha
2. Sistema valida credenciais no banco de dados
3. Senha é verificada usando bcrypt.compare()
4. JWT token é gerado com ID do usuário e expiração de 7 dias
5. Cliente inclui token no header: `Authorization: Bearer <token>`
6. Middleware valida token em cada requisição protegida

### Exemplo de Login:

```json
POST /tokens
{
  "email": "usuario@email.com",
  "password": "minhasenha123"
}

Response:
{
  "user": {
    "userId": 1,
    "name": "João Silva",
    "email": "usuario@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📏 Boas Práticas e Convenções

### Código:
- **TypeScript** para tipagem estática
- **ESLint + Prettier** para formatação consistente
- **Conventional Commits** para mensagens de commit
- **Nomenclatura:** camelCase para variáveis, PascalCase para classes

### Validação:
- **Joi schemas** para validação rigorosa de entrada
- **Mensagens de erro** em português para melhor UX
- **Validação de data completa** (ano, mês, dia obrigatórios)
- **Descrições não podem ser apenas números**

### Segurança:
- **Senhas hasheadas** com bcryptjs (salt rounds)
- **JWT tokens** com expiração configurável
- **Validação de entrada** em todas as rotas
- **Isolamento de dados** por usuário autenticado
- **Headers CORS** configurados adequadamente

### Estrutura de Controllers:
- **Comentários em inglês** explicando funcionalidades
- **Tratamento de erros** padronizado
- **Validação separada** de campos do usuário vs sistema
- **Responses consistentes** com status codes apropriados

## 🚀 CI/CD

### Ambiente de Desenvolvimento:
- **Hot reload** com nodemon para desenvolvimento ágil
- **TypeScript compilation** automática
- **Database migrations** versionadas com Sequelize CLI

### Estrutura de Deploy:
- **Build process** com TypeScript compilation
- **Environment variables** para diferentes ambientes
- **Database migrations** automatizadas no deploy

## 📊 Logs e Monitoramento

### Logs:
- **Express middleware** para log de requisições HTTP
- **Error handling** centralizado com try/catch
- **Structured logging** com informações de contexto
- **Database query logging** via Sequelize

### Monitoramento:
- **Health checks** para verificação de status da API
- **Database connection** monitoring
- **JWT token validation** logging
- **Performance metrics** básicos de response time

## ❓ FAQ / Problemas Comuns

### Erro: "Database connection failed"
**Solução:** Verifique as variáveis de ambiente `DB_HOST`, `DB_USER`, `DB_PASS` e `DB_NAME` no arquivo `.env`. Certifique-se de que o MySQL está rodando.

### Erro: "Token inválido" ou "jwt malformed"
**Solução:** Confirme se está enviando o header `Authorization: Bearer <token>` corretamente e se o token não expirou (7 dias).

### Erro: "Validation failed" - Descrição não pode conter apenas números
**Solução:** A descrição deve conter texto, não apenas números. Ex: "Compra de materiais 123" ✅, "12345" ❌

### Erro: "O ano deve ser informado"
**Solução:** Envie a data completa no formato YYYY-MM-DD. Ex: "2024-03-15" ✅, "2024-03" ❌

### Erro: "Port 3000 already in use"
**Solução:** Altere a variável `PORT` no `.env` ou finalize o processo: `lsof -ti:3000 | xargs kill -9`

### Problema: Migrações não executam
**Solução:** 
1. Verifique se o banco existe: `npx sequelize-cli db:create`
2. Verifique credenciais no `.env`
3. Execute: `npx sequelize-cli db:migrate`

### Erro: "categoryId is not allowed"
**Solução:** Este erro foi resolvido. O controller agora filtra campos do sistema antes da validação.

### Erro: "Email ou senha inválidos"
**Solução:** Verifique se o email está cadastrado e se a senha está correta. Certifique-se de que não há espaços extras.

### Problema: Servidor não inicia
**Solução:** 
1. Verifique se todas as dependências estão instaladas: `npm install`
2. Verifique se o arquivo `.env` existe e está configurado
3. Verifique se a porta não está em uso

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

**Padrões de Commit:**

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: documentação
- `style`: formatação
- `refactor`: refatoração de código
- `test`: testes