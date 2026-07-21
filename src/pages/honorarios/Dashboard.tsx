import { useState } from 'react';
import { useAdvogadoAuth } from '@/contexts/AdvogadoAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Lock, Scale, X, Eye, EyeOff, ShieldCheck, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Dashboard = () => {
  const { advogado, signOut } = useAdvogadoAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Auth Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regNome, setRegNome] = useState('');
  const [regOab, setRegOab] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.warn(err);
    }
    toast.success('Sessão encerrada.');
  };

  // Capture Guard: Intercept all user interactions if they are not logged in
  const handleInteraction = (e: React.MouseEvent) => {
    if (!advogado) {
      e.preventDefault();
      e.stopPropagation();
      setAuthTab('login');
      setIsAuthModalOpen(true);
      toast.error('Acesso restrito. Faça login para interagir com a página.');
    }
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Preencha todos os campos.');
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      // Check if they have a lawyer profile
      const { data: profile, error: profileErr } = await supabase
        .from('advogados')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileErr || !profile) {
        await supabase.auth.signOut();
        throw new Error('Acesso restrito a advogados cadastrados.');
      }

      toast.success(`Acesso autorizado! Bem-vindo, Dr(a). ${profile.nome}.`);
      setIsAuthModalOpen(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNome || !regOab || !regEmail || !regPassword || !regConfirmPassword) {
      toast.error('Preencha todos os campos.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    setLoading(true);

    try {
      // 1. Sign up user
      const { data, error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Falha no cadastro.');

      // 2. Create lawyer profile
      const { error: profileError } = await supabase
        .from('advogados')
        .insert({
          id: data.user.id,
          nome: regNome,
          oab: regOab,
          email: regEmail
        });

      if (profileError) {
        toast.error('Erro ao salvar dados profissionais.');
        return;
      }

      toast.success('Cadastro realizado com sucesso! Faça login.');
      setAuthTab('login');
      // Clear registration states
      setRegNome('');
      setRegOab('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 
        ========================================================================================
        ÁREA PROTEGIDA: CAPTURE GUARD ATIVO
        
        Tudo o que for adicionado dentro desta tag <main> estará 100% protegido contra cliques
        e interações se o usuário estiver deslogado. Clicar em qualquer botão, link, caixa
        de input, ou enviar formulários abrirá o modal de login automaticamente.
        
        O outro desenvolvedor pode customizar, adicionar seu layout, calculadora, chatbot ou
        qualquer design sem se preocupar em programar verificações de segurança para cada botão.
        ========================================================================================
      */}
      <main 
        onClickCapture={handleInteraction}
        className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col relative"
      >
        
        {/* ======================================================================== */}
        {/* ESPAÇO DO DESENVOLVEDOR - INSIRA O DESIGN/ESTÉTICA/CHATBOT AQUI EMBAIXO */}
        {/* ======================================================================== */}
        
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-12 flex flex-col items-center justify-center min-h-[500px]">
          {/* Este bloco é um espaço reservado e pode ser removido/alterado livremente */}
          <div className="max-w-xl text-center space-y-4">
            <Scale className="h-12 w-12 text-[#0C2540] mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-black text-[#0C2540] uppercase tracking-tight">Área de Trabalho Disponível</h2>
            <p className="text-slate-500 text-sm">
              O layout e as funções da página (incluindo calculadoras, chatbots de IA, e consultas de tabelas) serão implementados neste espaço. A segurança de interceptação já está ativa para proteger qualquer componente inserido.
            </p>
          </div>
        </div>
        
        {/* ======================================================================== */}
        {/* ESPAÇO DO DESENVOLVEDOR - FIM DO BLOCO DE DESIGN                         */}
        {/* ======================================================================== */}

      </main>

      {/* 
        ========================================================================================
        MODAL DE AUTENTICAÇÃO (LOGIN / CADASTRO)
        Paleta de cores integrada ao padrão do sistema (Fundo azul marinho bg-[#0C2540] e branco)
        ========================================================================================
      */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm bg-[#0C2540] border-[#0C2540] text-white shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <CardHeader className="space-y-1 text-center pt-8 pb-2">
              <div className="flex justify-center mb-2">
                <div className="bg-white/10 p-3 rounded-full border border-white/10">
                  <Scale className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-lg font-black uppercase tracking-widest text-white">
                {authTab === 'login' ? 'Acesso ao Sistema' : 'Criar Nova Conta'}
              </CardTitle>
              <CardDescription className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                Restrito a Advogados
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-2 mb-6 bg-white/10 p-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`py-2 rounded-lg font-black transition-all ${
                    authTab === 'login' ? 'bg-white text-[#0C2540] shadow' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className={`py-2 rounded-lg font-black transition-all ${
                    authTab === 'register' ? 'bg-white text-[#0C2540] shadow' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Cadastrar
                </button>
              </div>

              {/* Login Form */}
              {authTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-[10px] font-black uppercase tracking-widest text-white/60">E-mail Profissional</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu.nome@oab.org.br"
                        required
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        className="pl-11 h-12 bg-white/10 border-white/10 text-white placeholder:text-white/25 focus:bg-white/15 focus:border-white/30 rounded-xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-password" className="text-[10px] font-black uppercase tracking-widest text-white/60">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        className="pl-11 pr-12 h-12 bg-white/10 border-white/10 text-white placeholder:text-white/25 focus:bg-white/15 focus:border-white/30 rounded-xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-12 bg-white hover:bg-white/90 text-[#0C2540] font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 rounded-xl active:scale-[0.98] transition-all"
                    >
                      {loading ? 'Autenticando...' : 'Acessar Área Restrita'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Register Form */}
              {authTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="reg-nome" className="text-[9px] font-black uppercase tracking-widest text-white/60">Nome Completo</Label>
                    <Input
                      id="reg-nome"
                      type="text"
                      placeholder="Dr(a). Nome Sobrenome"
                      required
                      value={regNome}
                      onChange={e => setRegNome(e.target.value)}
                      className="h-10 bg-white/10 border-white/10 text-white placeholder:text-white/25 focus:bg-white/15 focus:border-white/30 rounded-lg text-xs font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reg-oab" className="text-[9px] font-black uppercase tracking-widest text-white/60">Inscrição OAB</Label>
                    <Input
                      id="reg-oab"
                      type="text"
                      placeholder="MA123456"
                      required
                      value={regOab}
                      onChange={e => setRegOab(e.target.value)}
                      className="h-10 bg-white/10 border-white/10 text-white placeholder:text-white/25 focus:bg-white/15 focus:border-white/30 rounded-lg text-xs font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reg-email" className="text-[9px] font-black uppercase tracking-widest text-white/60">E-mail</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="exemplo@adv.oab.org.br"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="h-10 bg-white/10 border-white/10 text-white placeholder:text-white/25 focus:bg-white/15 focus:border-white/30 rounded-lg text-xs font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reg-password" className="text-[9px] font-black uppercase tracking-widest text-white/60">Senha</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="h-10 bg-white/10 border-white/10 text-white placeholder:text-white/25 focus:bg-white/15 focus:border-white/30 rounded-lg text-xs font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reg-confirm" className="text-[9px] font-black uppercase tracking-widest text-white/60">Confirmar Senha</Label>
                    <Input
                      id="reg-confirm"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      className="h-10 bg-white/10 border-white/10 text-white placeholder:text-white/25 focus:bg-white/15 focus:border-white/30 rounded-lg text-xs font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-10 bg-white hover:bg-white/90 text-[#0C2540] font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 rounded-lg active:scale-[0.98] transition-all"
                    >
                      {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>

            <div className="border-t border-white/5 py-4 px-8 flex items-center justify-center gap-2 bg-[#0a2038]">
              <ShieldCheck className="w-3.5 h-3.5 text-white/25" />
              <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest">
                Acesso Restrito e Criptografado
              </span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
