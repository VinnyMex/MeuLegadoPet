-- Migration to add CRM fields to profiles table

alter table public.profiles add column phone text;
alter table public.profiles add column cep text;
alter table public.profiles add column address text;
alter table public.profiles add column address_number text;
alter table public.profiles add column address_complement text;
alter table public.profiles add column neighborhood text;
alter table public.profiles add column city text;
alter table public.profiles add column state text;
alter table public.profiles add column birth_date date;
alter table public.profiles add column email text;
