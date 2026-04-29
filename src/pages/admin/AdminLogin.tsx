import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ChevronRight } from 'lucide-react';
import ChangePasswordModal from '@/components/portal/ChangePasswordModal';

const ROLE_DASHBOARDS: Record<string, string> = {
  admin: '/portal/admin',
  dev: '/admin/editor',
  presidente: '/portal/presidente',
  user: '/portal/user',
};

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkExistingSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;
            const { data } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .eq('active', true)
                .maybeSingle();
            const destination = data?.role ? (ROLE_DASHBOARDS[data.role] ?? '/admin/editor') : '/admin/editor';
            navigate(destination, { replace: true });
        };
        checkExistingSession();
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) throw new Error('Erro ao obter sessão.');

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .eq('active', true)
                .maybeSingle();

            const destination = roleData?.role ? (ROLE_DASHBOARDS[roleData.role] ?? '/admin/editor') : '/admin/editor';
            const mustChange = session.user.user_metadata?.must_change_password === true;

            if (mustChange) {
                setPendingRedirect(destination);
                setShowChangePassword(true);
                return;
            }

            toast.success('Acesso autorizado!');
            navigate(destination);
        } catch (error: any) {
            toast.error(error.message || 'Credenciais inválidas ou sem permissão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8 animate-fade-in">

                {/* Logo */}
                <div className="flex justify-center">
                    <img
                        src="https://kzlcwiwwmqtwkwwxustl.supabase.co/storage/v1/object/public/site-assets/870aef8b-6f85-4b59-8729-56dfaf35b6fa/mg7v5ppxop.png"
                        alt="Corregedoria Geral da OAB-MA"
                        className="h-9 md:h-12 object-contain"
                    />
                </div>

                {/* Card */}
                <div className="bg-primary rounded-2xl shadow-2xl shadow-primary/30 overflow-hidden">
                    <div className="px-8 pt-8 pb-2">
                        <h1 className="text-white font-black text-lg uppercase tracking-widest text-center">
                            Acesso ao Sistema
                        </h1>
                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest text-center mt-1">
                            Área restrita
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                                E-mail
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                                <Input
                                    type="email"
                                    placeholder="admin@oabma.org.br"
                                    className="pl-11 h-12 bg-white/10 border-white/10 text-white placeholder:text-white/25 focus:bg-white/15 focus:border-white/30 rounded-xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Senha */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="pl-11 pr-12 h-12 bg-white/10 border-white/10 text-white placeholder:text-white/25 focus:bg-white/15 focus:border-white/30 rounded-xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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

                        {/* Botão */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-white hover:bg-white/90 text-primary font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 rounded-xl active:scale-[0.98] transition-all group"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                        AUTENTICANDO...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        ENTRAR
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Rodapé do card */}
                    <div className="border-t border-white/5 py-4 px-8 flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-white/25" />
                        <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest">
                            Acesso Restrito e Criptografado
                        </span>
                    </div>
                </div>

                {/* Rodapé da página */}
                <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Desenvolvido para OAB-MA • 2024–2026
                </p>
            </div>

            {showChangePassword && pendingRedirect && (
                <ChangePasswordModal
                    open={showChangePassword}
                    title="Troca de Senha Obrigatória"
                    onSuccess={() => {
                        setShowChangePassword(false);
                        navigate(pendingRedirect, { replace: true });
                    }}
                />
            )}
        </div>
    );
};

export default AdminLogin;
