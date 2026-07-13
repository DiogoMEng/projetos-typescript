# Plano de Testes (QA)

## Objetivo
Estabelecer um ciclo rígido de Quality Assurance (QA) no frontend da aplicação, focando em testes de Unidade, Integração e Ponta-a-Ponta (E2E), com foco especial em resguardar o ciclo de vida da criação e gerenciamento de categorias contra regressões (como o Erro 400).

---

## Escopo
Este plano cobre toda a arquitetura front-end:
1. **Unidade:** Componentes isolados, Validadores, Adaptadores (HttpAdapter).
2. **Integração:** Comunicação correta das funções com o Axios/HttpAdapter (ex: `categoryService`).
3. **E2E:** Interações do usuário simulando navegadores (Criação, Edição, Deleção, Login e Fluxos Positivos/Negativos gerais).

---

## Ambiente
- **Framework de Testes (Unit & Integration):** Vitest (compatível nativamente com Vite).
- **Framework E2E:** Playwright.
- **Mock de Requisições:** Será utilizado interceptação local (Playwright/Vitest Mock) para os testes que necessitam simular o erro original (Erro 400) bem como o sucesso.

---

## Pré-requisitos
- Node.js atualizado.
- Instalação e build da aplicação front-end local (`npm run build`).
- API não será dependência rigorosa para testes unitários, mas será mockada nos de Integração e E2E via stubs se necessário.

---

## Casos de teste

### CT-01: Adaptação de Payload de Criação de Categorias
- **Objetivo:** Garantir que o frontend formata corretamente o objeto `category` para envio ao backend (evitando null, campos faltantes, strings sem trim).
- **Pré-condições:** Inicializar serviço.
- **Passos:** Inserir dados mock de teste na função de create.
- **Resultado esperado:** O objeto despachado contém apenas chaves pertinentes (nome string e tipo válido).
- **Critério de aprovação:** Assert que o objeto despachado não possui propriedades `undefined`.

### CT-02: Isolamento do Erro 400 em Categorias
- **Objetivo:** Simular que a API responda 400 e que o frontend lide com isso via Toast de Erro (reproduzindo o cenário anterior).
- **Pré-condições:** Mock do HTTP Request.
- **Passos:** Disparar função create. Mock responder Status 400.
- **Resultado esperado:** Catch executado com mensagem amigável sem quebrar o SPA.

### CT-03: E2E Criação de Categoria com Sucesso
- **Objetivo:** Testar via automação visual (Playwright) o fluxo completo se o backend corrigir o problema do Auth (retornar 201).
- **Passos:** Clicar "Nova Categoria" > Digitar Nome > Escolher Receita/Despesa > Salvar.
- **Resultado esperado:** Modal fecha, Toast de Sucesso aparece e Listagem se atualiza.

### CT-04: E2E Testes de Fluxos Existentes
- **Objetivo:** Garantir a estabilidade da interface (Login, Dashboard, Menus).
- **Passos:** Navegar para "/login" com user fake e validar falha e com sucesso e validar redirecionamento.
- **Resultado esperado:** Transições de rotas e bloqueios de acesso negado ocorrem naturalmente.

---

## Cobertura
- **Alvo:** 80% das funções do serviço da API (Unidade) e 100% de cobertura nos fluxos Críticos de negócio E2E do frontend (Login e Categoria).

---

## Como executar os testes
1. **Unidade / Integração:**
   ```bash
   npm run test
   ```
2. **E2E (Playwright):**
   ```bash
   npx playwright test
   ```

---

## Evidências esperadas
O terminal deve apresentar checks verdes indicativos de aprovação e relatórios de relatórios de cobertura. Para Playwright, deverá gerar os relatórios HTML de testes.

---

## Critérios de aprovação
- Todos os testes de API/HttpAdapter passando.
- Os cenários de Categorias operando (criando, filtrando, deletando e atualizando).

---

## Checklist final
- [x] Testes de Unidade previstos;
- [x] Casos de E2E desenhados;
- [x] Regressão para Erro 400 incluída no plano;
- [x] Estrutura documentada.
