create table public.tributes (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid references public.memorials(id) on delete cascade,
  guest_name text not null,
  message text,
  media_id uuid references public.media_files(id) on delete set null,
  approved boolean default true, -- By default true for MVP, can be moderated later
  created_at timestamptz default now()
);

alter table public.tributes enable row level security;

-- Guests can insert tributes to public memorials
create policy "Anyone can insert tributes"
on public.tributes
for insert
with check (true);

-- Everyone can read approved tributes
create policy "Anyone can view approved tributes"
on public.tributes
for select
using (approved = true);

-- Owners can manage tributes for their memorials
create policy "Owners can manage tributes"
on public.tributes
for all
using (
  exists (
    select 1 from public.memorials m
    join public.pets p on p.id = m.pet_id
    where m.id = tributes.memorial_id
    and p.owner_id = auth.uid()
  )
);
