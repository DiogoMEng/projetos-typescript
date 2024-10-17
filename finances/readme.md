# Finances

## 📝 Descrição

aplicação web de gestão financeira proporciona uma maneira simples e eficiente de controlar suas finanças pessoais. Com ela, você pode facilmente inserir suas receitas e despesas, visualizar relatórios claros sobre seus gastos e saldo, e fazer alterações nos dados sempre que necessário. É a ferramenta ideal para manter suas finanças organizadas e tomar decisões mais informadas sobre seu dinheiro.

## 🛠️ Funcionalidades

1. Inserção de dados financeiros.
   - (**POST**)`/balances` - permite inserir um saldo do usuário.
   - (**POST**)`/balances/expenses` - permite inserir uma despesa em dinheiro/débito do usuário.
   - (**POST**)`/balances/credit` - permite inserir uma despesa de crédito do usuário.
2. Visualização de dados do usuário.
   - (**GET**)`/balances` - retorna todos os saldos de entrada do usuário.
   - (**GET**)`/balances/expenses` - retorna as despesas realizadas em dinheiro/débito.
   - (**GET**)`/balances/credit` - retorna as despesas realizadas no crédito.

## 💻 Tecnologias Utilizadas

1. TypeScript.
2. NodeJs.
   - Express.
3. MySQL.
4. React
5. Tailwindcss.

## 🔰 Inicialização

`npm i`: Instalar pendências de projeto.

`npm run build`: executa projeto em produção.

`npm run dev`: executa projeto de desenvolvimento.

## Status do Projeto

<img alt="projectstatus" src="https://img.shields.io/badge/Status do Projeto-Em Construção-orange">
