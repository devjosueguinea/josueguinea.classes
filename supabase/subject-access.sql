-- Ejecutar una sola vez en Supabase > SQL Editor.
-- Los PIN se almacenan con hash bcrypt; nunca como texto legible.
create extension if not exists pgcrypto;

create table if not exists public.teacher_accounts (
    user_id uuid primary key references auth.users(id) on delete cascade,
    created_at timestamptz not null default now()
);

create table if not exists public.subject_access (
    subject_id text primary key check (subject_id ~ '^[a-z0-9-]+$'),
    pin_hash text not null,
    updated_at timestamptz not null default now(),
    updated_by uuid references auth.users(id)
);

alter table public.teacher_accounts enable row level security;
alter table public.subject_access enable row level security;

-- No se habilitan políticas SELECT: el navegador no puede leer hashes ni docentes.

create or replace function public.verify_subject_pin(p_subject_id text, p_pin text)
returns boolean
language sql
security definer
set search_path = public, extensions
as $$
    select exists (
        select 1
        from public.subject_access
        where subject_id = p_subject_id
          and pin_hash = crypt(p_pin, pin_hash)
    );
$$;

create or replace function public.set_subject_pin(p_subject_id text, p_pin text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
    if auth.uid() is null or not exists (
        select 1 from public.teacher_accounts where user_id = auth.uid()
    ) then
        raise exception 'Usuario no autorizado';
    end if;

    if p_subject_id !~ '^[a-z0-9-]+$' then
        raise exception 'Identificador de materia inválido';
    end if;

    if p_pin !~ '^\d{4,8}$' then
        raise exception 'El PIN debe contener entre 4 y 8 dígitos';
    end if;

    insert into public.subject_access (subject_id, pin_hash, updated_at, updated_by)
    values (p_subject_id, crypt(p_pin, gen_salt('bf')), now(), auth.uid())
    on conflict (subject_id) do update
    set pin_hash = excluded.pin_hash,
        updated_at = excluded.updated_at,
        updated_by = excluded.updated_by;
end;
$$;

revoke all on function public.verify_subject_pin(text, text) from public;
revoke all on function public.set_subject_pin(text, text) from public;
grant execute on function public.verify_subject_pin(text, text) to anon, authenticated;
grant execute on function public.set_subject_pin(text, text) to authenticated;

-- Después de crear el usuario docente en Authentication > Users, autorízalo:
-- insert into public.teacher_accounts (user_id)
-- select id from auth.users where email = 'docente@ejemplo.com';
