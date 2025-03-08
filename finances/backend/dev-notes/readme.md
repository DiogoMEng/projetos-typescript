# DOCKERFILE

Utilizado para buildar a imagem do backend para o container Docker.

```dockerfile
# Utiliza a imagem do node
FROM node:16.14-alpine

# Informar a pasta de trabalho que será utilizado dentro do container
WORKDIR /app-backend

# Copia tudo que tem package para o container
# -- COPY <diretorio_local> <diretorio_container>
COPY package* .

# Instala as depências no container
RUN npm install

# Copia todos os arquivos de /backend para o container
COPY . .

# Comando padrão para rodar no container
ENTRYPOINT ["npm", "run"]

CMD ["dev"]
```

---

# DOCKER-COMPOSE

Ferramenta que permite definir e gerenciar vários containers do Docker.

```yml
version: '3'

# Declara todos os serviços que serão executados
services:
  # Serviço de backend
  backend:
    # Cria uma imagem a partir do dockerfile presente em ./backedn
    build: ./backend
    # Porta em que o serviço será executado
    ports:
      - 3000:3000
    # Variáveis de ambientes necessárias para conexão com a base de dados
    environment:
      - DB_USER=root
      - DB_PASS=password
      - DB_NAME=finances
      - DB_HOST=db
      - JWT_SECRET=c03a21ed65f4dsfd1aAD21F3ASF5AS
    # Todas as alterações locais serão refletidas dentro do container
    volumes:
      - ./backend:/app-backend
    container_name: finances_backend
    # Container restarta toda vez que cair
    restart: always
    # Informa que o serviço de backend depende do serviço de banco de dados para funcionar
    depends_on:
      - db
  
  db:
    # Imagem do banco de dados que será utilizado
    image: mysql
    ports:
      - 3306:3306
    environment:
      - MYSQL_ROOT_PASSWORD=password
    restart: always
```

```yml
# Inicializa o contêineres que foram definidos no arquivo docker-compose.yml
docker-compose up -d
```

---

# SEQUELIZE

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