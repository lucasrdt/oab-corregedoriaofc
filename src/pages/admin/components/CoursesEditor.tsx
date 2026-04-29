import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Plus, Trash, Edit, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useCourses, Course } from '@/hooks/useCourses';

const OAB_MA_SITE_ID = import.meta.env.VITE_SITE_ID || '';
const IS_SITE_CONFIGURED = OAB_MA_SITE_ID && OAB_MA_SITE_ID !== 'CONFIGURE_SITE_ID';


const courseSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  description: z.string().optional(),
  date: z.string().min(1, 'Data obrigatória'),
  modality: z.string().optional(),
  location: z.string().optional(),
  registration_link: z.string().url('URL inválida').or(z.literal('')).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

const CoursesEditor = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Course | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const queryClient = useQueryClient();
  const { data: courses, isLoading } = useCourses();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  const modalityValue = watch('modality');

  const openCreateDialog = () => {
    setEditingItem(null);
    setImageUrl('');
    reset({
      title: '',
      description: '',
      date: '',
      modality: '',
      location: '',
      registration_link: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Course) => {
    setEditingItem(item);
    setImageUrl(item.image_url || '');
    // Convert ISO date to datetime-local format (YYYY-MM-DDTHH:mm)
    let dateValue = '';
    if (item.date) {
      try {
        const d = parseISO(item.date);
        dateValue = format(d, "yyyy-MM-dd'T'HH:mm");
      } catch {
        dateValue = item.date.slice(0, 16);
      }
    }
    reset({
      title: item.title,
      description: item.description || '',
      date: dateValue,
      modality: item.modality || '',
      location: item.location || '',
      registration_link: item.registration_link || '',
    });
    setIsDialogOpen(true);
  };

  const createCourse = useMutation({
    mutationFn: async (formData: CourseFormData) => {
      const { error } = await supabase.from('courses').insert([
        {
          ...formData,
          image_url: imageUrl || null,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso criado.');
      setIsDialogOpen(false);
      setEditingItem(null);
    },
    onError: () => {
      toast.error('Erro ao salvar. Tente novamente.');
    },
  });

  const updateCourse = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: CourseFormData }) => {
      const { error } = await supabase
        .from('courses')
        .update({ ...formData, image_url: imageUrl || null })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso atualizado.');
      setIsDialogOpen(false);
      setEditingItem(null);
    },
    onError: () => {
      toast.error('Erro ao salvar. Tente novamente.');
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso removido.');
    },
    onError: () => {
      toast.error('Erro ao remover. Tente novamente.');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este curso?')) {
      deleteCourse.mutate(id);
    }
  };

  const onSubmit = (formData: CourseFormData) => {
    if (editingItem) {
      updateCourse.mutate({ id: editingItem.id, formData });
    } else {
      createCourse.mutate(formData);
    }
  };

  const formatCourseDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-primary uppercase tracking-tight">Academia de Cursos</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Capacitação e Aperfeiçoamento Jurídico</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
                onClick={openCreateDialog}
                className="bg-primary hover:bg-primary/90 h-11 px-8 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" /> Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-h-[92vh]">
            <div className="flex h-full flex-col">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tight">
                            {editingItem ? 'Ajustar Qualificação' : 'Propor Novo Curso'}
                        </DialogTitle>
                        <span className="sr-only">Preencha os detalhes do curso abaixo</span>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-secondary text-primary text-[10px] font-black uppercase rounded-full tracking-tighter shadow-sm">Certificado Digital</span>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-10">
                  <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12 space-y-8">
                      <div className="grid gap-3">
                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Título do Curso / Ciclo de Palestras</Label>
                        <Input
                          id="title"
                          {...register('title')}
                          placeholder="Ex: Atualização em Direito Civil e Processual"
                          className="h-14 bg-slate-50 border-slate-200 focus:bg-white rounded-2xl text-lg font-black text-primary shadow-inner"
                        />
                        {errors.title && <p className="text-destructive text-[10px] font-bold uppercase ml-2">{errors.title.message}</p>}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Data e Horário do Evento</Label>
                          <Input
                            id="date"
                            type="datetime-local"
                            {...register('date')}
                            className="h-12 bg-slate-50 border-slate-200 rounded-xl font-black text-center"
                          />
                          {errors.date && <p className="text-destructive text-[10px] font-bold uppercase ml-2">{errors.date.message}</p>}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="modality" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Modalidade de Ensino</Label>
                          <Select
                            value={modalityValue || ''}
                            onValueChange={(val) => setValue('modality', val)}
                          >
                            <SelectTrigger id="modality" className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold">
                              <SelectValue placeholder="Selecione a modalidade" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                              <SelectItem value="Presencial" className="font-bold py-3 uppercase text-[10px] tracking-widest italic">Presencial - Sede OAB</SelectItem>
                              <SelectItem value="Online" className="font-bold py-3 uppercase text-[10px] tracking-widest italic">Online - Ao Vivo</SelectItem>
                              <SelectItem value="Híbrido" className="font-bold py-3 uppercase text-[10px] tracking-widest italic">Híbrido - Flexível</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Ementa e Programação</Label>
                        <Textarea
                          id="description"
                          rows={4}
                          {...register('description')}
                          placeholder="Detalhe o conteúdo programático..."
                          className="bg-slate-50 border-slate-200 rounded-2xl font-medium focus:bg-white shadow-inner resize-none"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Localização ou Link</Label>
                          <Input
                            id="location"
                            {...register('location')}
                            placeholder="Ex: Auditório Principal ou URL"
                            className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold"
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="registration_link" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Link para Inscrições</Label>
                          <Input
                            id="registration_link"
                            type="url"
                            {...register('registration_link')}
                            placeholder="https://oabma.org.br/eventos/..."
                            className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium"
                          />
                        </div>
                      </div>

                      <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 text-center block">Identidade Visual do Curso</Label>
                        <ImageUpload
                          siteId={OAB_MA_SITE_ID}
                          label=""
                          value={imageUrl}
                          onChange={setImageUrl}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsDialogOpen(false)}
                      className="h-12 px-8 font-black text-[10px] tracking-widest uppercase hover:bg-slate-100 rounded-xl"
                    >
                      Descartar
                    </Button>
                    <Button
                      type="submit"
                      disabled={createCourse.isPending || updateCourse.isPending}
                      className="bg-primary h-12 px-12 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20"
                    >
                      {editingItem ? 'Finalizar Edição' : 'Publicar Curso'}
                    </Button>
                  </div>
                </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <p className="font-black text-primary/30 uppercase tracking-[0.3em] text-xs italic">Nenhum curso acadêmico disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((item) => (
            <Card key={item.id} className="group border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/10 transition-all rounded-[2rem] overflow-hidden bg-white cursor-default">
              <div className="aspect-video relative overflow-hidden group-hover:scale-105 transition-transform duration-700 bg-slate-100">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Calendar className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-sm">
                    {item.modality || 'Evento'}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <Button
                    size="icon"
                    variant="white"
                    className="h-9 w-9 bg-white rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all"
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-9 w-9 bg-red-500 text-white rounded-xl shadow-xl hover:bg-red-600 transition-all border-none"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-primary uppercase tracking-tight leading-tight group-hover:text-secondary-foreground transition-colors min-h-[3rem] line-clamp-2">{item.title}</h3>
                  
                  <div className="space-y-3 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary/40" />
                      <span className="text-[11px] font-black text-primary/80 uppercase tracking-widest">{formatCourseDate(item.date)}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-primary/40" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  {item.registration_link && (
                    <a 
                      href={item.registration_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 group/link"
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary border-b border-primary/20 group-hover/link:border-primary transition-all">Página de Inscrição</span>
                      <ExternalLink className="w-3 h-3 text-primary group-hover/link:translate-y--0.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                  <span className="text-[8px] font-black text-primary/20 uppercase tracking-[0.2em] italic">OAB Premium</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesEditor;
