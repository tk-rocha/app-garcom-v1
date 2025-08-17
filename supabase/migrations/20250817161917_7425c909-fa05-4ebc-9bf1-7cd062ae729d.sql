-- Corrigir search_path nas funções para segurança

-- Função strip_digits com search_path fixo
CREATE OR REPLACE FUNCTION public.strip_digits(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  select case when value is null then null else regexp_replace(value, '\D', '', 'g') end
$function$;

-- Função normalize_cpf_on_clientes_fidelidade com search_path fixo
CREATE OR REPLACE FUNCTION public.normalize_cpf_on_clientes_fidelidade()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  new.cpf := public.strip_digits(new.cpf);
  return new;
end;
$function$;

-- Função normalize_cpf_on_vendas com search_path fixo
CREATE OR REPLACE FUNCTION public.normalize_cpf_on_vendas()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  if new.cpf_cliente is not null then
    new.cpf_cliente := public.strip_digits(new.cpf_cliente);
  end if;

  if new.cpf_fidelidade is not null then
    new.cpf_fidelidade := public.strip_digits(new.cpf_fidelidade);
  end if;

  return new;
end;
$function$;

-- Função atualizar_pontos_fidelidade com search_path fixo
CREATE OR REPLACE FUNCTION public.atualizar_pontos_fidelidade()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
declare
  pontos_ganhos int := 0;
  pontos_resgatados int := 0;
begin
  -- Aplica apenas quando a venda está ativa e possui CPF de fidelidade
  if (new.status = 'ativo' and new.cpf_fidelidade is not null) then
    -- calcular pontos ganhos: a cada R$50 => 5 pontos
    pontos_ganhos := (floor((new.valor_liquido / 50))::int) * 5;

    if pontos_ganhos > 0 then
      update public.clientes_fidelidade
      set pontos = pontos + pontos_ganhos,
          atualizado_em = now()
      where cpf = public.strip_digits(new.cpf_fidelidade);
    end if;

    -- Se houver desconto (representando resgate de pontos)
    if coalesce(new.valor_desconto, 0) > 0 then
      -- Regra atual: 1 ponto por R$1 de desconto (ajustável futuramente)
      pontos_resgatados := floor(new.valor_desconto)::int;
      update public.clientes_fidelidade
      set pontos = greatest(pontos - pontos_resgatados, 0),
          atualizado_em = now()
      where cpf = public.strip_digits(new.cpf_fidelidade);
    end if;
  end if;

  return new;
end;
$function$;

-- Função update_updated_at_column com search_path fixo
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$function$;

-- Função atualizar_pontos_fidelidade_on_finalize com search_path fixo
CREATE OR REPLACE FUNCTION public.atualizar_pontos_fidelidade_on_finalize()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
declare
  pontos_ganhos int := 0;
  pontos_resgatados int := 0;
begin
  -- Executa apenas quando a venda muda para 'finalizado' e antes não era 'finalizado'
  if (new.status = 'finalizado' and coalesce(old.status, '') <> 'finalizado' and new.cpf_fidelidade is not null) then
    -- calcular pontos ganhos: a cada R$50 => 5 pontos
    pontos_ganhos := (floor((new.valor_liquido / 50))::int) * 5;

    if pontos_ganhos > 0 then
      update public.clientes_fidelidade
      set pontos = pontos + pontos_ganhos,
          atualizado_em = now()
      where cpf = public.strip_digits(new.cpf_fidelidade);
    end if;

    -- Se houver desconto (representando resgate de pontos), baixa pontos
    if coalesce(new.valor_desconto, 0) > 0 then
      pontos_resgatados := floor(new.valor_desconto)::int;
      update public.clientes_fidelidade
      set pontos = greatest(pontos - pontos_resgatados, 0),
          atualizado_em = now()
      where cpf = public.strip_digits(new.cpf_fidelidade);
    end if;
  end if;

  return new;
end;
$function$;