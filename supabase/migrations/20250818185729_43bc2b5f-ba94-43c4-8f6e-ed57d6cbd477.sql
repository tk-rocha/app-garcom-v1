begin;
-- 1) Zerar pontos de fidelidade, mantendo clientes cadastrados
UPDATE public.clientes_fidelidade SET pontos = 0;

-- 2) Garantir que não haja vendas (idempotente)
DELETE FROM public.itens_venda;
DELETE FROM public.pagamentos_venda;
DELETE FROM public.vendas;

-- 3) Reiniciar sequência do número do cupom para começar em 1
ALTER SEQUENCE public.vendas_numero_cupom_seq RESTART WITH 1;
commit;