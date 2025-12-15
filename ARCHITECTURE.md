# Arquitetura do Projeto

Este documento descreve a arquitetura do projeto Home Spends Frontend, que foi adaptada do projeto `romas-erp-frontend` (Vue/Quasar) para React/Next.js.

## Estrutura de Pastas

```
src/
├── app/                    # Páginas e rotas (Next.js App Router)
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx            # Página inicial (Dashboard)
│   ├── people/             # Páginas de pessoas
│   ├── categories/        # Páginas de categorias
│   ├── transactions/      # Páginas de transações
│   └── reports/           # Páginas de relatórios
├── components/            # Componentes reutilizáveis
│   ├── ui/                # Componentes shadcn/ui
│   └── shared/            # Componentes compartilhados
├── hooks/                 # Hooks customizados (equivalente aos composables Vue)
│   └── api/               # Hooks para recursos da API
├── stores/                # Stores Zustand (equivalente ao Pinia)
├── types/                 # Tipos e interfaces TypeScript
├── lib/                   # Utilitários e configurações
│   ├── api/               # Configuração do Axios
│   └── utils.ts           # Funções utilitárias
└── styles/                # Estilos globais
    └── globals.css        # Estilos globais e variáveis CSS
```

## Adaptações da Arquitetura Vue/Quasar para React/Next.js

### 1. Composables → Hooks Customizados

**Vue/Quasar (romas-erp-frontend):**
```typescript
// composables/api/useCollaboratorsResource.ts
export function useCollaboratorsResource() {
  const { setCollaborators } = useCollaboratorsStore();
  function findAll() { ... }
  return { findAll, ... };
}
```

**React/Next.js (home-spends-frontend):**
```typescript
// hooks/api/usePeopleResource.ts
export function usePeopleResource() {
  const { setPeople } = usePeopleStore();
  function findAll() { ... }
  return { findAll, ... };
}
```

### 2. Pinia Stores → Zustand Stores

**Vue/Quasar (romas-erp-frontend):**
```typescript
// stores/collaborators.ts
export const useCollaboratorsStore = defineStore('collaborators', () => {
  const collaborators = ref<Collaborator[]>([]);
  function setCollaborators(data) { ... }
  return { collaborators, setCollaborators };
});
```

**React/Next.js (home-spends-frontend):**
```typescript
// stores/people.ts
export const usePeopleStore = create<PeopleStore>((set) => ({
  people: [],
  setPeople: (people) => set({ people }),
}));
```

### 3. Vue Router → Next.js App Router

**Vue/Quasar (romas-erp-frontend):**
```typescript
// router/routes.ts
const routes = [
  { path: '/colaboradores', component: CollaboratorsListPage },
];
```

**React/Next.js (home-spends-frontend):**
```
// app/people/page.tsx (rota automática: /people)
export default function PeoplePage() { ... }
```

### 4. Quasar Components → shadcn/ui Components

**Vue/Quasar:**
- Usa componentes do Quasar Framework (q-btn, q-table, q-dialog, etc.)

**React/Next.js:**
- Usa componentes do shadcn/ui (Button, Table, Dialog, etc.)
- Baseado em Radix UI e Tailwind CSS

### 5. Axios Configuration

A configuração do Axios foi mantida similar, com adaptações para Next.js:

- Interceptors para adicionar token de autenticação
- Tratamento de erros 401 (redirecionamento)
- Suporte a SSR (verificação de `typeof window !== 'undefined'`)

## Padrões de Código

### Hooks de API

Todos os hooks de API seguem o mesmo padrão:
- Funções para CRUD (findAll, findById, create, update, destroy)
- Função `load*` que carrega dados e atualiza o store
- Retornam funções que podem ser usadas nos componentes

### Stores

Todas as stores seguem o mesmo padrão:
- Estado: lista de itens e item atual
- Ações: setters para atualizar o estado
- Tipagem completa com TypeScript

### Componentes de Páginas

Todas as páginas seguem o mesmo padrão:
- Estado local para loading e formulários
- Uso de hooks de API e stores
- Diálogos modais para criação
- Tabelas para listagem
- Tratamento de erros

## Tecnologias Utilizadas

- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **shadcn/ui**: Componentes UI baseados em Radix UI
- **Tailwind CSS**: Estilização utilitária
- **Zustand**: Gerenciamento de estado leve
- **Axios**: Cliente HTTP
- **React Hook Form** (preparado para uso futuro)
- **Zod** (preparado para validação futura)

## Fluxo de Dados

1. **Componente** → Chama hook de API
2. **Hook de API** → Faz requisição HTTP via Axios
3. **Axios** → Interceptors adicionam token e tratam erros
4. **API Backend** → Retorna dados
5. **Hook de API** → Atualiza store via Zustand
6. **Componente** → Re-renderiza com dados atualizados do store

## Validações Implementadas

### Transações
- Menores de idade (< 18 anos) só podem ter despesas
- Categoria deve permitir o tipo de transação (despesa/receita/ambas)
- Validação no frontend e backend

### Pessoas
- Nome obrigatório
- Idade deve ser um número inteiro positivo

### Categorias
- Descrição obrigatória
- Finalidade: Despesa, Receita ou Ambas

## Próximos Passos Sugeridos

1. Adicionar validação de formulários com React Hook Form + Zod
2. Implementar paginação nas listagens
3. Adicionar filtros e busca
4. Implementar autenticação (se necessário)
5. Adicionar testes unitários e de integração
6. Implementar tratamento de erros mais robusto (toasts)
7. Adicionar loading states mais elaborados (skeletons)

