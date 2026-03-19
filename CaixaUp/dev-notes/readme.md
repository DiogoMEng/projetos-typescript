# Notação de Projeto: Igapó Certo

# <p id="sumario">Sumário</p>

Parte 1: <a href="#docker" style="font-weight: bold">Configuração do Docker</a>
- <a href="#dockerfile">DockerFile</a>
- <a href="#docker-compose">Docker-Compose</a>

Parte 2: <a href="#orm" style="font-weight: bold">Configuração de Conexão do Banco de Dados</a>
- <a href="#sequelize">Sequelize</a>

---

# <p id="docker">Configuração do Docker</p>

## <p id="dockerfile">DockerFile</p>

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

## <p id="docker-compose">Docker-Compose</p>

Ferramenta que permite definir e gerenciar vários containers do Docker.

```yml
# Configuração do Docker Compose para o projeto Finances
# Este arquivo define os serviços, redes e volumes para executar a aplicação em contêineres.
# Inclui serviços de desenvolvimento, teste e banco de dados.

# Versão do formato do Docker Compose (opcional, mas boa prática)
version: '3.8'

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
      - DB_USER=postgres          # Nome de usuário do banco de dados
      - DB_PASS=admin123          # Senha do banco de dados
      - DB_NAME=finances_db       # Nome do banco de dados
      - DB_HOST=db                # Host do banco de dados (refere-se ao serviço db)
      - JWT_SECRET=c03a21ed65f4dsfd1aAD21F3ASF5AS  # Chave secreta para tokens JWT
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
      - POSTGRES_USER=postgres      # Nome de usuário superusuário padrão
      - POSTGRES_PASSWORD=admin123  # Senha para o superusuário
      - POSTGRES_DB=finances_db     # Nome do banco de dados padrão a ser criado
    # Mapeamento de portas: porta do host 5432 para porta do contêiner 5432
    ports:
      - "5432:5432"
    # Volumes: Volume nomeado 'database' montado no diretório de dados do PostgreSQL
    volumes:
      - database:/var/lib/postgresql/data  # Nota: Caminho corrigido para /var/lib/postgresql/data

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

--- <a href="#sumário">Retornar ao sumário</a> ---

---

# <p id="orm" >Configuração de Conexão do Banco de Dados</p>

## <p id="sequelize" >Sequelize</p>

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
  "config": path.resolve(__dirname, "build", "database", "config", "database.js"),
  "models-path": path.resolve(__dirname, "build", "database", "models"),
  "migrations-path": path.resolve(__dirname, "src", "database", "migrations"),
  "seeders-path": path.resolve(__dirname, "src", "database", "models"),
}
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