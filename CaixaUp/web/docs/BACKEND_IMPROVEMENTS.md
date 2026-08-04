# Melhorias do Backend

## Diagnóstico técnico
Durante a criação de categorias no sistema CaixaUp, a API estava respondendo com `HTTP 400 (Bad Request)` com a mensagem de banco de dados: `WHERE parameter "user_id" has invalid "undefined" value`.
A análise aprofundada concluiu que:
1. O fluxo e o payload enviados pelo Frontend estão 100% corretos.
2. O problema começa no serviço de Autenticação (`Auth.service.ts`). O JWT (Token) gerado não contém as informações do usuário (o `userId` fica `undefined`).
3. Como o Token fica vazio, o middleware de validação (`checkAuth.ts`) repassa `undefined` no objeto Request (`req.userId`).
4. Quando o `CategoryController` processa o payload e adiciona o `req.userId`, ele constrói um objeto de categoria onde a foreign key do usuário é vazia.
5. O `CategoryService.beforeCreate` verifica a duplicidade consultando o banco. A query é montada com `user_id = undefined`, o que resulta na sintaxe inválida e causa a rejeição pelo ORM (Sequelize).
6. A função utilitária `catchAsync` trata esse erro nativo de banco como um simples "Bad Request 400", camuflando o erro real.

**A Raiz do Problema:**
No arquivo `api/tsconfig.json`, a flag `"target": "es2022"` (ou superior) ativa a propriedade intrínseca `"useDefineForClassFields": true`.
Devido a isso, quando o TypeScript compila classes herdadas como `export class UserModel extends Model`, propriedades escritas como `public userId!: string;` são traduzidas como `this.userId = undefined` dentro do construtor Javascript final, o que **sobrescreve e apaga** os `getters/setters` dinâmicos do Sequelize que carregariam os valores oriundos do banco de dados.

---

## Arquivos afetados
- `api/tsconfig.json`
- `api/src/database/models/User.model.ts` (e demais Models como `Category.model.ts`, etc.)
- `api/src/services/auth.service.ts`

---

## Melhorias recomendadas
- Desabilitar a sobrescrição arbitrária de variáveis nas classes Models.
- Utilizar os modificadores corretos (`declare`) exigidos pelas novas versões do TypeScript ao mapear models com Sequelize.
- Melhorar a função de tratamento `catchAsync` / Middleware de erro para diferenciar entre problemas de constraint (500) de problemas de payload malformado (400).

---

## Correções necessárias

### Opção A: Alteração Arquitetural (Recomendada)
Em todos os modelos do banco (`User.model.ts`, `Category.model.ts`, etc.), adicionar o prefixo `declare` nas propriedades para que o TypeScript saiba que elas já existem dinamicamente (no ORM) e não devem ser inicializadas no construtor.

### Opção B: Configuração Global no TSConfig (Alternativa Rápida)
Adicionar explicitamente no `api/tsconfig.json`:
```json
{
  "compilerOptions": {
    "useDefineForClassFields": false
  }
}
```

### Opção C: Extração segura via Getters (Contorno Rápido)
Modificar o `Auth.service.ts` para capturar os campos usando `.get()`:
```typescript
const accessToken = sign(
  { userId: user.get('userId'), email: user.get('email') },
  JWT_SECRET!,
  { expiresIn: '5d' }
);
```

---

## Justificativa técnica
- Evita comportamentos anômalos onde objetos retornados perfeitamente pelo banco têm seus valores setados retroativamente para `undefined` por conta do transpiler de classes ES2022 do NodeJS.
- Preserva a arquitetura de banco de dados fortemente tipada no Sequelize, resolvendo falhas de constraint relativas a relacionamentos ausentes que derrubam o sistema sem stack traces claros na superfície.

---

## Exemplos de código (Opção A)
**Arquivo:** `api/src/database/models/User.model.ts`
```typescript
export class UserModel extends Model<User, UserCreationAttributes> implements User {
  // Alteração: adição da palavra-chave 'declare'
  declare public userId: string;
  declare public email: string;
  declare public name: string;
  declare public password: string;

  declare public userPermissions?: RUBBModel[];

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
  
  // ...
}
```

---

## Ordem correta de implementação
1. Alterar as propriedades no `User.model.ts` incluindo a tag `declare`.
2. Compilar o backend para atestar que não há quebras de tipagem.
3. Subir a API e testar uma requisição POST de `/login`.
4. Avaliar o Payload do JWT (utilizando JWT Decode) garantindo que `userId` e `email` estão populados, resolvendo a falha sistêmica.

---

## Impactos esperados
- **Benefícios:** Estabiliza todas as rotas protegidas por autenticação. Acaba com o erro crônico 400 ao salvar e manipular dados (Categorias, Boxes, Transações).
- **Riscos:** Nenhum risco estrutural. Utilizar a tag `declare` é a recomendação oficial da documentação do Sequelize para projetos Typescript modernos.

---

## Como validar
1. Execute o fluxo de login no Frontend (ou via Curl/Postman).
2. Acesse a rota de criação de categoria.
3. Verifique o Response HTTP. Deve retornar Status 201 Created com os dados da nova entidade (provando que o payload `userId` circulou adequadamente pelo middleware, pelo serviço e foi injetado na tabela sql).

---

## Checklist final
- [x] Raiz do erro mapeada detalhadamente;
- [x] Soluções recomendadas avaliadas (3 opções sugeridas);
- [x] Tipagem documentada.
- [x] Consequências listadas.
