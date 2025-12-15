# Home Spends Frontend

Sistema de controle de gastos residenciais desenvolvido com Next.js, React, TypeScript, shadcn/ui e Tailwind CSS.

## Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## Estrutura do Projeto

```
src/
├── app/                    # Páginas e rotas (Next.js App Router)
├── components/             # Componentes reutilizáveis
│   ├── ui/                # Componentes shadcn/ui
│   └── shared/            # Componentes compartilhados
├── hooks/                 # Hooks customizados (equivalente aos composables)
│   └── api/               # Hooks para recursos da API
├── stores/                # Stores Zustand (gerenciamento de estado)
├── types/                 # Tipos e interfaces TypeScript
├── lib/                   # Utilitários e configurações
│   └── api/               # Configuração do Axios
└── styles/                # Estilos globais
```

## Funcionalidades

- **Cadastro de Pessoas**: Criação, listagem e exclusão
- **Cadastro de Categorias**: Criação e listagem
- **Cadastro de Transações**: Criação e listagem com validações
- **Relatórios**: Totais por pessoa e por categoria

## Como executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

