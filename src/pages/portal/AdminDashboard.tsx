import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PortalLayout from './PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, UserX, ExternalLink, FileText, RotateCcw, UserCircle, Users, Building2, FolderOpen, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import ProfileSection from '@/components/portal/ProfileSection';
import { ImageUpload } from '@/components/ui/image-upload';

const SITE_ID = import.meta.env.VITE_SITE_ID || '';

const navItems = [
  { id: 'usuarios', label: 'GestÃ£o de UsuÃ¡rios', icon: Users },
  { id: 'subsecoes', label: 'SubseÃ§Ãµes OAB', icon: Building2 },
  { id: 'casos', label: 'Acervo de Casos', icon: FolderOpen },
  { id: 'site', label: 'Editor do Site', icon: Globe },
  { id: 'perfil', label: 'ConfiguraÃ§Ãµes', icon: UserCircle },
];

// --- Types ---

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  subsection_id: string | null;
  active: boolean;
  created_at: string;
}

interface Caso {
  id: string;
  nome: string;
  processo: string | null;
  comarca: string | null;
  subsection_id: string | null;
  created_at: string;
}

interface Subsection {
  id: string;
  city: string;
  corregedor: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  cover_image_url?: string | null;
}

// --- Form schema ---

const createUserSchema = z.object({
  email: z.string().email('E-mail invÃ¡lido'),
  role: z.enum(['admin', 'dev', 'presidente', 'user'], {
    required_error: 'Selecione um papel',
  }),
  subsection_id: z.string().optional(),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

// --- Sub-components ---

const truncate = (str: string | null, len = 8) =>
  str ? str.substring(0, len) + '...' : 'â€”';

const UsuariosSection = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: users, isLoading } = useQuery<UserRole[]>({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, user_id, role, subsection_id, active, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: subsections } = useQuery<Subsection[]>({
    queryKey: ['admin-subsections-for-form'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subsections')
        .select('id, city, corregedor')
        .order('city', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
  });

  const selectedRole = watch('role');
  const needsSubsection = selectedRole === 'presidente' || selectedRole === 'user';

  const handleResetPassword = async (userId: string) => {
    const { data, error } = await supabase.functions.invoke('admin-reset-password', {
      body: { user_id: userId },
    });

    if (error || data?.error) {
      toast.error('Erro ao resetar senha: ' + (data?.error ?? error?.message ?? 'Erro desconhecido'));
      return;
    }

    toast.success('Senha resetada para Mudar@123. O usuario devera trocar no proximo login.');
  };

  const onSubmit = async (values: CreateUserForm) => {
    const { data, error } = await supabase.functions.invoke('admin-create-user', {
      body: {
        email: values.email,
        role: values.role,
        subsection_id: needsSubsection ? (values.subsection_id || null) : null,
      },
    });

    if (error || data?.error) {
      const msg = data?.error ?? error?.message ?? 'Erro desconhecido';
      toast.error('Erro ao criar usuÃ¡rio: ' + msg);
      return;
    }

    toast.success('UsuÃ¡rio criado com sucesso!');
    setDialogOpen(false);
    reset();
    queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
  };

  const handleDeactivate = async (roleId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .update({ active: false })
      .eq('id', roleId);

    if (error) {
      toast.error('Erro ao desativar usuÃ¡rio: ' + error.message);
      return;
    }

    toast.success('UsuÃ¡rio desativado.');
    queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-secondary" /> GestÃ£o de Acessos
          </h2>
          <p className="text-muted-foreground font-medium text-sm">Controle as permissÃµes e nÃ­veis de acesso dos colaboradores.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] tracking-widest uppercase px-6 h-11 shadow-lg shadow-primary/10">
              <Plus className="w-4 h-4 mr-2" />
              CADASTRAR USUÃRIO
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md border-none shadow-2xl overflow-hidden p-0">
            <DialogHeader className="bg-primary p-6 text-white border-b border-primary/10">
              <DialogTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Plus className="h-4 w-4 text-secondary" /> Novo Colaborador
              </DialogTitle>
              <span className="sr-only">Preencha o formulÃ¡rio para cadastrar um novo usuÃ¡rio no sistema</span>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...register('email')} placeholder="usuario@exemplo.com" />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <p className="text-xs text-muted-foreground">
                A senha padrao <span className="font-mono font-medium">Mudar@123</span> sera definida automaticamente. O usuario devera troca-la no primeiro login.
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="role">Papel</Label>
                <Select onValueChange={(val) => setValue('role', val as CreateUserForm['role'])}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione um papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="dev">Dev</SelectItem>
                    <SelectItem value="presidente">Presidente</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
              </div>

              {needsSubsection && (
                <div className="space-y-1.5">
                  <Label htmlFor="subsection_id">SubseÃ§Ã£o</Label>
                  <Select onValueChange={(val) => setValue('subsection_id', val)}>
                    <SelectTrigger id="subsection_id">
                      <SelectValue placeholder="Selecione uma subseÃ§Ã£o" />
                    </SelectTrigger>
                    <SelectContent>
                      {subsections && subsections.length > 0 ? (
                        subsections.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.city}{sub.corregedor ? ` â€” ${sub.corregedor}` : ''}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="_none" disabled>
                          Nenhuma subseÃ§Ã£o cadastrada
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); reset(); }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Criar UsuÃ¡rio
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-primary font-black text-[10px] uppercase tracking-widest py-5 pl-6">ID do UsuÃ¡rio</TableHead>
                <TableHead className="text-primary font-black text-[10px] uppercase tracking-widest py-5">NÃ­vel de Acesso</TableHead>
                <TableHead className="text-primary font-black text-[10px] uppercase tracking-widest py-5">SubseÃ§Ã£o Original</TableHead>
                <TableHead className="text-primary font-black text-[10px] uppercase tracking-widest py-5">Status</TableHead>
                <TableHead className="w-[110px] py-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                // ... same mapping logic but with premium styling ...
                users.map((u) => (
                  <TableRow key={u.id} className="hover:bg-muted/30 transition-colors border-border/30">
                    <TableCell className="font-mono text-[10px] font-bold text-muted-foreground pl-6">{truncate(u.user_id, 8)}</TableCell>
                    <TableCell>
                      <Badge className={`${u.role === 'admin' ? 'bg-red-500/10 text-red-600 border-red-500/20' : u.role === 'dev' ? 'bg-secondary/10 text-secondary-foreground border-secondary/20' : 'bg-primary/10 text-primary border-primary/20'} text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border`}>
                        {u.role}
                      </Badge>
                    </TableCell>
                     <TableCell className="text-xs font-medium">
                       {u.subsection_id
                         ? (subsections?.find(s => s.id === u.subsection_id)?.city ?? truncate(u.subsection_id))
                         : '—'}
                     </TableCell>
                    <TableCell>
                      <Badge className={`${u.active ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-muted text-muted-foreground border-border'} text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border`}>
                        {u.active ? 'ATIVO' : 'INATIVO'}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      {u.active && (
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                            onClick={() => handleResetPassword(u.user_id)}
                            title="Resetar senha para Mudar@123"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDeactivate(u.id)}
                            title="Desativar usuÃ¡rio"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center opacity-30">
                      <Users className="h-10 w-10 mb-2" />
                      <p className="text-xs font-black uppercase tracking-widest">Nenhum registro encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

const CasosSection = () => {
  const navigate = useNavigate();

  const { data: casos, isLoading } = useQuery<Caso[]>({
    queryKey: ['admin-casos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('casos')
        .select('id, nome, processo, comarca, subsection_id, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Todos os Casos</h2>
      {casos && casos.length > 0 ? (
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-primary font-black text-[10px] uppercase tracking-widest py-5 pl-6">Nome do Caso</TableHead>
                <TableHead className="text-primary font-black text-[10px] uppercase tracking-widest py-5">NÂ° Processo</TableHead>
                <TableHead className="text-primary font-black text-[10px] uppercase tracking-widest py-5">Comarca</TableHead>
                <TableHead className="text-primary font-black text-[10px] uppercase tracking-widest py-5">SubseÃ§Ã£o</TableHead>
                <TableHead className="text-primary font-black text-[10px] uppercase tracking-widest py-5">Cadastro</TableHead>
                <TableHead className="w-[120px] py-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {casos.map((caso) => (
                <TableRow key={caso.id} className="hover:bg-muted/30 transition-colors border-border/30">
                  <TableCell className="font-bold text-sm text-primary pl-6">{caso.nome}</TableCell>
                  <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">{caso.processo ?? 'â€”'}</TableCell>
                  <TableCell className="text-xs font-medium">{caso.comarca ?? 'â€”'}</TableCell>
                  <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">{truncate(caso.subsection_id)}</TableCell>
                  <TableCell className="text-xs font-medium">
                    {new Date(caso.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="pr-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary hover:text-white h-8"
                      onClick={() => navigate(`/portal/admin/casos/${caso.id}`)}
                    >
                      EDITAR <ExternalLink className="w-3 h-3 ml-1.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <FileText className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm">Nenhum caso encontrado</p>
        </div>
      )}
    </div>
  );
};

const SubsecoesSection = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedSubsection, setSelectedSubsection] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');

  const { data: subsections, isLoading: loadingSubsections } = useQuery<Subsection[]>({
    queryKey: ['admin-subsections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subsections')
        .select('id, city, corregedor, address, phone, email, cover_image_url')
        .order('city', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: casos, isLoading: loadingCasos } = useQuery<Caso[]>({
    queryKey: ['admin-casos-subsecao', selectedSubsection],
    enabled: !!selectedSubsection,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('casos')
        .select('id, nome, processo, comarca, subsection_id, created_at')
        .eq('subsection_id', selectedSubsection!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const createSubsection = useMutation({
    mutationFn: async (formData: Omit<Subsection, 'id'>) => {
      const { error } = await supabase.from('subsections').insert([formData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subsections'] });
      queryClient.invalidateQueries({ queryKey: ['subsections'] });
      toast.success('SubseÃ§Ã£o criada com sucesso.');
      setDialogOpen(false);
      setCoverImageUrl('');
    },
    onError: () => toast.error('Erro ao criar subseÃ§Ã£o. Tente novamente.'),
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    createSubsection.mutate({
      city: fd.get('city') as string,
      corregedor: fd.get('corregedor') as string,
      address: (fd.get('address') as string) || null,
      phone: (fd.get('phone') as string) || null,
      email: (fd.get('email') as string) || null,
      cover_image_url: coverImageUrl || null,
    });
  };

  if (loadingSubsections) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-secondary" /> SubseÃ§Ãµes OAB
          </h2>
          <p className="text-muted-foreground font-medium text-sm">Gerencie as subseÃ§Ãµes e filtre casos por unidade.</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setCoverImageUrl(''); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] tracking-widest uppercase px-6 h-11 shadow-lg shadow-primary/10">
              <Plus className="w-4 h-4 mr-2" />
              NOVA SUBSEÃ‡ÃƒO
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg border-none shadow-2xl overflow-hidden p-0">
            <DialogHeader className="bg-primary p-6 text-white border-b border-primary/10">
              <DialogTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Plus className="h-4 w-4 text-secondary" /> Nova SubseÃ§Ã£o
              </DialogTitle>
              <span className="sr-only">Preencha os dados da nova subseÃ§Ã£o regional</span>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Imagem de Capa</Label>
                <ImageUpload
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                  label=""
                  bucket="site-assets"
                  siteId={SITE_ID}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="new-city">MunicÃ­pio *</Label>
                  <Input id="new-city" name="city" required placeholder="Ex: Imperatriz" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-corregedor">Corregedor(a) *</Label>
                  <Input id="new-corregedor" name="corregedor" required placeholder="Nome completo" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-address">EndereÃ§o</Label>
                <Input id="new-address" name="address" placeholder="Rua, NÃºmero, Bairro, CEP" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="new-phone">Telefone</Label>
                  <Input id="new-phone" name="phone" placeholder="(00) 0000-0000" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-email">E-mail</Label>
                  <Input id="new-email" name="email" type="email" placeholder="subsecao@oab.org.br" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); setCoverImageUrl(''); }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createSubsection.isPending}>
                  {createSubsection.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Criar SubseÃ§Ã£o
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subsection cards */}
      {subsections && subsections.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subsections.map((sub) => (
            <Card
              key={sub.id}
              className={`cursor-pointer transition-all border-2 overflow-hidden ${
                selectedSubsection === sub.id
                  ? 'border-primary shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedSubsection(selectedSubsection === sub.id ? null : sub.id)}
            >
              {sub.cover_image_url ? (
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={sub.cover_image_url}
                    alt={`Capa ${sub.city}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                </div>
              ) : (
                <div className={`h-1 transition-colors ${selectedSubsection === sub.id ? 'bg-primary' : 'bg-primary/10'}`} />
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{sub.city}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                {sub.corregedor && (
                  <p><span className="font-medium text-foreground">Corregedor:</span> {sub.corregedor}</p>
                )}
                {selectedSubsection === sub.id && (
                  <p className="text-primary font-medium mt-1">Selecionada</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
          <Building2 className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm">Nenhuma subseÃ§Ã£o cadastrada ainda.</p>
          <p className="text-xs mt-1">Clique em "Nova SubseÃ§Ã£o" para comeÃ§ar.</p>
        </div>
      )}

      {/* Cases for selected subsection */}
      {selectedSubsection && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Casos da subseÃ§Ã£o: <span className="text-foreground font-semibold">
                {subsections?.find(s => s.id === selectedSubsection)?.city}
              </span>
            </h3>
            <Button
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate(`/portal/admin/casos/new?subsection_id=${selectedSubsection}`)}
            >
              <FileText className="w-4 h-4" />
              Novo Caso
            </Button>
          </div>

          {loadingCasos ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : casos && casos.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Processo</TableHead>
                    <TableHead>Comarca</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[100px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {casos.map((caso) => (
                    <TableRow key={caso.id}>
                      <TableCell className="font-medium text-sm">{caso.nome}</TableCell>
                      <TableCell className="text-xs">{caso.processo ?? 'â€”'}</TableCell>
                      <TableCell className="text-xs">{caso.comarca ?? 'â€”'}</TableCell>
                      <TableCell className="text-xs">
                        {new Date(caso.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => { e.stopPropagation(); navigate(`/portal/admin/casos/${caso.id}`); }}
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          Ver/Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground border-2 border-dashed rounded-md">
              <FileText className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">Nenhum caso nesta subseÃ§Ã£o ainda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ConfigSection = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Gerenciamento do Site</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Painel de ConteÃºdo</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/admin/editor')} className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Abrir Editor do Site
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Main component ---

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('usuarios');

  return (
    <PortalLayout
      title={activeItem.toUpperCase()}
      navItems={navItems}
      activeItem={activeItem}
      onNavClick={setActiveItem}
    >
      <div className="max-w-[1400px] mx-auto">
        {activeItem === 'usuarios' && <UsuariosSection />}
        {activeItem === 'subsecoes' && <SubsecoesSection />}
        {activeItem === 'casos' && <CasosSection />}
        {activeItem === 'site' && <ConfigSection />}
        {activeItem === 'perfil' && <ProfileSection />}
      </div>
    </PortalLayout>
  );
};

export default AdminDashboard;
