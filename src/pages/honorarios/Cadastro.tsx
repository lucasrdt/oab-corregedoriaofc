import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserPlus, Loader2 } from 'lucide-react';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [oab, setOab] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !oab || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      toast.error('Senha fraca. Inclua letras maiúsculas, minúsculas, números e caracteres especiais.');
      return;
    }

    setLoading(true);
    try {
      // 1. Sign up user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        toast.error(signUpError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        // 2. Create the lawyer profile in the public.advogados table
        const { error: profileError } = await supabase
          .from('advogados')
          .insert({
            id: data.user.id,
            oab,
            nome,
            email,
          });

        if (profileError) {
          // If inserting profile fails, delete auth user or alert support
          console.error('Error creating profile:', profileError);
          toast.error('Erro ao salvar dados cadastrais: ' + profileError.message);
          setLoading(false);
          return;
        }

        toast.success('Cadastro realizado com sucesso! Faça seu login.');
        navigate('/honorarios/login');
      }
    } catch (err) {
      console.error(err);
      toast.error('Ocorreu um erro no cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <Card className="w-full max-w-md bg-slate-100 border-slate-300 text-slate-900 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-[#0C2540]/5 p-3 rounded-full border border-[#0C2540]/15">
              <UserPlus className="h-6 w-6 text-[#0C2540]" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold uppercase tracking-wider text-[#0C2540]">
            Cadastro de Advogado
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            Crie sua conta para acessar o sistema de honorários
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nome" className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                Nome Completo
              </Label>
              <Input
                id="nome"
                placeholder="Seu Nome Completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#0C2540]/30 focus-visible:border-[#0C2540]"
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="oab" className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                Inscrição OAB
              </Label>
              <Input
                id="oab"
                placeholder="Ex: PR123456"
                value={oab}
                onChange={(e) => setOab(e.target.value)}
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#0C2540]/30 focus-visible:border-[#0C2540]"
                disabled={loading}
              />
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#0C2540]/30 focus-visible:border-[#0C2540]"
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                  Confirmar Senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#0C2540]/30 focus-visible:border-[#0C2540]"
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#0C2540] hover:bg-[#001E5F] text-white font-bold uppercase tracking-wider text-xs h-11 transition-colors"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> : 'Criar Conta'}
            </Button>
            <div className="text-center text-xs text-slate-500">
              Já possui uma conta?{' '}
              <Link to="/honorarios/login" className="text-[#0C2540] hover:underline font-bold">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Cadastro;
