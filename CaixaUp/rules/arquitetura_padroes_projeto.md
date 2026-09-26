# 📐 GUIA DE ARQUITETURA E PADRÕES DO PROJETO

---

## 🎯 VISÃO GERAL

Este documento define os padrões arquitetônicos, princípios de design e práticas de codificação que devem ser seguidos **rigorosamente** em todo o desenvolvimento do projeto. O objetivo é garantir um código:
- **Escalável** e fácil de manter
- **Bem estruturado** e documentado
- **Testável** e resiliente
- **Consistente** em toda a base de código
- **Eficiente** em performance e usabilidade

---

## 1️⃣ DESIGN PATTERNS (Padrões de Projeto)

### Obrigatoriedade
Todo o código desenvolvido **DEVE** seguir os padrões de design estabelecidos. Nenhuma função, classe ou módulo deve ser criado sem considerar qual padrão de projeto se aplica melhor.

### Padrões Obrigatórios por Contexto

#### **Backend/API:**
- **Singleton**: Para gerenciar conexões com banco de dados, caches e configurações globais
- **Factory**: Para criação de objetos complexos e instâncias de serviços
- **Repository**: Para abstrair acesso a dados e facilitar testes
- **Observer**: Para sistemas de notificação e eventos
- **Strategy**: Para implementar algoritmos intercambiáveis
- **Dependency Injection**: Para facilitar testes e manutenção
- **Adapter**: Para integração com sistemas externos
- **Facade**: Para simplificar interfaces complexas

#### **Frontend:**
- **Component Pattern**: Todo elemento visual deve ser um componente reutilizável
- **Container/Presentational**: Separação clara entre lógica e apresentação
- **Higher Order Components (HOC)**: Para reutilização de lógica entre componentes
- **Render Props**: Para compartilhamento de estado e comportamento
- **Custom Hooks**: Para lógica compartilhada em aplicações React
- **Observer/Pub-Sub**: Para gerenciamento de estado global
- **Strategy**: Para diferentes formas de renderização condicional

### Validação de Padrões
- [ ] Toda classe possui responsabilidade única bem definida
- [ ] Interfaces de padrões estão claramente implementadas
- [ ] Documentação de qual padrão foi aplicado está presente no código

---

## 2️⃣ CLEAN CODE (Código Limpo)

### Princípios Fundamentais

#### **A. Nomenclatura Clara e Significativa**
```
✗ ERRADO:
function calc(a, b) { return a + b; }
let d = new Date();
const x = getUserData(id);

✓ CORRETO:
function calculateTotalPrice(basePrice, taxAmount) { 
  return basePrice + taxAmount; 
}
let currentDate = new Date();
const userData = getUserData(userId);
```

**Regras:**
- Nomes devem revelar intenção
- Evitar abreviações exceto variáveis de loop (i, j, k)
- Nomes de funções começam com verbos (get, set, calculate, validate, create, delete)
- Nomes de variáveis booleanas começam com "is", "has", "should", "can"
- Constantes em UPPER_SNAKE_CASE

#### **B. Funções e Métodos**
```
✗ ERRADO:
function processUserAndSendEmail(user, emailTemplate, notification, logger) {
  // 200 linhas de código...
  // Valida usuário
  // Formata template
  // Envia email
  // Log de tudo
}

✓ CORRETO:
function processUserAndSendEmail(user, emailTemplate, notification, logger) {
  validateUser(user);
  const formattedTemplate = formatEmailTemplate(emailTemplate, user);
  sendEmail(user.email, formattedTemplate);
  logEmailSent(logger, user.id);
}
```

**Regras:**
- Máximo de 3-4 parâmetros (usar objeto se precisar mais)
- Máximo de 20 linhas de código por função
- Uma responsabilidade por função
- Sem efeitos colaterais não documentados
- Sem "flag parameters" (evitar parâmetros booleanos)

#### **C. Tratamento de Erros**
```
✗ ERRADO:
try {
  const data = fetchData();
  return data;
} catch (e) {
  console.log("Erro");
}

✓ CORRETO:
try {
  const data = await fetchUserData(userId);
  return data;
} catch (error) {
  logger.error('Falha ao buscar dados do usuário', {
    userId,
    errorMessage: error.message,
    stack: error.stack
  });
  throw new UserDataFetchError(
    `Não foi possível buscar dados do usuário ${userId}`,
    error
  );
}
```

**Regras:**
- Sempre tratar erros explicitamente
- Nunca swallow exceptions (engolir exceções)
- Usar tipos de erro específicos
- Logar contexto completo do erro
- Não retornar null, usar Optional/Result pattern

#### **D. Comentários**
```
✗ ERRADO:
// Incrementa i
i++;

// Verifica se usuário existe
if (user) { ... }

✓ CORRETO:
// Usar apenas para explicar POR QUÊ, não O QUÊ
// O algoritmo de validação segue RFC 5322 porque
// precisamos aceitar alguns casos edge cases não-padrão
function validateEmail(email) { ... }

// Documentar decisões arquitetônicos
// FIXME: Refatorar quando a biblioteca X for atualizada
// TODO: Otimizar query quando implementar índices no DB
```

**Regras:**
- Mínimo de comentários possível
- Código auto-explicativo é melhor que comentários
- Comentários devem explicar decisões, contexto, limitações
- Manter comentários atualizados com o código

#### **E. Formatação e Estrutura**
```
✓ ESTRUTURA CORRETA:
import statements
constants
types/interfaces
classes/functions
exports

- Máximo 80-100 caracteres por linha
- Indentação consistente (2 ou 4 espaços)
- Linhas em branco entre métodos
- Sem trailing whitespace
```

**Regras:**
- Usar formatador automático (Prettier, ESLint)
- Máximo 300 linhas por arquivo
- Organizar imports alfabeticamente
- Agrupar imports por: externas, internas, tipos

#### **F. Complexidade**
```
✗ ERRADO (Complexity muito alta):
function process(data) {
  if (a) {
    if (b) {
      if (c) {
        if (d) {
          // 10 níveis de aninhamento
        }
      }
    }
  }
}

✓ CORRETO (Guard clauses):
function process(data) {
  if (!isValid(data)) return;
  if (!hasPermission(data)) return;
  if (!isEnabled(data)) return;
  
  // Código principal
}
```

**Regras:**
- Máximo de 10 de Cyclomatic Complexity
- Evitar deep nesting (máximo 3 níveis)
- Usar guard clauses
- Extrair lógica complexa em funções nomeadas

### Checklist Clean Code
- [ ] Nomes significativos em todo o código
- [ ] Funções com responsabilidade única
- [ ] Máximo 20 linhas por função
- [ ] Máximo 3-4 parâmetros por função
- [ ] Sem código duplicado (DRY - Don't Repeat Yourself)
- [ ] Tratamento de erros explícito
- [ ] Sem hard-coded magic numbers
- [ ] Código formatado consistentemente
- [ ] Complexidade ciclomática baixa
- [ ] Fácil de ler e entender

---

## 3️⃣ PRINCÍPIOS SOLID

### S - Single Responsibility Principle (SRP)
**Uma classe deve ter uma única razão para mudar.**

```typescript
// ✗ VIOLAÇÃO
class User {
  private name: string;
  private email: string;

  saveToDatabase() { /* ... */ }
  sendEmail() { /* ... */ }
  generateReport() { /* ... */ }
  validateEmail() { /* ... */ }
  logAction() { /* ... */ }
}

// ✓ CORRETO
class User {
  constructor(private name: string, private email: string) {}
  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
}

class UserRepository {
  save(user: User): void { /* ... */ }
  findById(id: string): User { /* ... */ }
}

class EmailService {
  send(to: string, message: string): void { /* ... */ }
}

class UserValidator {
  validateEmail(email: string): boolean { /* ... */ }
  validateName(name: string): boolean { /* ... */ }
}

class UserLogger {
  logAction(userId: string, action: string): void { /* ... */ }
}
```

### O - Open/Closed Principle (OCP)
**Aberto para extensão, fechado para modificação.**

```typescript
// ✗ VIOLAÇÃO
class PaymentProcessor {
  processPayment(type: string, amount: number) {
    if (type === 'credit_card') {
      // processar cartão
    } else if (type === 'paypal') {
      // processar paypal
    } else if (type === 'bitcoin') {
      // processar bitcoin
    }
  }
}

// ✓ CORRETO
interface PaymentStrategy {
  process(amount: number): Promise<boolean>;
}

class CreditCardPayment implements PaymentStrategy {
  async process(amount: number): Promise<boolean> { /* ... */ }
}

class PayPalPayment implements PaymentStrategy {
  async process(amount: number): Promise<boolean> { /* ... */ }
}

class BitcoinPayment implements PaymentStrategy {
  async process(amount: number): Promise<boolean> { /* ... */ }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}
  async processPayment(amount: number): Promise<boolean> {
    return await this.strategy.process(amount);
  }
}
```

### L - Liskov Substitution Principle (LSP)
**Subclasses devem ser substituíveis por suas classes base.**

```typescript
// ✗ VIOLAÇÃO
class Bird {
  fly(): void { /* ... */ }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error('Pinguins não voam!');
  }
}

// ✓ CORRETO
interface Bird {
  move(): void;
}

class FlyingBird implements Bird {
  move(): void {
    this.fly();
  }
  private fly(): void { /* ... */ }
}

class Penguin implements Bird {
  move(): void {
    this.swim();
  }
  private swim(): void { /* ... */ }
}
```

### I - Interface Segregation Principle (ISP)
**Clientes não devem ser forçados a depender de interfaces que não usam.**

```typescript
// ✗ VIOLAÇÃO
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class Robot implements Worker {
  work(): void { /* ... */ }
  eat(): void { throw new Error('Robôs não comem'); }
  sleep(): void { throw new Error('Robôs não dormem'); }
}

// ✓ CORRETO
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class Robot implements Workable {
  work(): void { /* ... */ }
}

class Human implements Workable, Eatable, Sleepable {
  work(): void { /* ... */ }
  eat(): void { /* ... */ }
  sleep(): void { /* ... */ }
}
```

### D - Dependency Inversion Principle (DIP)
**Dependa de abstrações, não de concretizações.**

```typescript
// ✗ VIOLAÇÃO
class UserService {
  private database = new MySQLDatabase();
  
  getUser(id: string) {
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// ✓ CORRETO
interface IDatabase {
  query(sql: string): Promise<any>;
}

class UserService {
  constructor(private database: IDatabase) {}
  
  getUser(id: string) {
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

class MySQLDatabase implements IDatabase {
  async query(sql: string): Promise<any> { /* ... */ }
}

class MongoDBDatabase implements IDatabase {
  async query(sql: string): Promise<any> { /* ... */ }
}
```

### Checklist SOLID
- [ ] Cada classe tem responsabilidade única
- [ ] Classes são abertas para extensão mas fechadas para modificação
- [ ] Subclasses podem substituir classes pai sem quebrar comportamento
- [ ] Interfaces são específicas (não genéricas)
- [ ] Dependências injetadas via constructor
- [ ] Abstrações usadas ao invés de concretizações

---

## 4️⃣ PADRÕES GOF (Gang of Four)

### Introdução
Os 23 padrões GoF são divididos em 3 categorias. Neste projeto, os seguintes são **obrigatórios** conforme contexto:

### PADRÕES CRIACIONAIS

#### **1. Singleton**
Garante uma única instância de uma classe e fornece ponto de acesso global.

```typescript
class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor(private connectionString: string) {}

  static getInstance(connectionString: string): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(connectionString);
    }
    return DatabaseConnection.instance;
  }

  connect(): void { /* ... */ }
}

// Uso
const db1 = DatabaseConnection.getInstance('postgresql://...');
const db2 = DatabaseConnection.getInstance('postgresql://...');
console.log(db1 === db2); // true
```

**Quando usar:** Loggers, Caches, Pool de conexões, Configurações globais

#### **2. Factory Method**
Cria objetos sem especificar as classes exatas.

```typescript
interface Document {
  open(): void;
  close(): void;
}

class PDFDocument implements Document {
  open(): void { console.log('PDF aberto'); }
  close(): void { console.log('PDF fechado'); }
}

class WordDocument implements Document {
  open(): void { console.log('Word aberto'); }
  close(): void { console.log('Word fechado'); }
}

abstract class Application {
  abstract createDocument(): Document;
  
  openDocument(): void {
    const doc = this.createDocument();
    doc.open();
  }
}

class PDFApplication extends Application {
  createDocument(): Document {
    return new PDFDocument();
  }
}

class WordApplication extends Application {
  createDocument(): Document {
    return new WordDocument();
  }
}
```

**Quando usar:** Criação de objetos complexos, Múltiplas implementações, APIs

#### **3. Abstract Factory**
Cria famílias de objetos relacionados sem especificar suas classes concretas.

```typescript
interface Button {
  render(): void;
}

interface Checkbox {
  render(): void;
}

interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class WindowsButton implements Button {
  render(): void { console.log('Windows Button'); }
}

class WindowsCheckbox implements Checkbox {
  render(): void { console.log('Windows Checkbox'); }
}

class WindowsFactory implements UIFactory {
  createButton(): Button { return new WindowsButton(); }
  createCheckbox(): Checkbox { return new WindowsCheckbox(); }
}

class MacButton implements Button {
  render(): void { console.log('Mac Button'); }
}

class MacCheckbox implements Checkbox {
  render(): void { console.log('Mac Checkbox'); }
}

class MacFactory implements UIFactory {
  createButton(): Button { return new MacButton(); }
  createCheckbox(): Checkbox { return new MacCheckbox(); }
}
```

**Quando usar:** Temas UI, Múltiplos SO, Variações de produtos

#### **4. Builder**
Constrói objetos complexos passo a passo.

```typescript
class User {
  constructor(
    private name: string,
    private email: string,
    private phone?: string,
    private address?: string,
    private age?: number
  ) {}
}

class UserBuilder {
  private name: string = '';
  private email: string = '';
  private phone?: string;
  private address?: string;
  private age?: number;

  setName(name: string): UserBuilder {
    this.name = name;
    return this;
  }

  setEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  setPhone(phone: string): UserBuilder {
    this.phone = phone;
    return this;
  }

  setAddress(address: string): UserBuilder {
    this.address = address;
    return this;
  }

  setAge(age: number): UserBuilder {
    this.age = age;
    return this;
  }

  build(): User {
    return new User(
      this.name,
      this.email,
      this.phone,
      this.address,
      this.age
    );
  }
}

// Uso
const user = new UserBuilder()
  .setName('João')
  .setEmail('joao@example.com')
  .setPhone('11999999999')
  .build();
```

**Quando usar:** Objetos com muitos parâmetros opcionais, Configurações complexas

#### **5. Prototype**
Cria novos objetos clonando um existente.

```typescript
interface Cloneable {
  clone(): Cloneable;
}

class User implements Cloneable {
  constructor(
    public id: string,
    public name: string,
    public email: string
  ) {}

  clone(): User {
    return new User(this.id, this.name, this.email);
  }
}

// Uso
const user1 = new User('1', 'João', 'joao@example.com');
const user2 = user1.clone();
user2.name = 'Maria';

console.log(user1.name); // João
console.log(user2.name); // Maria
```

**Quando usar:** Objetos custosos de criar, Cópia profunda

### PADRÕES ESTRUTURAIS

#### **1. Adapter**
Converte interface de uma classe em outra esperada pelos clientes.

```typescript
interface Target {
  request(): string;
}

class Adaptee {
  specificRequest(): string {
    return 'Adaptee request';
  }
}

class Adapter implements Target {
  constructor(private adaptee: Adaptee) {}

  request(): string {
    return this.adaptee.specificRequest();
  }
}

// Uso
const adaptee = new Adaptee();
const target = new Adapter(adaptee);
console.log(target.request());
```

**Quando usar:** Integração com sistemas legados, APIs incompatíveis

#### **2. Decorator**
Adiciona funcionalidades a objetos dinamicamente.

```typescript
interface Component {
  operation(): string;
}

class ConcreteComponent implements Component {
  operation(): string {
    return 'ConcreteComponent';
  }
}

abstract class Decorator implements Component {
  constructor(protected component: Component) {}

  operation(): string {
    return this.component.operation();
  }
}

class ConcreteDecoratorA extends Decorator {
  operation(): string {
    return `ConcreteDecoratorA(${super.operation()})`;
  }
}

class ConcreteDecoratorB extends Decorator {
  operation(): string {
    return `ConcreteDecoratorB(${super.operation()})`;
  }
}

// Uso
const component = new ConcreteComponent();
const decoratedA = new ConcreteDecoratorA(component);
const decoratedB = new ConcreteDecoratorB(decoratedA);
console.log(decoratedB.operation());
// ConcreteDecoratorB(ConcreteDecoratorA(ConcreteComponent))
```

**Quando usar:** Adicionar responsabilidades a objetos, Autenticação/Autorização

#### **3. Facade**
Fornece interface unificada para subsistema complexo.

```typescript
class SubSystemA {
  operationA(): string {
    return 'SubSystemA';
  }
}

class SubSystemB {
  operationB(): string {
    return 'SubSystemB';
  }
}

class Facade {
  private subSystemA = new SubSystemA();
  private subSystemB = new SubSystemB();

  operation(): string {
    return this.subSystemA.operationA() + ' ' + this.subSystemB.operationB();
  }
}

// Uso
const facade = new Facade();
console.log(facade.operation());
```

**Quando usar:** Simplificar APIs complexas, Encapsular múltiplas classes

#### **4. Proxy**
Fornece substituto para controlar acesso a outro objeto.

```typescript
interface Subject {
  request(): void;
}

class RealSubject implements Subject {
  request(): void {
    console.log('RealSubject: Processando requisição');
  }
}

class Proxy implements Subject {
  private realSubject?: RealSubject;

  request(): void {
    if (!this.checkAccess()) {
      console.log('Acesso negado');
      return;
    }
    this.realSubject ??= new RealSubject();
    this.logAccess();
    this.realSubject.request();
  }

  private checkAccess(): boolean {
    return true;
  }

  private logAccess(): void {
    console.log('Logging...');
  }
}

// Uso
const proxy = new Proxy();
proxy.request();
```

**Quando usar:** Lazy loading, Controle de acesso, Logging, Caching

#### **5. Bridge**
Desacopla abstração de sua implementação.

```typescript
interface Implementor {
  operationImpl(): string;
}

class ConcreteImplementorA implements Implementor {
  operationImpl(): string {
    return 'Implementor A';
  }
}

class ConcreteImplementorB implements Implementor {
  operationImpl(): string {
    return 'Implementor B';
  }
}

abstract class Abstraction {
  constructor(protected implementor: Implementor) {}

  operation(): string {
    return this.implementor.operationImpl();
  }
}

class RefinedAbstraction extends Abstraction {
  operation(): string {
    return `RefinedAbstraction: ${super.operation()}`;
  }
}

// Uso
const implA = new ConcreteImplementorA();
const absA = new RefinedAbstraction(implA);
console.log(absA.operation()); // RefinedAbstraction: Implementor A
```

**Quando usar:** Múltiplas dimensões de variação, Evitar explosão de subclasses

### PADRÕES COMPORTAMENTAIS

#### **1. Observer**
Define dependência um-para-muitos entre objetos.

```typescript
interface Observer {
  update(subject: Subject): void;
}

class ConcreteObserverA implements Observer {
  update(subject: Subject): void {
    console.log('ConcreteObserverA: Reagindo ao evento');
  }
}

class Subject {
  private observers: Observer[] = [];

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notify(): void {
    this.observers.forEach(observer => observer.update(this));
  }
}

// Uso
const subject = new Subject();
const observerA = new ConcreteObserverA();
subject.attach(observerA);
subject.notify();
```

**Quando usar:** Event-driven systems, Pub-Sub, Notificações

#### **2. Strategy**
Define família de algoritmos encapsulados e intercambiáveis.

```typescript
interface Strategy {
  execute(a: number, b: number): number;
}

class ConcreteStrategyAdd implements Strategy {
  execute(a: number, b: number): number {
    return a + b;
  }
}

class ConcreteStrategySubtract implements Strategy {
  execute(a: number, b: number): number {
    return a - b;
  }
}

class Context {
  constructor(private strategy: Strategy) {}

  setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
  }

  executeStrategy(a: number, b: number): number {
    return this.strategy.execute(a, b);
  }
}

// Uso
const context = new Context(new ConcreteStrategyAdd());
console.log(context.executeStrategy(5, 3)); // 8

context.setStrategy(new ConcreteStrategySubtract());
console.log(context.executeStrategy(5, 3)); // 2
```

**Quando usar:** Múltiplos algoritmos, Processamento de pagamentos, Cálculos

#### **3. Command**
Encapsula uma requisição como um objeto.

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  private on = false;

  turnOn(): void {
    this.on = true;
    console.log('Luz ligada');
  }

  turnOff(): void {
    this.on = false;
    console.log('Luz desligada');
  }
}

class TurnOnLight implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOn();
  }

  undo(): void {
    this.light.turnOff();
  }
}

// Uso
const light = new Light();
const command = new TurnOnLight(light);
command.execute(); // Luz ligada
command.undo();    // Luz desligada
```

**Quando usar:** Undo/Redo, Job queues, Transações

#### **4. State**
Permite objeto alterar comportamento quando estado interno muda.

```typescript
interface State {
  handle(context: Context): void;
}

class ConcreteStateA implements State {
  handle(context: Context): void {
    console.log('Estado A: Transicionando para B');
    context.setState(new ConcreteStateB());
  }
}

class ConcreteStateB implements State {
  handle(context: Context): void {
    console.log('Estado B: Transicionando para A');
    context.setState(new ConcreteStateA());
  }
}

class Context {
  private state: State;

  constructor() {
    this.state = new ConcreteStateA();
  }

  setState(state: State): void {
    this.state = state;
  }

  request(): void {
    this.state.handle(this);
  }
}

// Uso
const context = new Context();
context.request(); // Estado A: Transicionando para B
context.request(); // Estado B: Transicionando para A
```

**Quando usar:** State machines, Workflows, Controle de fluxo

#### **5. Template Method**
Define estrutura de algoritmo em classe base, deixando passos para subclasses.

```typescript
abstract class AbstractClass {
  templateMethod(): void {
    this.step1();
    this.step2();
    this.step3();
  }

  abstract step1(): void;
  abstract step2(): void;
  step3(): void {
    console.log('Passo 3 padrão');
  }
}

class ConcreteClass extends AbstractClass {
  step1(): void {
    console.log('Passo 1 concreto');
  }

  step2(): void {
    console.log('Passo 2 concreto');
  }
}

// Uso
const concrete = new ConcreteClass();
concrete.templateMethod();
// Passo 1 concreto
// Passo 2 concreto
// Passo 3 padrão
```

**Quando usar:** Algoritmos com estrutura fixa, Frameworks, Herança

#### **6. Chain of Responsibility**
Passa requisição ao longo de cadeia de handlers.

```typescript
abstract class Handler {
  private nextHandler?: Handler;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handle(request: string): string {
    if (this.canHandle(request)) {
      return this.process(request);
    }
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return 'Requisição não processada';
  }

  abstract canHandle(request: string): boolean;
  abstract process(request: string): string;
}

class ConcreteHandlerA extends Handler {
  canHandle(request: string): boolean {
    return request === 'A';
  }
  process(request: string): string {
    return 'Handler A processou';
  }
}

// Uso
const handlerA = new ConcreteHandlerA();
const handlerB = new ConcreteHandlerB();
handlerA.setNext(handlerB);
console.log(handlerA.handle('A')); // Handler A processou
```

**Quando usar:** Logging, Requisições HTTP, Middleware

#### **7. Iterator**
Acessa elementos de coleção sequencialmente sem expor estrutura.

```typescript
interface Iterator<T> {
  next(): IteratorResult<T>;
  hasNext(): boolean;
}

interface Iterable<T> {
  getIterator(): Iterator<T>;
}

class ConcreteIterator<T> implements Iterator<T> {
  private index = 0;

  constructor(private collection: T[]) {}

  next(): IteratorResult<T> {
    return { value: this.collection[this.index++], done: this.index > this.collection.length };
  }

  hasNext(): boolean {
    return this.index < this.collection.length;
  }
}

class ConcreteCollection<T> implements Iterable<T> {
  constructor(private items: T[]) {}

  getIterator(): Iterator<T> {
    return new ConcreteIterator(this.items);
  }
}

// Uso
const collection = new ConcreteCollection([1, 2, 3]);
const iterator = collection.getIterator();
while (iterator.hasNext()) {
  console.log(iterator.next().value);
}
```

**Quando usar:** Coleções customizadas, Generators, Streams

#### **8. Mediator**
Define objeto que encapsula como conjunto de objetos interagem.

```typescript
interface Mediator {
  notify(sender: Colleague, event: string): void;
}

abstract class Colleague {
  constructor(protected mediator: Mediator) {}

  send(event: string): void {
    this.mediator.notify(this, event);
  }

  abstract receive(event: string): void;
}

class ConcreteMediator implements Mediator {
  private colleague1?: ConcreteColleague1;
  private colleague2?: ConcreteColleague2;

  registerColleague1(c: ConcreteColleague1): void {
    this.colleague1 = c;
  }

  registerColleague2(c: ConcreteColleague2): void {
    this.colleague2 = c;
  }

  notify(sender: Colleague, event: string): void {
    if (sender === this.colleague1) {
      this.colleague2?.receive(event);
    }
  }
}
```

**Quando usar:** Reduzir acoplamento, Chat rooms, Form validation

#### **9. Memento**
Captura e externaliza estado interno de objeto.

```typescript
class Memento {
  constructor(private state: string) {}

  getState(): string {
    return this.state;
  }
}

class Originator {
  private state: string = '';

  setState(state: string): void {
    this.state = state;
  }

  getState(): string {
    return this.state;
  }

  saveToMemento(): Memento {
    return new Memento(this.state);
  }

  restoreFromMemento(memento: Memento): void {
    this.state = memento.getState();
  }
}

// Uso
const originator = new Originator();
originator.setState('Estado 1');
const memento = originator.saveToMemento();
originator.setState('Estado 2');
originator.restoreFromMemento(memento);
console.log(originator.getState()); // Estado 1
```

**Quando usar:** Undo/Redo, Snapshots, Transações

#### **10. Visitor**
Representa operação a ser executada sobre elementos de estrutura.

```typescript
interface Visitor {
  visitConcreteElementA(element: ConcreteElementA): void;
  visitConcreteElementB(element: ConcreteElementB): void;
}

interface Element {
  accept(visitor: Visitor): void;
}

class ConcreteElementA implements Element {
  accept(visitor: Visitor): void {
    visitor.visitConcreteElementA(this);
  }

  operationA(): string {
    return 'Elemento A';
  }
}

class ConcreteVisitor implements Visitor {
  visitConcreteElementA(element: ConcreteElementA): void {
    console.log(`${element.operationA()} visitado`);
  }

  visitConcreteElementB(element: ConcreteElementB): void {
    console.log(`${element.operationB()} visitado`);
  }
}

// Uso
const element = new ConcreteElementA();
const visitor = new ConcreteVisitor();
element.accept(visitor);
```

**Quando usar:** Compiladores, Parsers, Operações complexas

### Checklist Padrões GOF
- [ ] Padrões criacionais aplicados para instanciação
- [ ] Padrões estruturais reduzem acoplamento
- [ ] Padrões comportamentais organizam responsabilidades
- [ ] Nenhuma classe trata de múltiplos padrões
- [ ] Documentação clara de qual padrão foi aplicado

---

## 5️⃣ UI/UX DESIGN (Frontend)

### Princípios Fundamentais de UI/UX

#### **A. Usabilidade (Usability)**

**Acessibilidade**
```html
✗ ERRADO:
<button onclick="doSomething()">Clique aqui</button>
<img src="foto.jpg">

✓ CORRETO:
<button 
  aria-label="Enviar formulário"
  aria-describedby="form-help"
  onClick={handleSubmit}
>
  Enviar
</button>
<img 
  src="foto.jpg" 
  alt="Descrição detalhada da imagem"
  role="img"
/>
<span id="form-help">Preencha todos os campos antes de enviar</span>
```

**Regras:**
- WCAG 2.1 Level AA mínimo
- Suporte a leitores de tela (ARIA labels)
- Contraste de cores ≥ 4.5:1 para texto
- Teclado navegável
- Alt text em todas as imagens

**Feedback Visual**
```tsx
✗ ERRADO:
<button onClick={handleClick}>
  Salvar
</button>

✓ CORRETO:
<button 
  onClick={handleClick}
  disabled={isLoading}
  aria-busy={isLoading}
  className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
>
  {isLoading ? (
    <>
      <Spinner aria-hidden="true" />
      Salvando...
    </>
  ) : (
    'Salvar'
  )}
</button>
```

**Regras:**
- Feedback imediato para todas as ações
- Loading states visíveis
- Estados desabilitados claros
- Mensagens de erro/sucesso
- Animações suaves (não > 300ms)

#### **B. Design System (Consistência)**

**Estrutura Obrigatória:**
```typescript
// tokens/colors.ts
export const COLORS = {
  primary: {
    50: '#f0f7ff',
    100: '#e0effe',
    500: '#3b82f6', // Principal
    900: '#1e3a8a',
  },
  secondary: { /* ... */ },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
  },
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    500: '#6b7280',
    900: '#111827',
  }
};

// tokens/typography.ts
export const TYPOGRAPHY = {
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  body: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.4,
  }
};

// tokens/spacing.ts
export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};
```

**Regras:**
- Tokens centralizados (cores, tipografia, espaçamento)
- Componentes baseados em design system
- Documentação (Storybook obrigatório)
- Consistência visual em toda a aplicação
- Paleta de cores limitada (máximo 12 cores principais)

#### **C. Hierarquia Visual**

```tsx
✗ ERRADO (Sem hierarquia clara):
<div>
  <div>Home</div>
  <div>Usuário</div>
  <div>Salvar</div>
</div>

✓ CORRETO (Hierarquia clara):
<header>
  <nav>
    <h1>Logo</h1>
    <ul role="navigation">
      <li><a href="/">Home</a></li>
      <li><a href="/user">Usuário</a></li>
    </ul>
  </nav>
</header>

<main>
  <section>
    <h2>Título Principal</h2>
    <p>Conteúdo descritivo...</p>
    <button priority="primary">Salvar</button>
  </section>
</main>
```

**Regras:**
- Títulos H1 → H6 em ordem hierárquica
- Elementos importantes: tamanho, cor, espaçamento
- White space adequado
- Alignamento consistente (grid)
- Agrupamento lógico de conteúdo

#### **D. Responsividade (Mobile First)**

```tsx
// Mobile First Approach
export const Card = styled.div`
  // Mobile: 100% width
  width: 100%;
  padding: ${SPACING.md};
  
  // Tablet
  @media (min-width: 768px) {
    width: 48%;
    padding: ${SPACING.lg};
  }
  
  // Desktop
  @media (min-width: 1024px) {
    width: 32%;
    padding: ${SPACING.xl};
  }
  
  @media (min-width: 1440px) {
    width: 24%;
  }
`;
```

**Breakpoints Obrigatórios:**
```typescript
export const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
  ultrawide: '1920px',
};
```

**Regras:**
- Mobile First approach obrigatório
- Testar em múltiplos dispositivos
- Touch targets: mínimo 44x44px
- Sem scroll horizontal em mobile
- Imagens responsivas (srcset)

#### **E. Componentes Reutilizáveis**

```tsx
// ✓ CORRETO - Componente atômico e reutilizável
import React from 'react';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING } from '@/design-system';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  'aria-label'?: string;
}

const StyledButton = styled.button<ButtonProps>`
  // Estilos base
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  font-family: inherit;
  
  // Variantes
  ${props => props.variant === 'primary' && `
    background-color: ${COLORS.primary[500]};
    color: ${COLORS.neutral[0]};
    
    &:hover:not(:disabled) {
      background-color: ${COLORS.primary[600]};
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  `}
  
  // Tamanhos
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: ${SPACING.sm} ${SPACING.md};
          font-size: 0.875rem;
        `;
      case 'large':
        return `
          padding: ${SPACING.lg} ${SPACING.xl};
          font-size: 1.125rem;
        `;
      default:
        return `
          padding: ${SPACING.md} ${SPACING.lg};
          font-size: 1rem;
        `;
    }
  }}
  
  // Estados
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid ${COLORS.primary[500]};
    outline-offset: 2px;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children,
  'aria-label': ariaLabel,
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <Spinner size={size} />
          {children}
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};
```

**Regras de Componentes:**
- Props com tipos TypeScript (não `any`)
- Componentes funcionais com hooks
- Propsforwarding para elementos nativos
- Slots para flexibilidade
- Composição ao invés de herança

#### **F. Tipografia**

```css
✓ CORRETO:
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px; /* Base */
  line-height: 1.5;
  color: #111827; /* Neutral 900 */
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
}

p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

small, .caption {
  font-size: 0.875rem;
  color: #6b7280; /* Neutral 500 */
}
```

**Regras:**
- System fonts (sem custom fonts quando possível)
- Máximo 2-3 fontes por projeto
- Line-height ≥ 1.5 para readabilidade
- Letter-spacing para títulos
- Font-weight: 400, 600, 700 apenas

#### **G. Animações**

```tsx
// Apenas transições suaves e com propósito
const CardContainer = styled.div`
  transition: transform 200ms ease-out,
              box-shadow 200ms ease-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

// Evitar:
// - Animações > 300ms sem razão
// - Múltiplas animações simultâneas
// - Efeitos piscantes ou epilépticos
// - Auto-play de vídeos/sons
```

**Regras:**
- Duração: 100-300ms para interações
- Easing: ease-out para entrada, ease-in para saída
- Sem movimento infinito
- Animações podem ser desativadas (prefers-reduced-motion)
- Propósito: feedback, transição, ênfase

#### **H. Cores e Contraste**

```typescript
// Paleta com variações de contraste
const colorSample = {
  primary: {
    50: '#f0f7ff',   // Backgrounds
    100: '#e0effe',  // Hover backgrounds
    500: '#3b82f6',  // Principal
    600: '#2563eb',  // Hover states
    700: '#1d4ed8',  // Active
    900: '#1e3a8a',  // Text on light
  }
};

// Verificar contraste:
// WCAG AA: 4.5:1 para texto normal
// WCAG AAA: 7:1 para texto normal
// Usar ferramentas: WebAIM, Contrast Checker
```

**Regras:**
- Contraste mínimo 4.5:1
- Não usar apenas cor para indicar status
- Paleta limitada e consistente
- Modo escuro opcional (se implementado)
- Testable color contrast

#### **I. Estados e Feedback**

```tsx
// Estados visuais para toda interação
const Input = styled.input`
  // Default
  border: 1px solid #e5e7eb;
  
  // Hover
  &:hover:not(:disabled) {
    border-color: #d1d5db;
    background-color: #f9fafb;
  }
  
  // Focus
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  // Disabled
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  // Invalid
  &[aria-invalid="true"] {
    border-color: #ef4444;
    
    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
`;
```

**Regras:**
- Estados: default, hover, focus, active, disabled, error
- Feedback visual para todos os estados
- Mensagens de erro inline e úteis
- Loading states com spinners
- Confirmações para ações destrutivas

#### **J. Padrões de Layout**

```tsx
// 1. GRID SYSTEM
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${SPACING.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

// 2. FLEXBOX PARA LINHAS
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${SPACING.md};
  flex-wrap: wrap;
`;

// 3. STACK PARA COLUNAS
const Stack = styled.div<{ spacing?: keyof typeof SPACING }>`
  display: flex;
  flex-direction: column;
  gap: ${props => SPACING[props.spacing || 'md']};
`;

// 4. SIDEBAR LAYOUT
const SidebarLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: ${SPACING.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
```

**Regras:**
- Grid para layouts 2D
- Flexbox para layouts 1D
- Mobile first (column stacks)
- Máximo width: 1200-1440px
- Padding responsivo

### Checklist UI/UX Design
- [ ] WCAG 2.1 AA compliance
- [ ] Componentes reutilizáveis com TypeScript
- [ ] Design tokens centralizados
- [ ] Mobile responsive (mobile first)
- [ ] Feedback visual para todas as interações
- [ ] Acessibilidade completa (ARIA labels)
- [ ] Consistência visual em todo projeto
- [ ] Touch targets ≥ 44x44px
- [ ] Contraste adequado (4.5:1 mínimo)
- [ ] Sem auto-play de mídia
- [ ] Animações suaves (≤ 300ms)
- [ ] Teclado navegável
- [ ] Design system documentado (Storybook)

---

## 📋 CHECKLIST GERAL DO PROJETO

### Antes de cada Commit
- [ ] Código segue Clean Code
- [ ] Padrões SOLID aplicados
- [ ] Design Patterns utilizados apropriadamente
- [ ] GOF patterns implementados onde necessário
- [ ] Testes unitários escritos (mínimo 80% coverage)
- [ ] Sem console.log() ou debug code
- [ ] Sem código comentado
- [ ] Variáveis nomeadas significativamente
- [ ] Funções com responsabilidade única
- [ ] Sem duplicação de código
- [ ] Tratamento de erros implementado

### Frontend Específico
- [ ] Componentes em padrão atomicamente consistente
- [ ] Props tipadas em TypeScript
- [ ] Acessibilidade (ARIA, semantic HTML)
- [ ] Responsivo para mobile/tablet/desktop
- [ ] Estados visuais: hover, focus, active, disabled
- [ ] Loading e error states
- [ ] Sem hard-coded colors/spacing
- [ ] Feedback de usuário implementado

### Backend Específico
- [ ] Dependency Injection configurado
- [ ] Repositories abstraindo dados
- [ ] Services com lógica de negócio
- [ ] Controllers delegando a services
- [ ] Validação de inputs
- [ ] Logging implementado
- [ ] Tratamento de exceções específicas
- [ ] Database migrations versionadas

### Documentação
- [ ] README atualizado
- [ ] APIs documentadas (Swagger/OpenAPI)
- [ ] Padrões arquitetônicos explicados
- [ ] Passos para setup local claros
- [ ] Exemplos de uso fornecidos
- [ ] Componentes documentados (Storybook)

---

## 📚 REFERÊNCIAS E RECURSOS

### Livros Recomendados
1. **"Clean Code" - Robert C. Martin**
2. **"Design Patterns" - Gang of Four**
3. **"Refactoring" - Martin Fowler**
4. **"Don't Make Me Think" - Steve Krug**
5. **"The SOLID Principles" - Uncle Bob**

### Ferramentas Obrigatórias
- **ESLint**: Linting e qualidade de código
- **Prettier**: Formatação automática
- **SonarQube**: Análise de código
- **Jest/Vitest**: Testes unitários
- **Storybook**: Documentação de componentes
- **Figma**: Design system
- **Axe DevTools**: Testes de acessibilidade

### Padrões Web
- WCAG 2.1 Level AA: https://www.w3.org/WAI/WCAG21/quickref/
- Web Accessibility: https://www.a11y-101.com/
- Design Patterns: https://refactoring.guru/design-patterns
- SOLID Principles: https://en.wikipedia.org/wiki/SOLID

---

## 🚀 CONCLUSÃO

Seguir rigorosamente este guia resultará em um projeto:
- **Mantível**: Código claro e bem estruturado
- **Escalável**: Fácil adicionar novas funcionalidades
- **Testável**: Componentes desacoplados
- **Profissional**: Segue padrões da indústria
- **Acessível**: Inclusivo para todos usuários
- **Performático**: Otimizado e eficiente

**Lembre-se: A qualidade do código agora economiza tempo e dinheiro futuros.**

---

**Última atualização:** 2024
**Versão:** 1.0
**Responsável:** Arquitetura do Projeto