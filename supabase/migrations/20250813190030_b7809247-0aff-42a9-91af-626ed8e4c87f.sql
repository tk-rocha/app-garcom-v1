-- Alterar tabela vendas para a nova estrutura (versão corrigida)
-- Primeiro, criar sequência para numero_cupom se não existir
CREATE SEQUENCE IF NOT EXISTS vendas_numero_cupom_seq START WITH 1 INCREMENT BY 1;

-- Desativar RLS na tabela vendas
ALTER TABLE public.vendas DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas RLS existentes
DROP POLICY IF EXISTS "Vendas podem ser atualizadas por todos" ON public.vendas;
DROP POLICY IF EXISTS "Vendas podem ser deletadas por todos" ON public.vendas;
DROP POLICY IF EXISTS "Vendas podem ser inseridas por todos" ON public.vendas;
DROP POLICY IF EXISTS "Vendas são visíveis por todos" ON public.vendas;

-- Remover constraints existentes
ALTER TABLE public.vendas DROP CONSTRAINT IF EXISTS vendas_status_check;
ALTER TABLE public.vendas DROP CONSTRAINT IF EXISTS vendas_tipo_check;

-- Remover coluna numero_pedido se existir
ALTER TABLE public.vendas DROP COLUMN IF EXISTS numero_pedido CASCADE;

-- Adicionar nova coluna numero_cupom com sequência
ALTER TABLE public.vendas ADD COLUMN IF NOT EXISTS numero_cupom integer;

-- Definir default e preencher valores existentes
UPDATE public.vendas SET numero_cupom = nextval('vendas_numero_cupom_seq') WHERE numero_cupom IS NULL;
ALTER TABLE public.vendas ALTER COLUMN numero_cupom SET NOT NULL;
ALTER TABLE public.vendas ALTER COLUMN numero_cupom SET DEFAULT nextval('vendas_numero_cupom_seq');

-- Alterar coluna status
ALTER TABLE public.vendas ALTER COLUMN status SET DEFAULT 'ativo';

-- Renomear valor_total para valor_bruto se ainda não foi renomeado
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendas' AND column_name = 'valor_total') THEN
        ALTER TABLE public.vendas RENAME COLUMN valor_total TO valor_bruto;
    END IF;
END $$;

-- Garantir que valor_bruto seja obrigatório
ALTER TABLE public.vendas ALTER COLUMN valor_bruto SET NOT NULL;

-- Adicionar novas colunas (apenas se não existirem)
DO $$ 
BEGIN
    -- valor_taxa
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendas' AND column_name = 'valor_taxa') THEN
        ALTER TABLE public.vendas ADD COLUMN valor_taxa numeric(10,2) DEFAULT 0;
    END IF;
    
    -- valor_desconto
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendas' AND column_name = 'valor_desconto') THEN
        ALTER TABLE public.vendas ADD COLUMN valor_desconto numeric(10,2) DEFAULT 0;
    END IF;
    
    -- valor_liquido
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendas' AND column_name = 'valor_liquido') THEN
        ALTER TABLE public.vendas ADD COLUMN valor_liquido numeric(10,2) DEFAULT 0;
        UPDATE public.vendas SET valor_liquido = COALESCE(valor_bruto, 0);
        ALTER TABLE public.vendas ALTER COLUMN valor_liquido SET NOT NULL;
    END IF;
    
    -- valor_troco
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendas' AND column_name = 'valor_troco') THEN
        ALTER TABLE public.vendas ADD COLUMN valor_troco numeric(10,2) DEFAULT 0;
    END IF;
    
    -- vendedor_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendas' AND column_name = 'vendedor_id') THEN
        ALTER TABLE public.vendas ADD COLUMN vendedor_id uuid REFERENCES public.garcons(id);
    END IF;
    
    -- tipo
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendas' AND column_name = 'tipo') THEN
        ALTER TABLE public.vendas ADD COLUMN tipo text DEFAULT 'balcao';
        UPDATE public.vendas SET tipo = 'balcao' WHERE tipo IS NULL;
        ALTER TABLE public.vendas ALTER COLUMN tipo SET NOT NULL;
    END IF;
    
    -- numero_mesa_comanda
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendas' AND column_name = 'numero_mesa_comanda') THEN
        ALTER TABLE public.vendas ADD COLUMN numero_mesa_comanda integer;
    END IF;
    
    -- cpf_cliente
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendas' AND column_name = 'cpf_cliente') THEN
        ALTER TABLE public.vendas ADD COLUMN cpf_cliente text;
    END IF;
    
    -- cpf_fidelidade
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendas' AND column_name = 'cpf_fidelidade') THEN
        ALTER TABLE public.vendas ADD COLUMN cpf_fidelidade text;
    END IF;
    
    -- finalizado_em
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendas' AND column_name = 'finalizado_em') THEN
        ALTER TABLE public.vendas ADD COLUMN finalizado_em timestamp with time zone;
    END IF;
END $$;

-- Remover colunas antigas que não são mais necessárias
ALTER TABLE public.vendas DROP COLUMN IF EXISTS garcom_id CASCADE;
ALTER TABLE public.vendas DROP COLUMN IF EXISTS mesa_id CASCADE;

-- Adicionar restrições para status e tipo
ALTER TABLE public.vendas ADD CONSTRAINT vendas_status_check CHECK (status IN ('ativo', 'cancelado'));
ALTER TABLE public.vendas ADD CONSTRAINT vendas_tipo_check CHECK (tipo IN ('balcao', 'mesa', 'comanda'));

-- Habilitar realtime para a tabela
ALTER TABLE public.vendas REPLICA IDENTITY FULL;