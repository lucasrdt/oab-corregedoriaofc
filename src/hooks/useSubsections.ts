import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Subsection {
  id: string;
  city: string;
  corregedor: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  cover_image_url?: string | null;
  created_at: string;
}

export function useSubsections() {
  return useQuery<Subsection[]>({
    queryKey: ['subsections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subsections')
        .select('*')
        .order('city', { ascending: true });

      if (error) throw error;
      return data as Subsection[];
    },
  });
}
