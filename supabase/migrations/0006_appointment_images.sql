-- 1. Create Media Bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies
create policy "Public Access" on storage.objects for select using (bucket_id = 'media');
create policy "Authenticated Upload" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Authenticated Update" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Authenticated Delete" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- 3. Add payment_method to appointments
alter table public.appointments add column if not exists payment_method text;

-- 4. Change default status to 'solicitado' 
alter table public.appointments alter column status set default 'solicitado';

-- 5. Create Appointment Images table for attachments
create table if not exists public.appointment_images (
    id uuid primary key default gen_random_uuid(),
    appointment_id uuid references public.appointments(id) on delete cascade not null,
    storage_path text not null,
    created_at timestamptz default now()
);

alter table public.appointment_images enable row level security;
create policy "Clients can view own appointment images" on public.appointment_images for select using (
    exists (select 1 from public.appointments a where a.id = appointment_id and a.profile_id = auth.uid())
);
create policy "Admins can manage appointment images" on public.appointment_images for all using (public.is_admin());
