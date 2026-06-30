# Meu Legado Pet — Projeto Completo (Supabase + Vercel)

## Visão geral

**Meu Legado Pet** é um aplicativo web/SaaS para registrar e preservar a memória afetiva dos pets, do início ao fim da vida, organizando fotos, histórias, eventos importantes e, quando chegar a hora, um memorial digital permanente. O app também se conecta a planos funerários e serviços parceiros (cremação, velório, homenagens), tornando o vínculo tutor–pet visível e lembrado para sempre [file:1][web:47][web:48][web:50].

A arquitetura alvo:
- **Frontend:** Next.js (Vercel).
- **Backend:** Supabase (Postgres + Auth + Storage).
- **Modelo de negócio:** SaaS multi-tenant com planos mensais, memorial premium e integrações com parceiros [cite:2][file:1].

---

## Marca e presença digital

### Nome da marca
- Nome do produto: **Meu Legado Pet**.
- Conceito: “O legado de amor do seu pet, preservado em memórias digitais, do primeiro dia até a despedida”.

### Garantia de território (pré-dev)
1. Registrar domínio `meulegadopet.com.br` no Registro.br (R$ 40/ano) [web:19].
2. Criar perfis em:
   - Instagram: `@meulegadopet` ou `@meulegadopet.app` [web:21].
   - TikTok: mesmo handle.
3. Bio inicial sugerida:
   > “Meu Legado Pet é um espaço para guardar a história do seu pet, do primeiro dia até a despedida — fotos, momentos, homenagens e um memorial digital para sempre.”

Esses passos são preparatórios e não dependem do código, mas garantem território da marca [web:19][web:21].

---

## Proposta de valor

### Para tutores
- Guardar memórias do pet em uma linha do tempo contínua (fotos, vídeos, textos, marcos).
- Organizar cuidados (vacinas, consultas, banho, tosa, passeios) com uma agenda inteligente [file:1].
- Criar um memorial digital quando o pet partir, com:
  - Mensagem principal.
  - Linha do tempo completa.
  - Homenagens da família.
  - Certificados ou registros vinculados ao plano funerário [file:1][web:48][web:49].

### Para parceiros (clínicas, crematórios, pet shops)
- Ter um canal digital para oferecer serviços de cuidado, funeral e homenagens.
- Receber leads e contratos via app.
- Aparecer como opção no fluxo de contratação de planos e serviços [file:1][web:41][web:43][web:46].

---

## Stack e arquitetura

### Tecnologias principais

- **Frontend**
  - Next.js (React).
  - Tailwind CSS ou outra lib de UI.
  - Deploy na Vercel.

- **Backend e dados**
  - Supabase:
    - Auth (e-mail, senha; futuramente OAuth).
    - Postgres com RLS.
    - Storage para fotos e vídeos.
    - Edge Functions apenas quando necessário.

- **Armazenamento de mídia**
  - Supabase Storage (buckets separados por ambiente).
  - Regra: arquivos vinculados a `media_files` no banco, nunca “soltos”.

---

## Escopo funcional do app

### Módulos principais

1. Autenticação e perfil de usuário (tutor).
2. Cadastro e gestão de pets.
3. Linha do tempo de memórias.
4. Agenda inteligente (saúde, higiene, alimentação, passeios) [file:1].
5. Memorial digital (página especial de despedida).
6. Planos funerários e área financeira [file:1].
7. Serviços e parceiros (crematórios, clínicas, pet shops) [file:1].
8. Backoffice administrativo (empresas funerárias, parceiros) [file:1].

---

## Fluxo de experiência (rotas e telas) — Next.js

### Rotas públicas

- `/`
  - Landing page.
  - Explica o conceito.
  - CTA: “Comece o legado do seu pet”.

- `/login`
  - Form de login (e-mail/senha).
  - Link para cadastro.

- `/register`
  - Cadastro de usuário.
  - Campos: nome, e-mail, senha, aceite de termos.

- `/memorial/[slug]`
  - Página pública de memorial de um pet.
  - Conteúdo:
    - Foto principal.
    - Nome do pet.
    - Mensagem de despedida.
    - Linha do tempo (eventos selecionados).
    - Homenagens e mensagens da família.
    - Configuração de privacidade (público/por link).

### Rotas autenticadas (tutor)

- `/app`
  - Dashboard do tutor.
  - Lista de pets cadastrados.
  - Resumo:
    - Próximos lembretes.
    - Últimos momentos registrados.
    - Status do plano (por pet) [file:1].

- `/app/pets`
  - Listagem de pets.

- `/app/pets/new`
  - Cadastro de novo pet:
    - Nome.
    - Espécie (cão, gato, pássaro, roedor, réptil, outros) [file:1].
    - Raça (busca ou lista).
    - Data de nascimento ou idade estimada.
    - Porte (pequeno, médio, grande, gigante) [file:1].
    - Peso (kg).
    - Altura (cm).
    - Sexo (macho/fêmea).
    - Castrado (sim/não).
    - Cor predominante.
    - Microchip opcional [file:1].
    - Localização (CEP, cidade, estado, endereço) [file:1].
    - Foto principal.

- `/app/pets/[pet_id]`
  - Visão geral do pet:
    - Dados básicos.
    - Saúde (vacinas, doenças, medicamentos, alergias, veterinário responsável) [file:1].
    - Agenda (próximos eventos) [file:1].
    - Resumo de plano funerário (se houver) [file:1].
    - Acesso à Linha do Tempo.

- `/app/pets/[pet_id]/timeline`
  - Linha do tempo do pet:
    - Lista de eventos (momentos).
    - Cada evento: data, tipo (foto, vídeo, texto, evento de saúde, passeio, marco), mídia associada.
    - Botão “Adicionar momento”:
      - Tipo.
      - Título.
      - Descrição.
      - Data.
      - Upload de mídia.

- `/app/pets/[pet_id]/agenda`
  - Agenda inteligente:
    - Lembretes de saúde: vacinas, vermífugo, antipulgas, consultas, exames [file:1].
    - Lembretes de alimentação: horários, mudança de ração [file:1].
    - Lembretes de higiene: banho, tosa, limpeza dentária [file:1].
    - Outros: passeios, treinamento, medicamentos [file:1].
    - Visualização por calendário.
    - Criação manual de lembrete.

- `/app/pets/[pet_id]/memorial`
  - Configuração do memorial:
    - Status: ativo/inativo.
    - Mensagem principal.
    - Foto de capa.
    - Seleção de eventos da linha do tempo que entram no memorial.
    - Configuração de privacidade (público, link privado, apenas familiares).
    - Slug da URL pública (`/memorial/[slug]`).

- `/app/plans`
  - Lista de planos funerários disponíveis:
    - Tipo (cremação individual/coletiva, sepultamento, memorial digital, urna personalizada) [file:1].
    - Valor.
    - Cobertura.
    - Simulador de custos com base em porte, peso, espécie e região [file:1].

- `/app/billing`
  - Área financeira:
    - Histórico de cobranças.
    - Plano atual.
    - Upgrade/downgrade.
    - Cancelamento.
    - Meios de pagamento: cartão, Pix, débito automático [file:1].

### Rotas administrativas (backoffice)

- `/admin`
  - Dashboard de empresa/parceiro.

- `/admin/clients`
  - Lista de tutores e pets vinculados à empresa.

- `/admin/services`
  - Gestão de serviços:
    - cremação,
    - velório,
    - urnas,
    - cerimônias,
    - memorial físico/digital [file:1].

- `/admin/schedule`
  - Agenda de cremação e remoção [file:1].

- `/admin/reports`
  - Relatórios financeiros e operacionais [file:1].

---

## Banco de dados (Supabase) — Schema sugerido

### Tabela `users`
Gerenciada pelo Supabase Auth, usada como base para `profiles`.

### Tabela `profiles`
Perfil do tutor.

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

RLS: cada usuário só vê/edita seu próprio profile.

---

### Tabela `pets`

```sql
create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  species text not null,      -- cão, gato, etc.
  breed text,
  birth_date date,
  estimated_age_years int,
  size text,                  -- pequeno, médio, grande, gigante
  weight_kg numeric(6,2),
  height_cm numeric(6,2),
  sex text,                   -- macho, fêmea
  neutered boolean,
  main_color text,
  microchip text,
  cep text,
  state text,
  city text,
  neighborhood text,
  address text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

RLS: `owner_id = current_user_profile_id()`.

---

### Tabela `pet_health`

```sql
create table public.pet_health (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  vaccines jsonb,             -- lista de doses, datas, tipos
  conditions jsonb,           -- doenças pré-existentes
  medications jsonb,
  allergies jsonb,
  vet_name text,
  clinic_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

### Tabela `timelines`

```sql
create table public.timelines (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  title text default 'Linha do Tempo',
  created_at timestamptz default now()
);
```

### Tabela `timeline_entries`

```sql
create table public.timeline_entries (
  id uuid primary key default gen_random_uuid(),
  timeline_id uuid references public.timelines(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  entry_type text not null,   -- 'photo', 'video', 'text', 'health', 'event'
  title text,
  content text,
  media_id uuid,
  event_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

### Tabela `reminders`

```sql
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  category text not null,     -- 'health', 'food', 'hygiene', 'other'
  title text not null,
  description text,
  reminder_date timestamptz not null,
  created_at timestamptz default now(),
  completed boolean default false
);
```

Categorias inspiradas diretamente nos tipos de lembrete do documento (saúde, alimentação, higiene, outros) [file:1].

---

### Tabela `plans`

```sql
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan_type text not null,        -- 'cremacao_individual', 'cremacao_coletiva', etc.
  monthly_price numeric(10,2),
  coverage jsonb,                 -- detalhes de cobertura
  active boolean default true,
  created_at timestamptz default now()
);
```

---

### Tabela `user_plans`

```sql
create table public.user_plans (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  plan_id uuid references public.plans(id),
  status text not null,           -- 'active', 'cancelled', 'pending'
  start_date date,
  end_date date,
  created_at timestamptz default now()
);
```

---

### Tabela `memorials`

```sql
create table public.memorials (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  slug text unique not null,
  title text,
  main_message text,
  cover_image_url text,
  visibility text not null,       -- 'public', 'link', 'private'
  active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

### Tabela `media_files`

```sql
create table public.media_files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id),
  storage_path text not null,
  media_type text not null,       -- 'image', 'video'
  created_at timestamptz default now()
);
```

---

### Tabela `partners`

```sql
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  partner_type text not null,     -- 'crematorio', 'clinica', 'petshop', 'seguro'
  city text,
  state text,
  contact_email text,
  contact_phone text,
  website text,
  active boolean default true,
  created_at timestamptz default now()
);
```

---

### Tabela `services`

```sql
create table public.services (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners(id) on delete cascade,
  name text not null,
  service_type text not null,     -- 'cremacao', 'velorio', 'urna', 'cerimonia'
  base_price numeric(10,2),
  region text,
  details jsonb,
  active boolean default true,
  created_at timestamptz default now()
);
```

---

### Tabela `audit_logs`

```sql
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text,
  entity text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);
```

---

## Segurança (RLS em Supabase)

Princípios:
- Usuário só vê e altera dados dos seus próprios pets, timelines, memorials, planos e mídia.
- Endpoints públicos para `/memorial/[slug]` usam `visibility = 'public'` ou `'link'`.
- Backoffice tem papéis adicionais (`role` em `profiles` ou tabela separada para empresas).

Exemplo de RLS:

```sql
alter table public.pets enable row level security;

create policy "tutor can manage own pets"
on public.pets
for all
using (owner_id = auth.uid());
```

Aplicar políticas similares em `timelines`, `timeline_entries`, `reminders`, `memorials`, `media_files`, `user_plans`.

---

## Monetização

Fontes de receita planejadas [file:1]:

1. **Plano funerário mensal** (assinatura).
2. **Comissão sobre serviços de crematórios parceiros**.
3. **Marketplace de serviços/produtos pet**.
4. **Publicidade veterinária e parceiros relevantes**.
5. **Serviços premium de memorial**:
   - domínio personalizado,
   - mais armazenamento,
   - temas exclusivos,
   - vídeos longos.

---

## Prompt de implementação para IA (Claude/Antigravity)

> Use este documento como especificação para criar o projeto **Meu Legado Pet** com:
> - Next.js (frontend, rotas descritas).
> - Supabase (Auth, Postgres, Storage, RLS conforme schema).
> - Deploy na Vercel com configuração básica.
>
> Implemente:
> - Páginas públicas (`/`, `/login`, `/register`, `/memorial/[slug]`).
> - Área autenticada (`/app` e rotas relacionadas).
> - Componentes de formulário de pet, timeline, agenda, memorial.
> - Integração com Supabase Auth e consultas às tabelas descritas.
> - Estrutura de serviços para planos, parceiros e memorial.
> - Layout responsivo, com foco em experiência emocional e simples.
>
> Prepare o código para futura integração com:
> - Notificações (e-mail, push; depois WhatsApp/n8n).
> - Ampliação de parceiros e marketplace.
> - Versão mobile (PWA ou app separado no futuro).

---

Esse .md está impecável e funciona perfeitamente como o "Cérebro" do seu projeto. A arquitetura usando Next.js hospedado na Vercel e o Supabase como backend é extremamente robusta para um SaaS multi-tenant.

# CONTEXTO DO PROJETO: Meu Legado Pet

Atue como um Engenheiro de Software Sênior especializado em Next.js (App Router), Tailwind CSS e Supabase. Sua missão é inicializar e desenvolver o MVP completo do aplicativo web/SaaS "Meu Legado Pet". 

O objetivo do app é registrar e preservar a memória afetiva de pets, organizando fotos, histórias, agenda de cuidados e, futuramente, um memorial digital permanente, com foco na celebração da vida e do vínculo afetivo.

## 1. Stack Tecnológica
- **Frontend:** Next.js (App Router), React, Tailwind CSS (estilização emocional, limpa e moderna).
- **Backend/BaaS:** Supabase (Postgres, Auth, Storage, Row Level Security).
- **Deploy Alvo:** Vercel.

## 2. Regras de Negócio e UX (CRÍTICO)
- **Autenticação (Login/Cadastro):** - A sessão do usuário DEVE ser persistente (o último usuário logado deve permanecer salvo para evitar logins repetitivos).
  - No formulário de login, a submissão deve ocorrer automaticamente ao pressionar a tecla "Enter" no campo de senha.
- **Fuso Horário e Agenda:** - Todas as lógicas de datas, horas e agendamentos (especialmente na tabela `reminders`) DEVEM respeitar estritamente o fuso horário de São Paulo. Utilize algo como `DateTime.now().setZone('America/Sao_Paulo')` (via biblioteca luxon ou date-fns-tz) para garantir que não haja inconsistência com o fuso do servidor.
- **Armazenamento (Storage):** - Fotos e vídeos sobem para o Supabase Storage (bucket `media_files`) e o path é salvo no banco, vinculado ao `pet_id`.

## 3. Estrutura de Banco de Dados (Supabase SQL)
Gere os scripts SQL iniciais baseados neste schema:
- `profiles`: id (refs auth.users), full_name, avatar_url.
- `pets`: id, owner_id (refs profiles), name, species, breed, birth_date, size, weight_kg, avatar_url.
- `pet_health`: id, pet_id, vaccines (jsonb), conditions, vet_name.
- `timelines` & `timeline_entries`: id, pet_id, entry_type (photo, text, event), content, media_id, event_date.
- `reminders`: id, pet_id, category, title, reminder_date (timezone de SP), completed.
- `memorials`: id, pet_id, slug (unique), main_message, visibility (public/link/private).
- **RLS (Row Level Security):** Crie políticas onde o tutor (`owner_id`) só pode ler/editar os dados de seus próprios pets. Apenas os memoriais com visibilidade 'public' ou 'link' podem ser lidos sem autenticação.

## 4. Arquitetura de Rotas (Next.js)
Implemente as seguintes rotas e componentes:

**Rotas Públicas:**
- `/`: Landing Page simples e emocional.
- `/login` e `/register`: Autenticação Supabase (com as regras de UX citadas).
- `/memorial/[slug]`: Página pública do memorial. Busca os dados via Server Component para SEO e carregamento rápido. Exibe foto de capa, nome, mensagem e linha do tempo pública.

**Rotas Protegidas (Dashboard do Tutor - `/app`):**
- `/app`: Dashboard principal. Resumo dos pets e próximos lembretes.
- `/app/pets/new`: Formulário de cadastro de novo pet.
- `/app/pets/[pet_id]`: Visão geral do pet (dados e saúde).
- `/app/pets/[pet_id]/timeline`: Linha do tempo vertical. Permite adicionar fotos, textos e marcos (Upload para Supabase Storage integrado).
- `/app/pets/[pet_id]/agenda`: Calendário/lista de lembretes (vacinas, passeios, etc).

## 5. Instruções de Execução (Primeiro Passo)
1. Crie a estrutura de pastas do Next.js.
2. Configure o cliente do Supabase (`supabase/client.ts` e `supabase/server.ts`).
3. Crie os arquivos SQL de migração com o schema completo e RLS.
4. Desenvolva as telas de autenticação (`/login`) garantindo o funcionamento da tecla Enter e sessão persistente.
5. Crie um script de Seed no banco (opcional, mas recomendado) populando o sistema com dados de teste para facilitar a visualização da UI (exemplo: um cachorro chamado Dylan e uma gata chamada Florzinha).
6. Implemente o Layout base do `/app`.

Por favor, gere o código passo a passo, começando pela infraestrutura (Supabase clients e SQL) e depois avançando para as rotas de Auth e Dashboard.




## 1. Contexto do Projeto

Atue como um **Engenheiro de Software Sênior Fullstack** especializado em **Node.js, Express.js, PostgreSQL** e **PagSeguro (API Rest)**.

Estou desenvolvendo o projeto **"Meu Legado Pet"** (SaaS de registro de pets e memorial) e a próxima etapa crítica é implementar o **Sistema de Pagamentos** de forma robusta.

O sistema deve processar pagamentos únicos (assinaturas) e recorrentes (assinaturas) dos planos de memorial.

O objetivo atual é criar o **backend (Node.js/Express)** que irá se conectar à **API REST do PagSeguro** para:
1. Gerar credenciais de API.
2. Criar uma transação/pedido de pagamento.
3. Receber notificações (Webhook) de aprovação/recusa.
4. Salvar o status do pagamento no banco de dados (PostgreSQL) na tabela `payments` (colunas: `id`, `pet_id`, `amount`, `status`, `transaction_code`, `type`, `paid_at`).

## 2. Requisitos Técnicos

### Tecnologias
- **Linguagem:** TypeScript.
- **Framework:** Node.js com Express.js.
- **Banco de Dados:** PostgreSQL (interface via `node-postgres` ou ORM como Prisma/Drizzle - prefira Drizzle para este projeto).
- **Autenticação:** JWT.
- **Pagamentos:** API REST do PagSeguro (SandBox para testes).

### Processo de Pagamento (Fluxo de Checkout)
1. O usuário seleciona um plano.
2. O backend gera um `orderId` único para o cliente (UUID).
3. Integração com a API do PagSeguro para criar uma transação.
4. Retorno do `transactionId` do PagSeguro.
5. O front-end redireciona o usuário para a página de pagamento do PagSeguro.

### Webhooks (NOTIFICAÇÕES)
- Implementar uma rota de webhook (ex: `/api/webhooks/pagseguro`).
- Esta rota deve receber POSTs do PagSeguro.
- Validar a assinatura da notificação.
- Buscar/salvar o status na tabela `payments`.
- **IMPORTANTE:** A lógica de persistência no banco deve estar isolada e protegida contra reenvios (idempotência).

## 3. Tarefa

**Gere o código completo do backend (Node.js + Express + Drizzle + TypeScript) para gerenciar os pagamentos via PagSeguro.**

Inclua:
1. **Configuração do Drizzle** e conexão com o PostgreSQL.
2. **Schemas do banco** para `payments` e `plans`.
3. **Endpoint de criação de transação** (`POST /api/v1/pagseguro/create-transaction`).
4. **Endpoint de Webhook** (`POST /api/v1/webhooks/pagseguro`).
5. **Funções de utilidade** para interagir com a API REST do PagSeguro (suporta tanto pagamentos únicos quanto recorrentes).
6. **Configurações de Sandbox** para facilitar os testes.

**Atenção:** O código deve estar modularizado (controllers, services, routes, drizzle) e pronto para ser integrado ao Next.js.
