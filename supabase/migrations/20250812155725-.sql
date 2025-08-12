-- Insert categories
INSERT INTO public.categorias (nome) VALUES 
('PRATO DO DIA'),
('EXECUTIVO'), 
('MASSAS'),
('LANCHES'),
('BEBIDAS'),
('CAFÉS'),
('PORÇÕES'),
('SOBREMESAS')
ON CONFLICT (nome) DO NOTHING;

-- Insert products with their respective categories
INSERT INTO public.produtos (nome, categoria_id, preco, descricao) VALUES 
-- PRATO DO DIA
('Virado à Paulista', (SELECT id FROM categorias WHERE nome = 'PRATO DO DIA'), 28.00, 'Tradicional prato paulista'),
('Bife à Rolê', (SELECT id FROM categorias WHERE nome = 'PRATO DO DIA'), 28.00, 'Bife enrolado com temperos especiais'),
('Feijoada', (SELECT id FROM categorias WHERE nome = 'PRATO DO DIA'), 32.00, 'Feijoada completa tradicional'),
('Macarrão à Bolonhesa', (SELECT id FROM categorias WHERE nome = 'PRATO DO DIA'), 25.00, 'Macarrão com molho bolonhesa'),
('Peixe Empanado', (SELECT id FROM categorias WHERE nome = 'PRATO DO DIA'), 28.00, 'Peixe fresco empanado'),
('Churrasco', (SELECT id FROM categorias WHERE nome = 'PRATO DO DIA'), 34.00, 'Mix de carnes grelhadas'),

-- EXECUTIVO
('Bife à Parmegiana', (SELECT id FROM categorias WHERE nome = 'EXECUTIVO'), 32.00, 'Bife empanado com molho e queijo'),
('Frango com Fritas', (SELECT id FROM categorias WHERE nome = 'EXECUTIVO'), 32.00, 'Frango grelhado com batata frita'),
('Bife com Fritas', (SELECT id FROM categorias WHERE nome = 'EXECUTIVO'), 32.00, 'Bife grelhado com batata frita'),
('Panquecas', (SELECT id FROM categorias WHERE nome = 'EXECUTIVO'), 30.00, 'Panquecas doces ou salgadas'),
('Omelete', (SELECT id FROM categorias WHERE nome = 'EXECUTIVO'), 25.00, 'Omelete com recheio especial'),

-- MASSAS
('Lasanha', (SELECT id FROM categorias WHERE nome = 'MASSAS'), 34.00, 'Lasanha à bolonhesa tradicional'),
('Ravioli', (SELECT id FROM categorias WHERE nome = 'MASSAS'), 34.00, 'Ravioli recheado'),
('Cappelletti', (SELECT id FROM categorias WHERE nome = 'MASSAS'), 38.00, 'Cappelletti artesanal'),
('Gnocchi', (SELECT id FROM categorias WHERE nome = 'MASSAS'), 44.00, 'Gnocchi de batata'),
('Rondelli', (SELECT id FROM categorias WHERE nome = 'MASSAS'), 44.00, 'Rondelli recheado'),
('Sorrentini', (SELECT id FROM categorias WHERE nome = 'MASSAS'), 45.00, 'Sorrentini especial'),

-- LANCHES
('Combo X-Salada', (SELECT id FROM categorias WHERE nome = 'LANCHES'), 29.99, 'Hambúrguer com salada completo'),
('Combo X-Bacon', (SELECT id FROM categorias WHERE nome = 'LANCHES'), 31.00, 'Hambúrguer com bacon completo'),
('Combo X-Tudo', (SELECT id FROM categorias WHERE nome = 'LANCHES'), 36.99, 'Hambúrguer completo com todos os ingredientes'),
('Combo Pastel', (SELECT id FROM categorias WHERE nome = 'LANCHES'), 19.99, 'Pastel com bebida'),
('Misto Quente', (SELECT id FROM categorias WHERE nome = 'LANCHES'), 22.00, 'Sanduíche misto quente'),

-- BEBIDAS
('Suco de Laranja', (SELECT id FROM categorias WHERE nome = 'BEBIDAS'), 15.00, 'Suco natural de laranja'),
('Suco de Maracujá', (SELECT id FROM categorias WHERE nome = 'BEBIDAS'), 15.00, 'Suco natural de maracujá'),
('Suco de Abacaxi', (SELECT id FROM categorias WHERE nome = 'BEBIDAS'), 15.00, 'Suco natural de abacaxi'),
('Sprite', (SELECT id FROM categorias WHERE nome = 'BEBIDAS'), 9.00, 'Refrigerante Sprite gelado'),
('Coca-Cola', (SELECT id FROM categorias WHERE nome = 'BEBIDAS'), 9.00, 'Refrigerante Coca-Cola gelado'),
('Fanta Laranja', (SELECT id FROM categorias WHERE nome = 'BEBIDAS'), 9.90, 'Refrigerante Fanta Laranja gelado'),

-- CAFÉS
('Café Expresso', (SELECT id FROM categorias WHERE nome = 'CAFÉS'), 8.00, 'Café expresso tradicional'),
('Macchiato', (SELECT id FROM categorias WHERE nome = 'CAFÉS'), 9.90, 'Café macchiato cremoso'),
('Carioca', (SELECT id FROM categorias WHERE nome = 'CAFÉS'), 7.90, 'Café carioca suave'),
('Café Coado', (SELECT id FROM categorias WHERE nome = 'CAFÉS'), 10.00, 'Café coado tradicional'),
('Latte', (SELECT id FROM categorias WHERE nome = 'CAFÉS'), 7.90, 'Café latte cremoso'),
('Prensa Francesa', (SELECT id FROM categorias WHERE nome = 'CAFÉS'), 9.99, 'Café prensa francesa'),
('Mocaccino', (SELECT id FROM categorias WHERE nome = 'CAFÉS'), 14.00, 'Mocaccino com chocolate'),

-- PORÇÕES
('Batata Frita', (SELECT id FROM categorias WHERE nome = 'PORÇÕES'), 28.00, 'Porção de batata frita crocante'),
('Batata com Cheddar', (SELECT id FROM categorias WHERE nome = 'PORÇÕES'), 37.00, 'Batata frita com molho cheddar'),
('Mandioca Frita', (SELECT id FROM categorias WHERE nome = 'PORÇÕES'), 29.90, 'Porção de mandioca frita'),
('Calabresa', (SELECT id FROM categorias WHERE nome = 'PORÇÕES'), 32.00, 'Porção de calabresa grelhada'),

-- SOBREMESAS
('Fondant de Chocolate', (SELECT id FROM categorias WHERE nome = 'SOBREMESAS'), 13.00, 'Fondant de chocolate quente'),
('Mousse de Limão', (SELECT id FROM categorias WHERE nome = 'SOBREMESAS'), 14.00, 'Mousse de limão cremoso'),
('Tiramisù', (SELECT id FROM categorias WHERE nome = 'SOBREMESAS'), 21.00, 'Tiramisù tradicional italiano');