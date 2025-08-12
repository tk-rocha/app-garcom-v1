-- Verificar e corrigir problemas com produtos específicos
UPDATE produtos 
SET imagem_url = CASE 
  WHEN nome = 'Café Coado' THEN 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop'
  WHEN nome ILIKE '%coca cola%' THEN 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=400&fit=crop'
  ELSE imagem_url
END
WHERE nome = 'Café Coado' OR nome ILIKE '%coca cola%';