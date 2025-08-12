-- Remover categorias duplicadas, mantendo apenas as versões em maiúsculo
DELETE FROM categorias WHERE nome = 'Bebidas';
DELETE FROM categorias WHERE nome = 'Lanches';
DELETE FROM categorias WHERE nome = 'Sobremesas';

-- Remover outras categorias que não têm versão em maiúsculo
DELETE FROM categorias WHERE nome = 'Aperitivos';
DELETE FROM categorias WHERE nome = 'Pratos Principais';