-- Função corrigida para atualizar pontos na inserção de vendas
CREATE OR REPLACE FUNCTION public.atualizar_pontos_fidelidade_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
declare
  pontos_ganhos int := 0;
begin
  -- Executa apenas quando a venda é inserida com status 'finalizado' e possui CPF de fidelidade
  if (new.status = 'finalizado' and new.cpf_fidelidade is not null) then
    -- calcular pontos ganhos: a cada R$50 => 5 pontos
    pontos_ganhos := (floor((new.valor_liquido / 50))::int) * 5;

    if pontos_ganhos > 0 then
      update public.clientes_fidelidade
      set pontos = pontos + pontos_ganhos,
          atualizado_em = now()
      where cpf = public.strip_digits(new.cpf_fidelidade);
      
      -- Log da operação
      raise notice 'Pontos adicionados: % para CPF: %', pontos_ganhos, new.cpf_fidelidade;
    end if;
  end if;

  return new;
end;
$function$;

-- Criar trigger para inserção de vendas
DROP TRIGGER IF EXISTS trg_atualizar_pontos_on_insert ON public.vendas;
CREATE TRIGGER trg_atualizar_pontos_on_insert
  AFTER INSERT ON public.vendas
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_pontos_fidelidade_on_insert();