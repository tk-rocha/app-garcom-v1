-- Criar tabela formas_pagamento
CREATE TABLE public.formas_pagamento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  situacao text NOT NULL DEFAULT 'ativo',
  nome text NOT NULL,
  padrao_sangria boolean DEFAULT false,
  padrao_suprimento boolean DEFAULT false,
  parcelas_permitidas integer DEFAULT 1,
  permite_troco boolean DEFAULT false,
  traz_fechamento boolean DEFAULT true,
  criado_em timestamp with time zone DEFAULT now(),
  atualizado_em timestamp with time zone DEFAULT now()
);

-- Desativar RLS
ALTER TABLE public.formas_pagamento DISABLE ROW LEVEL SECURITY;

-- Adicionar restrições
ALTER TABLE public.formas_pagamento 
  ADD CONSTRAINT formas_pagamento_situacao_check CHECK (situacao IN ('ativo', 'deletado'));

-- Habilitar realtime
ALTER TABLE public.formas_pagamento REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.formas_pagamento;

-- Criar trigger para atualização automática do campo atualizado_em
CREATE TRIGGER update_formas_pagamento_updated_at
  BEFORE UPDATE ON public.formas_pagamento
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais
INSERT INTO public.formas_pagamento (nome, padrao_sangria, padrao_suprimento, parcelas_permitidas, permite_troco, traz_fechamento) VALUES
('Dinheiro', true, true, 1, true, true),
('PIX', false, false, 1, false, true),
('Cartão Crédito', false, false, 1, false, true),
('Cartão Débito', false, false, 1, false, true),
('Vale Alimentação', false, false, 1, false, true);