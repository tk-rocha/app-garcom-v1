-- Criar estrutura para fases de produtos (combos)

-- 1. Tabela de tipos de fase
CREATE TABLE public.tipos_fase (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE, -- 'meat', 'soda', 'additional', 'flavor', 'drink'
  titulo text NOT NULL, -- 'Ponto da Carne', 'Refrigerante', etc.
  opcional boolean DEFAULT false,
  criado_em timestamp with time zone DEFAULT now()
);

-- 2. Tabela de opções de fase
CREATE TABLE public.opcoes_fase (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_fase_id uuid REFERENCES public.tipos_fase(id) ON DELETE CASCADE,
  nome text NOT NULL,
  preco_adicional numeric DEFAULT 0,
  ativo boolean DEFAULT true,
  criado_em timestamp with time zone DEFAULT now()
);

-- 3. Tabela de fases do produto (relaciona produtos com tipos de fase)
CREATE TABLE public.produto_fases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id uuid REFERENCES public.produtos(id) ON DELETE CASCADE,
  tipo_fase_id uuid REFERENCES public.tipos_fase(id) ON DELETE CASCADE,
  ordem integer NOT NULL, -- ordem da fase no fluxo
  obrigatorio boolean DEFAULT true,
  criado_em timestamp with time zone DEFAULT now(),
  UNIQUE(produto_id, tipo_fase_id)
);

-- Enable RLS
ALTER TABLE public.tipos_fase ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opcoes_fase ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_fases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Tipos de fase são visíveis por todos" ON public.tipos_fase FOR SELECT USING (true);
CREATE POLICY "Tipos de fase podem ser inseridos por todos" ON public.tipos_fase FOR INSERT WITH CHECK (true);
CREATE POLICY "Tipos de fase podem ser atualizados por todos" ON public.tipos_fase FOR UPDATE USING (true);
CREATE POLICY "Tipos de fase podem ser deletados por todos" ON public.tipos_fase FOR DELETE USING (true);

CREATE POLICY "Opções de fase são visíveis por todos" ON public.opcoes_fase FOR SELECT USING (true);
CREATE POLICY "Opções de fase podem ser inseridas por todos" ON public.opcoes_fase FOR INSERT WITH CHECK (true);
CREATE POLICY "Opções de fase podem ser atualizadas por todos" ON public.opcoes_fase FOR UPDATE USING (true);
CREATE POLICY "Opções de fase podem ser deletadas por todos" ON public.opcoes_fase FOR DELETE USING (true);

CREATE POLICY "Produto fases são visíveis por todos" ON public.produto_fases FOR SELECT USING (true);
CREATE POLICY "Produto fases podem ser inseridas por todos" ON public.produto_fases FOR INSERT WITH CHECK (true);
CREATE POLICY "Produto fases podem ser atualizadas por todos" ON public.produto_fases FOR UPDATE USING (true);
CREATE POLICY "Produto fases podem ser deletadas por todos" ON public.produto_fases FOR DELETE USING (true);

-- Inserir tipos de fase
INSERT INTO public.tipos_fase (nome, titulo, opcional) VALUES 
('meat', 'Ponto da Carne', false),
('soda', 'Refrigerante', false),
('additional', 'Adicionais', true),
('flavor', 'Sabor', false),
('drink', 'Bebida', false);

-- Inserir opções para cada tipo de fase
INSERT INTO public.opcoes_fase (tipo_fase_id, nome, preco_adicional) 
SELECT tf.id, opt.nome, opt.preco
FROM public.tipos_fase tf,
(VALUES 
  ('meat', 'Mal passada', 0),
  ('meat', 'Ao ponto', 0),
  ('meat', 'Bem passada', 0),
  ('soda', 'Coca-Cola', 0),
  ('soda', 'Pepsi', 0),
  ('soda', 'Guaraná', 0),
  ('soda', 'Sprite', 0),
  ('soda', 'Fanta', 0),
  ('additional', 'Batata Frita', 5.00),
  ('additional', 'Onion Rings', 7.00),
  ('additional', 'Queijo Extra', 3.00),
  ('additional', 'Bacon', 4.00),
  ('flavor', 'Carne', 0),
  ('flavor', 'Queijo', 0),
  ('flavor', 'Pizza', 0),
  ('flavor', 'Palmito', 0),
  ('drink', 'Suco de Laranja', 0),
  ('drink', 'Suco de Uva', 0),
  ('drink', 'Água', 0),
  ('drink', 'Refrigerante', 0)
) AS opt(tipo, nome, preco)
WHERE tf.nome = opt.tipo;