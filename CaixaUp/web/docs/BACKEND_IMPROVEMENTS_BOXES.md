# Melhorias Necessárias no Backend para Gestão de Caixinhas

## 1. Visão Geral
As novas funcionalidades da tela de Caixinhas exigem acesso a métricas agregadas que, atualmente, são calculadas apenas parcialmente ou não trafegam pela API de `Boxes` ou `RoleUserBoxBottom`. As alterações sugeridas aqui padronizam os DTOs do backend para enriquecer as consultas do Dashboard financeiro.

## 2. Endpoints Afetados e Necessários

### A. Listagem de Caixinhas (`GET /boxes`)
**Problema Atual:** Retorna apenas dados primários (`name, description, targetValue, balance`).
**Nova Regra de Negócio (Requerida):** O endpoint deve realizar agregações de Transações (`Transactions`) associadas às Caixas e subqueries de `RoleUserBoxBottom` para retornar dados de rentabilidade.
**Modificações no DTO de Resposta (Box):**
```json
{
  "id": "uuid",
  "name": "string",
  "balance": "number",
  "totalApplied": "number (Soma de todos os aportes manuais antes dos rendimentos)",
  "accumulatedGains": "number (Diferença entre o saldo atual e o total aplicado)",
  "rentabilityPercentage": "number",
  "participantsCount": "number",
  "createdAt": "ISOString",
  "status": "Ativa | Pausada | Concluída"
}
```

### B. Listagem de Participantes (`GET /roleUserBoxBottom/:boxId`)
**Problema Atual:** Retorna apenas as chaves primárias do relacionamento (`user_id, role_id`).
**Nova Regra de Negócio:** Realizar *JOIN* (Include no Sequelize) com a tabela de `Users` e `Roles`. Adicionalmente, calcular a cota parte do participante na caixinha.
**Modificações no DTO de Resposta (BoxParticipant):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "string (Oriundo de Users)",
  "email": "string (Oriundo de Users)",
  "roleName": "string (Oriundo de Roles)",
  "joinedAt": "ISOString (Data de vinculação)",
  "totalApplied": "number (Soma dos aportes exclusivos desse usuário nesta caixinha)",
  "participationPercentage": "number (Cálculo sobre o todo da caixinha)"
}
```

## 3. Gestão de Permissões e Remoção
- **Endpoint Existente:** `PUT /roleUserBoxBottom` e `DELETE /roleUserBoxBottom`.
- **Novas Validações:**
  - Garantir que o `req.userId` logado tem cargo `Proprietário` antes de permitir deletar ou alterar cargos.
  - Bloquear remoção do `Proprietário` (último restante).
  - Bloquear remoção de participantes caso o saldo individual aplicado deles na caixinha seja `> 0` (exigir saque antes de deletar).

## 4. Banco de Dados & Migrations
Não haverá necessidade imperativa de alterar o Schema (Migrations) se os dados `totalApplied` e `accumulatedGains` puderem ser resolvidos via SQL Dinâmico (`SUM`, `JOIN`). Contudo, caso haja degradação de performance nas listagens em grande escala, recomenda-se criar Colunas de Cache (ex: `accumulatedGainsCache`) atualizadas via *Triggers* do Banco.

## 5. Ordem de Implementação Recomendada
1. Adaptar Modelos Sequelize (`User`, `Role`, `RoleUserBoxBottom`) para que os `includes` venham preenchidos.
2. Injetar subqueries no `CategoryService` (ou `BoxService`) para trazer `participantsCount` direto na view.
3. Revisar Middlewares de Autorização nas rotas `PUT/DELETE` da tabela `RoleUserBoxBottom`.
4. Deploy e validação E2E.
