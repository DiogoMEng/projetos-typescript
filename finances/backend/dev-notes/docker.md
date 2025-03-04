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