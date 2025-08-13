-- Adicionar fases de combo para o produto Hambúrguer Clássico
-- Produto ID: 6c01a2c8-07c1-4c69-a38a-850b939068bd

-- Fase 1: Ponto da Carne (obrigatório)
INSERT INTO produto_fases (produto_id, tipo_fase_id, ordem, obrigatorio) 
VALUES (
  '6c01a2c8-07c1-4c69-a38a-850b939068bd', -- Hambúrguer Clássico
  '40d5e37d-63cd-4960-866d-5a78b62ac896', -- Ponto da Carne
  1, 
  true
);

-- Fase 2: Bebida (obrigatório)
INSERT INTO produto_fases (produto_id, tipo_fase_id, ordem, obrigatorio) 
VALUES (
  '6c01a2c8-07c1-4c69-a38a-850b939068bd', -- Hambúrguer Clássico
  'fb090463-67b7-4c2c-8a12-0917db7a52e1', -- Bebida
  2, 
  true
);

-- Fase 3: Adicionais (opcional)
INSERT INTO produto_fases (produto_id, tipo_fase_id, ordem, obrigatorio) 
VALUES (
  '6c01a2c8-07c1-4c69-a38a-850b939068bd', -- Hambúrguer Clássico
  'd235dad4-625e-4efb-81b5-ebb679864ead', -- Adicionais
  3, 
  false
);