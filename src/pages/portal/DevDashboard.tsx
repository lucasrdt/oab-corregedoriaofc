import React, { useState } from 'react';
import PortalLayout from './PortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Info, UserCircle, Globe, LayoutTemplate, Terminal, ChevronRight, Code } from 'lucide-react';
import ProfileSection from '@/components/portal/ProfileSection';

const navItems = [
  { id: 'site', label: 'Infraestrutura do Site', icon: Globe },
  { id: 'conteudo', label: 'Arquitetura de Conteúdo', icon: LayoutTemplate },
  { id: 'perfil', label: 'Meu Perfil Dev', icon: UserCircle },
];

const DevDashboard = () => {
  const [activeItem, setActiveItem] = useState('site');
  const navigate = useNavigate();

  return (
    <PortalLayout
      title={activeItem === 'perfil' ? "Acesso à Conta" : "Console de Desenvolvimento"}
      navItems={navItems}
      activeItem={activeItem}
      onNavClick={setActiveItem}
    >
      {activeItem === 'perfil' && (
        <div className="max-w-4xl mx-auto animate-fade-in">
          <ProfileSection />
        </div>
      )}
      
      {activeItem !== 'perfil' && (
        <div className="max-w-3xl space-y-8 animate-fade-in">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
              <Terminal className="h-6 w-6 text-secondary" /> Developer Console
            </h2>
            <p className="text-muted-foreground font-medium text-sm">Controle as variáveis globais e a estrutura técnica da plataforma.</p>
          </div>

          <Card className="border-border/50 shadow-xl overflow-hidden bg-card">
            <CardHeader className="bg-primary/5 border-b border-primary/5 py-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary text-secondary rounded-xl shadow-lg">
                  <Code className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-primary font-black uppercase tracking-tight">Núcleo do Sistema</CardTitle>
                  <CardDescription className="font-medium">
                    Acesso root às configurações de infraestrutura e templates.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-start gap-4 rounded-xl bg-secondary/10 p-6 border border-secondary/20">
                <div className="p-2 bg-secondary text-secondary-foreground rounded-lg">
                  <Info className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-primary uppercase tracking-widest">Informação Técnica</p>
                  <p className="text-sm text-primary/70 font-medium leading-relaxed">
                    Este papel tem permissão para editar a estrutura global do site e gerenciar subseções.
                    Dados sensíveis de casos individuais são restritos aos seus respectivos gestores.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => navigate('/admin/editor')}
                  className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] tracking-widest uppercase px-8 h-12 shadow-lg group transition-all"
                >
                  ACESSAR EDITOR ESTRUTURAL <ExternalLink className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                </Button>
              </div>
            </CardContent>
            <div className="px-8 py-4 bg-muted/30 border-t border-border/50">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Ambiente de Produção • Versão OAB Premium 2026.04
              </p>
            </div>
          </Card>
        </div>
      )}
    </PortalLayout>
  );
};

export default DevDashboard;
