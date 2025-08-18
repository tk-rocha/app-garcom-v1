-- Ensure CPF normalization, updated_at, and loyalty points triggers on vendas
DROP TRIGGER IF EXISTS trg_normalize_cpf_on_vendas ON public.vendas;
CREATE TRIGGER trg_normalize_cpf_on_vendas
BEFORE INSERT OR UPDATE ON public.vendas
FOR EACH ROW EXECUTE FUNCTION public.normalize_cpf_on_vendas();

DROP TRIGGER IF EXISTS trg_update_vendas_updated_at ON public.vendas;
CREATE TRIGGER trg_update_vendas_updated_at
BEFORE UPDATE ON public.vendas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_atualizar_pontos_on_finalize ON public.vendas;
CREATE TRIGGER trg_atualizar_pontos_on_finalize
AFTER UPDATE ON public.vendas
FOR EACH ROW EXECUTE FUNCTION public.atualizar_pontos_fidelidade_on_finalize();