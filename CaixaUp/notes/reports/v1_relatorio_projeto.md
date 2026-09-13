# v1 Relatório do Projeto CaixaUp

## 1. Resumo executivo

Nesta rodada, foi realizado o diagnóstico e a correção dos problemas identificados na suíte de testes unitários do backend do CaixaUp.

- Regras analisadas: `rules/arquitetura_padroes_projeto.md` e `rules/guia_completo_testes.md`
- Estado do banco/backend/testes analisado antes das alterações
- Plano de testes consultado em `api/test/plano-de-testes-caixaup.md`
- Resultado inicial: 7 suítes executadas, 43 testes no total, com 4 falhas
- Resultado final: 7 suítes executadas, 43 testes no total, 0 falhas

## 2. Procedimento realizado

### Fase 1 — Análise

1. Leitura obrigatória das regras do projeto em `rules/`.
2. Inspeção do estado atual do backend, com foco em:
   - modelos e schema real em `api/src/database/models/`
   - serviços em `api/src/services/`
   - erros HTTP em `api/src/errors/httpErrors.ts`
   - estrutura de `Service` base em `api/src/services/Service.ts`
3. Execução da suíte unitária com o comando:
   - `cd api && npm run test:unit:all -- --runInBand`
4. Levantamento das falhas e análise das causas reais antes de qualquer correção.
5. Consulta do plano de testes em `api/test/plano-de-testes-caixaup.md` para comparar comportamento esperado vs. implementação atual.

### Fase 2 — Desenvolvimento

1. Correção da causa raiz do mascaramento de erros em `Service.create()`.
2. Implementação de validações de domínio faltantes em `CategoryService`, `TransactionService` e `RoleService`.
3. Ajuste de testes que estavam inconsistentes com o comportamento real do código e com o contrato esperado pelos services.
4. Reexecução da suíte unitária para verificar regressões.

### Fase 3 — Relatório

- Criação deste arquivo com o resumo dos procedimentos, falhas, correções e resultado final.

## 3. Erros, falhas ou problemas identificados

| Teste afetado                  | Sintoma / erro                                                   | Causa raiz real encontrada                                                                                                                   |
| ------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Service.test.ts` / U5b        | `Service.create()` mascarava a mensagem do erro de `afterCreate` | O método `Service.create()` capturava qualquer exceção do `afterCreate` e lançava `BadRequestError` genérico, escondendo a mensagem original |
| `DomainServices.test.ts` / U24 | `CategoryService` aceitava `type` inválido                       | `CategoryService.beforeCreate()` não validava o enum `receita` / `despesa`                                                                   |
| `DomainServices.test.ts` / U26 | `TransactionService` aceitava `movementType` inválido            | `TransactionService.beforeCreate()` não validava `movementType`                                                                              |
| `DomainServices.test.ts` / U27 | `RoleService` não rejeitava nome duplicado                       | `RoleService` não tinha validação de conflito para `name` repetido                                                                           |

### Ajustes de teste identificados

| Teste ajustado                 | Motivo                                                                                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Service.test.ts` / U5b        | O teste havia sido escrito com um erro de `afterCreate` que não refletia a intenção original do cenário. O comportamento correto é propagar a mensagem real, e não um `BadRequestError` genérico |
| `DomainServices.test.ts` / U25 | O cenário de sucesso faltava `movementType`, o que fazia o serviço rejeitar um caso válido antes da correção da validação                                                                        |
| `DomainServices.test.ts` / U27 | O teste precisava mockar `Roles.findOne` retornando registro existente para simular duplicidade real                                                                                             |

## 4. Correções aplicadas

### 4.1 `api/src/services/Service.ts`

- Ajuste no fluxo de `create()` para separar:
  - erro de persistência (camada de banco)
  - erro de `afterCreate` (propagação da mensagem original)
- Motivo: resolver o problema raiz do mascaramento de exceções e manter o comportamento de `afterCreate` consistente com os testes e com o contrato da base service.
- Influência das regras: alinhou com `Clean Code` e `Tratamento de Erros`, evitando `swallow` de exceções e preservando contexto do erro.

### 4.2 `api/src/services/Category.service.ts`

- Adicionada validação para `type` com aceitação restricta de `receita` e `despesa`.
- Motivo: atender ao comportamento esperado pelos testes e ao schema do modelo `Category`, que já usa `ENUM('receita', 'despesa')`.

### 4.3 `api/src/services/Transaction.service.ts`

- Adicionada validação de `movementType` com aceitação restricta de `inflow` e `outflow`.
- Motivo: manter o contrato da model `Transaction`, que também usa enum de valores válidos.

### 4.4 `api/src/services/role.service.ts`

- Implementada checagem de duplicidade de `name` antes da criação.
- Motivo: resolver a falha de teste U27 e impedir criação de roles repetidas.

### 4.5 `api/test/unity/services/Service.test.ts`

- Ajustado o caso U5b para refletir corretamente a intenção do cenário: `afterCreate` deve lançar a mensagem real e o teste deve validar sua propagação.

### 4.6 `api/test/unity/services/DomainServices.test.ts`

- Ajustado U25 para incluir `movementType: 'inflow'`, refletindo o contrato válido do serviço.
- Ajustado U27 para simular um registro existente em `Roles.findOne` antes da chamada de criação.

## 5. Testes desatualizados ou ajustados

Os testes ajustados foram:

- `api/test/unity/services/Service.test.ts`
- `api/test/unity/services/DomainServices.test.ts`

Motivo: esses casos estavam desalinhados com o comportamento real esperado do serviço, ou não preparavam corretamente os mocks para reproduzir a regra de negócio.

## 6. Problemas identificados mas não corrigidos nesta rodada

Não houve problemas adicionais bloqueantes identificados durante a investigação que exigissem correção fora do escopo desta rodada.

## 7. Resultado final da suíte de testes

### Antes

- 7 suítes executadas
- 43 testes no total
- 4 falhas
- 39 testes passaram

### Depois

- 7 suítes executadas
- 43 testes no total
- 0 falhas
- 43 testes passaram

### Evidência verificada

Comando executado:

`cd api && npm run test:unit:all -- --runInBand`

Saída final verificada:

- `Test Suites: 7 passed, 7 total`
- `Tests: 43 passed, 43 total`

## 8. Recomendações futuras

- Revisar o script `test:unit:all` no `api/package.json`, porque o padrão de glob informado está com formatação inválida e o Jest acabou executando todas as suítes em vez do padrão esperado.
- Expandir a cobertura para integrações de `BoxBottom`, `RoleUserBoxBottom` e middlewares com banco real de teste.
- Considerar a adoção de classes de erro tipadas (`NotFoundError`, `ConflictError`, etc.) em vez de validações por substring de mensagens, especialmente para cenários de `catchAsync` e mapeamento de status.

## Checklist de aceite

- [x] Regras de `rules/` foram lidas e aplicadas em 100% das correções.
- [x] Estado do banco, backend e testes de unidade foi analisado antes de qualquer alteração.
- [x] `plano-de-testes-caixaup.md` foi consultado e usado como referência de comportamento esperado.
- [x] Todas as falhas de teste de unidade identificadas na Fase 1 foram tratadas (corrigidas no código ou ajustadas no teste com justificativa).
- [x] Suíte de testes de unidade roda 100% verde ao final, sem regressões.
- [x] Relatório `v1_relatorio_projeto.md` criado em `notes/reports/`.
