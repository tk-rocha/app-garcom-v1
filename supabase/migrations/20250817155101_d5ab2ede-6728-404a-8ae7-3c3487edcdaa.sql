
-- 1) Tabela de clientes de fidelidade
create table if not exists public.clientes_fidelidade (
  id uuid primary key default gen_random_uuid(),
  cpf text unique not null,
  nome text not null,
  pontos integer not null default 0,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

-- 2) RLS e políticas (permissivas como no restante do schema)
alter table public.clientes_fidelidade enable row level security;

do $$
begin
  begin
    create policy "clientes_fidelidade_select" on public.clientes_fidelidade
      for select using (true);
  exception when duplicate_object then null; end;

  begin
    create policy "clientes_fidelidade_insert" on public.clientes_fidelidade
      for insert with check (true);
  exception when duplicate_object then null; end;

  begin
    create policy "clientes_fidelidade_update" on public.clientes_fidelidade
      for update using (true);
  exception when duplicate_object then null; end;

  begin
    create policy "clientes_fidelidade_delete" on public.clientes_fidelidade
      for delete using (true);
  exception when duplicate_object then null; end;
end $$;

-- 3) Função utilitária para normalizar CPFs (apenas dígitos)
create or replace function public.strip_digits(value text)
returns text
language sql
immutable
as $$
  select case when value is null then null else regexp_replace(value, '\D', '', 'g') end
$$;

-- 4) Trigger para atualizar atualizado_em automaticamente
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'trg_clientes_fidelidade_set_updated_at'
  ) then
    create trigger trg_clientes_fidelidade_set_updated_at
      before update on public.clientes_fidelidade
      for each row execute function public.update_updated_at_column();
  end if;
end $$;

-- 5) Trigger para normalizar CPF em clientes_fidelidade
create or replace function public.normalize_cpf_on_clientes_fidelidade()
returns trigger
language plpgsql
as $$
begin
  new.cpf := public.strip_digits(new.cpf);
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'trg_clientes_fidelidade_normalize_cpf'
  ) then
    create trigger trg_clientes_fidelidade_normalize_cpf
      before insert or update on public.clientes_fidelidade
      for each row execute function public.normalize_cpf_on_clientes_fidelidade();
  end if;
end $$;

-- 6) Triggers para normalizar CPF em vendas (cpf_cliente e cpf_fidelidade)
create or replace function public.normalize_cpf_on_vendas()
returns trigger
language plpgsql
as $$
begin
  if new.cpf_cliente is not null then
    new.cpf_cliente := public.strip_digits(new.cpf_cliente);
  end if;

  if new.cpf_fidelidade is not null then
    new.cpf_fidelidade := public.strip_digits(new.cpf_fidelidade);
  end if;

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'trg_vendas_normalize_cpf'
  ) then
    create trigger trg_vendas_normalize_cpf
      before insert or update on public.vendas
      for each row execute function public.normalize_cpf_on_vendas();
  end if;
end $$;

-- 7) Trigger de atualizado_em em vendas (caso ainda não exista)
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'trg_vendas_set_updated_at'
  ) then
    create trigger trg_vendas_set_updated_at
      before update on public.vendas
      for each row execute function public.update_updated_at_column();
  end if;
end $$;

-- 8) FK de vendas.cpf_fidelidade -> clientes_fidelidade.cpf (NOT VALID para não quebrar dados legados)
do $$
begin
  begin
    alter table public.vendas
      add constraint fk_vendas_clientes_fidelidade
      foreign key (cpf_fidelidade)
      references public.clientes_fidelidade(cpf)
      on update cascade
      on delete set null
      not valid;
  exception when duplicate_object then null; end;
end $$;

-- 9) Normalizar CPFs existentes em vendas (remove máscara caso haja)
update public.vendas
set
  cpf_cliente = nullif(public.strip_digits(cpf_cliente), ''),
  cpf_fidelidade = nullif(public.strip_digits(cpf_fidelidade), '')
where cpf_cliente is not null or cpf_fidelidade is not null;

-- 10) Popular tabela com os CPFs que você passou (evita duplicar com ON CONFLICT)
insert into public.clientes_fidelidade (cpf, nome, pontos)
values 
  ('22553346824', 'Ester Rocha', 0),
  ('37097181800', 'Fagner Barreto', 0),
  ('33333333333', 'Igor Monteiro', 0),
  ('35649814899', 'Rodolpho Florentino', 10)
on conflict (cpf) do nothing;
