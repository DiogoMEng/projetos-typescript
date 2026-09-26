# Relatório v4 — Refatoração da suíte de integração CaixaUp

## Resumo executivo

A suíte de integração foi refatorada em configuração, execução e visualização. O baseline foi medido antes das alterações, e a suíte final cobre os 42 itens I1-I42 do plano, além de 18 testes/casos de borda complementares: passou de 42 para 60 testes e de 6 para 8 arquivos.

| Métrica | Baseline | Resultado final | Threshold configurado |
| --- | ---: | ---: | ---: |
| Statements | 90,37% | **99,73%** (373/374) | 98% |
| Branches | 61,76% | **95,58%** (65/68) | 90% |
| Functions | 90,83% | **99,08%** (108/109) | 98% |
| Lines | 90,58% | **99,72%** (360/361) | 98% |

O baseline terminou em 18,8 s com 42 testes. As duas execuções finais terminaram em 11,75 s e 12,78 s (média **12,27 s**) com 60 testes — redução de aproximadamente 35% apesar do aumento de 18 testes. Todas as 8 suítes passaram em ambas as rodadas. Nenhuma regressão foi detectada.

## Procedimento realizado

### Fase 1 — Análise inicial

1. Leitura integral de `api/test/plano-de-testes-caixaup.md`; foram extraídos todos os cenários I1-I42.
2. Leitura das regras `rules/arquitetura_padroes_projeto.md` e `rules/guia_completo_testes.md`, incluindo nomenclatura, Clean Code, tipos, isolamento, estrutura, limite de arquivo e cobertura mínima de integração de 80% statements/75% branches/80% functions/80% lines.
3. Análise de migrations, models, associações, FKs/cascatas, seeders, rotas, controllers, services, middlewares e testes existentes.
4. Execução da suíte preexistente com cobertura antes da edição: 6 suites/42 testes, 18,8 s, com migrations CLI disparadas em cada arquivo.
5. A baseline de produção foi calculada apenas sobre `src` (sem helpers de teste): 90,37/61,76/90,83/90,58% para statements/branches/functions/lines. O ponto mais fraco era branches.
6. Lacunas destacadas pela baseline: controllers (85,04/53,84/89,47/84,76), errors (83,33/14,28/71,42/83,33), middlewares (89,13/80/100/88,37), services (89/67,85/94,44/90,21) e validations (96,77/100/50/96,77). Routes e models já tinham statements/lines integrais, mas parte dos branches do registry de models não era exercitada.
7. Divergência confirmada em I35: a migration de roles não cria constraint única para `description`, apesar da declaração `unique` no model; o service verifica duplicidade por `name`, não por description.

### Fase 2 — Desenvolvimento

- Extraída a composição HTTP para `api/src/app.ts`, permitindo importar o Express real sem iniciar `listen`.
- Criado `api/test/integration/globalSetup.cjs`; `sequelize-cli db:migrate` é invocado uma vez por execução Jest, não uma vez por arquivo.
- Hooks mantêm conexão, truncagem `CASCADE` e reseed de roles por teste. A limpeza por `TRUNCATE` compartilha um único banco, portanto o Jest é serial (`maxWorkers: 1`) para eliminar corridas entre suites.
- Criados testes de serviços/bordas com banco real, sem mocks de model/Sequelize; os casos diretos de controller cobrem somente branches não alcançáveis pelas rotas Joi.
- Refatorados scripts e configuração para ativar setup, cobertura e reporter somente no perfil de integração; scripts unitários não passam a depender do PostgreSQL.
- Harmonizadas as configurações conflitantes: Prettier agora usa aspas simples, conforme a regra ESLint do repositório; ESLint também reconhece arquivos `.cjs` para aplicar globals Node/CommonJS ao global setup.
- Formatados os testes/configuração com Prettier; lint, typecheck e Prettier passam.

## Refatoração de configuração

Em `api/jest.config.ts`:

- `collectCoverageFrom` aponta para `src/**/*.ts`, excluindo declarações/tipos, interfaces, migrations, seeders, configuração CLI do Sequelize e `src/server.ts`.
- `src/server.ts` é excluído porque inicializa conexão/listener de processo e não participa do contrato testado via Supertest; `app.ts` e o pipeline Express permanecem integralmente cobertos.
- `coverageReporters`: `text`, `text-summary`, `html`, `lcov`, `json` e `json-summary`.
- Threshold global: 98% statements, 90% branches, 98% functions, 98% lines. O gate foi aprovado nas duas execuções finais.
- `moduleNameMapper` preserva aliases `#...` e mapeia imports ESM relativos `.js` para TypeScript.
- Configuração de integração é condicional a `CAIXAUP_INTEGRATION=true`, evitando que a suíte unitária execute migrations ou exija banco.
- `.prettierrc.json` passou a usar `singleQuote: true`, alinhando Prettier às aspas simples já exigidas por ESLint; o padrão ESLint para JavaScript também passou a reconhecer `*.cjs` (global setup).

Scripts em `api/package.json`:

- `test:integration`: suíte serial com cobertura habilitada pela configuração.
- `test:integration:coverage`: atalho explícito para a mesma execução com os relatórios.
- `test:integration:watch`: modo watch serial com o ambiente de teste.
- `test:int:all`: alias retrocompatível para `test:integration`.

## Refatoração de execução

A escolha foi **execução serial**, não paralela. Todas as suites apontam para o mesmo Postgres e executam `TRUNCATE ... CASCADE`; workers paralelos poderiam truncar dados pertencentes a outro teste. O `maxWorkers: 1` é ativado somente no perfil de integração.

`globalSetup` executa as migrations uma única vez antes dos workers. `prepareDatabase()` agora somente valida `NODE_ENV=test` e autentica; `beforeEach` limpa e recria as seis roles. `afterAll` fecha Sequelize. Essa separação removeu cinco chamadas repetidas à CLI por suite-run, preservando isolamento entre testes.

Comparativo observado:

- Antes: 6 arquivos, migrations CLI repetidas por arquivo, 42 testes, 18,8 s.
- Depois: 8 arquivos, uma chamada global à CLI, 60 testes, 11,75 s e 12,78 s.

## Visualização de resultados implementada

- Cobertura HTML Istanbul: `api/coverage/integration/index.html`.
- LCOV: `api/coverage/integration/lcov.info`.
- Resultado legível de execução: `api/coverage/integration/results/index.html`.
- JSON para inspeção/CI: `api/coverage/integration/coverage-final.json` e `coverage-summary.json`.
- A pasta `api/coverage/` está excluída por `api/.gitignore`; os artefatos não são versionados.
- Foi adicionada a dependência de desenvolvimento `jest-html-reporters` (^3.1.7) para relatório HTML de pass/fail e mensagens de falha, complementar ao HTML de cobertura.

## Testes adicionados/refatorados e cobertura por módulo

Os cenários I1-I42 foram mantidos e ampliados com testes de tokens expirados/adulterados em rotas protegidas, falhas de middleware, queries por usuário, duplicidades, serviços com banco real, transactions e branches genéricas de controller/error handler.

| Módulo de produção | Baseline S/B/F/L | Final S/B/F/L | Ganho principal |
| --- | --- | --- | --- |
| App/HTTP Express | 87,50/100/0/87,50 | 100/100/100/100 | rota não encontrada e composição `app` |
| Controllers | 85,04/53,84/89,47/84,76 | 99,06/100/97,36/99,04 | defaults e branches não encontrado; categoria própria e falhas de associação |
| Models | 100/66,66/100/100 | 100/66,66/100/100 | cascatas, associações e persistência real; branch restante no registry de associações |
| Errors | 83,33/14,28/71,42/83,33 | 100/100/100/100 | todos os construtores e error handler genérico |
| Middlewares | 89,13/80/100/88,37 | 100/93,33/100/100 | token ausente, malformado, expirado, assinado errado e erro real no `checkRole` |
| Routes | 100/100/100/100 | 100/100/100/100 | endpoints felizes, erros e 404 |
| Services | 89/67,85/94,44/90,21 | 100/100/100/100 | branches de validação, transaction/rollback, persistência e cascata |
| Validations | 96,77/100/50/96,77 | 100/100/100/100 | alvo body default e ObjectId/UUID |
| Utils | 100/100/100/100 | 100/100/100/100 | `catchAsync` exercitado pelos endpoints reais |

S/B/F/L = statements/branches/functions/lines. Cobertura por arquivo também está navegável no HTML.

## Erros e divergências identificados

- **I35 / migration de roles:** uma role com nome diferente e `description` igual a OWNER é aceita (`201`); consulta direta confirma duas rows. A migration não definiu UNIQUE em `description`, e a validação do service olha apenas `name`. O teste caracteriza a divergência sem corrigir backend.
- **I5:** a senha é persistida como hash bcrypt, mas o endpoint de cadastro também devolve esse hash no corpo. I8 confirma que `GET /users` já exclui `password`.
- **I2:** email inexistente retorna `404` com mensagem específica, divergindo do objetivo de não revelar existência do usuário.
- **I4, I7, I14 e I31:** validações Joi retornam `422`, enquanto o plano exemplifica `400`.
- **I28:** box inexistente retorna `403` porque `checkRole` roda antes da consulta do service e bloqueia o usuário; não chega ao 404 do service.
- **I27/I32:** os caminhos reais usam `/transactions/box-bottom/:boxBottomId/category/:categoryId` e `/transactions/box-bottom/:boxBottomId`, respectivamente; a consulta de I32 agora filtra pelo box e passa.
- **I21:** comportamento atual já é transacional: sem role OWNER a criação retorna erro e a caixinha é revertida; teste verifica zero registro órfão.
- Avisos não bloqueantes: Node avisa que `--experimental-vm-modules` é experimental; `pg` reporta depreciação de `client.query()` durante autenticação concorrente iniciada no import do model registry. As execuções permanecem verdes.
- `npm install` reportou 13 vulnerabilidades no grafo total de dependências (2 low, 7 moderate, 4 high); não foi feita atualização automática fora de escopo.

## Itens não atingidos

O threshold foi alcançado. Permanecem 1 statement/function e 3 branch outcomes não exercitados, por serem comportamentos fora do fluxo HTTP de integração ou inalcançáveis após guardas:

1. `CategoryController.getParamIdName()` é um getter protegido não chamado porque o controller substitui `getById()` e fornece o próprio param diretamente.
2. `config/index.ts` tem a alternativa `NODE_ENV` ausente (`development`); toda execução de integração define obrigatoriamente `NODE_ENV=test`.
3. `models/index.ts` mantém um branch para membros do objeto DB que não possuem `associate`; os modelos reais testados possuem associação declarada.
4. `checkRole.ts` contém fallback `userPermissions || []` após um guard que já retorna quando `userPermissions` não existe; esse fallback é inalcançável sem adulterar/mocar o retorno do model.

Essas lacunas correspondem ao delta entre o resultado e 100%; não são cenários I1-I42 pendentes. A suíte alcança 100% de statements/branches/functions/lines em Services, Routes, Errors, Validations e Utils.

## Resultado final

- **8 suites**, **60 testes**, todos passando em duas execuções consecutivas.
- Cobertura final: **99,73% statements; 95,58% branches; 99,08% functions; 99,72% lines**.
- Threshold: 98/90/98/98, aprovado.
- Tempos: 11,75 s e 12,78 s; média 12,27 s. Baseline: 18,8 s para 42 testes.
- Regressões: zero falhas nas duas execuções finais.
- Typecheck (`tsc --noEmit --project tsconfig.test.json`), ESLint (`eslint jest.config.ts test/integration`) e `prettier --check jest.config.ts test/integration .prettierrc.json` passam. A suíte unitária também passou: 7 suites/43 testes.

## Checklist de cobertura do plano I1-I42

| Item | Status final | Cobertura do módulo | Arquivo | Observação |
| --- | --- | --- | --- | --- |
| I1 — Login com credenciais válidas | ✅ Passando | Auth/controller 100%; services 100% | `auth-users.integration.test.ts` | JWT verificado e decodificado; resposta usa `accessToken`. |
| I2 — Email inexistente no login | ✅ Passando, divergência | Auth 100% | `auth-users.integration.test.ts` | Retorna 404 e revela que o usuário não existe. |
| I3 — Senha incorreta | ✅ Passando | Auth 100% | `auth-users.integration.test.ts` | Status real 401. |
| I4 — Body de login inválido | ✅ Passando, divergência | Auth/validation 100% | `auth-users.integration.test.ts` | Joi responde 422 em vez do 400 sugerido. |
| I5 — Cadastro e hash bcrypt | ✅ Passando, divergência | User service 100%; controllers 99,06% | `auth-users.integration.test.ts` | Hash verificado em DB e na resposta; hash é exposto pelo POST. |
| I6 — Email duplicado | ✅ Passando | User service 100% | `auth-users.integration.test.ts` | 409 e apenas um registro persistido. |
| I7 — Campos de usuário ausentes | ✅ Passando, divergência | User validation 100% | `auth-users.integration.test.ts` | Resposta Joi real 422. |
| I8 — GET users sem password | ✅ Passando | User service/controller 100% | `auth-users.integration.test.ts` | Cada item não contém `password`. |
| I9 — GET usuário por ID inexistente | ✅ Passando | User service/controller 100% | `auth-users.integration.test.ts` | UUID válido inexistente retorna 404; busca de UUID existente é coberta em teste complementar. |
| I10 — PUT usuário | ✅ Passando | User service/controller 100% | `auth-users.integration.test.ts` | Persistência confirmada. |
| I11 — DELETE usuário | ✅ Passando | User service/controller 100% | `auth-users.integration.test.ts` | Registro ausente após resposta 200. |
| I12 — Categoria sem token | ✅ Passando | Auth middleware 100% | `categories.integration.test.ts` | 401. |
| I13 — Criar categoria com token | ✅ Passando | Category service 100% | `categories.integration.test.ts` | `userId` vem do token. |
| I14 — Tipo de categoria inválido | ✅ Passando, divergência | Category validation/service 100% | `categories.integration.test.ts`; `services.integration.test.ts` | HTTP 422; service também exercitado diretamente com DB real. |
| I15 — Listagem isolada | ✅ Passando | Category service 100% | `categories.integration.test.ts` | Outra conta não aparece. |
| I16 — GET categoria de outro usuário | ✅ Passando | Category controller 95,23% S / 100% B | `categories.integration.test.ts` | Dono recebe 200; outro usuário recebe 404. |
| I17 — PUT/DELETE categoria alheia | ✅ Passando | Category service 100% | `categories.integration.test.ts` | Não dono recebe 404; dono altera e remove. |
| I18 — Criar caixinha | ✅ Passando | BoxBottom controller/service 100% | `boxBottoms.integration.test.ts` | 201, ID e nome corretos. |
| I19 — Associação OWNER | ✅ Passando | BoxBottom/RUBB services 100% | `boxBottoms.integration.test.ts` | Query direta confirma relação OWNER. |
| I20 — Caixinha duplicada | ✅ Passando | BoxBottom service 100% | `boxBottoms.integration.test.ts` | 409, sem nova row. |
| I21 — Falha ao vincular OWNER | ✅ Passando | BoxBottom service 100% | `boxBottoms.integration.test.ts` | Transaction reverte a caixinha; não deixa órfã. |
| I22 — Dono ou membro vê caixa | ✅ Passando | BoxBottom service 100% | `boxBottoms.integration.test.ts` | Owner/membro e ausência antes da associação verificados. |
| I23 — Acesso sem vínculo | ✅ Passando | `checkRole` 85,71% branches | `boxBottoms.integration.test.ts` | Resposta real 403. |
| I24 — PUT caixinha | ✅ Passando | BoxBottom controller/service 100% | `boxBottoms.integration.test.ts` | Owner edita e DB reflete alteração. |
| I25 — DELETE caixinha/cascade | ✅ Passando | BoxBottom service/model 100% | `boxBottoms.integration.test.ts` | Associação removida por cascata. |
| I26 — Escrita sem role suficiente | ✅ Passando | `checkRole` 85,71% branches | `boxBottoms.integration.test.ts` | Viewer não edita nem remove. |
| I27 — POST transação com IDs da URL | ✅ Passando | Transaction controller/service 100% | `transactions.integration.test.ts` | IDs persistidos correspondem aos params reais. |
| I28 — Box inexistente | ✅ Passando, divergência | Transaction/checkRole 100% statements | `transactions.integration.test.ts` | `checkRole` retorna 403 antes do service (não 404). |
| I29 — Categoria inexistente | ✅ Passando | Transaction service 100% | `transactions.integration.test.ts` | 404. |
| I30 — Caixa de outro usuário | ✅ Passando | Transaction/checkRole | `transactions.integration.test.ts` | 403. |
| I31 — movementType inválido | ✅ Passando, divergência | Transaction service/validation 100% | `transactions.integration.test.ts`; `services.integration.test.ts` | HTTP 422; validação de serviço também testada com banco real. |
| I32 — Listar transações por caixa | ✅ Passando | Transaction controller/service 100% | `transactions.integration.test.ts` | Endpoint real `/transactions/box-bottom/:boxBottomId`; filtro por caixa verificado. |
| I33 — PUT/DELETE transação | ✅ Passando | Transaction controller/service 100% | `transactions.integration.test.ts` | Atualização e remoção confirmadas no DB. |
| I34 — POST nova role | ✅ Passando | Role service/controller 100% | `roles.integration.test.ts` | Criação responde 201. |
| I35 — Description duplicada | ⚠️ Divergência caracterizada, teste passando | Role service 100% após teste complementar | `roles.integration.test.ts` | Nova role com outro nome e descrição OWNER é aceita; migration sem UNIQUE. |
| I36 — Associação válida | ✅ Passando | RUBB controller/service 100% | `roles.integration.test.ts` | Owner associa membro no caminho real. |
| I37 — ID de associação inexistente | ✅ Passando | RUBB service 100% | `roles.integration.test.ts`; `services.integration.test.ts` | Missing user/box/role exercitados; API retorna 404. |
| I38 — GET associações | ✅ Passando | RUBB service/controller 100% | `roles.integration.test.ts` | Lista inclui vínculo OWNER. |
| I39 — PUT/DELETE associação | ✅ Passando | RUBB service/controller 100% | `roles.integration.test.ts`; `error-paths.integration.test.ts` | Update/delete reais; atualização de membro inexistente retorna 404. |
| I40 — DELETE user com recursos | ✅ Passando | User/service/models 100% statements | `cascades.integration.test.ts` | API remove user, caixa, categoria, transaction e associação OWNER. |
| I41 — DELETE category referenciada | ✅ Passando | Category service/model 100% | `cascades.integration.test.ts` | DELETE HTTP do dono remove transaction por cascade. |
| I42 — DELETE box referenciada | ✅ Passando | BoxBottom service/model 100% | `cascades.integration.test.ts` | DELETE HTTP do owner remove transaction e associação. |

**Cobertura funcional dos itens I1-I42: 100% (todos exercitados).** I35 é o único caso em que o teste passa ao registrar explicitamente uma divergência do comportamento esperado; não há cenário omitido.
