# Plano de Testes (QA) - Gestão de Caixinhas (/boxes)

## Objetivo
Garantir o perfeito funcionamento, a escalabilidade e a resiliência visual das novas mecânicas de Busca, Ordenação e Gestão Detalhada de Caixinhas.

## Escopo
- Módulo de Listagem (`src/pages/Boxes.tsx`): Testar renderização de indicadores visuais de lucro/prejuízo, busca reativa e ordenação múltipla (nome, ganho, data).
- Módulo de Detalhes (`src/pages/BoxDetails.tsx`): Testar navegação por abas, exibição dos KPIs e modais de remoção e alteração de privilégios.

## Casos de Teste (Unity & Integration - Vitest)

### CT-01: Funcionamento dos Filtros Locais (Busca e Ordenação)
- **Objetivo:** Garantir que o `useMemo` atua corretamente ordenando os arrays sem disparar requisições extras à rede.
- **Passos:** Injetar lista mockada. Alterar variável estado "Search" e "SortOrder".
- **Critério:** Retorno do hook/memo reflete a ordem exata matematicamente correta (ex: "Maior Ganho" trará o index X para Y).

### CT-02: Tratamento de Fallbacks de APIs incompletas
- **Objetivo:** Como o Backend ainda não envia o objeto `user` e `role` dentro do `RoleUserBoxBottom`, testar se o Frontend não quebra e injeta corretamente o MOCK temporário.
- **Passos:** Instanciar serviço `getByBoxBottom` devolvendo payload pobre.
- **Critério:** Página de Detalhes carrega a lista de Participantes com a Fallback function sem apresentar erro de React Runtime.

## Casos de Teste E2E (Playwright)

### CT-03: Roteamento de Detalhes Fim-a-Fim
- **Objetivo:** O fluxo de clique no cartão lista abre corretamente a página dedicada.
- **Passos:** Acessar `/boxes`, clicar na primeira "Caixinha".
- **Resultados:** Rota altera para `/boxes/:id`, breadcrumb/header aparece "Visão Geral", Tabs ficam visíveis.

### CT-04: Gestão e Edição de Participantes
- **Objetivo:** Validar os diálogos destrutivos e a reatividade.
- **Passos:** 
  1. Acessar Aba "Participantes"
  2. Clicar em "Permissão", mudar para "Administrador" e salvar.
  3. Clicar em "Excluir (Trash2)", confirmar exclusão.
- **Critério:** Modais devem se fechar, Toasts de sucesso (Sonner) devem pipocar na tela e a UI deve refletir o estado excluído/modificado instantaneamente.

## Ambiente
Os testes rodarão sob o ecossistema JSDom (Vitest) para lógicas algorítmicas, e Playwright Chromium engine (Emulação local 1280x720) para checagens visuais DOM.

## Cobertura e Aprovação
- Aprovação ocorre quando todo o pipeline CI retornar `exit code 0`.
- É inaceitável qualquer travamento na UI devido à lentidão em buscas (validação humana: UX "Liso" na digitação da Busca local).
