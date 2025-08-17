-- Habilitar Row Level Security (RLS) nas tabelas que não possuem

-- Habilitar RLS na tabela formas_pagamento
ALTER TABLE public.formas_pagamento ENABLE ROW LEVEL SECURITY;

-- Criar políticas para formas_pagamento (acesso público para todos)
CREATE POLICY "Formas de pagamento são visíveis por todos" 
ON public.formas_pagamento 
FOR SELECT 
USING (true);

CREATE POLICY "Formas de pagamento podem ser inseridas por todos" 
ON public.formas_pagamento 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Formas de pagamento podem ser atualizadas por todos" 
ON public.formas_pagamento 
FOR UPDATE 
USING (true);

CREATE POLICY "Formas de pagamento podem ser deletadas por todos" 
ON public.formas_pagamento 
FOR DELETE 
USING (true);

-- Habilitar RLS na tabela pagamentos_venda
ALTER TABLE public.pagamentos_venda ENABLE ROW LEVEL SECURITY;

-- Criar políticas para pagamentos_venda (acesso público para todos)
CREATE POLICY "Pagamentos de venda são visíveis por todos" 
ON public.pagamentos_venda 
FOR SELECT 
USING (true);

CREATE POLICY "Pagamentos de venda podem ser inseridos por todos" 
ON public.pagamentos_venda 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Pagamentos de venda podem ser atualizados por todos" 
ON public.pagamentos_venda 
FOR UPDATE 
USING (true);

CREATE POLICY "Pagamentos de venda podem ser deletados por todos" 
ON public.pagamentos_venda 
FOR DELETE 
USING (true);

-- Habilitar RLS na tabela vendas
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;

-- Criar políticas para vendas (acesso público para todos)
CREATE POLICY "Vendas são visíveis por todos" 
ON public.vendas 
FOR SELECT 
USING (true);

CREATE POLICY "Vendas podem ser inseridas por todos" 
ON public.vendas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Vendas podem ser atualizadas por todos" 
ON public.vendas 
FOR UPDATE 
USING (true);

CREATE POLICY "Vendas podem ser deletadas por todos" 
ON public.vendas 
FOR DELETE 
USING (true);