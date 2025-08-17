-- Função e trigger para atualização automática de pontos de fidelidade após vendas

create or replace function public.atualizar_pontos_fidelidade()
returns trigger
language plpgsql
as $$
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
$$;

-- Recria o trigger para garantir idempotência
drop trigger if exists trg_atualizar_pontos_fidelidade on public.vendas;
create trigger trg_atualizar_pontos_fidelidade
after insert on public.vendas
for each row
execute function public.atualizar_pontos_fidelidade();