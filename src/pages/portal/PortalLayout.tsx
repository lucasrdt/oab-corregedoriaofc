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
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSite } from '@/contexts/SiteContext';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface PortalLayoutProps {
  children: React.ReactNode;
  title: string;
  navItems: NavItem[];
  activeItem?: string;
  onNavClick?: (id: string) => void;
}

interface PortalSidebarProps {
  navItems: NavItem[];
  activeItem?: string;
  onNavClick?: (id: string) => void;
}

const PortalSidebar = ({ navItems, activeItem, onNavClick }: PortalSidebarProps) => {
  const { isMobile, setOpenMobile } = useSidebar();
  const { config } = useSite();
  const logoUrl = config?.content?.logo?.imageUrlWhite || config?.content?.logo?.imageUrl || '';
  const companyName = config?.content?.companyName || 'OAB-MA';

  const handleClick = (id: string) => {
    onNavClick?.(id);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="border-r border-white/10 bg-primary text-white">
      <SidebarHeader className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer group">
          {logoUrl ? (
            <img src={logoUrl} alt={companyName} className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
          ) : (
            <span className="text-sm font-black text-white uppercase tracking-tighter">{companyName}</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-6">
        <SidebarMenu className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon || LayoutDashboard;
            const isActive = activeItem === item.id;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={isActive}
                  onClick={() => handleClick(item.id)}
                  className={`w-full group px-4 py-6 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-colors ${
                    isActive ? 'text-secondary-foreground' : 'text-white/40 group-hover:text-white'
                  }`} />
                  <span className="text-[11px] font-black uppercase tracking-widest truncate">{item.label}</span>
                  {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

const PortalLayout = ({ children, title, navItems, activeItem, onNavClick }: PortalLayoutProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/portal');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc]">
        <PortalSidebar navItems={navItems} activeItem={activeItem} onNavClick={onNavClick} />
        <SidebarInset className="flex flex-col min-w-0 flex-1 bg-transparent">
          <header className="flex h-16 flex-shrink-0 items-center gap-4 border-b border-border/50 bg-white px-6 sticky top-0 z-40">
            <SidebarTrigger className="hover:bg-primary/5 text-primary" />

            <div className="h-4 w-px bg-border/50 mx-2" />

            <div className="flex flex-1 items-center justify-between min-w-0">
              <h2 className="text-xs font-black text-primary uppercase tracking-widest truncate">{title}</h2>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                title="Sair do Sistema"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </header>

          <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 animate-fade-in">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default PortalLayout;
