import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PortalLayout from './PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Plus, Pencil, UserCircle, FolderOpen, MapPin, Hash, Calendar, ChevronRight, Gavel, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSection from '@/components/portal/ProfileSection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import CalendarSection from '@/components/CalendarSection';

const navItems = [
  { id: 'perfil', label: 'Configurações', icon: UserCircle },
  { id: 'casos', label: 'Gestão da Subseção', icon: FolderOpen },
  { id: 'calendario', label: 'Calendário', icon: Calendar },
];

interface Caso {
  id: string;
  nome: string;
  processo: string | null;
  comarca: string | null;
  uf: string | null;
  ajuizamento: string | null;
  created_at: string;
}

interface Subsection {
  id: string;
  city: string;
  corregedor: string;
}

const PresidenteDashboard = () => {
  const [activeItem, setActiveItem] = useState('perfil');
  const navigate = useNavigate();
  const { subsectionId } = useAuth();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newProcesso, setNewProcesso] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome || !newProcesso) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('casos')
        .insert({
          subsection_id: subsectionId,
          nome: newNome,
          processo: newProcesso,
          documentos: {
            demandasTed: [],
            ouvidoria: [],
            prerrogativas: [],
            fiscalizacao: [],
            esa: [],
            comissoes: [],
            financeiro: [],
            customCategories: [],
          }
        })
        .select('id')
        .single();

      if (error) throw error;
      toast.success('Processo criado com sucesso!');
      setIsCreateDialogOpen(false);
      setNewNome('');
      setNewProcesso('');
      navigate(`/portal/presidente/casos/${data.id}`);
    } catch (err: any) {
      toast.error('Erro ao criar processo: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const { data: subsection } = useQuery<Subsection | null>({
    queryKey: ['presidente-subsection', subsectionId],
    enabled: !!subsectionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subsections')
        .select('id, city, corregedor')
        .eq('id', subsectionId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: casos, isLoading } = useQuery<Caso[]>({
    queryKey: ['presidente-casos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('casos')
        .select('id, nome, processo, comarca, uf, ajuizamento, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <PortalLayout
      title={activeItem === 'perfil' ? "Configurações" : activeItem === 'casos' ? "Gestão da Subseção" : "Calendário de Assembleias"}
      navItems={navItems}
      activeItem={activeItem}
      onNavClick={setActiveItem}
    >
      {activeItem === 'perfil' && (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
          {/* Subsection context banner */}
          {subsection && (
            <div className="flex items-center gap-4 p-5 rounded-xl bg-primary/5 border border-primary/10">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Subseção Vinculada</p>
                <p className="text-sm font-black text-primary uppercase tracking-tight truncate">{subsection.city}</p>
                {subsection.corregedor && (
                  <p className="text-xs text-muted-foreground truncate">{subsection.corregedor}</p>
                )}
              </div>
              <Badge
                variant="outline"
                className="ml-auto bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-600 hover:text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border flex-shrink-0 transition-colors duration-200 cursor-default"
              >
                ATIVO
              </Badge>
            </div>
          )}
          <ProfileSection />
        </div>
      )}

      {activeItem === 'casos' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
                <Gavel className="h-6 w-6 text-secondary" /> Governança de Casos
              </h2>
              <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
                {subsection ? (
                  <>
                    <Building2 className="h-3.5 w-3.5 text-primary/50" />
                    <span>Subseção <strong className="text-primary">{subsection.city}</strong></span>
                  </>
                ) : (
                  'Administração estratégica e acompanhamento de processos da subseção.'
                )}
              </p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] tracking-widest uppercase px-6 h-11 shadow-lg shadow-primary/10 transition-all active:scale-95"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              NOVO PROCESSO
            </Button>
          </div>

          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[220px] bg-muted animate-pulse rounded-lg border border-border/50" />
              ))}
            </div>
          )}

          {!isLoading && casos?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-dashed border-border rounded-xl">
              <div className="p-4 bg-muted/50 rounded-full mb-4">
                <FileText className="w-10 h-10 opacity-20 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary">Nenhum caso cadastrado</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2 italic">
                A subseção ainda não possui processos registrados. Clique em 'Novo Processo' para iniciar.
              </p>
            </div>
          )}

          {!isLoading && casos && casos.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {casos.map((caso) => (
                <Card key={caso.id} className="group flex flex-col border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-300 overflow-hidden bg-card">
                  <CardHeader className="pb-4 bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <CardTitle className="text-sm font-black text-primary uppercase tracking-tight line-clamp-2 min-h-[40px]">
                      {caso.nome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 text-xs text-muted-foreground space-y-4 flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Hash className="h-3.5 w-3.5 text-primary/60" />
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Protocolo</p>
                          <p className="font-bold text-foreground truncate">{caso.processo || '—'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-primary/60" />
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Comarca / UF</p>
                          <p className="font-bold text-foreground">
                            {caso.comarca || '—'}{caso.uf && ` / ${caso.uf}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary/60" />
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Data de Ajuizamento</p>
                          <p className="font-bold text-foreground">
                            {caso.ajuizamento ? new Date(caso.ajuizamento).toLocaleDateString('pt-BR') : 'Não informada'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-6 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/20 text-primary font-black text-[10px] tracking-widest uppercase hover:bg-primary/5 transition-all h-10 group/btn shadow-sm"
                      onClick={() => navigate(`/portal/presidente/casos/${caso.id}`)}
                    >
                      EDITAR REGISTRO <Pencil className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Create Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-md border-none shadow-2xl overflow-hidden p-0 bg-white">
              <DialogHeader className="bg-primary p-6 text-white border-b border-primary/10">
                <DialogTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Plus className="h-4 w-4 text-[#C1A461]" /> Novo Processo
                </DialogTitle>
                <span className="sr-only">Preencha os dados do novo processo da subseção</span>
              </DialogHeader>
              <form onSubmit={handleCreateProcess} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nome">Nome do Caso *</Label>
                  <Input
                    id="nome"
                    value={newNome}
                    onChange={(e) => setNewNome(e.target.value)}
                    placeholder="Ex: Recuperação Judicial ABC Ltda"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="processo">Número do Processo *</Label>
                  <Input
                    id="processo"
                    value={newProcesso}
                    onChange={(e) => setNewProcesso(e.target.value)}
                    placeholder="0000000-00.0000.8.00.0000"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setNewNome('');
                      setNewProcesso('');
                    }}
                    disabled={isCreating}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Criar Processo
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {activeItem === 'calendario' && (
        <div className="max-w-6xl mx-auto animate-fade-in bg-white p-6 rounded-xl border border-border/50 shadow-sm">
          <CalendarSection allowNotes={true} subsectionId={subsectionId} />
        </div>
      )}
    </PortalLayout>
  );
};

export default PresidenteDashboard;
