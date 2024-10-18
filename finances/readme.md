# 💸 Projeto Fullstack - Finances 💸

Este projeto é uma **aplicação web de gestão financeira** que proporciona uma maneira simples e eficiente de controlar suas finanças pessoais. Com ela, você pode inserir receitas e despesas, visualizar relatórios claros sobre seus gastos e saldo, além de fazer alterações nos dados conforme necessário. É a ferramenta ideal para manter suas finanças organizadas e tomar decisões mais informadas sobre o seu dinheiro! 💼💰

## 🚀 Tecnologias Utilizadas

### Backend (Node.js + TypeScript) 🛠️

- **cors**: Middleware para habilitar CORS (Cross-Origin Resource Sharing) no servidor.
- **dotenv**: Gerencia variáveis de ambiente para configuração segura.
- **express**: Framework web minimalista para criar APIs e servidores.
- **mysql2**: Cliente MySQL para conexão e execução de consultas SQL.
- **@types/cors**: Tipagens TypeScript para o pacote CORS.
- **@types/express**: Tipagens TypeScript para o Express.
- **nodemon**: Ferramenta que reinicia automaticamente o servidor durante o desenvolvimento.
- **ts-node-dev**: Executa e reinicia código TypeScript automaticamente no ambiente de desenvolvimento.
- **typescript**: Suporte para a linguagem TypeScript no desenvolvimento do backend.

### Frontend (React.js + TypeScript) 🎨

- **axios**: Cliente HTTP para fazer requisições a APIs.
- **react**: Biblioteca JavaScript para construção de interfaces de usuário interativas.
- **react-dom**: Pacote que lida com a renderização do React no DOM.
- **react-router-dom**: Biblioteca para gerenciamento de rotas no React.
- **@eslint/js**: Ferramenta de análise estática para identificar e corrigir problemas no código.
- **@types/react**: Tipagens TypeScript para o React.
- **@types/react-dom**: Tipagens TypeScript para o React DOM.
- **@vitejs/plugin-react**: Integração do Vite com React para uma construção mais rápida.
- **eslint**: Ferramenta de linting para garantir a qualidade e a consistência do código.
- **eslint-plugin-react-hooks**: Plugin ESLint para garantir boas práticas no uso de hooks do React.
- **eslint-plugin-react-refresh**: Plugin para melhorar a experiência de desenvolvimento no React com recarregamento automático.
- **globals**: Mapeia variáveis globais, auxiliando na verificação de código.
- **tailwindcss**: Framework CSS utilitário para estilização rápida e responsiva.
- **typescript**: Suporte para a linguagem TypeScript no desenvolvimento do frontend.
- **typescript-eslint**: Integração do ESLint com TypeScript para garantir boas práticas de código.
- **vite**: Ferramenta de build rápida para desenvolvimento de aplicações frontend modernas.

## 🛣️ Rotas da API

### Inserção de dados financeiros:

1. **POST** `/balances` - Inserir saldo do usuário.
2. **POST** `/balances/expenses` - Inserir uma despesa em dinheiro/débito.
3. **POST** `/balances/credit` - Inserir uma despesa de crédito.

### Visualização de dados do usuário:

1. **GET** `/balances` - Retorna todos os saldos do usuário.
2. **GET** `/balances/expenses` - Retorna despesas realizadas em dinheiro/débito.
3. **GET** `/balances/credit` - Retorna despesas realizadas no crédito.

## 🖼️ Pré-visualização da Aplicação

![alt text](public/img/image1.png)

![alt text](public/img/image2.png)

![alt text](public/img/image3.png)

## 🛠️ Como Executar o Projeto

### Instalar Pendências do Projeto

Para instalar os pacotes que são utilizados:

```bash
npm install
```

### Ambiente de Desenvolvimento:

Para rodar o projeto em modo desenvolvimento:

```bash
npm run dev
```

### Compilar para Produção:

Para compilar o código Typescript para Javascript:

```bash
npm run build
```

## 🎯 Funcionalidades do Projeto

- **Cadastro de Receitas e Despesas**: Adicione suas receitas e despesas em diferentes categorias, como dinheiro/débito ou crédito, para ter um controle completo sobre suas finanças.
- **Relatórios Financeiros**: Visualize relatórios detalhados e gráficos claros sobre suas transações, ajudando a identificar seus principais gastos e a planejar melhor o orçamento.
- **Atualização de Dados**: Edite ou exclua entradas de saldo e despesas sempre que necessário, garantindo que seus registros financeiros estejam sempre atualizados.
- **Interface Amigável**: A interface foi desenvolvida utilizando React.js com Tailwind CSS, proporcionando uma experiência moderna e fácil de navegar.

## 🎨 Layout Responsivo

O frontend da aplicação é totalmente responsivo, adaptando-se para funcionar perfeitamente em dispositivos móveis, tablets e desktops, oferecendo uma experiência de usuário consistente em qualquer tamanho de tela. 📱💻

## 📊 Banco de Dados

O projeto utiliza o **MySQL** como banco de dados relacional, garantindo segurança e performance no armazenamento e recuperação de informações financeiras. O MySQL foi escolhido pela sua escalabilidade e pela facilidade de integração com a arquitetura escolhida. O esquema de dados foi projetado para garantir consultas rápidas e atualizações eficientes. 🗄️

## 📈 Melhoria Contínua

Este projeto foi pensado para facilitar a vida financeira dos usuários e está em constante evolução. Futuras melhorias incluem:

- **Categorias personalizadas** para que os usuários possam categorizar suas despesas e receitas conforme suas necessidades.
- **Notificações automáticas** que alertam sobre o vencimento de contas ou o limite de gastos.

---

## 📋 Conclusão

Este projeto de gestão financeira combina a robustez do **Node.js** no backend com a eficiência do **React.js** no frontend, proporcionando uma solução completa e intuitiva para o controle de finanças pessoais. O uso de **TypeScript** em ambas as camadas garante um código mais seguro e legível, enquanto ferramentas como **Tailwind CSS** ajudam a entregar uma interface visualmente atraente e responsiva.

Quer se organizar financeiramente? Esse é o aplicativo certo para você! 💡💼

Agradeço por conferir o projeto! 💻🚀
