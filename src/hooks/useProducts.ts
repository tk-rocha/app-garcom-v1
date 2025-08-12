import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  nome: string;
  preco: number;
  descricao?: string;
  imagem_url?: string;
  ativo: boolean;
  categoria_id?: string;
  criado_em?: string;
  categoria?: {
    nome: string;
  };
}

export const useProducts = (categoryId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('produtos')
          .select(`
            *,
            categoria:categorias(nome)
          `)
          .eq('ativo', true)
          .order('criado_em', { ascending: true });

        if (categoryId) {
          query = query.eq('categoria_id', categoryId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching products:', error);
          setError(error.message);
          return;
        }

        setProducts(data || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Set up real-time updates
    const channel = supabase
      .channel('produtos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'produtos',
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [categoryId]);

  return { products, loading, error };
};

export const useAllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('produtos')
          .select(`
            *,
            categoria:categorias(nome)
          `)
          .eq('ativo', true)
          .order('criado_em', { ascending: true });

        if (error) {
          console.error('Error fetching products:', error);
          setError(error.message);
          return;
        }

        setProducts(data || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Set up real-time updates
    const channel = supabase
      .channel('all-produtos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'produtos',
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, loading, error };
};