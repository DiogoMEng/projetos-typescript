# ADR 0001: representar o vínculo de acesso como `Permissions`

- **Status:** Aceita
- **Data:** 2026-09-28
- **Decisores:** Equipe CaixaUp

## Contexto

O acesso colaborativo a uma caixinha é uma associação entre um usuário, uma caixinha e um papel. A tabela histórica `role_user_box_bottoms` já representava essa associação, mas seu nome descrevia a implementação anterior, em vez do conceito de autorização exposto pelo domínio. A aplicação passou a tratar esse vínculo como a entidade `Permissions`, com chave `permissionId` e tabela física `permissions`.

## Fatores de decisão

- Nomear a entidade conforme a responsabilidade de conceder acesso a uma caixinha.
- Manter explícitos os vínculos com usuário, caixinha e papel.
- Alinhar tabela, modelo Sequelize, atributos e rotas à terminologia vigente.
- Permitir reversão da alteração estrutural pelo mecanismo de migrações.

## Opções consideradas

1. Manter `role_user_box_bottoms` como nome de tabela e de entidade.
2. Renomear a tabela para `permissions` e representar o vínculo com um modelo `Permissions`.
3. Remover o vínculo persistido e derivar autorização de outras tabelas.

## Decisão

Adotar a opção 2. A migração `20260928233415-rename-role-user-box-bottoms-to-permissions.js` renomeia `role_user_box_bottoms` para `permissions`; a migração inversa renomeia a tabela de volta. O modelo atual relaciona `Permissions` com `Users`, `BoxBottoms` e `Roles`, e as rotas de autorização consultam esse vínculo.

## Consequências

### Positivas

- A nomenclatura do domínio expressa a função do registro: conceder um papel a um usuário em uma caixinha.
- A autorização e a listagem de membros usam uma entidade e tabela explícitas.
- A alteração de tabela pode ser desfeita pela migração `down`.

### Custos e riscos

- Ambientes existentes precisam executar as migrações em ordem.
- Código, seeds, testes e clientes que dependam da nomenclatura antiga precisam ser atualizados.
- Renomear a tabela não altera, por si só, os registros nela contidos; a migração preserva os dados existentes.

## Confirmação

Verificar a tabela `permissions` e as chaves `permissionId`, `userId`, `boxBottomId` e `roleId` após aplicar as migrações. Confirmar também que as rotas de membros e a autorização por papel continuam consultando a associação atual.
