import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Course {
  id: string;
  title: string;
  description?: string;
  date: string;
  modality?: string;
  location?: string;
  registration_link?: string;
  image_url?: string;
  created_at: string;
}

export function useCourses() {
  return useQuery<Course[], Error>({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw new Error(error.message);

      return (data ?? []) as Course[];
    },
  });
}
