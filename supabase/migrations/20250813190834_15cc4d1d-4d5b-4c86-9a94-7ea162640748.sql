-- Criar tabela pagamentos_venda
CREATE TABLE public.pagamentos_venda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_venda uuid NOT NULL REFERENCES public.vendas(id) ON DELETE CASCADE,
  id_forma_pagamento uuid NOT NULL REFERENCES public.formas_pagamento(id) ON DELETE RESTRICT,
  valor_pago numeric(10,2) NOT NULL,
  criado_em timestamp with time zone DEFAULT now()
);

-- Desativar RLS
ALTER TABLE public.pagamentos_venda DISABLE ROW LEVEL SECURITY;

-- Habilitar realtime
ALTER TABLE public.pagamentos_venda REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pagamentos_venda;

-- Criar índices para melhor performance
CREATE INDEX idx_pagamentos_venda_id_venda ON public.pagamentos_venda(id_venda);
CREATE INDEX idx_pagamentos_venda_id_forma_pagamento ON public.pagamentos_venda(id_forma_pagamento);
CREATE INDEX idx_pagamentos_venda_criado_em ON public.pagamentos_venda(criado_em);

-- Adicionar constraint para garantir que valor_pago seja positivo
ALTER TABLE public.pagamentos_venda 
  ADD CONSTRAINT pagamentos_venda_valor_pago_positivo CHECK (valor_pago > 0);