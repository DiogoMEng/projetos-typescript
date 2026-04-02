# 📌 Finances Backend API

> API backend para sistema de gerenciamento financeiro, desenvolvida em Node.js com TypeScript, permitindo o controle de usuários, categorias, caixas e transações.

---

## 📖 Sumário
- [Visão Geral](#-visão-geral)
- [Objetivos](#-objetivos)
- [Escopo do Projeto](#-escopo-do-projeto)
- [Arquitetura](#-arquitetura)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução do Projeto](#-execução-do-projeto)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Banco de Dados](#-banco-de-dados)
- [Endpoints da API](#-endpoints-da-api)
- [Autenticação e Autorização](#-autenticação-e-autorização)
- [Tratamento de Erros](#-tratamento-de-erros)
- [Logs e Monitoramento](#-logs-e-monitoramento)
- [Testes](#-testes)
- [Boas Práticas](#-boas-práticas)
- [Segurança](#-segurança)
- [Deploy](#-deploy)
- [Versionamento](#-versionamento)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Autores e Contato](#-autores-e-contato)

---

## 🔍 Visão Geral
O Finances Backend API é um sistema de gerenciamento financeiro que permite aos usuários controlar suas finanças pessoais ou empresariais. O sistema oferece funcionalidades para cadastro de usuários, criação de categorias de despesas/receitas, gerenciamento de caixas (contas) e registro de transações financeiras. Utiliza uma arquitetura RESTful com autenticação JWT para garantir a segurança dos dados.

---

## 🎯 Objetivos
- Fornecer uma API robusta para gerenciamento de finanças pessoais/empresariais
- Implementar controle de acesso baseado em roles e permissões
- Garantir integridade e segurança dos dados financeiros
- Oferecer uma interface programática para integração com aplicações frontend

---

## 📦 Escopo do Projeto
### Dentro do Escopo
- CRUD completo de usuários, categorias, caixas e transações
- Sistema de roles e permissões (Role-Based Access Control)
- Autenticação via JWT
- Validação de dados com Joi
- Migrações e seeders para banco de dados
- Containerização com Docker

### Fora do Escopo
- Interface gráfica (frontend)
- Aplicativos mobile
- Relatórios avançados e dashboards
- Integrações com bancos externos
- Processamento de pagamentos online

---

## 🏗 Arquitetura
O projeto utiliza uma arquitetura MVC (Model-View-Controller) com separação clara de responsabilidades:

- **Models**: Definem a estrutura dos dados e interações com o banco
- **Views**: Não aplicável (API REST)
- **Controllers**: Gerenciam as requisições HTTP e respostas
- **Services**: Contêm a lógica de negócio
- **Routes**: Definem os endpoints da API
- **Interfaces**: Tipagem TypeScript para contratos de dados

### Diagrama Arquitetural
```
Cliente HTTP
    ↓
Express Router
    ↓
Controller → Service → Model → Database
    ↑
Response
```

---

## 🧰 Tecnologias Utilizadas
- **Linguagem**: TypeScript
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL
- **ORM**: Sequelize
- **Ferramentas de Build**: TypeScript Compiler
- **Documentação de API**: Esta documentação
- **Outras dependências**: bcryptjs (hashing), jsonwebtoken (JWT), joi (validação), cors, express-async-errors

---

## 📋 Requisitos
### Requisitos Funcionais
- RF01 - Gerenciar usuários (cadastro, listagem, edição, exclusão)
- RF02 - Gerenciar categorias de transações
- RF03 - Gerenciar caixas (contas financeiras)
- RF04 - Registrar e gerenciar transações
- RF05 - Controle de permissões baseado em roles

### Requisitos Não Funcionais
- RNF01 - Segurança com autenticação JWT
- RNF02 - Validação de dados de entrada
- RNF03 - Tratamento adequado de erros
- RNF04 - Containerização para facilitar deploy
- RNF05 - Código tipado com TypeScript

---

## ⚙️ Instalação
Passo a passo para instalar o projeto localmente.

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Acesse a pasta do projeto
cd finances/api

# Instale as dependências
npm install
```

---

## 🔧 Configuração
O projeto utiliza variáveis de ambiente para configuração. Crie um arquivo `.env.development` na raiz do diretório `api`.

### Exemplo de `.env.development`
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_jwt_aqui

DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin123
DB_NAME=finances_db
DB_HOST=db
DB_DIALECT=postgres
```

---

## ▶️ Execução do Projeto
```bash
# Ambiente de desenvolvimento (com Docker)
docker-compose up -d

# Ambiente de desenvolvimento (sem Docker)
npm run dev

# Ambiente de produção
npm run build
npm start
```

URL base da aplicação:
```
http://localhost:3000
```

---

## 🗂 Estrutura de Pastas
```
api/
├── src/
│   ├── config/           # Configurações da aplicação e banco
│   ├── controllers/      # Controladores HTTP (lógica de rotas)
│   ├── database/         # Migrações, modelos e seeders
│   │   ├── migrations/   # Scripts de migração do banco
│   │   ├── models/       # Modelos Sequelize
│   │   └── seeders/      # Dados de exemplo
│   ├── interfaces/       # Interfaces TypeScript
│   ├── middlewares/      # Middlewares personalizados (vazio)
│   ├── routes/           # Definições de rotas Express
│   ├── services/         # Lógica de negócio
│   └── server.ts         # Ponto de entrada da aplicação
├── Dockerfile            # Configuração para containerização
├── docker-compose.yml    # Orquestração de containers
├── package.json          # Dependências e scripts NPM
├── tsconfig.json         # Configuração TypeScript
└── .env.development      # Variáveis de ambiente
```

**Responsabilidades:**
- `controllers/`: Recebem requisições, validam dados e retornam respostas
- `services/`: Contêm regras de negócio e interações com modelos
- `models/`: Representam tabelas do banco e relacionamentos
- `routes/`: Mapeiam URLs para controladores

---

## 🗄 Banco de Dados
- **Tipo**: PostgreSQL (relacional)
- **ORM**: Sequelize
- **Estratégia de modelagem**: Entidade-Relacionamento com chaves estrangeiras
- **Migrações**: Scripts versionados para evolução do schema
- **Seeds**: Dados iniciais para desenvolvimento

### Relacionamentos Principais
- User hasMany Categories, BoxBottoms, RoleUserBoxBottoms
- Category belongsTo User
- BoxBottom belongsTo User
- Transaction belongsTo BoxBottom, Category
- RoleUserBoxBottom belongsTo User, Role, BoxBottom

---

## 🔗 Endpoints da API

### Padrão de Resposta
```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso"
}
```

### Autenticação
**POST** `/auth/login`
Realiza login e retorna token JWT.

**Request Body**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usuários
**POST** `/users`
Registra um novo usuário. *(Pública)*

**Request Body**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**GET** `/users`
Lista todos os usuários (sem senha). *(Pública)*

**GET** `/users/:id`
Obtém usuário específico por ID. *(Pública)*

**PUT** `/users/:id`
Edita dados do usuário.

**DELETE** `/users/:id`
Remove usuário.

### Categorias
**POST** `/categories`
Cria nova categoria. *(Protegida)*

**GET** `/categories`
Lista categorias. *(Protegida)*

**GET** `/categories/:categoryId`
Obtém categoria por ID. *(Protegida)*

**PUT** `/categories/:categoryId`
Edita categoria. *(Protegida)*

**DELETE** `/categories/:categoryId`
Remove categoria. *(Protegida)*

### Caixas (Box Bottoms)
**POST** `/box-bottoms`
Cria nova caixa. *(Protegida)*

**GET** `/box-bottoms`
Lista caixas. *(Protegida)*

**GET** `/box-bottoms/:boxBottomId`
Obtém caixa por ID. *(Protegida)*

**PUT** `/box-bottoms/:boxBottomId`
Edita caixa. *(Protegida)*

**DELETE** `/box-bottoms/:boxBottomId`
Remove caixa. *(Protegida)*

### Transações
**POST** `/transactions/:boxBottomId/:categoryId`
Registra nova transação. *(Protegida)*

**GET** `/transactions/:id`
Lista transações (por caixa?). *(Protegida)*

**GET** `/transactions/:id`
Obtém transação por ID. *(Protegida)*

**PUT** `/transactions/:id`
Edita transação. *(Protegida)*

**DELETE** `/transactions/:id`
Remove transação. *(Protegida)*

### Roles
**POST** `/roles/register`
Cria novo role.

**GET** `/roles`
Lista roles.

**GET** `/role/:id`
Obtém role por ID.

**PUT** `/role/:id`
Edita role.

**DELETE** `/role/:id`
Remove role.

### Role-User-BoxBottom
**POST** `/role-user-box-bottoms/register`
Associa usuário, role e caixa.

**GET** `/role-user-box-bottoms`
Lista associações.

**GET** `/role-user-box-bottom/:id`
Obtém associação por ID.

**PUT** `/role-user-box-bottom/:id`
Edita associação.

**DELETE** `/role-user-box-bottom/:id`
Remove associação.

---

## 🔐 Autenticação e Autorização
- **Tipo**: JWT (JSON Web Tokens) - ✅ Implementado
- **Papéis**: Sistema de roles para controle de permissões
- **Fluxo**: Registro → Login → Token JWT → Acesso autorizado

### Autenticação JWT
A autenticação JWT está **completamente implementada**. O middleware `checkAuth` valida o token em todas as requisições protegidas.

**Como usar:**
1. Registre um novo usuário em `POST /users`
2. Faça login em `POST /auth/login` para obter o token JWT
3. Use o token no header `Authorization: Bearer <token>` em requisições protegidas

**Rotas Protegidas (requerem autenticação):**
- `/categories` - Gerenciamento de categorias
- `/box-bottoms` - Gerenciamento de caixas
- `/transactions` - Gerenciamento de transações
- `/role-user-box-bottoms` - Associações de roles

**Rotas Públicas:**
- `POST /users` - Registro de usuários
- `GET /users` - Listar usuários
- `POST /auth/login` - Login

---

## ❌ Tratamento de Erros
O sistema retorna erros no formato:

```json
{
  "message": "Descrição do erro"
}
```

**Códigos HTTP comuns:**
- `200` - Sucesso
- `201` - Criado
- `400` - Dados inválidos
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

---

## 📊 Logs e Monitoramento
- **Ferramenta**: Console do Node.js (logs básicos)
- **Níveis**: Info, Error
- **Monitoramento**: Não implementado (recomendado para produção)

---

## 🧪 Testes
- **Tipos**: Unitários (planejados)
- **Ferramentas**: Jest (não configurado)
- **Cobertura**: Não implementada

```bash
# Comando para testes (quando implementado)
npm run test
```

---

## ✅ Boas Práticas
- **Padrões de código**: ESLint com Airbnb base
- **Convenções de commits**: Não definidas
- **Organização**: Separação clara de responsabilidades (MVC)
- **Tipagem**: TypeScript para type safety
- **Validação**: Joi para entrada de dados

---

## 🔒 Segurança
- **Proteções**: Hashing de senhas com bcryptjs
- **Criptografia**: JWT para tokens (✅ Implementado)
- **Prevenção**: Validação de entrada, CORS habilitado, Middleware de autenticação em rotas protegidas
- **Melhorias futuras**: Rate limiting, validação com Joi mais rigorosa, logs de auditoria

---

## 🚀 Deploy
- **Ambiente**: Docker containers
- **Pipeline**: Não implementado
- **Variáveis**: Separação entre dev/prod via .env

```bash
# Deploy com Docker
docker-compose up -d
```

---

## 🧾 Versionamento
- **Estratégia**: SemVer (1.0.0)
- **Branches**: main para produção, develop para desenvolvimento

---

## 🤝 Contribuição
1. Fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença
ISC License

---

## 👤 Autores e Contato
- **Autor**: Diogo Dias Mello
- **Email**: diogoeng19@gmail.com
- **GitHub**: [link do github](https://github.com/DiogoMEng)
- **LinkedIn**: [link do linkedin](https://www.linkedin.com/in/diogo-meng/)