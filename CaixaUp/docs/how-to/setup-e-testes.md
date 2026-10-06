# Configurar o ambiente e executar testes

Este guia cobre o ambiente local de desenvolvimento e os comandos de validação definidos em `api/package.json`.

## Pré-requisitos

- Node.js 18 ou superior e npm.
- Docker Engine com o plugin Docker Compose, para executar PostgreSQL em contêiner.
- PostgreSQL acessível pela API. O serviço Compose de desenvolvimento publica o banco na porta `5432`; o banco de testes publica na porta `5433`.

## Configurar variáveis

A API carrega `api/.env.<NODE_ENV>` a partir do diretório de trabalho `api`. Para desenvolvimento, configure `api/.env.development`; para testes, configure `api/.env.test`. Não versione segredos nem use credenciais de produção em ambientes locais.

| Variável      | Uso                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`    | Seleciona o arquivo `.env` da API (por exemplo, `development` ou `test`).                                         |
| `PORT`        | Porta HTTP da API; o padrão do servidor é `3000`.                                                                 |
| `DB_HOST`     | Host PostgreSQL. Use `localhost` para comandos executados no host e `db` para o serviço da API dentro do Compose. |
| `DB_PORT`     | Porta PostgreSQL; normalmente `5432` dentro da rede Compose e `5433` para o banco de testes acessado pelo host.   |
| `DB_USERNAME` | Usuário PostgreSQL.                                                                                               |
| `DB_PASSWORD` | Senha PostgreSQL local.                                                                                           |
| `DB_NAME`     | Banco de dados usado pela aplicação.                                                                              |
| `DB_DIALECT`  | Dialeto Sequelize; use `postgres` na configuração da API.                                                         |
| `JWT_SECRET`  | Segredo local para assinar e verificar JWTs.                                                                      |

O `docker-compose.yml` também lê um arquivo `.env` na raiz do projeto para interpolação de variáveis. Nesse arquivo, `DB_DIALECT` é usado como referência da imagem PostgreSQL; defina `DB_DIALECT=postgres:16`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST=db` e `JWT_SECRET`. Na configuração da API em `api/.env.development`, `DB_DIALECT` deve ser o dialeto Sequelize `postgres`. Os valores de usuário, senha e banco devem coincidir nos dois arquivos; mantenha `DB_HOST=localhost` na configuração usada por comandos que rodam no host. No contêiner, o Compose fornece `DB_HOST=db`.

> O arquivo raiz `.env` e os arquivos `api/.env.*` podem conter segredos. Mantenha-os locais e confirme que estão excluídos do controle de versão antes de adicioná-los.

## Instalar dependências

Na raiz do repositório:

```bash
(cd api && npm ci)
```

## Iniciar o ambiente de desenvolvimento

Na raiz do repositório, com as variáveis de ambiente configuradas:

```bash
docker compose up -d
```

O Compose inicia PostgreSQL e a API em modo de desenvolvimento. A API escuta em `http://localhost:3000`.

Se preferir executar a API no host, inicie apenas o banco com Compose e, em outro terminal:

```bash
(cd api && npm run dev)
```

## Aplicar migrações

Com o PostgreSQL acessível e as variáveis de desenvolvimento apontando para o host correto:

```bash
(cd api && npm run db:migrate)
```

O CLI do Sequelize lê a configuração em `api/src/config/sequelize_cli.js` e as migrações em `api/src/database/migrations`.

## Executar testes

Os testes de integração e E2E usam o banco de testes definido em `docker-compose.test.yml`. Inicie-o na raiz:

```bash
docker compose -f docker-compose.test.yml up -d db-test
```

Configure `api/.env.test` para acessar esse banco. As execuções dos scripts de integração e E2E definem `NODE_ENV=test` e ativam seus respectivos conjuntos.

Na raiz do repositório, execute conforme a camada desejada:

```bash
# Testes unitários
(cd api && npm run test:unit:all)

# Testes de integração
(cd api && npm run test:integration)

# Testes end-to-end
(cd api && npm run test:e2e:all)
```

## Build de produção

```bash
(cd api && npm run build && npm start)
```

Para contratos HTTP, rotas e formatos de resposta, consulte [openapi.yaml](../../openapi.yaml).
