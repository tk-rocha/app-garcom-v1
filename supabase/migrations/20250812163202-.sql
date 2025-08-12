-- Criar tabela mesas (caso não exista)
CREATE TABLE IF NOT EXISTS public.mesas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero INTEGER NOT NULL UNIQUE,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela vendas
CREATE TABLE public.vendas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_pedido SERIAL NOT NULL,
  mesa_id UUID REFERENCES public.mesas(id),
  garcom_id UUID REFERENCES public.garcons(id),
  status TEXT DEFAULT 'aberta' CHECK (status IN ('aberta', 'enviada_cozinha', 'finalizada', 'cancelada')),
  valor_total NUMERIC(10,2) DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela itens_venda
CREATE TABLE public.itens_venda (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venda_id UUID NOT NULL REFERENCES public.vendas(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES public.produtos(id),
  quantidade INTEGER DEFAULT 1,
  preco_unitario NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'enviado_cozinha', 'preparado', 'entregue')),
  observacao TEXT,
  enviado_em TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Desabilitar RLS conforme solicitado
ALTER TABLE public.mesas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_venda DISABLE ROW LEVEL SECURITY;

-- Criar função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar timestamp na tabela vendas
CREATE TRIGGER update_vendas_updated_at
  BEFORE UPDATE ON public.vendas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Configurar realtime para as tabelas
ALTER TABLE public.mesas REPLICA IDENTITY FULL;
ALTER TABLE public.vendas REPLICA IDENTITY FULL;
ALTER TABLE public.itens_venda REPLICA IDENTITY FULL;

-- Adicionar tabelas ao supabase_realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.mesas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.itens_venda;

-- Criar índices para melhor performance
CREATE INDEX idx_vendas_mesa_id ON public.vendas(mesa_id);
CREATE INDEX idx_vendas_garcom_id ON public.vendas(garcom_id);
CREATE INDEX idx_vendas_status ON public.vendas(status);
CREATE INDEX idx_itens_venda_venda_id ON public.itens_venda(venda_id);
CREATE INDEX idx_itens_venda_produto_id ON public.itens_venda(produto_id);
CREATE INDEX idx_mesas_numero ON public.mesas(numero);