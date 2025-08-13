-- Alterar tabela vendas para a nova estrutura
-- Primeiro, criar sequência para numero_cupom se não existir
CREATE SEQUENCE IF NOT EXISTS vendas_numero_cupom_seq START WITH 1 INCREMENT BY 1;

-- Desativar RLS na tabela vendas
ALTER TABLE public.vendas DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas RLS existentes
DROP POLICY IF EXISTS "Vendas podem ser atualizadas por todos" ON public.vendas;
DROP POLICY IF EXISTS "Vendas podem ser deletadas por todos" ON public.vendas;
DROP POLICY IF EXISTS "Vendas podem ser inseridas por todos" ON public.vendas;
DROP POLICY IF EXISTS "Vendas são visíveis por todos" ON public.vendas;

-- Alterar colunas existentes e adicionar novas
-- Renomear numero_pedido para numero_cupom e usar nova sequência
ALTER TABLE public.vendas 
  DROP COLUMN IF EXISTS numero_pedido CASCADE;

-- Adicionar nova coluna numero_cupom com sequência
ALTER TABLE public.vendas 
  ADD COLUMN numero_cupom integer NOT NULL DEFAULT nextval('vendas_numero_cupom_seq');

-- Alterar coluna status para usar novos valores
ALTER TABLE public.vendas 
  ALTER COLUMN status TYPE text,
  ALTER COLUMN status SET DEFAULT 'ativo';

-- Renomear valor_total para valor_bruto
ALTER TABLE public.vendas 
  RENAME COLUMN valor_total TO valor_bruto;

-- Alterar valor_bruto para ser obrigatório
ALTER TABLE public.vendas 
  ALTER COLUMN valor_bruto SET NOT NULL;

-- Adicionar novas colunas
ALTER TABLE public.vendas 
  ADD COLUMN IF NOT EXISTS valor_taxa numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valor_desconto numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valor_liquido numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valor_troco numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vendedor_id uuid REFERENCES public.garcons(id),
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'balcao',
  ADD COLUMN IF NOT EXISTS numero_mesa_comanda integer,
  ADD COLUMN IF NOT EXISTS cpf_cliente text,
  ADD COLUMN IF NOT EXISTS cpf_fidelidade text,
  ADD COLUMN IF NOT EXISTS finalizado_em timestamp with time zone;

-- Remover colunas antigas que não são mais necessárias
ALTER TABLE public.vendas 
  DROP COLUMN IF EXISTS garcom_id CASCADE,
  DROP COLUMN IF EXISTS mesa_id CASCADE;

-- Adicionar restrições para status e tipo
ALTER TABLE public.vendas 
  ADD CONSTRAINT vendas_status_check CHECK (status IN ('ativo', 'cancelado'));

ALTER TABLE public.vendas 
  ADD CONSTRAINT vendas_tipo_check CHECK (tipo IN ('balcao', 'mesa', 'comanda'));

-- Habilitar realtime para a tabela
ALTER TABLE public.vendas REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendas;