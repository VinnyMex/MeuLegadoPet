-- Seeder de Testes Reais (Mock Data) para o Painel Master
-- Este script insere usuários, pets, e agendamentos fictícios para testes.

DO $$
DECLARE
  user1_id uuid := gen_random_uuid();
  user2_id uuid := gen_random_uuid();
  user3_id uuid := gen_random_uuid();
  
  pet1_id uuid := gen_random_uuid();
  pet2_id uuid := gen_random_uuid();
  pet3_id uuid := gen_random_uuid();
  pet4_id uuid := gen_random_uuid();
BEGIN

  -- 1. Insert Mock Users into auth.users (This will trigger profile creation)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) 
  VALUES 
  (user1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carlos.almeida@test.com', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Carlos Almeida"}', now(), now()),
  (user2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'marina.costa@test.com', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Marina Costa"}', now(), now()),
  (user3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'roberto.santos@test.com', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Roberto Santos"}', now(), now());

  -- 2. Insert Pets
  INSERT INTO public.pets (id, owner_id, name, species, breed, birth_date, estimated_age_years, size, weight_kg, sex, neutered, main_color)
  VALUES 
  (pet1_id, user1_id, 'Thor', 'cão', 'Golden Retriever', '2020-05-10', 4, 'grande', 32.5, 'macho', true, 'Dourado'),
  (pet2_id, user2_id, 'Mia', 'gato', 'Siamês', '2022-01-15', 2, 'pequeno', 4.2, 'fêmea', true, 'Bege e Marrom'),
  (pet3_id, user2_id, 'Tico', 'cão', 'Pug', '2021-08-20', 3, 'pequeno', 8.5, 'macho', false, 'Abricot'),
  (pet4_id, user3_id, 'Luna', 'cão', 'SRD (Vira-lata)', '2019-11-05', 5, 'médio', 14.0, 'fêmea', true, 'Preta e Branca');

  -- 3. Insert Health Records
  INSERT INTO public.pet_health (pet_id, vaccines, medications, conditions, allergies)
  VALUES 
  (pet1_id, 
   '[{"id":"v1", "name":"V10 Importada", "date_applied":"2023-05-15"}, {"id":"v2", "name":"Raiva", "date_applied":"2023-05-15"}]'::jsonb,
   '[{"id":"m1", "name":"Bravecto", "dosage":"1 comp (20-40kg)", "date":"2024-01-10"}]'::jsonb,
   '[]'::jsonb,
   '[{"id":"a1", "name":"Alergia a Frango", "severity":"Alta", "date":"2022-03-01"}]'::jsonb),
   
  (pet2_id, 
   '[{"id":"v1", "name":"V4 Felina", "date_applied":"2023-02-10"}]'::jsonb,
   '[]'::jsonb,
   '[{"id":"c1", "name":"Consulta de Rotina", "notes":"Tudo ótimo, mantendo peso", "date":"2023-12-05"}]'::jsonb,
   '[]'::jsonb),
   
  (pet4_id, 
   '[]'::jsonb,
   '[{"id":"m1", "name":"Simparic", "dosage":"1 comp (10-20kg)", "date":"2024-02-01"}]'::jsonb,
   '[{"id":"c1", "name":"Dermatite", "notes":"Prescrito shampoo especial", "date":"2024-01-20"}]'::jsonb,
   '[{"id":"a1", "name":"Picada de Pulga", "severity":"Média", "date":"2021-06-15"}]'::jsonb);

  -- 4. Insert Appointments (Agenda Global e Faturamento)
  INSERT INTO public.appointments (profile_id, pet_id, service_type, appointment_date, notes, price, status, payment_status)
  VALUES 
  (user1_id, pet1_id, 'banho', now() - interval '2 days', 'Banho terapêutico', 85.00, 'concluido', 'pago'),
  (user1_id, pet1_id, 'vacina', now() + interval '5 days', 'Reforço V10', 120.00, 'agendado', 'pendente'),
  
  (user2_id, pet2_id, 'consulta', now() - interval '10 days', 'Checkup anual', 150.00, 'concluido', 'pago'),
  (user2_id, pet3_id, 'tosa', now() - interval '1 day', 'Tosa higiênica', 60.00, 'concluido', 'pendente'),
  
  (user3_id, pet4_id, 'banho', now() + interval '2 days', 'Banho completo', 75.00, 'agendado', 'pendente'),
  (user3_id, pet4_id, 'tosa', now() + interval '15 days', 'Tosa na máquina', 80.00, 'agendado', 'pendente');

END $$;
