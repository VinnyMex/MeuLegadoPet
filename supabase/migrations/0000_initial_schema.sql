-- Initial Schema and RLS for Meu Legado Pet

-- 1. Profiles (Tutor Profile)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Pets
create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  species text not null,
  breed text,
  birth_date date,
  estimated_age_years int,
  size text,
  weight_kg numeric(6,2),
  height_cm numeric(6,2),
  sex text,
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

alter table public.pets enable row level security;
create policy "Users can manage own pets" on public.pets for all using (owner_id = auth.uid());

-- 3. Pet Health
create table public.pet_health (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  vaccines jsonb,
  conditions jsonb,
  medications jsonb,
  allergies jsonb,
  vet_name text,
  clinic_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.pet_health enable row level security;
create policy "Users can manage own pet health" on public.pet_health for all 
using (exists (select 1 from public.pets where id = pet_health.pet_id and owner_id = auth.uid()));

-- 4. Timelines and Entries
create table public.timelines (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  title text default 'Linha do Tempo',
  created_at timestamptz default now()
);

alter table public.timelines enable row level security;
create policy "Users can manage own pet timelines" on public.timelines for all 
using (exists (select 1 from public.pets where id = timelines.pet_id and owner_id = auth.uid()));

create table public.timeline_entries (
  id uuid primary key default gen_random_uuid(),
  timeline_id uuid references public.timelines(id) on delete cascade not null,
  pet_id uuid references public.pets(id) on delete cascade not null,
  entry_type text not null,
  title text,
  content text,
  media_id uuid,
  event_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.timeline_entries enable row level security;
create policy "Users can manage own timeline entries" on public.timeline_entries for all 
using (exists (select 1 from public.pets where id = timeline_entries.pet_id and owner_id = auth.uid()));

-- 5. Reminders
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  category text not null,
  title text not null,
  description text,
  reminder_date timestamptz not null,
  created_at timestamptz default now(),
  completed boolean default false
);

alter table public.reminders enable row level security;
create policy "Users can manage own reminders" on public.reminders for all 
using (exists (select 1 from public.pets where id = reminders.pet_id and owner_id = auth.uid()));

-- 6. Memorials
create table public.memorials (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  slug text unique not null,
  title text,
  main_message text,
  cover_image_url text,
  visibility text not null, -- 'public', 'link', 'private'
  active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.memorials enable row level security;
create policy "Users can manage own memorials" on public.memorials for all 
using (exists (select 1 from public.pets where id = memorials.pet_id and owner_id = auth.uid()));

-- Allow public read of memorials if visibility is public or link
create policy "Anyone can read public or linked memorials" on public.memorials for select 
using (visibility in ('public', 'link'));

-- 7. Media Files (Reference to Storage)
create table public.media_files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade not null,
  pet_id uuid references public.pets(id),
  storage_path text not null,
  media_type text not null,
  created_at timestamptz default now()
);

alter table public.media_files enable row level security;
create policy "Users can manage own media files" on public.media_files for all 
using (owner_id = auth.uid());

-- 8. Plans and Payments
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan_type text not null,
  monthly_price numeric(10,2),
  coverage jsonb,
  active boolean default true,
  created_at timestamptz default now()
);

-- Plans are public readable
alter table public.plans enable row level security;
create policy "Anyone can view active plans" on public.plans for select using (active = true);

create table public.user_plans (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  pet_id uuid references public.pets(id) on delete cascade,
  plan_id uuid references public.plans(id),
  status text not null,
  start_date date,
  end_date date,
  created_at timestamptz default now()
);

alter table public.user_plans enable row level security;
create policy "Users can view own plans" on public.user_plans for select using (profile_id = auth.uid());

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  pet_id uuid references public.pets(id),
  amount numeric(10,2) not null,
  status text not null,
  transaction_code text unique,
  type text,
  paid_at timestamptz,
  created_at timestamptz default now()
);

alter table public.payments enable row level security;
create policy "Users can view own payments" on public.payments for select using (profile_id = auth.uid());

-- Create Storage bucket for media
insert into storage.buckets (id, name, public) values ('media_files', 'media_files', true);

-- Storage policies
create policy "Anyone can view public media" on storage.objects for select 
using (bucket_id = 'media_files');
create policy "Authenticated users can upload media" on storage.objects for insert 
with check (bucket_id = 'media_files' and auth.role() = 'authenticated');
create policy "Users can update own media" on storage.objects for update 
using (bucket_id = 'media_files' and auth.uid() = owner);
create policy "Users can delete own media" on storage.objects for delete 
using (bucket_id = 'media_files' and auth.uid() = owner);
