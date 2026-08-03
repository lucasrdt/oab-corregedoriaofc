import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShieldCheck, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast.error(authError.message);
        setLoading(false);
        return;
      }

      if (user) {
        // Check if lawyer profile exists
        const { data: adv, error: dbError } = await supabase
          .from('advogados')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (dbError) {
          await supabase.auth.signOut();
          toast.error('Erro ao verificar perfil: ' + dbError.message);
          setLoading(false);
          return;
        }

        if (!adv) {
          await supabase.auth.signOut();
          toast.error('Acesso restrito. Este portal é exclusivo para advogados cadastrados.');
          setLoading(false);
          return;
        }

        toast.success('Login efetuado com sucesso!');
        navigate('/honorarios');
      }
    } catch (err) {
      console.error(err);
      toast.error('Ocorreu um erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md bg-slate-100 border-slate-300 text-slate-900 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-[#0C2540]/5 p-3 rounded-full border border-[#0C2540]/15">
              <ShieldCheck className="h-6 w-6 text-[#0C2540]" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold uppercase tracking-wider text-[#0C2540]">
            Assistente de Honorários
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            Acesse para interagir com o assistente inteligente de honorários
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@oab.org.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#0C2540]/30 focus-visible:border-[#0C2540]"
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                  Senha
                </Label>
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) {
                      toast.error('Por favor, informe seu e-mail no campo acima para recuperar a senha.');
                      return;
                    }
                    try {
                      setLoading(true);
                      const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/honorarios/resetar-senha`,
                      });
                      if (error) throw error;
                      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
                    } catch (err: any) {
                      toast.error(err.message || 'Erro ao enviar e-mail de recuperação.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="text-xs text-[#0C2540] hover:underline font-semibold"
                  disabled={loading}
                >
                  Esqueceu sua senha?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#0C2540]/30 focus-visible:border-[#0C2540]"
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#0C2540] hover:bg-[#001E5F] text-white font-bold uppercase tracking-wider text-xs h-11 transition-colors"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> : 'Acessar Assistente'}
            </Button>
            <div className="text-center text-xs text-slate-500">
              Não tem acesso?{' '}
              <Link to="/honorarios/cadastro" className="text-[#0C2540] hover:underline font-bold">
                Cadastre-se aqui
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
