-- Atualiza a regra: somar pontos SOMENTE quando a venda for finalizada (status = 'finalizado')
-- e houver CPF de fidelidade vinculado. Evita contagem dupla verificando transição de status.

-- Função
create or replace function public.atualizar_pontos_fidelidade_on_finalize()
returns trigger
language plpgsql
as $$
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
$$;

-- Garante idempotência: remove o trigger antigo (que executava no insert)
drop trigger if exists trg_atualizar_pontos_fidelidade on public.vendas;

-- Cria trigger para executar quando o status for atualizado
create trigger trg_atualizar_pontos_fidelidade_on_finalize
after update of status on public.vendas
for each row
execute function public.atualizar_pontos_fidelidade_on_finalize();