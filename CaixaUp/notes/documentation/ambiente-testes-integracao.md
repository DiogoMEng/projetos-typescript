# Ambiente de testes de integração do CaixaUp

Este documento explica como preparar, executar, investigar e manter o ambiente de testes de integração do backend CaixaUp.

Os testes ficam em `api/test/integration` e exercitam a aplicação Express real, os controllers, services, models Sequelize e um PostgreSQL separado do banco de desenvolvimento. As requisições HTTP são simuladas com `supertest`; não é necessário iniciar o servidor HTTP da API.

## 1. O que é validado

Um teste de integração verifica a colaboração entre partes reais do sistema. Nesta suíte, a chamada percorre aproximadamente este caminho:

```text
Teste Jest
  -> supertest
  -> app Express
  -> rotas e middlewares
  -> controller
  -> service
  -> model Sequelize
  -> PostgreSQL de teste
```

A suíte cobre atualmente:

| Arquivo | Responsabilidade |
| --- | --- |
| `auth-users.integration.test.ts` | Login, JWT e operações de usuários |
| `categories.integration.test.ts` | Autenticação, criação, listagem e isolamento de categorias |
| `boxBottoms.integration.test.ts` | Caixinhas, role `OWNER`, permissões e cascatas |
| `transactions.integration.test.ts` | Criação, listagem, edição, remoção e autorização de transações |
| `roles.integration.test.ts` | Roles e associações usuário-caixinha |
| `cascades.integration.test.ts` | Integridade referencial e exclusões em cascata |

Os identificadores `I1` a `I42` nos testes representam cenários do plano de testes do projeto.

## 2. Pré-requisitos

Instale ou disponibilize:

- Node.js compatível com o projeto, recomendado Node.js 18 ou superior;
- npm;
- Docker Engine;
- Docker Compose, normalmente disponível como `docker compose`;
- um terminal aberto na raiz do repositório para os comandos Docker;
- outro terminal, opcionalmente, aberto em `api` para os comandos npm.

Confirme as ferramentas:

```bash
node --version
npm --version
docker --version
docker compose version
```

A dependência `pg` permite a conexão com PostgreSQL, `sequelize-cli` executa migrações, Jest executa a suíte, `ts-jest` transpila TypeScript em ESM e `supertest` simula requisições HTTP.

## 3. Componentes do ambiente

### 3.1 PostgreSQL de teste

O arquivo `docker-compose.test.yml` define apenas o serviço `db-test`:

```yaml
services:
  db-test:
    image: postgres:16
    container_name: caixaup_db_test
    ports:
      - '5433:5432'
```

Características importantes:

- imagem PostgreSQL 16;
- nome do container: `caixaup_db_test`;
- usuário: `postgres`;
- senha: `admin123`;
- banco: `caixaup_db_test`;
- porta do host: `5433`;
- porta dentro do container: `5432`;
- diretório de dados montado em `tmpfs`.

A porta `5433` evita conflito com o PostgreSQL de desenvolvimento, que usa a porta `5432`. O `tmpfs` mantém os dados em memória e não cria volume persistente. Portanto, o banco é descartável: ao remover o container, o conteúdo é perdido.

### 3.2 Configuração da aplicação

O arquivo `api/.env.test` aponta a aplicação para o banco de teste:

```dotenv
NODE_ENV=test
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=admin123
DB_NAME=caixaup_db_test
DB_HOST=127.0.0.1
DB_DIALECT=postgres
JWT_SECRET=caixaup-integration-test-secret
```

A configuração em `api/src/config/index.ts` escolhe o arquivo `.env.<NODE_ENV>`. Assim, com `NODE_ENV=test`, o processo carrega `.env.test`.

O `sequelize-cli` usa `api/.sequelizerc`, que aponta para:

- configuração: `src/config/sequelize_cli.js`;
- migrações: `src/database/migrations`;
- seeders: `src/database/seeders`.

Sempre execute os comandos do Sequelize a partir de `api`, pois os caminhos relativos e o arquivo `.sequelizerc` pressupõem esse diretório.

### 3.3 Jest e TypeScript

O arquivo `api/jest.config.ts` configura:

- ambiente Jest do tipo `node`;
- preset ESM do `ts-jest`;
- `api/tsconfig.test.json` como configuração TypeScript dos testes;
- resolução dos aliases `#models`, `#services`, `#controllers` e outros aliases internos;
- remoção da extensão `.js` dos imports relativos durante a execução TypeScript;
- timeout de 30 segundos por teste;
- descoberta de arquivos `*.test.ts`, `*.spec.ts`, além de arquivos em `tests` e `__tests__`.

O projeto usa módulos ESM. Por isso os scripts passam `NODE_OPTIONS=--experimental-vm-modules` ao Jest.

## 4. Execução recomendada, do zero

### Passo 1: iniciar o PostgreSQL

Na raiz do repositório:

```bash
docker compose -f docker-compose.test.yml up -d db-test
```

Confira o estado:

```bash
docker compose -f docker-compose.test.yml ps
docker logs caixaup_db_test
```

O container precisa estar em execução antes de importar a aplicação ou iniciar os testes. O PostgreSQL pode levar alguns segundos para aceitar conexões após o container ser criado.

Para verificar diretamente a disponibilidade do banco:

```bash
docker exec caixaup_db_test pg_isready -U postgres -d caixaup_db_test
```

O resultado esperado indica que o servidor aceita conexões.

### Passo 2: instalar as dependências

No diretório `api`:

```bash
cd api
npm install
```

Esse passo é necessário na primeira execução ou depois de alterar `package.json`/`package-lock.json`.

### Passo 3: executar a suíte

Ainda em `api`:

```bash
npm run test:int:all
```

Esse script equivale essencialmente a:

```bash
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest test/integration
```

O Jest pode iniciar os arquivos de teste em paralelo. Como todos eles usam o mesmo banco e executam `TRUNCATE`/reseed em seus hooks, a execução paralela pode gerar interferência entre arquivos. Para uma execução determinística da suíte completa, prefira o comando serial abaixo.

No Linux, também é possível executar diretamente:

```bash
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npx jest test/integration
```

O script `cross-env` presente no `package.json` torna a definição da variável portável entre sistemas operacionais.

### Passo 4: encerrar o banco

Quando terminar:

```bash
docker compose -f docker-compose.test.yml down
```

Para remover explicitamente um container que ficou parado:

```bash
docker rm -f caixaup_db_test
```

Como o banco usa `tmpfs`, não há dados de teste persistentes para limpar depois de remover o container.

## 5. O que acontece durante a suíte

Cada arquivo de teste importa `useDatabaseHooks()` dos helpers. Essa função registra três hooks Jest:

```text
beforeAll  -> prepareDatabase
beforeEach -> clearDatabase
afterAll  -> closeDatabase
```

### 5.1 Antes de todos os testes do arquivo

`prepareDatabase()`:

1. confirma que `NODE_ENV` é exatamente `test`;
2. executa `npx sequelize-cli db:migrate` no diretório `api`;
3. autentica a conexão Sequelize;
4. limpa as tabelas de negócio com `TRUNCATE ... CASCADE`;
5. recria as roles padrão.

Se `NODE_ENV` não for `test`, a função falha intencionalmente com `Integração exige NODE_ENV=test`. Essa proteção evita apontar acidentalmente para o banco de desenvolvimento.

### 5.2 Antes de cada teste

`clearDatabase()` limpa novamente:

```text
role_user_box_bottoms
transactions
box_bottoms
categories
users
roles
```

A opção `CASCADE` permite remover registros dependentes respeitando as relações de chave estrangeira. Em seguida, as seguintes roles são recriadas:

- `OWNER`;
- `MANAGER`;
- `EDITOR`;
- `CONTRIBUTOR`;
- `ANALYST`;
- `VIEWER`.

Na prática, cada caso começa com banco vazio, exceto pelas roles padrão. Dados criados por um teste não devem ser usados por outro teste.

### 5.3 Depois de todos os testes do arquivo

`closeDatabase()` fecha a conexão Sequelize. Isso é importante para que o Jest não fique com handles abertos e termine corretamente.

## 6. Fixtures e autenticação

Os helpers em `api/test/integration/helpers/factories.ts` criam dados reais no banco:

| Helper | Função |
| --- | --- |
| `createUser()` | Cria usuário com senha armazenada como hash bcrypt |
| `createRole(name)` | Busca uma role existente pelo nome |
| `createCategory(userId)` | Cria categoria vinculada ao usuário |
| `createBox(userId)` | Cria uma caixinha diretamente pelo model |
| `assignRole(userId, boxBottomId, roleId)` | Cria vínculo de permissão |
| `createTransaction(boxBottomId, categoryId)` | Cria transação vinculada à caixinha e categoria |
| `tokenFor(user)` | Gera JWT com `userId` e `email` |
| `authHeader(token)` | Monta o header `Authorization: Bearer ...` |

Exemplo de teste autenticado:

```ts
const user = await createUser();
const token = tokenFor(user);

const response = await request(app)
  .get('/categories')
  .set(authHeader(token));
```

As requisições usam `request(app)`, e não `request('http://localhost:3000')`. Isso permite testar o pipeline Express sem iniciar `src/server.ts` e sem ocupar uma porta HTTP adicional.

## 7. Comandos úteis

### Executar um único arquivo

```bash
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npx jest test/integration/auth-users.integration.test.ts
```

Exemplos:

```bash
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npx jest test/integration/boxBottoms.integration.test.ts
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npx jest test/integration/transactions.integration.test.ts
```

### Executar um teste pelo nome

```bash
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npx jest test/integration --runInBand -t "I20"
```

Também é possível usar parte do texto descritivo:

```bash
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npx jest test/integration --runInBand -t "cria vínculo OWNER"
```

### Executar em modo serial

Para reduzir concorrência contra o mesmo banco:

```bash
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npx jest test/integration --runInBand
```

O modo serial é especialmente útil para depuração e é o modo recomendado para validar a suíte completa no ambiente atual. Mesmo com a limpeza por teste, executar suites que compartilham o mesmo banco em processos paralelos pode produzir falhas intermitentes.

### Executar em modo de observação

O script genérico de watch é:

```bash
npm run test:watch
```

Como ele não define `NODE_ENV=test`, use explicitamente a configuração de teste ao observar a suíte de integração:

```bash
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npx jest test/integration --watch
```

### Executar migrações manualmente

Normalmente `prepareDatabase()` migra automaticamente. Para executar manualmente:

```bash
cd api
NODE_ENV=test npx sequelize-cli db:migrate
```

Ver o status das migrações:

```bash
NODE_ENV=test npx sequelize-cli db:migrate:status
```

Desfazer a última migração, somente no banco de teste:

```bash
NODE_ENV=test npx sequelize-cli db:migrate:undo
```

Não use `db:migrate:undo` em um banco compartilhado sem confirmar o ambiente e a migração alvo.

### Inspecionar o banco

Abrir o `psql` dentro do container:

```bash
docker exec -it caixaup_db_test psql -U postgres -d caixaup_db_test
```

Consultas úteis:

```sql
\dt
SELECT * FROM roles;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM box_bottoms;
SELECT COUNT(*) FROM transactions;
\q
```

A limpeza da suíte é feita por SQL via Sequelize, não por `sequelize db:seed:undo`.

## 8. Diferença entre integração, unitário e E2E

- **Unitários:** ficam em `api/test/unity`, devem isolar dependências e não precisam de PostgreSQL.
- **Integração:** ficam em `api/test/integration`, usam o `app` real e PostgreSQL real, mas não iniciam o servidor HTTP.
- **E2E:** ficam em `api/test/e2e`. O script existente é `npm run test:e2e:all`; o ambiente necessário deve ser confirmado nos próprios testes antes de executá-los.

Comandos disponíveis relacionados:

```bash
npm run test:unit:all
npm run test:int:all
npm run test:e2e:all
```

O comando `npm test` não está definido atualmente no `api/package.json`.

## 9. Fluxo de criação de um novo teste

1. Crie o arquivo em `api/test/integration` com o sufixo `.integration.test.ts`.
2. Importe `request` de `supertest` e o `app` real quando testar endpoints.
3. Importe `useDatabaseHooks` e chame-o no escopo do arquivo.
4. Use factories para preparar entidades ou crie diretamente pelo model quando isso fizer parte do cenário.
5. Gere um token com `tokenFor` e envie `authHeader` nos endpoints protegidos.
6. Verifique o status HTTP e o corpo da resposta.
7. Quando necessário, consulte `DB` para confirmar persistência, hash, relações ou cascatas.
8. Não dependa da ordem dos testes nem de dados criados em outro arquivo.

Exemplo mínimo:

```ts
import request from 'supertest';
import { describe, expect, it } from '@jest/globals';
import app from '../../src/app.js';
import { createUser, authHeader, tokenFor } from './helpers/factories.js';
import { useDatabaseHooks } from './helpers/hooks.js';

useDatabaseHooks();

describe('Exemplo de integração', () => {
  it('lista dados do usuário autenticado', async () => {
    const user = await createUser();
    const response = await request(app)
      .get('/categories')
      .set(authHeader(tokenFor(user)));

    expect(response.status).toBe(200);
  });
});
```

## 10. Diagnóstico de problemas

### `ECONNREFUSED 127.0.0.1:5433`

O PostgreSQL de teste não está disponível ou ainda está inicializando.

```bash
docker compose -f docker-compose.test.yml up -d db-test
docker compose -f docker-compose.test.yml ps
docker logs caixaup_db_test
docker exec caixaup_db_test pg_isready -U postgres -d caixaup_db_test
```

### `Integração exige NODE_ENV=test`

O comando foi executado sem `NODE_ENV=test`. Use o script oficial:

```bash
npm run test:int:all
```

Ou defina a variável manualmente:

```bash
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npx jest test/integration
```

### Testes apontando para o banco errado

Confirme:

```bash
printf '%s\n' "$NODE_ENV"
cat api/.env.test
```

O host deve ser `127.0.0.1`, a porta `5433` e o banco `caixaup_db_test`. Não use o `.env.development`, cujo host é `db` e cuja porta é `5432`.

### Migração falha ou tabela não existe

Verifique se o comando está sendo executado em `api` e se as migrações existem:

```bash
cd api
NODE_ENV=test npx sequelize-cli db:migrate:status
NODE_ENV=test npx sequelize-cli db:migrate
```

Se o container foi recriado, a base é nova e as migrações precisam ser aplicadas novamente. A própria preparação da suíte normalmente executa esse passo.

### `Cannot find module` para aliases `#...`

Execute o Jest pelos scripts do `package.json` ou pela configuração `jest.config.ts`. Não rode diretamente o arquivo TypeScript com `node`. O `moduleNameMapper` do Jest traduz os aliases internos durante os testes.

### O Jest não encerra

Confira se o teste fechou a conexão com `useDatabaseHooks()`. A suíte atual registra `afterAll(closeDatabase)`. Para investigar handles abertos:

```bash
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npx jest test/integration --runInBand --detectOpenHandles
```

Use `--detectOpenHandles` para diagnóstico; ele pode deixar a execução mais lenta.

### Container encerrado com código 137

O código 137 normalmente indica que o processo recebeu `SIGKILL`, frequentemente por pressão de memória ou encerramento forçado do container. Verifique o estado e os logs:

```bash
docker compose -f docker-compose.test.yml ps -a
docker logs caixaup_db_test
docker stats --no-stream
```

Depois de resolver a causa, recrie somente o serviço de teste:

```bash
docker compose -f docker-compose.test.yml down
docker compose -f docker-compose.test.yml up -d db-test
```

### Porta `5433` ocupada

Descubra o processo ou container que ocupa a porta:

```bash
docker ps --format 'table {{.Names}}\t{{.Ports}}'
ss -ltnp | grep ':5433'
```

Pare o serviço conflitante ou ajuste conjuntamente a porta publicada no Compose e `DB_PORT` em `.env.test`. A porta interna do PostgreSQL continua sendo `5432`.

### Teste falha por ordem ou por dados antigos

A suíte foi desenhada para limpar o banco antes de cada teste. Verifique se o teste novo:

- usa `useDatabaseHooks()`;
- não depende de outro teste;
- não cria entidades com nomes fixos que causem conflito dentro do mesmo caso;
- não deixa transações abertas;
- não altera as roles padrão sem restaurá-las no próprio cenário.

## 11. Cuidados e limites atuais

- O banco de teste é compartilhado por todos os arquivos executados no mesmo comando.
- O isolamento é obtido por limpeza de tabelas, não por um banco ou schema exclusivo por teste.
- A limpeza usa `TRUNCATE ... CASCADE`; portanto, nunca aponte o processo para um banco que contenha dados importantes.
- O banco usa `tmpfs` e perde os dados quando o container é removido.
- O script de integração define `NODE_ENV=test`; o script de watch genérico não define.
- A preparação chama migrações automaticamente, mas não executa seeders. As roles necessárias são inseridas diretamente pelo helper.
- O segredo JWT de `.env.test` é destinado ao ambiente local de testes e não deve ser reutilizado em desenvolvimento compartilhado ou produção.
- O Sequelize autentica a conexão durante a importação dos models; por isso um banco indisponível pode fazer o Jest falhar antes de qualquer teste começar.
- O `testTimeout` padrão é de 30 segundos. Um teste que exceder esse tempo deve ser investigado, não apenas receber um timeout maior.
- Não há servidor Express ouvindo em uma porta para a suíte de integração. O objeto `app` é passado diretamente ao `supertest`.
- O driver `pg` pode emitir um aviso de depreciação sobre chamadas concorrentes a `client.query`; esse aviso não impediu a execução serial validada, mas merece acompanhamento em atualizações futuras das dependências.

## 12. Checklist rápido

```text
[ ] Docker está em execução
[ ] db-test está ativo na porta 5433
[ ] pg_isready confirma que o banco aceita conexões
[ ] dependências de api estão instaladas
[ ] comando está sendo executado dentro de api
[ ] NODE_ENV=test está definido
[ ] .env.test aponta para caixaup_db_test em 127.0.0.1:5433
[ ] migrações foram aplicadas
[ ] npm run test:int:all termina sem falhas
[ ] docker compose -f docker-compose.test.yml down foi executado ao finalizar
```

## Referências internas

- Configuração do banco: `api/.env.test` e `api/src/config/index.ts`;
- Compose de teste: `docker-compose.test.yml`;
- Configuração Jest: `api/jest.config.ts`;
- Scripts: `api/package.json`;
- Hooks e ciclo do banco: `api/test/integration/helpers/database.ts` e `api/test/integration/helpers/hooks.ts`;
- Factories: `api/test/integration/helpers/factories.ts`;
- Migrações: `api/src/database/migrations`;
- Configuração do Sequelize CLI: `api/.sequelizerc` e `api/src/config/sequelize_cli.js`.
