import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";

import Index from "./pages/Index";
import Equipe from "./pages/Equipe";
import NaMidia from "./pages/NaMidia";
import Duvidas from "./pages/Duvidas";
import Contato from "./pages/Contato";
import Artigo from "./pages/Artigo";
import CategoryPage from "./pages/CategoryPage";
import DetalheCaso from "./pages/DetalheCaso";
import Subsecoes from "./pages/Subsecoes";
import Cursos from "./pages/Cursos";
import Cursor from "./pages/Cursor";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import SiteEditor from "./pages/admin/SiteEditor";
import CaseDetailsEditor from "./pages/admin/CaseDetailsEditor";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./contexts/AuthContext";
import { PortalRoute } from "./components/PortalRoute";
import AdminDashboard from "./pages/portal/AdminDashboard";
import DevDashboard from "./pages/portal/DevDashboard";
import PresidenteDashboard from "./pages/portal/PresidenteDashboard";
import UserDashboard from "./pages/portal/UserDashboard";
import CasoEditor from "./pages/portal/CasoEditor";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Admin Routes — layout próprio (AdminLayout) */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/editor" element={<SiteEditor />} />
              <Route path="/admin/cases/:caseId" element={<CaseDetailsEditor />} />
            </Route>

            {/* Portal Routes — sem MainLayout */}
            <Route path="/portal" element={<Navigate to="/admin" replace />} />
            <Route element={<AuthProvider><Outlet /></AuthProvider>}>
              <Route element={<PortalRoute allowedRoles={['admin']} />}>
                <Route path="/portal/admin" element={<AdminDashboard />} />
                <Route path="/portal/admin/casos/:casoId" element={<CasoEditor />} />
              </Route>
              <Route element={<PortalRoute allowedRoles={['dev']} />}>
                <Route path="/portal/dev" element={<DevDashboard />} />
              </Route>
              <Route element={<PortalRoute allowedRoles={['presidente', 'admin']} />}>
                <Route path="/portal/presidente" element={<PresidenteDashboard />} />
                <Route path="/portal/presidente/casos/:casoId" element={<CasoEditor />} />
              </Route>
              <Route element={<PortalRoute allowedRoles={['user']} />}>
                <Route path="/portal/user" element={<UserDashboard />} />
                <Route path="/portal/user/casos/:casoId" element={<CasoEditor />} />
              </Route>
            </Route>

            {/* Public Routes — com MainLayout (Header + Footer) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/equipe" element={<Equipe />} />
              <Route path="/na-midia" element={<NaMidia />} />
              <Route path="/artigo/:id" element={<Artigo />} />
              <Route path="/recuperacao-judicial" element={<CategoryPage />} />
              <Route path="/falencia" element={<CategoryPage />} />
              <Route path="/administracao-judicial" element={<CategoryPage />} />
              <Route path="/litisconsorcio" element={<CategoryPage />} />
              <Route path="/duvidas" element={<Duvidas />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/subsecoes" element={<Subsecoes />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/cursor" element={<Cursor />} />
              <Route path="/:slug" element={<DetalheCaso />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
