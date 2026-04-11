import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Users,
  Building2,
  GraduationCap,
  FolderOpen,
  HelpCircle,
  MessageSquare,
  Calendar,
  Newspaper,
  ChevronRight,
  UserCircle,
  Globe
} from 'lucide-react';

const navItems = [
  { id: 'general',    label: 'Configurações Gerais', icon: Settings },
  { id: 'content',    label: 'Quem Somos', icon: Building2 },
  { id: 'team',       label: 'Equipe', icon: Users },
  { id: 'subsections',label: 'Subseções', icon: Globe },
  { id: 'courses',    label: 'Cursos & Eventos', icon: GraduationCap },
  { id: 'cases',      label: 'Acervo de Casos', icon: FolderOpen },
  { id: 'faq',        label: 'Dúvidas Frequentes', icon: HelpCircle },
  { id: 'leads',      label: 'Canais de Contato', icon: MessageSquare },
  { id: 'calendar',   label: 'Agenda de Eventos', icon: Calendar },
  { id: 'articles',   label: 'Notícias & Mídia', icon: Newspaper },
];

interface AdminSidebarProps {
  activeSection?: string;
  onSectionChange?: (id: string) => void;
  logoUrl?: string;
}

const AdminSidebar = ({ activeSection, onSectionChange, logoUrl }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = (id: string) => {
    if (onSectionChange) {
      onSectionChange(id);
    } else {
      navigate('/admin/editor', { state: { section: id } });
    }
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="border-r border-white/10 bg-primary text-white">
      <SidebarHeader className="p-6 border-b border-white/5">
        <div
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <>
              <div className="p-2 bg-secondary rounded-lg shadow-lg group-hover:scale-105 transition-transform">
                <LayoutDashboard className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-sm font-black uppercase tracking-tight text-white">Painel Admin</span>
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-6">
        <SidebarMenu className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={activeSection === item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full group px-4 py-6 rounded-xl transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-colors ${
                    activeSection === item.id ? 'text-secondary-foreground' : 'text-white/40 group-hover:text-white'
                  }`} />
                  <span className="text-[11px] font-black uppercase tracking-widest truncate">{item.label}</span>
                  {activeSection === item.id && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

const AdminLayout = ({ children, activeSection, onSectionChange, logoUrl }: {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (id: string) => void;
  logoUrl?: string;
}) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        <AdminSidebar activeSection={activeSection} onSectionChange={onSectionChange} logoUrl={logoUrl} />
        <SidebarInset className="flex flex-col min-w-0 flex-1 bg-transparent">
          <header className="flex h-20 flex-shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-8 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-primary hover:bg-primary/5 p-2 rounded-lg" />
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Sessão Ativa</span>
                <span className="text-sm font-black text-primary uppercase tracking-tight">
                  Editor do Sistema
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Master Admin</span>
                <span className="text-[9px] font-bold text-muted-foreground">Logado em Produção</span>
              </div>
              <div className="p-2.5 bg-slate-100 rounded-full text-slate-400 border border-slate-200">
                <UserCircle className="w-5 h-5" />
              </div>
            </div>
          </header>
          <main className="flex-1 min-h-0 overflow-y-auto p-8 lg:p-12 scroll-smooth">
            <div className="max-w-[1400px] mx-auto animate-fade-in">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
