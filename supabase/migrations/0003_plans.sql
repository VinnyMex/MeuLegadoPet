create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan_type text not null,        -- 'cremacao_individual', 'cremacao_coletiva', 'memorial_premium'
  monthly_price numeric(10,2),
  coverage jsonb,                 -- detalhes de cobertura
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.user_plans (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  plan_id uuid references public.plans(id),
  status text not null,           -- 'active', 'cancelled', 'pending'
  start_date date,
  end_date date,
  created_at timestamptz default now()
);

alter table public.plans enable row level security;
alter table public.user_plans enable row level security;
alter table public.payments enable row level security;

-- Utilizar bloco DO para evitar erros se as políticas já existirem
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Plans are public' AND tablename = 'plans') THEN
        create policy "Plans are public" on public.plans for select using (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own plans' AND tablename = 'user_plans') THEN
        create policy "Users can view own plans" on public.user_plans for select using (profile_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own plans' AND tablename = 'user_plans') THEN
        create policy "Users can insert own plans" on public.user_plans for insert with check (profile_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own payments' AND tablename = 'payments') THEN
        create policy "Users can view own payments" on public.payments for select using (profile_id = auth.uid());
    END IF;
END $$;

-- Inserir planos padrão apenas se eles não existirem (evita duplicação)
insert into public.plans (name, plan_type, monthly_price, coverage)
select 'Memorial Eterno', 'memorial_premium', 0.00, '["Memorial Público", "Upload Ilimitado", "Tema Personalizado"]'
where not exists (select 1 from public.plans where name = 'Memorial Eterno');

insert into public.plans (name, plan_type, monthly_price, coverage)
select 'Cremação Preventiva', 'cremacao_coletiva', 29.90, '["Cremação Coletiva", "Apoio Psicológico", "Memorial Público"]'
where not exists (select 1 from public.plans where name = 'Cremação Preventiva');

insert into public.plans (name, plan_type, monthly_price, coverage)
select 'Despedida VIP', 'cremacao_individual', 79.90, '["Cremação Individual", "Entrega de Cinzas", "Urna Premium", "Apoio Psicológico"]'
where not exists (select 1 from public.plans where name = 'Despedida VIP');
