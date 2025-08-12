-- Habilitar RLS e criar políticas para todas as tabelas

-- 1. Habilitar RLS em todas as tabelas
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_venda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_componentes ENABLE ROW LEVEL SECURITY;

-- 2. Criar políticas para acesso público às categorias
CREATE POLICY "Categorias são visíveis por todos" 
ON public.categorias 
FOR SELECT 
USING (true);

CREATE POLICY "Categorias podem ser inseridas por todos" 
ON public.categorias 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Categorias podem ser atualizadas por todos" 
ON public.categorias 
FOR UPDATE 
USING (true);

CREATE POLICY "Categorias podem ser deletadas por todos" 
ON public.categorias 
FOR DELETE 
USING (true);

-- 3. Criar políticas para acesso público aos produtos
CREATE POLICY "Produtos são visíveis por todos" 
ON public.produtos 
FOR SELECT 
USING (true);

CREATE POLICY "Produtos podem ser inseridos por todos" 
ON public.produtos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Produtos podem ser atualizados por todos" 
ON public.produtos 
FOR UPDATE 
USING (true);

CREATE POLICY "Produtos podem ser deletados por todos" 
ON public.produtos 
FOR DELETE 
USING (true);

-- 4. Criar políticas para acesso público às mesas
CREATE POLICY "Mesas são visíveis por todos" 
ON public.mesas 
FOR SELECT 
USING (true);

CREATE POLICY "Mesas podem ser inseridas por todos" 
ON public.mesas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Mesas podem ser atualizadas por todos" 
ON public.mesas 
FOR UPDATE 
USING (true);

CREATE POLICY "Mesas podem ser deletadas por todos" 
ON public.mesas 
FOR DELETE 
USING (true);

-- 5. Criar políticas para acesso público às vendas
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

-- 6. Criar políticas para acesso público aos itens de venda
CREATE POLICY "Itens de venda são visíveis por todos" 
ON public.itens_venda 
FOR SELECT 
USING (true);

CREATE POLICY "Itens de venda podem ser inseridos por todos" 
ON public.itens_venda 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Itens de venda podem ser atualizados por todos" 
ON public.itens_venda 
FOR UPDATE 
USING (true);

CREATE POLICY "Itens de venda podem ser deletados por todos" 
ON public.itens_venda 
FOR DELETE 
USING (true);

-- 7. Criar políticas para acesso público aos componentes de produto
CREATE POLICY "Componentes de produto são visíveis por todos" 
ON public.produto_componentes 
FOR SELECT 
USING (true);

CREATE POLICY "Componentes de produto podem ser inseridos por todos" 
ON public.produto_componentes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Componentes de produto podem ser atualizados por todos" 
ON public.produto_componentes 
FOR UPDATE 
USING (true);

CREATE POLICY "Componentes de produto podem ser deletados por todos" 
ON public.produto_componentes 
FOR DELETE 
USING (true);