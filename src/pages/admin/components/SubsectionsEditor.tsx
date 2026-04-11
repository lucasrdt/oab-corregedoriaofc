import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash, Edit } from 'lucide-react';
import { useSubsections, Subsection } from '@/hooks/useSubsections';
import { ImageUpload } from '@/components/ui/image-upload';

type SubsectionFormData = Omit<Subsection, 'id' | 'created_at'>;

const SITE_ID = import.meta.env.VITE_SITE_ID || '';

const SubsectionsEditor = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Subsection | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');

  const queryClient = useQueryClient();
  const { data: subsections, isLoading } = useSubsections();

  const createSubsection = useMutation({
    mutationFn: async (formData: SubsectionFormData) => {
      const { error } = await supabase.from('subsections').insert([formData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subsections'] });
      toast.success('Subseção criada.');
      setIsDialogOpen(false);
      setEditingItem(null);
      setCoverImageUrl('');
    },
    onError: () => toast.error('Erro ao salvar. Tente novamente.'),
  });

  const updateSubsection = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: SubsectionFormData }) => {
      const { error } = await supabase.from('subsections').update(formData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subsections'] });
      toast.success('Subseção atualizada.');
      setIsDialogOpen(false);
      setEditingItem(null);
      setCoverImageUrl('');
    },
    onError: () => toast.error('Erro ao salvar. Tente novamente.'),
  });

  const deleteSubsection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subsections').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subsections'] });
      toast.success('Subseção removida.');
    },
    onError: () => toast.error('Erro ao salvar. Tente novamente.'),
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setCoverImageUrl('');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Subsection) => {
    setEditingItem(item);
    setCoverImageUrl(item.cover_image_url || '');
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta subseção?')) {
      deleteSubsection.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);

    const formData: SubsectionFormData = {
      city: fd.get('city') as string,
      corregedor: fd.get('corregedor') as string,
      address: (fd.get('address') as string) || null,
      phone: (fd.get('phone') as string) || null,
      email: (fd.get('email') as string) || null,
      cover_image_url: coverImageUrl || null,
    };

    if (editingItem) {
      updateSubsection.mutate({ id: editingItem.id, formData });
    } else {
      createSubsection.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em]">Sincronizando Base Regional...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-primary uppercase tracking-tight">Capilaridade Institucional</h2>
            <Badge className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest">
              {subsections?.length || 0} Unidades
            </Badge>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Gestão de Subseções e Corregedorias Regionais</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setEditingItem(null); setCoverImageUrl(''); }
        }}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenCreate}
              className="bg-primary hover:bg-primary/90 h-11 px-8 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" /> Registrar Unidade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl bg-white rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 italic">
                    #{editingItem ? 'EDT' : 'NEW'}
                  </div>
                  {editingItem ? 'Atualizar Jurisdição' : 'Nova Unidade Regional'}
                </DialogTitle>
                <span className="sr-only">Cadastre ou edite as informações da subseção regional</span>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Cover image */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Imagem de Capa</Label>
                <ImageUpload
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                  label=""
                  bucket="site-assets"
                  siteId={SITE_ID}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Município Sede *</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    defaultValue={editingItem?.city ?? ''}
                    placeholder="Ex: Imperatriz"
                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-black text-primary uppercase shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corregedor" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Corregedor(a) Titular *</Label>
                  <Input
                    id="corregedor"
                    name="corregedor"
                    required
                    defaultValue={editingItem?.corregedor ?? ''}
                    placeholder="Nome completo"
                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-black text-primary uppercase shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Endereço de Atendimento</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={editingItem?.address ?? ''}
                  placeholder="Rua, Número, Bairro, CEP"
                  className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary shadow-inner"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Terminal de Contato</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={editingItem?.phone ?? ''}
                    placeholder="(00) 0000-0000"
                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-black text-primary shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Endereço de E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={editingItem?.email ?? ''}
                    placeholder="juridico@oab.org.br"
                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary shadow-inner"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  className="h-12 px-8 font-black text-[10px] tracking-widest uppercase text-primary/40 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                >
                  Descartar
                </Button>
                <Button
                  type="submit"
                  disabled={createSubsection.isPending || updateSubsection.isPending}
                  className="bg-primary hover:bg-primary/90 h-12 px-10 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20 transition-all"
                >
                  {editingItem ? 'Confirmar Alterações' : 'Efetivar Registro'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!subsections || subsections.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <Plus className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <p className="font-black text-primary/30 uppercase tracking-[0.3em] text-xs">Nenhuma Unidade Regional Catalogada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subsections.map((item) => (
            <Card key={item.id} className="group relative border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/10 transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white">
              {/* Cover image */}
              {item.cover_image_url ? (
                <div className="relative h-36 w-full overflow-hidden">
                  <img
                    src={item.cover_image_url}
                    alt={`Capa ${item.city}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                </div>
              ) : (
                <div className="h-36 w-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-black text-primary/10 italic">{item.city.substring(0, 3).toUpperCase()}</span>
                </div>
              )}

              <CardContent className="p-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="h-14 w-14 rounded-2xl bg-slate-50 text-primary flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner italic font-black text-xs">
                    {item.city.substring(0, 3).toUpperCase()}
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] italic">Unidade Federada</span>
                  <h3 className="text-xl font-black text-primary uppercase tracking-tight leading-tight group-hover:translate-x-1 transition-transform">{item.city}</h3>
                </div>

                <div className="pt-4 border-t border-slate-50 space-y-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-primary/20 uppercase tracking-widest">Titular Corregedor</span>
                    <p className="font-bold text-primary/70 uppercase text-xs">{item.corregedor}</p>
                  </div>

                  <div className="space-y-3">
                    {item.address && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary shadow-sm" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed italic line-clamp-2">{item.address}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.phone && (
                        <Badge variant="secondary" className="bg-slate-50 text-primary/40 border-slate-100 font-bold text-[9px] px-3 py-1 rounded-full uppercase tracking-widest group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/5 transition-all">
                          {item.phone}
                        </Badge>
                      )}
                      {item.email && (
                        <Badge variant="secondary" className="bg-slate-50 text-secondary border-slate-100 font-bold text-[9px] px-3 py-1 rounded-full uppercase tracking-widest group-hover:bg-secondary group-hover:text-secondary-foreground transition-all">
                          {item.email}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubsectionsEditor;
