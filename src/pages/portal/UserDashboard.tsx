import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PortalLayout from './PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Eye, UserCircle, FolderOpen, MapPin, Hash, Calendar, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import ProfileSection from '@/components/portal/ProfileSection';

const navItems = [
  { id: 'casos', label: 'Painel de Casos', icon: FolderOpen },
  { id: 'perfil', label: 'Meu Perfil', icon: UserCircle },
];

interface Caso {
  id: string;
  nome: string;
  processo: string | null;
  comarca: string | null;
  uf: string | null;
  created_at: string;
}

const UserDashboard = () => {
  const [activeItem, setActiveItem] = useState('casos');
  const navigate = useNavigate();

  const { data: casos, isLoading } = useQuery<Caso[]>({
    queryKey: ['user-casos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('casos')
        .select('id, nome, processo, comarca, uf, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <PortalLayout
      title={activeItem === 'perfil' ? "Gerenciar Perfil" : "Painel de Controle"}
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
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
              <FolderOpen className="h-6 w-6 text-secondary" /> Casos da Subseção
            </h2>
            <p className="text-muted-foreground font-medium text-sm">
              Visualize e gerencie os processos ativos vinculados à sua subseção.
            </p>
          </div>

          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[200px] bg-muted animate-pulse rounded-lg border border-border/50" />
              ))}
            </div>
          )}

          {!isLoading && casos?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-dashed border-border rounded-xl">
              <div className="p-4 bg-muted/50 rounded-full mb-4">
                <FileText className="w-10 h-10 opacity-20 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary">Nenhum caso encontrado</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                Não existem processos vinculados à sua conta ou subseção no momento.
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
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Processo</p>
                          <p className="font-bold text-foreground truncate">{caso.processo || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-primary/60" />
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Localização</p>
                          <p className="font-bold text-foreground">
                            {caso.comarca || 'N/A'}{caso.uf && ` — ${caso.uf}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary/60" />
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Cadastrado em</p>
                          <p className="font-bold text-foreground">
                            {new Date(caso.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-6 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/20 text-primary font-black text-[10px] tracking-widest uppercase hover:bg-primary hover:text-white transition-all h-10 group/btn shadow-sm"
                      onClick={() => navigate(`/portal/user/casos/${caso.id}`)}
                    >
                      DETALHES DO CASO <ChevronRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
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

export default UserDashboard;
