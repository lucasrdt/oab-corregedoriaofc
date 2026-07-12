import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Senha deve ter ao menos 8 caracteres')
      .refine((val) => val !== 'Mudar@123', {
        message: 'Escolha uma senha diferente da senha padrão',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  open: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

const ChangePasswordModal = ({
  open,
  onSuccess,
  onCancel,
  title = 'Trocar Senha',
  description,
}: ChangePasswordModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const isMandatory = !onCancel;

  const onSubmit = async (values: ChangePasswordForm) => {
    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
      data: { must_change_password: false },
    });

    if (error) {
      toast.error('Erro ao trocar senha: ' + error.message);
      return;
    }

    toast.success('Senha alterada com sucesso!');
    reset();
    onSuccess();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && onCancel) onCancel();
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        hideCloseButton={isMandatory}
        onInteractOutside={(e) => {
          if (isMandatory) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isMandatory) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {isMandatory && (
            <DialogDescription className="text-amber-600 font-medium">
              Voce deve trocar sua senha antes de continuar.
            </DialogDescription>
          )}
          {!isMandatory && description && (
            <DialogDescription>{description}</DialogDescription>
          )}
          {!isMandatory && !description && (
            <DialogDescription className="sr-only">Altere sua senha de acesso ao portal</DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">Nova senha</Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword')}
              placeholder="Minimo 8 caracteres"
            />
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Repita a nova senha"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar nova senha
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
