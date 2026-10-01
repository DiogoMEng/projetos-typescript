# Relatório v5 — Testes E2E CaixaUp

## Resumo executivo

Foram implementados os dez fluxos E1–E10 do plano como jornadas HTTP completas, executadas contra Express em listener TCP efêmero e PostgreSQL real. A suíte final possui 3 arquivos e 10 testes; todos passaram. Foram necessários **4 ciclos de Fase 2 → Fase 3** para corrigir os bugs de runtime, o tratamento de JSON inválido, asserções numéricas e referências obsoletas após a mudança para permissions.

A migration de rename já existia no repositório, mas não estava aplicada no banco de teste recém-criado. Após aplicar todas as migrations, o schema real confirmou `permissions` (minúscula) e `permission_id`.

## Procedimento realizado

### Fase 1 — Análise

1. Lido integralmente `api/test/plano-de-testes-caixaup.md`; foram extraídos E1–E10: ciclo de caixinha, fluxo financeiro, compartilhamento, isolamento, duplicidade, token inválido/expirado, regressão HTTP OWNER, payload malformado, volume de transações e operação após exclusão.
2. Lidas as regras `rules/arquitetura_padroes_projeto.md` e `rules/guia_completo_testes.md`: estrutura E2E, nomes explícitos, factories/helpers, TypeScript, isolamento, teardown, Clean Code e padrão de formatação/lint.
3. Revisadas as suítes unitária e de integração existentes. A integração cobria endpoints individualmente, mas não fluxos completos de cliente HTTP; E2E estava vazio.
4. Verificadas migrations, models, rotas, controllers, services, middlewares e ambiente de teste. Inicialmente as 15 migrations estavam `down`; foram aplicadas apenas no PostgreSQL descartável em `localhost:5433`.
5. Confirmado no catálogo PostgreSQL que a tabela é `permissions`, com PK `permission_id`, FKs para usuários, caixas e roles e cascatas. As rotas atuais ficam sob `/permissions`, não `/role-user-box-bottoms`.
6. O plano usava nomes/caminhos antigos e o backend ainda tinha referências ao registry/tabela antigos, além de um model configurado como `Permissions` (maiúsculo), incompatível com a tabela PostgreSQL minúscula.

### Fase 2 — Implementação e ciclos de correção

1. Implementados primeiro setup HTTP real, limpeza do DB e E1. O fluxo inicial reproduziu falha de inicialização no Sequelize por associações apontando para `models.Permission` em vez de `models.Permissions`.
2. Corrigido o registry das associações; E1 então revelou que o model consultava a tabela PostgreSQL como `"Permissions"`, inexistente. Alinhados nome físico `permissions`, chave de atributo `permissionId` e consumidores. E1 passou.
3. E8 reproduziu resposta 500 para JSON sintaticamente inválido, pois o error handler descartava `entity.parse.failed` do body-parser. O middleware passou a responder 400 controlado. E8 focal passou.
4. A execução completa apontou E2/E9 acumulando strings porque PostgreSQL entrega `DECIMAL` como string; os testes passaram a converter valores para número antes do saldo. E2/E9 e, em seguida, E1–E10 passaram.
5. A regressão de integração encontrou referências antigas em helpers e casos existentes. Atualizados para `DB.Permissions`, tabela `permissions`, `/permissions/...` e `permissionId`; ajustadas também as unitárias que mockavam o registry antigo. Integração e unitários passaram.
6. Removida a chamada fire-and-forget `sequelize.authenticate()` durante o import de `models/index.ts`. O bootstrap de produção (`server.ts`) mantém autenticação antes do `listen`; setups de teste autenticam explicitamente. Isso elimina a corrida de query/conexão causada pela importação.

A decisão foi importar o `app` real e iniciar `app.listen(0)` em cada arquivo E2E. Assim os testes passam pelo socket HTTP e pelo pipeline completo sem ocupar porta fixa nem iniciar outro processo da API. O DB é serial e limpo por teste com `TRUNCATE ... CASCADE`, recriando roles mínimas; migrations rodam uma vez no `globalSetup` existente.

## Fluxos E2E implementados

| Cenário                                                           | Arquivo                                      | Cobertura do fluxo                                                                                    |
| ----------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| E1 — Cadastro → login → criar caixinha → listar → confirmar OWNER | `api/test/e2e/caixaup.e2e.test.ts`           | POST users, login, POST/GET box-bottoms e GET permissions; ID e role verificados por HTTP.            |
| E2 — Fluxo financeiro completo                                    | `api/test/e2e/caixaup.e2e.test.ts`           | Categoria receita, caixa, inflow, categoria despesa, outflow, consulta e saldo 75.                    |
| E3 — Compartilhamento entre usuários                              | `api/test/e2e/caixaup.e2e.test.ts`           | Usuários A/B, role VIEWER via `/permissions`, listagem por B e DELETE negado.                         |
| E4 — Isolamento de recursos por ID                                | `api/test/e2e/caixaup.e2e.test.ts`           | GET/PUT/DELETE de caixa, categoria e transação por usuário sem vínculo; todos bloqueados.             |
| E5 — Caixinha duplicada                                           | `api/test/e2e/recovery-security.e2e.test.ts` | Segunda criação retorna 409; uma caixa e somente a permission OWNER permanecem.                       |
| E6 — Token expirado/adulterado                                    | `api/test/e2e/recovery-security.e2e.test.ts` | Ambos os tokens dão 401 em categories, box-bottoms, transactions e permissions.                       |
| E7 — Regressão ID/OWNER via HTTP                                  | `api/test/e2e/recovery-security.e2e.test.ts` | POST seguido de GET da caixa e GET de permission; ID e OWNER coincidem sem consulta direta ao DB.     |
| E8 — JSON inválido e Content-Type incorreto                       | `api/test/e2e/negative-flows.e2e.test.ts`    | Duas variantes testadas em cada uma das sete rotas POST reais. JSON inválido 400; tipo incorreto 422. |
| E9 — Volume sequencial                                            | `api/test/e2e/negative-flows.e2e.test.ts`    | 12 transações HTTP sequenciais, IDs únicos, 12 rows, listagem e saldo 42.                             |
| E10 — Transação após exclusão da caixa                            | `api/test/e2e/negative-flows.e2e.test.ts`    | Delete de caixa 200; POST posterior negado 403 e zero transações persistidas.                         |

Helpers compartilhados de conta, login, autorização e criação de recursos ficam em `api/test/e2e/helpers/client.ts`; setup de banco em `api/test/e2e/helpers/database.ts` e configuração de logging em `api/test/e2e/setup.ts`.

## Erros identificados

### Erros nos testes, corrigidos nos próprios testes

- E2/E9 somavam valores DECIMAL serializados como strings; conversão com `Number()` tornou saldo e volume assertáveis sem alterar o contrato da API.
- O banco PostgreSQL estava vazio no início do diagnóstico; o ambiente descartável foi iniciado e as migrations aplicadas antes dos fluxos.

### Bugs reais de backend, corrigidos

- Associações User/BoxBottom/Role referiam `models.Permission`, embora o registry exponha `Permissions`; isso impedia Sequelize de inicializar.
- Model Permission usava `tableName: 'Permissions'`, mas a migration produziu `permissions`; também havia divergência de PK de `PermissionId`/`roleUserBoxBottomId` versus `permission_id`/`permissionId`.
- `BoxBottom.service` e `checkRole` ainda consultavam `DB.RoleUserBoxBottoms`, inexistente no registry após a migração.
- A rota de DELETE declarava `:permissionId`, mas schema/controller ainda liam `roleUserBoxBottomId`; alinhados à PK atual.
- O error handler tratava `SyntaxError` do body-parser como 500 genérico embora o parser marcasse `entity.parse.failed` com status 400. Agora retorna 400 e mensagem controlada `JSON inválido`.
- A autenticação Sequelize disparada sem await durante import do model registry criava query/handle concorrente com o teardown. A conexão fica sob responsabilidade do bootstrap do servidor/setup de testes.
- Atualizados os helpers/testes unitários e de integração que usavam tabela, registry, serviço ou rotas antigas.

## Correções aplicadas no backend

- `api/src/database/models/index.ts`, `User.model.ts`, `BoxBottom.model.ts`, `Role.model.ts`, `permission.ts` e `permission.interface.ts`: registry e associações usam `Permissions`; tabela física minúscula e PK `permissionId` mapeada em `permission_id`; removida autenticação implícita na importação.
- `api/src/services/BoxBottom.service.ts`, `Permission.service.ts` e `api/src/middlewares/checkRole.ts`: consultas e associações usam o model atualizado; services passaram a tipar o modelo de domínio; autorização mantém os mesmos códigos/roles.
- `api/src/controllers/Permission.controller.ts`, `api/src/routes/permission.route.ts` e `api/src/validations/RoleUserBoxBottom.validation.ts`: DELETE usa `permissionId` de ponta a ponta e os endpoints reais sob `/permissions`.
- `api/src/middlewares/errorHandler.ts`: parse failure JSON agora tem resposta 400 controlada.
- `api/src/server.ts` continua autenticando antes de abrir listener; nenhum fluxo de produção foi substituído por setup de teste.

## Resultado final da suíte E2E

- **3 suites, 10/10 testes passando** em execução final completa.
- Integração de regressão: **8 suites, 60/60 testes passando**, cobertura Istanbul 99,47% statements, 94,36% branches, 99,08% functions e 99,45% lines; threshold 98/90/98/98 aprovado.
- Unitários: **7 suites, 43/43 testes passando**.
- TypeScript e Prettier aprovados. ESLint nos arquivos E2E/integração e serviços/middlewares tocados não teve erros; resta apenas warning existente de `console.error` no error handler.
- Relatório de resultados E2E: `api/coverage/e2e/results/index.html`; relatório de integração permanece em `api/coverage/integration/results/index.html`. Ambos ficam sob `api/coverage/`, ignorado pelo Git.
- Avisos não bloqueantes observados: Node considera experimental `--experimental-vm-modules`; `pg` emite depreciação sobre chamadas `client.query()` concorrentes durante autenticação.

## Checklist E1-E10

| Item do plano                          | Status final | Arquivo de teste                | Observação                                                          |
| -------------------------------------- | ------------ | ------------------------------- | ------------------------------------------------------------------- |
| E1 — Cadastro, login, caixinha e owner | ✅ Passando   | `caixaup.e2e.test.ts`           | Fluxo HTTP completo; verifica o OWNER por `/permissions`.           |
| E2 — Fluxo financeiro entrada/saída    | ✅ Passando   | `caixaup.e2e.test.ts`           | Saldo calculado a partir da listagem real da caixa.                 |
| E3 — Compartilhamento                  | ✅ Passando   | `caixaup.e2e.test.ts`           | Usa tabela/model/rota atual `permissions`; Viewer não pode deletar. |
| E4 — Isolamento entre usuários         | ✅ Passando   | `caixaup.e2e.test.ts`           | Nove tentativas de leitura/escrita/removal bloqueadas.              |
| E5 — Duplicidade de caixinha           | ✅ Passando   | `recovery-security.e2e.test.ts` | Sem duplicata e sem permission órfã.                                |
| E6 — Tokens expirado/adulterado        | ✅ Passando   | `recovery-security.e2e.test.ts` | Quatro módulos × duas classes de token inválido.                    |
| E7 — Regressão HTTP do ID/OWNER        | ✅ Passando   | `recovery-security.e2e.test.ts` | Validado só com requisições HTTP.                                   |
| E8 — Payload malformado                | ✅ Passando   | `negative-flows.e2e.test.ts`    | JSON malformado e Content-Type incorreto nas sete rotas POST.       |
| E9 — Volume transacional               | ✅ Passando   | `negative-flows.e2e.test.ts`    | 12 transações, IDs únicos e saldo consistente.                      |
| E10 — Operação após exclusão           | ✅ Passando   | `negative-flows.e2e.test.ts`    | Transação rejeitada após delete; não persiste.                      |

**Cobertura de cenários E2E do plano: 100% (10 de 10 implementados e passando).**
