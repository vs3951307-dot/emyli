-- 1. Execute este arquivo inteiro no SQL Editor do Supabase (projeto jtfqukwsiejlwydqpqtd).
-- 2. Antes de executar, crie a conta da proprietária pelo site em /admin.
-- 3. Substitua o email abaixo se quiser usar outro.

-- Migração completa
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.site_admins enable row level security;

create or replace function public.is_site_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.site_admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;

create policy "Admin vê sua autorização" on public.site_admins
  for select to authenticated using (user_id = (select auth.uid()));

create table public.site_settings (
  id integer primary key default 1 check (id = 1),
  theme text not null default 'classic' check (theme in ('classic', 'rose', 'sage')),
  hero_path text,
  portrait_path text,
  hidden_gallery_ids text[] not null default '{}'
);
insert into public.site_settings (id) values (1);
alter table public.site_settings enable row level security;
create policy "Configuração pública" on public.site_settings for select to anon, authenticated using (true);
create policy "Admin altera configuração" on public.site_settings for update to authenticated
  using ((select public.is_site_admin())) with check ((select public.is_site_admin()));

create table public.site_gallery (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  alt text not null check (length(trim(alt)) between 3 and 200),
  service_id text not null check (service_id in ('design-sobrancelhas', 'design-henna', 'brow-lamination')),
  authorized boolean not null default false check (authorized),
  created_at timestamptz not null default now()
);
alter table public.site_gallery enable row level security;
create policy "Galeria pública autorizada" on public.site_gallery for select to anon, authenticated using (authorized);
create policy "Admin adiciona fotos" on public.site_gallery for insert to authenticated
  with check ((select public.is_site_admin()));
create policy "Admin remove fotos" on public.site_gallery for delete to authenticated
  using ((select public.is_site_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-photos', 'site-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
create policy "Fotos públicas" on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-photos');
create policy "Admin envia fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'site-photos' and (select public.is_site_admin()));
create policy "Admin exclui fotos" on storage.objects for delete to authenticated
  using (bucket_id = 'site-photos' and (select public.is_site_admin()));

-- Autoriza a conta da proprietária (crie a conta antes pelo site /admin)
insert into public.site_admins (user_id)
select id from auth.users where email = 'vs3951307@gmail.com';