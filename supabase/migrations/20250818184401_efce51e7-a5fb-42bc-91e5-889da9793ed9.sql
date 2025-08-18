begin;
-- 1) Limpar tabelas filhas primeiro
DELETE FROM public.itens_venda;
DELETE FROM public.pagamentos_venda;

-- 2) Limpar tabela principal de vendas
DELETE FROM public.vendas;

-- 3) Reiniciar sequência do número do cupom para começar em 1
ALTER SEQUENCE public.vendas_numero_cupom_seq RESTART WITH 1;
commit;