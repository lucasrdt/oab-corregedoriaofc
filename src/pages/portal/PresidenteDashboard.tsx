import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PortalLayout from './PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Plus, Pencil, UserCircle, FolderOpen, MapPin, Hash, Calendar, ChevronRight, Gavel } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import ProfileSection from '@/components/portal/ProfileSection';

const navItems = [
  { id: 'casos', label: 'Gestão da Subseção', icon: FolderOpen },
  { id: 'perfil', label: 'Meu Perfil', icon: UserCircle },
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

const PresidenteDashboard = () => {
  const [activeItem, setActiveItem] = useState('casos');
  const navigate = useNavigate();

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
      title={activeItem === 'perfil' ? "Meu Perfil Institucional" : "Painel da Presidência"}
      navItems={navItems}
      activeItem={activeItem}
      onNavClick={setActiveItem}
    >
      {activeItem === 'perfil' && (
        <div className="max-w-4xl mx-auto animate-fade-in">
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
              <p className="text-muted-foreground font-medium text-sm">Administração estratégica e acompanhamento de processos da subseção.</p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] tracking-widest uppercase px-6 h-11 shadow-lg shadow-primary/10 transition-all active:scale-95"
              onClick={() => navigate('/portal/presidente/casos/new')}
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
        </div>
      )}
    </PortalLayout>
  );
};

export default PresidenteDashboard;
