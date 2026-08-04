# 🧪 Plano de Testes — CaixaUp API

> Planejamento de testes Unitários, de Integração e E2E para a API de gerenciamento financeiro CaixaUp (Node.js + TypeScript + Express + Sequelize + PostgreSQL).

---

## 1. Objetivo e Escopo

Garantir a qualidade e a integridade da API nas três camadas de teste:

| Nível | O que valida | Isolamento |
|---|---|---|
| **Unitário** | Regras de negócio isoladas (services, utils, middlewares) | Sem banco real, sem HTTP — tudo mockado |
| **Integração** | Interação entre camadas (Controller → Service → Model → Banco) | Banco de dados real de teste, sem subir servidor HTTP completo (ou subindo, mas sem mocks de DB) |
| **E2E** | Fluxos completos do ponto de vista do cliente HTTP | Aplicação rodando de ponta a ponta, banco de teste populado, requisições reais via HTTP |

Módulos cobertos: **Auth, Users, Categories, BoxBottoms, Transactions, Roles, RoleUserBoxBottoms**, além de middlewares (`checkAuth`, `checkRole`) e utilitários (`catchAsync`).

---

## 2. Stack de Testes Recomendada

| Ferramenta | Uso |
|---|---|
| **Jest** | Test runner + assertions + mocks (unitário e integração) |
| **ts-jest** ou **SWC** | Suporte a TypeScript no Jest |
| **Supertest** | Requisições HTTP simuladas contra o `app` Express (integração e E2E) |
| **PostgreSQL de teste** (container Docker dedicado, ex: `docker-compose.test.yml`) | Banco real isolado para testes de integração/E2E |
| **sequelize-cli** | Rodar migrations no banco de teste antes da suíte |
| **jest-mock-extended** ou mocks manuais | Mockar models Sequelize em testes unitários |
| **supertest + jsonwebtoken** | Gerar tokens válidos/inválidos para testar rotas protegidas |
| **cross-env** | Selecionar `NODE_ENV=test` e `.env.test` |

Scripts sugeridos no `package.json`:
```json
{
  "test:unit": "cross-env NODE_ENV=test jest --testPathPattern=unit",
  "test:integration": "cross-env NODE_ENV=test jest --testPathPattern=integration --runInBand",
  "test:e2e": "cross-env NODE_ENV=test jest --testPathPattern=e2e --runInBand",
  "test": "npm run test:unit && npm run test:integration && npm run test:e2e"
}
```

`.env.test` separado, apontando para um banco `finances_db_test` isolado do de desenvolvimento.

---

## 3. Testes Unitários

Objetivo: testar cada método isoladamente, **mockando** o model Sequelize (`jest.mock`) e dependências externas. Nenhum teste unitário deve tocar o banco real.

### 3.1 `Service.ts` (classe base genérica)

| # | Cenário | Resultado esperado |
|---|---|---|
| U1 | `create()` chama `beforeCreate` antes de gerar o UUID e persistir | `beforeCreate` é chamado com o DTO original, antes de `model.create` |
| U2 | `create()` gera um UUID para a PK quando não informado | `data[primaryKey]` preenchido com string UUID v4 válida |
| U3 | `create()` chama `afterCreate` com o registro criado | `afterCreate` recebe a instância retornada por `model.create` |
| U4 | `create()` propaga erro lançado dentro de `beforeCreate` sem envolver na mensagem genérica | Erro original (`instanceof Error`) chega intacto ao chamador |
| U5 | `create()` encapsula erro de `model.create`/`afterCreate` em `Erro ao criar registro em {model}` | ⚠️ Ver nota de regressão abaixo |
| U6 | `getAll()` repassa `options` para `findAll` e retorna a lista | Resultado igual ao mock de `findAll` |
| U7 | `getById()` lança erro `"{model} não encontrado"` quando `findByPk` retorna `null` | Exception lançada com mensagem correta |
| U8 | `getById()` retorna o registro quando encontrado | Retorno igual ao mock |
| U9 | `update()` retorna `true` quando `affectedCount > 0` | — |
| U10 | `update()` retorna `false` quando nenhum registro é afetado | — |
| U11 | `delete()` chama `model.destroy` com o `where` correto baseado em `primaryKey` | — |
| U12 | `beforeCreate`/`afterCreate` default (não sobrescritos) não lançam erro e não alteram o fluxo | Classes que não implementam os hooks funcionam normalmente |

> **⚠️ Nota de regressão (bug já identificado nesta conversa):** o `catch` genérico de `create()` mascara qualquer erro ocorrido em `afterCreate` (ex: falha ao criar o vínculo de `RoleUserBoxBottom`) como se fosse erro na criação do registro principal. Adicionar teste específico (**U5b**) verificando que, quando `afterCreate` rejeita, a mensagem de erro **não** deveria ser genérica — e usar esse teste como gatilho para decidir se a correção (propagar `error.message` real, ou envolver tudo em transaction) será aplicada.

### 3.2 `BoxBottom.service.ts`

| # | Cenário | Resultado esperado |
|---|---|---|
| U13 | `beforeCreate` lança `"Caixinha já existe para este usuário"` quando já existe box com mesmo `name` + `userId` | `findOne` mockado retornando registro existente |
| U14 | `beforeCreate` não lança erro quando não há conflito | `findOne` mockado retornando `null` |
| U15 | `afterCreate` busca a role `OWNER` e cria o vínculo em `RoleUserBoxBottom` com `userId`, `boxBottomId`, `roleId` corretos | `roleUserBoxBottomService.create` chamado com os argumentos esperados |
| U16 | `afterCreate` lança `"Role OWNER não encontrada"` se a role não existir | `DB.Roles.findOne` retorna `null` |
| U17 | **Regressão crítica:** `record.userId` e `record.boxBottomId` retornados por `model.create` devem estar acessíveis (não `undefined`) na instância usada por `afterCreate` | Este é o teste que teria capturado o bug do `public x!: Type` vs `declare x: Type` antes de ir para produção — deve rodar contra o model real (teste de integração é o ideal, mas um teste unitário com a classe do model real, sem mock, também cobre) |
| U18 | `getAllBoxBottomsByUser` monta o `where` com `Op.or` (dono OU membro) e os `include` corretos | Verificar estrutura do objeto passado para `super.getAll` |

### 3.3 `RoleUserBoxBottom.service.ts`

| # | Cenário | Resultado esperado |
|---|---|---|
| U19 | `beforeCreate` lança `"Usuário, Caixa ou Função não encontrados"` quando `userId`, `boxBottomId` ou `roleId` não existem | Mock de `findByPk` retornando `null` para cada combinação (testar os 3 casos isoladamente: só user falha, só box falha, só role falha) |
| U20 | `beforeCreate` não lança erro quando os três existem | — |
| U21 | Não permite duplicar o mesmo vínculo (se essa regra existir/for adicionada) | A definir com o time — sugerido como melhoria |

### 3.4 `User.service.ts`, `Category.service.ts`, `Transaction.service.ts`, `role.service.ts`

| # | Cenário | Resultado esperado |
|---|---|---|
| U22 | `User.service`: senha é hasheada com `bcryptjs` antes de persistir | `bcrypt.hash` chamado; senha em texto plano nunca é passada ao `model.create` |
| U23 | `User.service`: retorno de criação/listagem nunca inclui o campo `password` | Objeto de resposta sem a chave `password` |
| U24 | `Category.service`: validação de `type` restrita a `receita`/`despesa` | Erro ao tentar criar com valor fora do enum (camada de validação, se existir antes do model) |
| U25 | `Transaction.service`: vínculo correto entre `boxBottomId` e `categoryId` recebidos via rota (`/transactions/:boxBottomId/:categoryId`) | Objeto persistido contém os IDs corretos vindos dos params, não do body |
| U26 | `Transaction.service`: `movementType` restrito a `inflow`/`outflow` | Erro para valores inválidos |
| U27 | `role.service`: impede criação de roles duplicados (`name` único), se essa regra existir | A definir |

### 3.5 Middlewares

| # | Cenário | Resultado esperado |
|---|---|---|
| U28 | `checkAuth`: token ausente no header `Authorization` | Retorna 401, `next()` não é chamado |
| U29 | `checkAuth`: token mal formatado (`Bearer` ausente, string vazia) | Retorna 401 |
| U30 | `checkAuth`: token expirado | Retorna 401 com mensagem apropriada |
| U31 | `checkAuth`: token válido | `req.userId` populado corretamente e `next()` chamado |
| U32 | `checkAuth`: token assinado com segredo diferente do `JWT_SECRET` | Retorna 401 (rejeita assinatura inválida) |
| U33 | `checkRole`: usuário sem a role exigida para a rota | Retorna 403 |
| U34 | `checkRole`: usuário com a role exigida | `next()` chamado |
| U35 | `checkRole`: caixa (`boxBottomId`) sem vínculo de role para o usuário (nunca associado) | Retorna 403/404 conforme regra definida |

### 3.6 `catchAsync.ts`

| # | Cenário | Resultado esperado |
|---|---|---|
| U36 | Handler resolve normalmente (sem erro) | Resposta enviada normalmente, `catch` não interfere |
| U37 | Handler rejeita com `Error` cuja mensagem contém `"not found"` (case-insensitive) | Status `404` retornado |
| U38 | Handler rejeita com `Error` sem `"not found"` na mensagem | Status `400` retornado |
| U39 | Handler rejeita com valor que não é instância de `Error` (ex: string, objeto puro) | Status `500` com mensagem genérica `"Erro interno do servidor"` |
| U40 | Handler nunca deve deixar uma `UnhandledPromiseRejection` escapar | Teste de "fumaça" garantindo que toda rejeição é capturada |

> **Observação de risco:** o mapeamento de status por `message.includes('not found')` é frágil — qualquer erro de negócio que mencione "não encontrado" (em português) não cai no 404 hoje (ex: `"Usuário, Caixa ou Função não encontrados"` cairia como 400, não 404). Vale um teste específico (**U38b**) documentando esse comportamento atual, para decidir se é intencional ou se deve ser corrigido (ex: usar classes de erro tipadas como `NotFoundError` em vez de checar substring da mensagem).

---

## 4. Testes de Integração

Objetivo: subir o `app` Express real (via Supertest, sem `.listen()`), com o banco de dados de teste real (Postgres em container, migrations aplicadas, dados limpos entre testes via `beforeEach`/transaction rollback). Sem mocks de Sequelize — os models e o banco são reais.

### 4.1 Setup

- `beforeAll`: conectar ao banco de teste, rodar migrations.
- `beforeEach`: iniciar transaction ou truncar tabelas relevantes (estratégia recomendada: `TRUNCATE ... CASCADE` entre testes, ou envolver cada teste numa transaction com `ROLLBACK` no `afterEach` para velocidade).
- `afterAll`: fechar conexão Sequelize.
- Helper `createAuthenticatedUser()`: cria usuário real via service/model e gera token JWT válido para reuso nos testes de rotas protegidas.

### 4.2 `POST /auth/login`

| # | Cenário | Resultado esperado |
|---|---|---|
| I1 | Login com credenciais válidas | `200`, retorna `token` JWT válido e decodificável |
| I2 | Login com email inexistente | `400`/`401`, mensagem apropriada, sem vazar se o email existe ou não (boa prática de segurança) |
| I3 | Login com senha incorreta | `400`/`401` |
| I4 | Login com body inválido (email malformado, campos faltando) | `400` de validação (Joi) |

### 4.3 `POST /users` e demais rotas de usuário

| # | Cenário | Resultado esperado |
|---|---|---|
| I5 | Criar usuário com dados válidos | `201`, usuário persistido no banco, senha salva com hash (não em texto plano) |
| I6 | Criar usuário com email já cadastrado | Erro de conflito (`400`/`409`), nenhum registro duplicado |
| I7 | Criar usuário com campos obrigatórios faltando | `400` de validação |
| I8 | `GET /users` retorna lista sem o campo `password` | Verificar ausência da chave em cada item |
| I9 | `GET /users/:id` com ID inexistente | `404` |
| I10 | `PUT /users/:id` atualiza dados corretamente | Dados persistidos refletem a alteração |
| I11 | `DELETE /users/:id` remove o usuário | Registro não encontrado em consulta subsequente |

### 4.4 `/categories` (rotas protegidas)

| # | Cenário | Resultado esperado |
|---|---|---|
| I12 | Requisição sem token | `401` |
| I13 | Criar categoria com token válido | `201`, categoria vinculada ao `userId` do token, não ao body |
| I14 | Criar categoria com `type` inválido (fora de `receita`/`despesa`) | `400` |
| I15 | `GET /categories` retorna apenas categorias do usuário autenticado (ou conforme regra de negócio) | Nenhuma categoria de outro usuário aparece |
| I16 | `GET /categories/:categoryId` de categoria de outro usuário | `403`/`404` conforme regra de autorização |
| I17 | `PUT`/`DELETE` em categoria que não pertence ao usuário | Bloqueado (`403`/`404`) |

### 4.5 `/box-bottoms` — **prioridade alta** (módulo com bug já identificado)

| # | Cenário | Resultado esperado |
|---|---|---|
| I18 | Criar caixinha com dados válidos e token válido | `201`; resposta contém `boxBottomId` **não-undefined** e mensagem com o `name` correto |
| I19 | **Regressão direta do bug corrigido:** após `POST /box-bottoms`, verificar no banco que existe um registro correspondente em `role_user_box_bottoms` vinculando o criador como `OWNER` | Query direta ao banco confirma o vínculo — este é o teste que teria pego o bug do `declare` antes de ir para produção |
| I20 | Criar caixinha com `name` duplicado para o mesmo usuário | Erro `"Caixinha já existe para este usuário"`, nenhum registro novo criado |
| I21 | Criar caixinha e depois falhar a criação do vínculo de `OWNER` propositalmente (ex: banco sem a role `OWNER` seedada) | Definir comportamento esperado: **idealmente** o `BoxBottom` também deve ser revertido (requer transaction) — testar o estado atual e documentar se há inconsistência (registro órfão) |
| I22 | `GET /box-bottoms` retorna caixinhas onde o usuário é dono OU membro (`boxMembers`) | Confirma o `Op.or` do `getAllBoxBottomsByUser` |
| I23 | `GET /box-bottoms/:boxBottomId` de caixinha à qual o usuário não tem acesso | `403`/`404` |
| I24 | `PUT /box-bottoms/:boxBottomId` edita corretamente | Dados persistidos refletem a alteração |
| I25 | `DELETE /box-bottoms/:boxBottomId` remove a caixinha | Registro relacionado em `role_user_box_bottoms` também é tratado (cascade ou remoção explícita — validar) |
| I26 | `DELETE`/`PUT` de caixinha por usuário sem permissão (não-owner) | Bloqueado conforme `checkRole` |

### 4.6 `/transactions`

| # | Cenário | Resultado esperado |
|---|---|---|
| I27 | `POST /transactions/:boxBottomId/:categoryId` com dados válidos | `201`, transação vinculada corretamente aos IDs da URL |
| I28 | Criar transação para `boxBottomId` inexistente | `404`/`400` |
| I29 | Criar transação para `categoryId` inexistente | `404`/`400` |
| I30 | Criar transação em caixinha de outro usuário (sem permissão) | `403` |
| I31 | `movementType` inválido | `400` |
| I32 | `GET /transactions/:id` lista transações da caixinha corretamente | Retorno filtrado corretamente (validar se `:id` é `boxBottomId` — o README indica ambiguidade nesse ponto, ver seção 8) |
| I33 | `PUT`/`DELETE /transactions/:id` | Comportamento de edição/remoção validado |

### 4.7 `/roles` e `/role-user-box-bottoms`

| # | Cenário | Resultado esperado |
|---|---|---|
| I34 | `POST /roles/register` cria role nova | `201` |
| I35 | Criar role com `description` duplicada (campo `unique`) | Erro de constraint tratado corretamente pela API (não deve vazar erro cru do Postgres) |
| I36 | `POST /role-user-box-bottoms/register` com `userId`/`boxBottomId`/`roleId` válidos | `201` |
| I37 | Com algum dos três IDs inexistente | Erro `"Usuário, Caixa ou Função não encontrados"`, status mapeado corretamente pelo `catchAsync` (ver nota U38b sobre o mapeamento por substring) |
| I38 | `GET /role-user-box-bottoms` lista associações | — |
| I39 | `PUT`/`DELETE /role-user-box-bottom/:id` | — |

### 4.8 Integridade referencial / cascata

| # | Cenário | Resultado esperado |
|---|---|---|
| I40 | Remover um `User` que possui `BoxBottoms`, `Categories`, `RoleUserBoxBottoms` associados | Validar política definida nas migrations (`ON DELETE CASCADE`/`RESTRICT`) e que a API responde de forma controlada, sem erro 500 cru do banco |
| I41 | Remover uma `Category` referenciada por `Transactions` existentes | Mesmo ponto acima |
| I42 | Remover um `BoxBottom` referenciado por `Transactions`/`RoleUserBoxBottoms` | Mesmo ponto acima |

---

## 5. Testes E2E

Objetivo: validar fluxos completos do ponto de vista de um cliente real, com a aplicação totalmente de pé (Docker Compose de teste) e banco populado do zero a cada execução da suíte.

### 5.1 Fluxo principal: ciclo de vida completo de uma caixinha

| # | Fluxo | Passos |
|---|---|---|
| E1 | **Cadastro → Login → Criação de caixinha → Verificação de permissão de owner** | 1) `POST /users` 2) `POST /auth/login` 3) `POST /box-bottoms` 4) `GET /box-bottoms` confirma que a caixinha aparece para o criador 5) `GET /role-user-box-bottoms` confirma vínculo `OWNER` criado automaticamente |
| E2 | **Fluxo financeiro completo** | 1) Login 2) Criar categoria (`receita`) 3) Criar caixinha 4) Registrar transação de entrada 5) Criar categoria (`despesa`) 6) Registrar transação de saída 7) Consultar transações da caixinha e validar saldo/listagem |
| E3 | **Compartilhamento de caixinha entre usuários** | 1) Usuário A cria caixinha (vira `OWNER`) 2) Usuário A associa Usuário B via `role-user-box-bottoms` com role diferente (ex: `MEMBER`, se existir) 3) Usuário B faz login e consegue ver a caixinha em `GET /box-bottoms` 4) Validar que permissões de B (ex: não pode `DELETE` a caixinha) são respeitadas |
| E4 | **Isolamento entre usuários (segurança)** | 1) Usuário A cria caixinha, categoria e transação 2) Usuário B (sem vínculo) faz login e tenta acessar/editar/remover os recursos de A por ID direto → todas as tentativas devem ser bloqueadas (`403`/`404`) |
| E5 | **Tentativa de criar caixinha duplicada** | Criar duas vezes a mesma caixinha (mesmo nome, mesmo usuário) → segunda tentativa falha com mensagem clara, sem deixar registro órfão nem duplicado no banco |
| E6 | **Token expirado/inválido em qualquer rota protegida** | Usar token expirado ou adulterado em `/categories`, `/box-bottoms`, `/transactions`, `/role-user-box-bottoms` → todas retornam `401` |
| E7 | **Fluxo de erro em cascata (regressão do bug de `declare`)** | Cenário de ponta a ponta: criar caixinha via API real → confirmar via chamada HTTP subsequente (`GET /box-bottoms/:id`) que o `boxBottomId` retornado no `POST` é o mesmo objeto persistido, e que o vínculo de owner existe — fecha o ciclo completo do bug relatado nesta conversa, validado via HTTP puro, sem acesso direto ao banco |

### 5.2 Fluxos negativos / borda

| # | Cenário |
|---|---|
| E8 | Registro com payload malformado (JSON inválido, `Content-Type` incorreto) em cada rota `POST` |
| E9 | Rate/volume: criar múltiplas transações em sequência rápida e validar consistência (sem duplicidade de ID, sem deadlock) |
| E10 | Fluxo de recuperação: usuário exclui uma caixinha e tenta registrar transação nela em seguida → deve falhar corretamente |

---

## 6. Dados de Teste / Fixtures / Seeds

- **Seeds mínimos obrigatórios para o banco de teste:** roles `OWNER` (e demais roles do domínio, se existirem) devem estar sempre seedadas antes da suíte rodar — o bug relatado nesta conversa (`"Role OWNER não encontrada"`) reforça a importância de garantir isso via seeder automático no `beforeAll`, e não manualmente.
- **Factories sugeridas** (ex: com `@faker-js/faker`): `makeUser()`, `makeCategory(userId)`, `makeBoxBottom(userId)`, `makeTransaction(boxBottomId, categoryId)`, `makeRole(name)`.
- Nunca reutilizar dados entre arquivos de teste sem isolamento — preferir criar tudo do zero por teste (`beforeEach`) a depender de ordem de execução.

---

## 7. Ambiente e Execução

- Banco de teste isolado via `docker-compose.test.yml`, subindo um Postgres próprio (porta diferente da de desenvolvimento) para não conflitar nem arriscar rodar testes contra dados reais.
- Migrations aplicadas automaticamente antes da suíte (`npx sequelize-cli db:migrate --env test`).
- Pipeline sugerido (CI): `test:unit` (rápido, roda sempre) → `test:integration` → `test:e2e` (mais lento, pode rodar só em PRs para `main`/`develop` ou noturno).

---

## 8. Pontos em Aberto / Ambiguidades do README que Precisam de Definição Antes de Detalhar Alguns Testes

- `GET /transactions/:id` aparece duas vezes no README com descrições diferentes ("lista transações" e "obtém transação por ID"), sugerindo que o `:id` pode ora significar `boxBottomId`, ora `transactionId`. Recomendo confirmar com o time antes de escrever os testes de integração I32/I33 em definitivo.
- Regras de permissão por `role` (o que exatamente `OWNER` pode fazer vs. outras roles) não estão explícitas no README — os testes de `checkRole` (U33–U35) e de compartilhamento (E3) foram desenhados com base em suposições razoáveis e devem ser ajustados assim que as regras forem confirmadas.
- Política de cascata (`ON DELETE`) entre `User → BoxBottom → Transaction/RoleUserBoxBottom` não está documentada — necessária para fechar os testes I40–I42.

---

## 9. Resumo de Cobertura Alvo

| Camada | Meta de cobertura sugerida |
|---|---|
| Services (regras de negócio) | ≥ 90% |
| Controllers | ≥ 80% |
| Middlewares | 100% (poucos caminhos, todos críticos para segurança) |
| Rotas (integração) | Todos os endpoints listados no README com pelo menos 1 caminho feliz + 1 caminho de erro |
| E2E | Todos os fluxos de negócio principais (criação de caixinha, transações, compartilhamento, isolamento entre usuários) |
