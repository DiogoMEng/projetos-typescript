# API DE AUTENTICAÇÃO COM JWT

# <p id="dependencias">Dependências de Projeto</p>

`express-async-errors`: utilizado para o gerenciamento de erros.

`pg`: banco de dados PostgreSQL.

`reflect-metadata`: requisito necessário para o typeORM.

`typeORM`: utilizado para lidar com as transações de banco de dados.

**AppDataSource** - arquivo de conexão com o banco de dados utilizando o typeORM.
- O arquivo deverá ser primeiramente inicializado para a aplicação poder iniciar.

```typescript
export const AppDataSource = new DataSource({
	type: <tipo de banco de dados que será utilizado>,
	host: process.env.DB_HOST,
	port: port,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	entities: <caminho para entidades>,
	migrations: <caminho para migrations>,
})
```

**errorMiddleware** - Middleware para o tratamente de erro.
- retorna qualquer exceção que pode ter acontecidade no sistema.

O arquivo api-erros dentro da pasta helpers contém abstrações do erro padrão do Node, onde a partir dele é possível criar as classes independentes de erros.

## Instalando e Criando Banco de Dados PostgreSQL

Etapas para instalação do postgresql:
```bash
sudo apt update

sudo apt install postgresql postgresql-contrib

# VERIFICAÇÃO DE INSTALAÇÃO
sudo systemctl status postgresql

# CASO NÃO ESTEJA RODANDO
sudo systemctl start postgresql
```

Etapas para criar o banco de dados:
```bash
sudo -u postgres psql

CREATE DATABASE <database_name>

# VERIFICA SE O BANCO FOI CRIADO
\l
```

---

# <p id="criando-entidades">Criando as Entidades</p>

```typescript
// // DECORATOR ENTITY - Informa o nome da entidade.
// // --> Nome da tabela que será criada no banco.
// --> Informar que a classe irá mapear a tabela do banco
@Entity('users')
export class User {
	// Decorator que cria uma chave primária e um campo autoincremento
	@PrimaryGeneratedColumn()
  id: number

	// Informa que o atributo será uma coluna do tipo texto
	@Column({ type: 'text' })
  name: string

	// Informa que o campo além de ser do tipo texto, deverá ser unico dentro da base de dados--
	@Column({ type: 'text', unique: true })
  email: string
	...
}
```

Script de **Criação da migration**:
- configura todo banco de dados.

```bash
# O comando a baixo só deve ser utilizado depois de criado a entidade

# CRIAÇÃO DA MIGRATION #
npm run migration:generate

# EXECUTANDO A MIGRATION #
npm run migration:run
```

> OBS: PARA A MIGRATION SER CRIADO A CAMINHO DAS ENTIDADES E O LOCAL QUE TERÁ AS MIGRATIONS DEVEM SER INFORMADOS EM DATA-SOURCE.

```typescript
// Repositório para realizar todas as operações de banco de dados através
// da entidade user

export const userRepository = AppDataSource.getRepository(User);
```

# <p id="controller-user">Controller User</p>

```typescript
// Verifica busco o email na base
		const userExists = await userRepository.findOneBy({
      email
    })

// Realiza uma verificação caso o e-mail já exista dentro da base de dados
    if (userExists) {
      throw new BadRequestError('Este e-mail já existe');
    }

// Criptografa a senha
// O segundo parâmetro chamado de salt não deve ter valor superior a 10 para evitar a lentidão de processamento
		const hashPassword = await bcrypt.hash (password, 10);

// Cadastra o usuário na base de dados
		await userRepository.save(newUser);
```

A autenticação do usuário será feito por meio de um **token de autenticação**, que simboliza uma assinatura que comprova que o usuário ter permissão para acessar determinado conteúdo.

```typescript
// Verificação de senha passada no formulário com a senha salva na base de daddos.

// O método abaixo irá retorna um booleano
const verifyPass = await bcrypt.compare(password, user.password);
```

```typescript
// Criação do Token de usuário
    const token = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_PASS ?? '',
      {
        expiresIn: '7d'
      }
    )
```

> OBS: PARA TOKEN PODER SER VÁLIDO NO SISTEMA É IMPORTANTE QUE `process.env.JWT_PASS` SEJA VÁLIDO.

```typescript
// Recebendo token de usuário para validação em uma rota
// -- authorization: propriedade dentro do header para passar o token da requisição

const { authorization } = req.headers;
```

**`Bearer Token`** - formato de token que enviado para API.

> OBS: O TOKEN SEMPRE DEVE SER ENVIADO NO FORMATO DE **BEARER TOKEN**.

```typescript
// Retornará o ID do usuário caso o token passado exista
// -- retorna todos os dados de payload do usuário

const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload;
```

# <p id="arquivo-types">Arquivo de Types</p>

Arquivo `express.d.ts` - arquivo tipo da aplicação backend onde será configurada algumas
informações do express.

```typescript
// Declara a criação de um módulo global
declare global {
	// -- Utilizado para sobreescrever os dados do express
  namespace Express {
    export interface Request {
			// Informa que a propriedade pode ser utilizado de forma parcial
      user: Partial<User>
    }
  }
}
```

No arquivo `tsconfig.json` há uma propriedade chamada `typeRoots` que serve para
sinalizar a localidade das bibliotecas de tipos que foram criadas