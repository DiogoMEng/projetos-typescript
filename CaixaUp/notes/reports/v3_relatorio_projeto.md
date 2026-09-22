# v3 Relatório do Projeto CaixaUp

## 1. Resumo executivo

A análise da suíte de integração identificou que todos os 42 testes existentes passavam literalmente, mas vários deles estavam escritos para confirmar bugs conhecidos com descrições como `demonstra que ... não é bloqueado`. Esses testes foram tratados como expectativas incorretas e alinhados ao comportamento definido no plano.

Foram corrigidos bugs de autorização, exposição de credenciais, parâmetros de rota, filtro de transações, criação de roles e consistência transacional na criação de caixinhas.

- Suíte inicial: 6 suítes, 42 testes passando, porém 11 cenários afirmavam comportamento defeituoso.
- Cenários corrigidos no backend: 11.
- Testes de integração ajustados: 11.
- Ciclos Fase 2 -> Fase 3: 2 ciclos de correção funcional, além de uma rodada final de compatibilidade unitária.
- Resultado final: 6 suítes, 42 testes passando, 0 falhas.
- Regressão unitária final: 7 suítes, 43 testes passando, 0 falhas.

## 2. Procedimento realizado

### Fase 1 — Análise

1. Leitura integral de `api/test/plano-de-testes-caixaup.md`, com foco nas seções de integração, cascata, setup e ambiguidades de rotas.
2. Leitura das regras em `rules/arquitetura_padroes_projeto.md` e `rules/guia_completo_testes.md`.
3. Verificação do banco real:
   - migrations de usuários, categorias, caixinhas, transações, roles e vínculos;
   - models Sequelize, mapeamentos `field`, atributos declarados, associações e `onDelete: CASCADE`;
   - hooks de preparação da base e seed lógico de roles OWNER, MANAGER, EDITOR, CONTRIBUTOR, ANALYST e VIEWER.
4. Verificação do backend:
   - controllers e service base;
   - rotas e validações Joi;
   - `checkAuth`, `checkRole`, tratamento de erros e utilitários;
   - fluxo de criação de caixinha e associação automática OWNER.
5. Execução inicial da suíte de integração:
   - `npm run test:int:all -- --runInBand`
   - resultado literal inicial: 6 suítes e 42 testes verdes.
6. Investigação dos testes que documentavam bugs como se fossem o comportamento esperado. Foram identificadas falhas reais em 11 cenários, apesar do status verde da suíte inicial.

### Fase 2 — Desenvolvimento

1. Corrigidos contratos de usuários, categorias, transações, roles e caixinhas.
2. Atualizados os testes que estavam desatualizados ou deliberadamente verificavam comportamento defeituoso.
3. Após a primeira rodada, a criação de caixinha falhou porque os hooks consultavam o banco fora da transação e não enxergavam o registro ainda não confirmado.
4. A transação foi propagada para `beforeCreate`, `afterCreate`, consultas de validação e criação do vínculo OWNER.
5. A suíte de integração foi executada novamente até atingir 42/42.
6. A suíte unitária revelou chamadas com opções vazias nos mocks; o service foi ajustado para só enviar opções quando há transação ativa.
7. Unitários, typecheck e integração foram executados novamente.

## 3. Erros e bugs identificados

| Teste         | Sintoma inicial                                                   | Causa raiz                                                                                                                        |
| ------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| I8            | `GET /users` expunha `password`                                   | O controller usava `Service.getAll()` genérico, sem exclusão do atributo sensível                                                 |
| I9            | UUID válido era rejeitado e o parâmetro não chegava ao controller | A rota usava validação hexadecimal de 24 caracteres e parâmetro `:id`, enquanto o domínio usa UUID e o controller espera `userId` |
| I10           | Atualização com UUID era rejeitada                                | Mesmo mapeamento incorreto de parâmetro/validação de usuário                                                                      |
| I11           | Exclusão com UUID era rejeitada                                   | Mesmo mapeamento incorreto de parâmetro/validação de usuário                                                                      |
| I16           | Usuário conseguia ler categoria de outro usuário                  | `CategoryController` delegava para `getById()` sem filtrar por `userId`                                                           |
| I17           | Usuário conseguia editar e excluir categoria de outro usuário     | `update()` e `delete()` genéricos filtravam somente pela chave da categoria                                                       |
| I21           | Caixinha órfã permanecia quando OWNER não existia                 | Criação da caixinha e criação do vínculo OWNER não compartilhavam uma transação                                                   |
| I32           | Listagem exigia `categoryId` inexistente na URL                   | A rota GET reutilizava o schema de parâmetros do POST                                                                             |
| I34           | `POST /roles/register` retornava 404                              | A rota de criação de roles não existia                                                                                            |
| I35           | A API não oferecia criação/erro controlado de role duplicada      | Faltava endpoint público de criação e validação de payload; a regra de nome duplicado existia apenas no service                   |
| I9 individual | Usuário era retornado com senha hash                              | A consulta individual também usava o método genérico sem exclusão de `password`                                                   |

## 4. Correções e refatorações aplicadas

### Service e transações

Arquivos: `api/src/services/Service.ts`, `api/src/interfaces/Service.interface.ts`, `api/src/services/BoxBottom.service.ts`, `api/src/services/RoleUserBoxBottom.service.ts`.

- `Service.create()` passou a aceitar opções transacionais e propagá-las aos hooks.
- `BoxBottomService.create()` abriu uma transação quando chamado pelo endpoint, confirmou somente após a criação do vínculo OWNER e executou rollback em qualquer falha.
- Consultas de validação de usuário, caixa, role e permissão passaram a usar o mesmo contexto transacional.
- Chamadas sem transação continuam com a assinatura original, evitando argumentos vazios e preservando compatibilidade com os services e mocks existentes.

Essa é uma refatoração estrutural pequena, necessária para corrigir a inconsistência de dados do I21. Ela segue as regras de tratamento explícito de erros, responsabilidade única e uso de abstração compartilhada na classe base.

### Usuários

Arquivos: `api/src/routes/user.route.ts`, `api/src/services/User.service.ts`, `api/src/controllers/User.controller.ts`.

- Rotas de usuário passaram de `:id` com validação hexadecimal para `:userId` com UUID.
- Listagens usam atributos excluindo `password`.
- Consultas individuais também excluem `password`.

A alteração foi pontual no contrato de rota e consistente com o schema real dos models.

### Categorias

Arquivos: `api/src/services/Category.service.ts`, `api/src/controllers/Category.controller.ts`.

- Adicionados métodos de busca, edição e exclusão filtrados por `categoryId` e `userId`.
- O controller passou a usar esses métodos nas rotas protegidas.
- Usuários sem posse da categoria recebem 404, sem revelar existência do recurso.

A lógica ficou na camada de service, mantendo a separação Controller/Service definida pelas regras do projeto.

### Transações

Arquivos: `api/src/validations/Transaction.validation.ts`, `api/src/routes/transaction.route.ts`, `api/src/services/Transaction.service.ts`, `api/src/controllers/Transaction.controller.ts`.

- Criado schema específico para GET por `boxBottomId`.
- Criado `getAllTransactionsByBox()` para filtrar pelo identificador da caixinha.
- O controller passou a utilizar esse filtro na listagem.

Essa correção resolve a ambiguidade do README escolhendo o comportamento usado pelo endpoint real: `GET /transactions/box-bottom/:boxBottomId` lista transações da caixinha.

### Roles

Arquivos: `api/src/routes/role.route.ts`, `api/src/validations/Role.validation.ts`.

- Adicionado `POST /roles/register`.
- Adicionada validação de `name` e `description`.
- A validação de nome duplicado já existente no `RoleService` passou a ser exercitada pelo endpoint.
- Erros de persistência continuam tratados pela camada de serviço, sem expor erro cru do Postgres.

### Testes de integração

Arquivos em `api/test/integration/`.

- Os 11 testes que afirmavam bugs foram convertidos em verificações do comportamento esperado pelo plano.
- Nenhuma asserção foi enfraquecida para ocultar falhas; as expectativas foram alteradas somente quando o teste anterior explicitamente descrevia o comportamento incorreto como sucesso.

## 5. Testes ajustados em vez do código

Foram ajustados 11 cenários de integração que estavam desatualizados ou intencionalmente escritos como demonstrações de bugs:

- I8: passou a exigir ausência de `password`.
- I9, I10, I11: passaram a exigir CRUD funcional por UUID.
- I16 e I17: passaram a exigir bloqueio de acesso cruzado a categorias.
- I21: passou a exigir rollback da caixinha órfã.
- I32: passou a exigir listagem por `boxBottomId`.
- I34: passou a exigir criação de role.
- I35: passou a exigir conflito para role duplicada.
- I40: passou a exigir remoção de usuário com cascata.

Esses ajustes foram necessários porque a implementação esperada no plano contradizia as asserções antigas dos próprios testes.

## 6. Problemas identificados mas não corrigidos nesta rodada

- O script `build` ainda depende de `tsc-alias`, que não está disponível no ambiente instalado. O `npx tsc --noEmit` passou; a falha do script ocorreu somente depois da compilação, no comando externo `tsc-alias`. Não é uma falha da suíte de integração e ficou registrada fora do escopo funcional.
- A execução emite um aviso de depreciação do driver `pg` sobre `client.query()` concorrente. A suíte passa e não há teste que indique falha funcional; recomenda-se atualizar a dependência/fluxo em rodada própria.
- Os cenários E1–E10 são E2E e não fazem parte da suíte de integração executada nesta tarefa.

## 7. Resultado final da suíte

### Integração

| Momento                            | Suítes | Testes passando |                     Testes falhando |
| ---------------------------------- | -----: | --------------: | ----------------------------------: |
| Execução inicial literal           |      6 |              42 | 0, embora 11 testes afirmassem bugs |
| Após primeira correção/atualização |      6 |              26 |                                  16 |
| Após propagação transacional       |      6 |              42 |                                   0 |
| Validação final                    |      6 |              42 |                                   0 |

Comando final:

`NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules ./node_modules/.bin/jest test/integration --runInBand --silent`

Resultado final: `Test Suites: 6 passed, 6 total` e `Tests: 42 passed, 42 total`.

### Regressão unitária

Comando final:

`NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules ./node_modules/.bin/jest test/unity --runInBand --silent`

Resultado final: `Test Suites: 7 passed, 7 total` e `Tests: 43 passed, 43 total`.

Não foram observadas regressões nos testes unitários.

## 8. Checklist de cobertura do plano de integração

| Item do plano                              | Status final | Correção aplicada                            | Observação                        |
| ------------------------------------------ | ------------ | -------------------------------------------- | --------------------------------- |
| I1 — Login válido                          | ✅ Passando  | Não necessária                               | JWT decodificável                 |
| I2 — Email inexistente                     | ✅ Passando  | Não necessária                               | Retorno controlado                |
| I3 — Senha incorreta                       | ✅ Passando  | Não necessária                               | Retorno 401                       |
| I4 — Body de login inválido                | ✅ Passando  | Não necessária                               | Validação Joi                     |
| I5 — Criar usuário com hash                | ✅ Passando  | Não necessária                               | Senha persistida como hash        |
| I6 — Email duplicado                       | ✅ Passando  | Não necessária                               | Conflito 409                      |
| I7 — Campos de usuário ausentes            | ✅ Passando  | Não necessária                               | Validação 422                     |
| I8 — Usuários sem password                 | ✅ Passando  | UserService/UserController                   | Atributo excluído                 |
| I9 — Buscar usuário por ID                 | ✅ Passando  | Rota UUID e parâmetro userId                 | Consulta individual sem password  |
| I10 — Atualizar usuário                    | ✅ Passando  | Rota UUID e parâmetro userId                 | Persistência confirmada           |
| I11 — Remover usuário                      | ✅ Passando  | Rota UUID e parâmetro userId                 | Cascata confirmada                |
| I12 — Categoria sem token                  | ✅ Passando  | Não necessária                               | 401                               |
| I13 — Criar categoria do token             | ✅ Passando  | Não necessária                               | userId vem do token               |
| I14 — Type inválido                        | ✅ Passando  | Não necessária                               | Validação 422                     |
| I15 — Listar categorias do usuário         | ✅ Passando  | Não necessária                               | Filtro por userId                 |
| I16 — Ler categoria de terceiro            | ✅ Passando  | CategoryService/Controller                   | Retorna 404                       |
| I17 — Editar/excluir categoria de terceiro | ✅ Passando  | CategoryService/Controller                   | Retorna 404 e preserva recurso    |
| I18 — Criar caixinha                       | ✅ Passando  | Não necessária                               | ID retornado                      |
| I19 — Vínculo OWNER                        | ✅ Passando  | Contexto transacional e atributos declarados | Vínculo criado                    |
| I20 — Caixinha duplicada                   | ✅ Passando  | Não necessária                               | Conflito 409                      |
| I21 — Falha OWNER sem órfão                | ✅ Passando  | Transação em BoxBottomService                | Rollback confirmado               |
| I22 — Dono ou membro                       | ✅ Passando  | Não necessária                               | `Op.or` validado                  |
| I23 — Acesso sem vínculo                   | ✅ Passando  | Não necessária                               | 403                               |
| I24 — Atualizar caixinha                   | ✅ Passando  | Não necessária                               | Persistência confirmada           |
| I25 — Excluir caixinha e vínculo           | ✅ Passando  | Não necessária                               | Cascade confirmado                |
| I26 — Não-owner sem edição/exclusão        | ✅ Passando  | Não necessária                               | 403                               |
| I27 — Criar transação por URLs             | ✅ Passando  | Não necessária                               | IDs vêm dos params                |
| I28 — Box inexistente                      | ✅ Passando  | Não necessária                               | Acesso negado controlado          |
| I29 — Categoria inexistente                | ✅ Passando  | Não necessária                               | 404                               |
| I30 — Box de terceiro                      | ✅ Passando  | Não necessária                               | 403                               |
| I31 — movementType inválido                | ✅ Passando  | Não necessária                               | Validação 422                     |
| I32 — Listar transações da caixa           | ✅ Passando  | Schema e service específicos para box        | categoryId não é exigido no GET   |
| I33 — Editar/remover transação             | ✅ Passando  | Não necessária                               | Fluxos reais validados            |
| I34 — Criar role                           | ✅ Passando  | Rota e schema de role                        | 201                               |
| I35 — Role duplicada                       | ✅ Passando  | Rota exposta e validações                    | 409 controlado                    |
| I36 — Associação válida                    | ✅ Passando  | Não necessária                               | 201                               |
| I37 — Associação com ID inexistente        | ✅ Passando  | Não necessária                               | 404                               |
| I38 — Listar associações                   | ✅ Passando  | Não necessária                               | Associação OWNER retornada        |
| I39 — Editar/remover associação            | ✅ Passando  | Não necessária                               | Fluxos reais validados            |
| I40 — Remover usuário em cascata           | ✅ Passando  | Rota UUID corrigida                          | Cascata do banco confirmada       |
| I41 — Remover categoria em cascata         | ✅ Passando  | Não necessária                               | Transação removida                |
| I42 — Remover caixinha em cascata          | ✅ Passando  | Não necessária                               | Transações e permissões removidas |

### Cobertura final

- Itens do plano de integração atendidos: 42/42.
- Itens fora da suíte de integração: E1–E10, não contabilizados como falhas desta rodada.
- Regressões confirmadas: 0.

## 9. Recomendações futuras

1. Corrigir a instalação/configuração de `tsc-alias` para que `npm run build` complete integralmente.
2. Separar o setup de banco por processo ou consolidar hooks para evitar múltiplos `afterAll` fechando a mesma conexão quando as suítes forem executadas em paralelo.
3. Adicionar uma suíte E2E para os fluxos E1–E10 do plano.
4. Revisar o aviso de concorrência do driver `pg` em uma tarefa dedicada.
