import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  dev: 'Desenvolvedor',
  presidente: 'Presidente de Subsecao',
  user: 'Usuario',
};

const ProfileSection = () => {
  const { session, role } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-lg font-semibold">Meu Perfil</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informacoes da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="text-muted-foreground text-xs">E-mail</p>
            <p className="font-medium">{session?.user?.email ?? '—'}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground text-xs">Papel</p>
            <p className="font-medium">{role ? (ROLE_LABELS[role] ?? role) : '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Seguranca</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowChangePassword(true)}
          >
            <KeyRound className="w-4 h-4" />
            Trocar Senha
          </Button>
        </CardContent>
      </Card>

      <ChangePasswordModal
        open={showChangePassword}
        onSuccess={() => setShowChangePassword(false)}
        onCancel={() => setShowChangePassword(false)}
      />
    </div>
  );
};

export default ProfileSection;
