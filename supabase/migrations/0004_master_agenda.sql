-- 1. Add Role to Profiles
alter table public.profiles add column if not exists role text default 'client';

-- 2. Create Security Definer function to check admin status without infinite recursion
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer set search_path = public;

-- 3. Appointments / Agenda
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  pet_id uuid references public.pets(id) on delete cascade not null,
  service_type text not null, -- 'banho', 'tosa', 'vacina', 'consulta', 'outro'
  appointment_date timestamptz not null,
  notes text,
  price numeric(10,2),
  status text default 'agendado', -- 'agendado', 'concluido', 'cancelado'
  payment_status text default 'pendente', -- 'pendente', 'pago'
  created_at timestamptz default now()
);

alter table public.appointments enable row level security;

-- Client can manage their own appointments
create policy "Clients can view own appointments" on public.appointments for select using (profile_id = auth.uid());
create policy "Clients can create own appointments" on public.appointments for insert with check (profile_id = auth.uid());

-- Admin overrides (Role = 'admin')
-- NOTE: Policies are additive. If any policy evaluates to true, access is granted.
create policy "Admins can view all profiles" on public.profiles for all using (public.is_admin());
create policy "Admins can view all pets" on public.pets for all using (public.is_admin());
create policy "Admins can view all health records" on public.pet_health for all using (public.is_admin());
create policy "Admins can view all payments" on public.payments for all using (public.is_admin());
create policy "Admins can manage all appointments" on public.appointments for all using (public.is_admin());

-- Elevate the very first user to admin automatically for convenience
update public.profiles set role = 'admin' where id = (select id from public.profiles order by created_at asc limit 1);
