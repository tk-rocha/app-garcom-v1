-- Create categorias table
CREATE TABLE public.categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create produtos table
CREATE TABLE public.produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    categoria_id UUID REFERENCES public.categorias(id),
    preco NUMERIC(10,2) NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create produto_componentes table
CREATE TABLE public.produto_componentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    componente_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    quantidade INTEGER DEFAULT 1
);

-- Disable RLS for all tables (as requested)
ALTER TABLE public.categorias DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_componentes DISABLE ROW LEVEL SECURITY;

-- Configure realtime for live updates
ALTER TABLE public.categorias REPLICA IDENTITY FULL;
ALTER TABLE public.produtos REPLICA IDENTITY FULL;
ALTER TABLE public.produto_componentes REPLICA IDENTITY FULL;

-- Add tables to realtime publication for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.categorias;
ALTER PUBLICATION supabase_realtime ADD TABLE public.produtos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.produto_componentes;

-- Insert some sample categories for testing
INSERT INTO public.categorias (nome) VALUES
('Bebidas'),
('Pratos Principais'),
('Sobremesas'),
('Aperitivos'),
('Lanches');

-- Insert some sample products for testing
WITH categoria_bebidas AS (SELECT id FROM public.categorias WHERE nome = 'Bebidas'),
     categoria_pratos AS (SELECT id FROM public.categorias WHERE nome = 'Pratos Principais'),
     categoria_sobremesas AS (SELECT id FROM public.categorias WHERE nome = 'Sobremesas')

INSERT INTO public.produtos (nome, categoria_id, preco, descricao, ativo) VALUES
('Coca-Cola', (SELECT id FROM categoria_bebidas), 9.00, 'Refrigerante de cola gelado', true),
('Sprite', (SELECT id FROM categoria_bebidas), 9.00, 'Refrigerante de limão gelado', true),
('Fanta Laranja', (SELECT id FROM categoria_bebidas), 9.90, 'Refrigerante de laranja gelado', true),
('Hambúrguer Clássico', (SELECT id FROM categoria_pratos), 25.90, 'Hambúrguer com carne, queijo, alface e tomate', true),
('Pizza Margherita', (SELECT id FROM categoria_pratos), 35.00, 'Pizza com molho de tomate, mozzarella e manjericão', true),
('Pudim de Leite', (SELECT id FROM categoria_sobremesas), 12.00, 'Delicioso pudim de leite condensado', true),
('Sorvete de Chocolate', (SELECT id FROM categoria_sobremesas), 8.50, 'Sorvete cremoso sabor chocolate', true);