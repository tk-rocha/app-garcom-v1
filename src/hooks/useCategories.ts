import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  nome: string;
  criado_em?: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categorias')
          .select('*')
          .order('criado_em', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
          setError(error.message);
          return;
        }

        setCategories(data || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    // Set up real-time updates
    const channel = supabase
      .channel('categorias-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categorias',
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { categories, loading, error };
};