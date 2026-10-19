-- =====================================================================
-- DEP LOW — Regras de acesso (RLS)
-- Rodar no Supabase: Dashboard > SQL Editor > New query > colar > Run
-- Pode ser rodado mais de uma vez sem problema.
--
-- Resultado:
--   * qualquer visitante LÊ produtos e configurações da loja
--   * só quem está na tabela `admins` CRIA / EDITA / EXCLUI
--   * só admins enviam/alteram imagens no bucket `images`
-- =====================================================================

-- 1. Tabela de administradores -----------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- security definer: consulta `admins` sem esbarrar no RLS da própria tabela
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

-- 2. Remove políticas antigas (ex.: "liberado para todos") ---------------
-- Políticas no Postgres se somam: se sobrar uma permissiva, ela libera tudo.
do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('products', 'store_settings', 'admins')
  loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

alter table public.products       enable row level security;
alter table public.store_settings enable row level security;

-- 3. admins: cada usuário logado só enxerga o próprio registro -----------
create policy "admins_select_own" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- 4. products ----------------------------------------------------------
create policy "products_select_public" on public.products
  for select using (true);
create policy "products_insert_admin" on public.products
  for insert to authenticated with check (public.is_admin());
create policy "products_update_admin" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products_delete_admin" on public.products
  for delete to authenticated using (public.is_admin());

-- 5. store_settings ----------------------------------------------------
create policy "settings_select_public" on public.store_settings
  for select using (true);
create policy "settings_insert_admin" on public.store_settings
  for insert to authenticated with check (public.is_admin());
create policy "settings_update_admin" on public.store_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "settings_delete_admin" on public.store_settings
  for delete to authenticated using (public.is_admin());

-- 6. Storage (bucket `images`) -----------------------------------------
-- A leitura das imagens continua pública porque o bucket é público.
drop policy if exists "images_insert_admin" on storage.objects;
drop policy if exists "images_update_admin" on storage.objects;
drop policy if exists "images_delete_admin" on storage.objects;

create policy "images_insert_admin" on storage.objects
  for insert to authenticated with check (bucket_id = 'images' and public.is_admin());
create policy "images_update_admin" on storage.objects
  for update to authenticated using (bucket_id = 'images' and public.is_admin());
create policy "images_delete_admin" on storage.objects
  for delete to authenticated using (bucket_id = 'images' and public.is_admin());

-- ATENÇÃO: confira se existem OUTRAS políticas no storage que liberem upload
-- para qualquer um (ex.: criadas pelo painel). Liste com:
--   select policyname, cmd, roles from pg_policies where schemaname = 'storage';
-- e apague as permissivas que não sejam as três acima / de leitura.

-- 7. Tornar um usuário administrador -----------------------------------
-- Primeiro crie o usuário em Authentication > Users > Add user (com senha),
-- depois rode trocando o e-mail:
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'SEU_EMAIL_AQUI'
--   on conflict do nothing;

-- 8. (Opcional) Carrinho antigo ----------------------------------------
-- O carrinho agora fica no navegador de cada visitante; esta tabela não é
-- mais usada e pode conter dados antigos de clientes. Para apagar:
--
--   drop table if exists public.cart_items;
