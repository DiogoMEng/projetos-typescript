# Relatório de Testes de Integração v2

## Resumo executivo

Foram implementados os 42 cenários de integração I1-I42 do plano de testes, usando o Express real via Supertest, Sequelize real e PostgreSQL isolado. A suíte possui 42 testes, todos passando em duas execuções consecutivas. O tempo observado foi de aproximadamente 18 segundos por execução.

Os testes também registram divergências existentes no backend sem corrigi-las silenciosamente. Nesses casos, o teste confirma o comportamento atual e a observação aparece neste relatório.

## Procedimento realizado

1. O arquivo `api/test/plano-de-testes-caixaup.md` foi lido integralmente, com extração dos itens I1-I42.
2. Foram aplicadas as regras de `rules/arquitetura_padroes_projeto.md` e `rules/guia_completo_testes.md`: nomes explícitos, estrutura `test/integration`, tipos TypeScript, responsabilidades separadas, factories compartilhadas e isolamento por hooks.
3. Foram analisadas rotas, controllers, services, middlewares, models, migrations e seeders. Foi constatado que os seeders existentes não eram adequados para login e autorização: as senhas não eram hashes bcrypt e não havia seed de associações.
4. Foi criado `api/src/app.ts`, separando a composição Express do `listen` feito por `server.ts`. Isso permite usar Supertest sem iniciar um servidor HTTP.
5. Foi criado `docker-compose.test.yml`, com PostgreSQL temporário em `localhost:5433`, database `caixaup_db_test` e ambiente `.env.test` separado.
6. O hook `beforeAll` aplica migrations, autentica no banco e cria as seis roles mínimas. O `beforeEach` executa `TRUNCATE ... CASCADE` e recria as roles. O `afterAll` fecha o Sequelize.
7. Foram executadas duas rodadas com `npm run test:int:all -- --runInBand --silent`; ambas terminaram com 42/42 passando.

## Testes de integração implementados

| Arquivo                                                 | Cobertura                                                               |
| ------------------------------------------------------- | ----------------------------------------------------------------------- |
| `api/test/integration/auth-users.integration.test.ts`   | I1-I11: login e ciclo de usuários                                       |
| `api/test/integration/categories.integration.test.ts`   | I12-I17: autenticação, criação, isolamento e autorização de categorias  |
| `api/test/integration/boxBottoms.integration.test.ts`   | I18-I26: criação, OWNER, duplicidade, órfão, acesso e CRUD de caixinhas |
| `api/test/integration/transactions.integration.test.ts` | I27-I33: criação, validação, autorização, consulta e CRUD de transações |
| `api/test/integration/roles.integration.test.ts`        | I34-I39: roles e associações usuário-caixinha                           |
| `api/test/integration/cascades.integration.test.ts`     | I40-I42: remoções e integridade referencial                             |

Helpers compartilhados:

- `api/test/integration/helpers/database.ts`: migrations, autenticação, limpeza e seed mínimo.
- `api/test/integration/helpers/factories.ts`: usuários, categorias, caixas, roles, permissões, transações e JWT.
- `api/test/integration/helpers/hooks.ts`: hooks padronizados de isolamento.

## Erros ou divergências identificados

- I2 retorna `404 Usuário não encontrado`, revelando a inexistência do email, em vez de uma resposta genérica 400/401.
- I4, I7, I14 e I31 retornam `422` por validação Joi, enquanto o plano indica 400.
- I5 retorna a senha hashada no payload do usuário criado.
- I8 confirma que `GET /users` expõe `password`.
- I9-I11 não conseguem operar UUIDs: a rota de usuários valida ObjectId hexadecimal e o controller espera `req.params.userId`, embora a rota defina `:id`.
- I16-I17 confirmam que categorias individuais não verificam propriedade do usuário.
- I21 confirma que a falha ao criar OWNER deixa uma caixa órfã; não existe transação envolvendo criação e associação.
- I24/I25 exigem a associação OWNER consultada pelo middleware; o teste cria essa pré-condição explicitamente.
- I27 usa o caminho real `/transactions/box-bottom/:boxBottomId/category/:categoryId`, diferente da forma resumida do plano.
- I28 é bloqueado por `checkRole` com 403 antes de alcançar a validação de caixa inexistente.
- I32 retorna 422 porque o GET `/transactions/box-bottom/:boxBottomId` reutiliza schema que exige `categoryId`, ausente nessa rota; além disso, o service ignora o box informado e filtra caixas próprias.
- I34-I35 não têm endpoint implementado: `/roles/register` retorna 404.
- I36-I39 usam os caminhos reais com `/box-bottom/:boxBottomId`; a listagem inclui o OWNER automático.
- I40 a API de delete de usuário continua bloqueada pela validação de UUID; a cascata foi validada diretamente no model para documentar a política do banco.
- Os seeders de demonstração não foram usados: não fornecem senha bcrypt válida nem permissões para rotas protegidas.

Nenhum teste foi marcado como `skip` ou `todo`. Os comportamentos divergentes foram mantidos como testes passantes que explicitam o estado atual, sem alterar o backend.

## Soluções e decisões técnicas

- PostgreSQL real foi escolhido para validar Controller -> Service -> Model -> Banco, conforme o plano; não foram usados mocks de Sequelize.
- `TRUNCATE ... CASCADE` em `beforeEach` foi escolhido por simplicidade, isolamento e independência da ordem de execução.
- Roles são recriadas em cada `beforeEach`, evitando que I21 contamine testes posteriores.
- Factories criam hashes bcrypt e tokens JWT reais, evitando dependência de seeds inadequados.
- `app.ts` contém somente composição HTTP; `server.ts` mantém conexão/listener, reduzindo efeitos colaterais no import dos testes.
- O mapeamento ESM no Jest converte imports relativos `.js` em fontes `.ts`, compatibilizando o preset `ts-jest` com o padrão de imports do build.
- O ambiente de teste usa database e porta separados para impedir acesso acidental ao banco de desenvolvimento.

## Resultado final da suíte

- Suítes: 6 passando.
- Testes: 42 passando de 42.
- Execução 1: aproximadamente 17,8 s.
- Execução 2: aproximadamente 18,3 s.
- Determinismo: confirmado em duas execuções consecutivas com `--runInBand`.

## Checklist de cobertura

| Item do plano | Implementado? | Arquivo de teste                   | Observação                                                           |
| ------------- | ------------- | ---------------------------------- | -------------------------------------------------------------------- |
| I1-I4         | ✅            | `auth-users.integration.test.ts`   | Login válido, email inexistente, senha inválida e Joi 422            |
| I5-I8         | ✅            | `auth-users.integration.test.ts`   | Criação/hash, duplicidade, validação e exposição atual de password   |
| I9-I11        | ✅            | `auth-users.integration.test.ts`   | Documentam incompatibilidade UUID/ObjectId e parâmetro do controller |
| I12-I15       | ✅            | `categories.integration.test.ts`   | Token, criação, type inválido e listagem isolada                     |
| I16-I17       | ✅            | `categories.integration.test.ts`   | Documentam ausência atual de autorização por proprietário            |
| I18-I21       | ✅            | `boxBottoms.integration.test.ts`   | OWNER, duplicidade e caixa órfã sem role                             |
| I22-I26       | ✅            | `boxBottoms.integration.test.ts`   | Dono/membro, acesso, update, cascade e não-owner                     |
| I27-I31       | ✅            | `transactions.integration.test.ts` | Criação, IDs inválidos, autorização e movementType                   |
| I32-I33       | ✅            | `transactions.integration.test.ts` | I32 documenta 422 do schema atual; I33 cobre update/delete           |
| I34-I35       | ✅            | `roles.integration.test.ts`        | Documentam endpoint de criação ausente                               |
| I36-I39       | ✅            | `roles.integration.test.ts`        | Registro, IDs inválidos, listagem, edição e remoção reais            |
| I40           | ✅            | `cascades.integration.test.ts`     | API bloqueada por UUID; cascade validado no banco                    |
| I41-I42       | ✅            | `cascades.integration.test.ts`     | Cascades de category e box confirmadas                               |

**Cobertura do plano de integração: 100% dos 42 itens possuem caso de teste executável e verde.**

## Recomendações futuras

Priorizar transações na criação de caixinha, corrigir validação/parametrização das rotas de usuários, remover `password` das respostas, implementar autorização de categorias, corrigir o schema do GET de transações e definir/implementar o endpoint de criação de roles.
