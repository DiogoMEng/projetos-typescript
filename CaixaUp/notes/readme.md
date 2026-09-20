# Notação de Projeto: CaixaUp

## Sumário

Parte 1: [**Configurando Infraestrutura no Container**](#configurando-infraestrutura-no-container)

- [Configuração Dockerfile Backend](#configuração-dockerfile-backend)
- [Orquestrando Containers do Projeto](#orquestrando-containers-do-projeto)
- [Erros/Bugs Identificados - Configuração Infraestrutura](#)

Parte 2: [**Configuração da Base de Dados**](#configuração-da-base-de-dados)

- [Sequelize](#sequelize)
- [Erros/Bugs Identificados - Configuração Base de Dados](#errosbugs-identificados---configuração-base-de-dados)
  - [Bug do TypeScript com o Sequelize](#bug-do-typescript-com-sequelize)

Parte 3: [**Configurando Ambiente de Teste**](#configurando-ambiente-de-teste)

- [Configuração do Jest](#configuração-do-jest)

---

## Configurando Infraestrutura no Container

### Configuração Dockerfile Backend

Utilizado para buildar a imagem do backend para o container Docker.

```dockerfile
# Define a imagem base como Node.js v18 sobre Alpine Linux
# --> Alpine é uma distro minimalista, o que reduz o tamanho
#     da imagem e melhora o    tempo de pull/push.
FROM node:18-alpine

# Copia todo o contexto de build (diretório atual) para /app
# dentro da imagem.
ADD . /app

# Define /app como diretório de trabalho padrão para os
# próximos comandos e para o processo final.
WORKDIR /app

# Instala o pacote sqlite (cliente/CLI e libs) usando
# o gerenciador de pacotes do Alpine (apk).
RUN apk add --update-cache sqlite

# Troca o usuário para node (não-root), que já existe
# na imagem oficial do Node.
USER node

# Define o comando padrão quando o container inicia.
CMD npm install
```

### Orquestrando Containers do Projeto

Ferramenta que permite definir e gerenciar vários containers do Docker.

```yml
# Configuração do Docker Compose para o projeto Finances
# Este arquivo define os serviços, redes e volumes para executar a aplicação em contêineres.
# Inclui serviços de desenvolvimento, teste e banco de dados.

# Versão do formato do Docker Compose (opcional, mas boa prática)
version: "3.8"

# Seção de serviços: Define os contêineres que compõem a aplicação
services:
  # Serviço de desenvolvimento: Executa a API em modo de desenvolvimento
  dev:
    # Constrói a imagem a partir do diretório ./api (onde o Dockerfile está localizado)
    build: ./api
    # Nome do contêiner
    container_name: finances_dev
    # Comando para executar dentro do contêiner (inicia o servidor de desenvolvimento)
    command: npm run dev
    # Diretório de trabalho dentro do contêiner
    working_dir: /app
    # Mapeamento de portas: porta do host 3000 para porta do contêiner 3000
    ports:
      - "3000:3000"
    # Variáveis de ambiente para a aplicação
    environment:
      - DB_USER=postgres # Nome de usuário do banco de dados
      - DB_PASS=admin123 # Senha do banco de dados
      - DB_NAME=finances_db # Nome do banco de dados
      - DB_HOST=db # Host do banco de dados (refere-se ao serviço db)
      - JWT_SECRET=c03a21ed65f4dsfd1aAD21F3ASF5AS # Chave secreta para tokens JWT
    # Volumes: Monta o diretório local ./api em /app no contêiner com cache
    volumes:
      - ./api/:/app:cached
    # Dependências: Este serviço depende do serviço db para iniciar primeiro
    depends_on:
      - db

  # Serviço de teste: Executa os testes da API
  test:
    # Constrói a imagem a partir do diretório atual (raiz do projeto)
    build: .
    # Nome do contêiner
    container_name: finances_api_test
    # Comando para executar dentro do contêiner (executa testes)
    command: npm run test
    # Diretório de trabalho dentro do contêiner
    working_dir: /app
    # Mapeamento de portas: porta do host 4000 para porta do contêiner 4000 (para servidor de teste se necessário)
    ports:
      - "4000:4000"
    # Volumes: Monta o diretório local ./api em /app no contêiner com cache
    volumes:
      - ./api/:/app:cached

  # Serviço de banco de dados: Banco de dados PostgreSQL
  db:
    # Usa a imagem oficial do PostgreSQL
    image: postgres
    # Nome do contêiner
    container_name: finances_db
    # Variáveis de ambiente para PostgreSQL
    environment:
      - POSTGRES_USER=postgres # Nome de usuário superusuário padrão
      - POSTGRES_PASSWORD=admin123 # Senha para o superusuário
      - POSTGRES_DB=finances_db # Nome do banco de dados padrão a ser criado
    # Mapeamento de portas: porta do host 5432 para porta do contêiner 5432
    ports:
      - "5432:5432"
    # Volumes: Volume nomeado 'database' montado no diretório de dados do PostgreSQL
    volumes:
      - database:/var/lib/postgresql/data # Nota: Caminho corrigido para /var/lib/postgresql/data

# Seção de volumes: Define volumes nomeados para dados persistentes
volumes:
  # Volume nomeado para persistência do banco de dados
  database:
    # Este volume persiste os dados mesmo se o contêiner for removido
```

```yml
# Inicializa o contêineres que foram definidos no arquivo docker-compose.yml
docker-compose up -d

# Encerra e remove tudo que foi criado com "docker-compose up"
docker-compose down

# Verifica os containeres que ainda estão em execução
docker-compose ps

# se conecta ao banco pelo terminal
docker ps
docker exec -it <nome_container> /bin/sh
```

> ERROR: Network "caixaup_default" needs to be recreated - option "com.docker.network.enable_ipv6" has changed.

- Solução: `docker network rm caixaup_default` --> `docker-compose --env-file <caminho_arquivo_env> up -d`
- `--env-file <caminho_arquivo_env>`: o docker compose por padrão procura o .env na raiz do projeto. Desse modo, é necessário indicar o caminho do arquivo .env caso não esteja na raiz.

### Erros/Bugs Identificados - Configuração Infraestrutura

#### Erro do esbuild ao subir o container no Windows

| Item           | Detalhe                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------- |
| **Projeto**    | caixaup (API Node.js + PostgreSQL)                                                                |
| **Contexto**   | Projeto desenvolvido no Ubuntu, agora executado com Docker no Windows                             |
| **Sintoma**    | O container `caixaup_dev` falha ao iniciar com `TransformError` do esbuild                        |
| **Causa raiz** | O `node_modules` do Windows foi parar dentro do container Linux                                   |
| **Solução**    | Instalar as dependências dentro do container e impedir que o `node_modules` do host o sobrescreva |

Ao executar `npm run dev`, o container encerra com esta mensagem:

```
Specifically the "@esbuild/win32-x64" package is present but this platform
needs the "@esbuild/linux-x64" package instead.
...
name: 'TransformError'
```

O esbuild (usado pelo `npm run dev`) distribui um **binário nativo diferente para cada plataforma**. O `npm install` baixa apenas o binário do sistema em que roda:

- No Windows: `@esbuild/win32-x64`
- No container (Alpine Linux): `@esbuild/linux-x64`
  Dois pontos da configuração original faziam o `node_modules` do Windows chegar ao container:

1. **Bind mount no `docker-compose.yml`:** a linha `./api/:/app` substitui todo o `/app` do container pelos arquivos do host, incluindo o `node_modules` instalado no Windows.
2. **`Dockerfile`:** o `ADD . /app` copiava o `node_modules` do host para a imagem, e o `CMD npm install` não instalava nada durante o build. Ele era apenas o comando padrão e acabava sobrescrito pelo `command: npm run dev` do compose.
   No Ubuntu o problema não aparecia porque host e container eram Linux, então os binários eram compatíveis.

| **CORREÇÃO APLICADA** |
| :-------------------- |

```
<!-- CRIAÇÃO DE UM DOCKERFILE -->
node_modules
npm-debug.log
.git
.env

<!-- impede que o `node_modules` do host seja copiado para a imagem durante o build. O `.env` também fica de fora para não embutir segredos na imagem, já que as variáveis chegam pelo compose. -->
```

```dockerfile
# REESCREVE O DOCKERFILE
FROM node:18-alpine

RUN apk add --no-cache sqlite

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
```

| Mudança                                          | Motivo                                                                                                                                                                 |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RUN npm ci` durante o build                     | Instala as dependências no Linux, gerando o binário `@esbuild/linux-x64` correto. `npm ci` segue exatamente o `package-lock.json`, o que garante builds reproduzíveis. |
| `COPY package*.json` antes do restante do código | Aproveita o cache de camadas: se só o código mudar, o Docker não reinstala as dependências.                                                                            |
| `COPY` no lugar de `ADD`                         | `ADD` tem comportamentos extras (extrai arquivos e aceita URLs). `COPY` é a opção recomendada para cópia simples.                                                      |
| `chown node:node /app` e `--chown`               | O `WORKDIR` é criado como `root`. Como o processo roda como `USER node`, sem isso o `npm` não teria permissão de escrita.                                              |
| `apk add --no-cache`                             | Não guarda o cache de pacotes na imagem, deixando-a menor.                                                                                                             |

```yml
    volumes:
      - ./api/:/app
      - api_node_modules:/app/node_modules

volumes:
  database:
  api_node_modules:

```

o bind mount `./api/:/app` continua necessário para editar o código no host e ver as mudanças no container. O volume nomeado `api_node_modules`, montado por cima de `/app/node_modules`, **esconde o `node_modules` do Windows** e mantém o que foi instalado na imagem. Na primeira execução, o Docker popula esse volume com o conteúdo da imagem, que é a versão Linux.

[Retornar ao sumário](#sumario)

---

## Configuração da Base de Dados

### Sequelize

```bash
# Cria uma configuração padrão dentro do diretório
npx sequelize init
```

> OBS: OS SCRIPTS CRIADOS ESTARÃO EM JAVASCRIPT

**Arquivo `.sequelizerc`** - indica o local dos diretórios de configuração da base de dados.

```typescript
// O local para config e models-path aponta para pasta build que é compilada em js
// As demais pastas já estarão em js
module.exports = {
  config: path.resolve(__dirname, "build", "database", "config", "database.js"),
  "models-path": path.resolve(__dirname, "build", "database", "models"),
  "migrations-path": path.resolve(__dirname, "src", "database", "migrations"),
  "seeders-path": path.resolve(__dirname, "src", "database", "models"),
};
```

_Nota: como as variáveis de ambiente foram definidas dentro do container, os comandos referentes ao banco deve ser feito dentro do container._

```bash
# Cria a base de dados
npx sequelize db:create

# Cria uma tabela na base de dados
npx sequelize migration:generate --name <nome_tabela>

# Sobe uma migration
npx sequelize db:migrate

# Reverte a ùltima migration aplicada
npx sequelize db:migrate:undo

# Reverte todas as migration aplicada
npx sequelize db:migrate:undo:all

# Reverte uma migration específica
npx sequelize db:migrate:undo --name <nome_migration.js>
```

```typescript
// Relacionamento de Tabelas

expenses_id: {
  type: Sequelize.INTEGER,
  // referencia o campo da tabela expense que será utilizado no relacionamento
  references: {
    model: "expense",
    key: "id"
  },
  // As modificações realizadas em expenses devem ser refletidas em payment_types
  onUpdate: "CASCADE",
  onDelete: "CASCADE"
}
```

### Erros/Bugs Identificados - Configuração Base de Dados

#### Bug do TypeScript com Sequelize

O Typescript compila os campos `public <nome_atributo>!: type` como propriedades próprias da instância que são criadas depois que o construtor do Model já
configurou os getters/setters no prototype. Assim, os propriedades contendo `undefined` sobrescreve/esconde o getter que o sequelize define no prototype para aquele atributo.

> Observação: O Model.create() internamente já populou this.dataValues com os valores corretos antes dos campos de classe rodarem por cima. O INSERT usa dataValues, então o banco recebe tudo certinho. Mas quando você lê record.userId depois, o JS está lendo a propriedade própria (sobrescrita = undefined), não o getter que retornaria o valor real de dataValues.

```typescript
// TROCA `public` por `declare`
export class BoxBottomModel
  extends Model<BoxBottom, BoxBottomCreationAttributes>
  implements BoxBottom
{
  declare boxBottomId: string;
  declare userId: string;
  declare name: string;
  declare description: string;
  declare targetValue: number;
  declare created_at: string | undefined;
  declare updated_at: string | undefined;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    /* ...sem mudanças... */
  }
}
```

[Retornar ao sumário](#sumario)

---

## Configurando Ambiente de Teste

### Configuração do Jest

```bash
# INSTALAÇÃO DE DEPENDÊNCIAS

npm install - save-dev jest ts-jest @types/jest @jest/globals supertest @types/supertest
```

| CONFIGURAÇÃO DO JEST.CONFIG.TS |
| :----------------------------- |

```typescript
import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const presetConfig = createDefaultEsmPreset({});

export default {
  ...presetConfig,
  testEnvironment: "node",
  testMatch: [
    "**/tests/**/*.test.ts",
    "**/__tests__/**/*.test.ts",
    "**/?(*.)+(spec|test).ts",
  ],
  moduleNameMapper: {
    // trata exigências da extensão .js nas importações
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testTimeout: 30000,
} satisfies Config; // segurança de tipos para configuração do Jest
```
