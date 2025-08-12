-- Atualizar produtos da categoria "Bebidas" para "BEBIDAS"
UPDATE produtos 
SET categoria_id = (SELECT id FROM categorias WHERE nome = 'BEBIDAS') 
WHERE categoria_id = (SELECT id FROM categorias WHERE nome = 'Bebidas');

-- Atualizar produtos da categoria "Lanches" para "LANCHES"  
UPDATE produtos 
SET categoria_id = (SELECT id FROM categorias WHERE nome = 'LANCHES') 
WHERE categoria_id = (SELECT id FROM categorias WHERE nome = 'Lanches');

-- Atualizar produtos da categoria "Sobremesas" para "SOBREMESAS"
UPDATE produtos 
SET categoria_id = (SELECT id FROM categorias WHERE nome = 'SOBREMESAS') 
WHERE categoria_id = (SELECT id FROM categorias WHERE nome = 'Sobremesas');

-- Como não existem categorias em maiúsculo correspondentes para "Aperitivos" e "Pratos Principais",
-- vamos definir categoria_id como NULL para esses produtos
UPDATE produtos 
SET categoria_id = NULL 
WHERE categoria_id IN (
  SELECT id FROM categorias WHERE nome IN ('Aperitivos', 'Pratos Principais')
);

-- Agora remover as categorias duplicadas e não utilizadas
DELETE FROM categorias WHERE nome IN ('Bebidas', 'Lanches', 'Sobremesas', 'Aperitivos', 'Pratos Principais');