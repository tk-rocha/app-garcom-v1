-- Ensure triggers for CPF normalization, timestamps, and loyalty points on finalization

-- 1) Normalize CPF on clientes_fidelidade before insert/update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_cpf_clientes_fidelidade'
  ) THEN
    CREATE TRIGGER trg_normalize_cpf_clientes_fidelidade
    BEFORE INSERT OR UPDATE ON public.clientes_fidelidade
    FOR EACH ROW
    EXECUTE FUNCTION public.normalize_cpf_on_clientes_fidelidade();
  END IF;
END $$;

-- 2) Normalize CPF on vendas before insert/update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_cpf_vendas'
  ) THEN
    CREATE TRIGGER trg_normalize_cpf_vendas
    BEFORE INSERT OR UPDATE ON public.vendas
    FOR EACH ROW
    EXECUTE FUNCTION public.normalize_cpf_on_vendas();
  END IF;
END $$;

-- 3) Update updated_at column on vendas before update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_vendas_updated_at'
  ) THEN
    CREATE TRIGGER trg_update_vendas_updated_at
    BEFORE UPDATE ON public.vendas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 4) Update updated_at column on clientes_fidelidade before update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_clientes_fidelidade_updated_at'
  ) THEN
    CREATE TRIGGER trg_update_clientes_fidelidade_updated_at
    BEFORE UPDATE ON public.clientes_fidelidade
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 5) Award/adjust loyalty points when sale transitions to 'finalizado'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_pontos_on_venda_finalizada'
  ) THEN
    CREATE TRIGGER trg_pontos_on_venda_finalizada
    AFTER UPDATE ON public.vendas
    FOR EACH ROW
    EXECUTE FUNCTION public.atualizar_pontos_fidelidade_on_finalize();
  END IF;
END $$;

-- 6) Backfill: attach CPF and finalize the specific sale to trigger points (id provided by user)
--    This will only update if cpf_fidelidade is currently null
UPDATE public.vendas
SET cpf_fidelidade = '22553346824'
WHERE id = 'a6e6edd9-878a-43c0-b148-f371134d8c27'
  AND (cpf_fidelidade IS NULL OR cpf_fidelidade = '');

-- If the sale is not yet finalizado, transition it now to fire the trigger
UPDATE public.vendas
SET status = 'finalizado'
WHERE id = 'a6e6edd9-878a-43c0-b148-f371134d8c27'
  AND status <> 'finalizado';