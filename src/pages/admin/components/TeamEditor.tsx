import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash, Edit } from 'lucide-react';
import { TemplateIvaldo } from '@/config/template-ivaldo';
import { ImageUpload } from '@/components/ui/image-upload';

interface TeamEditorProps {
    config: TemplateIvaldo;
    updateConfig: (path: string, value: any) => void;
    siteId?: string;
}

const TeamEditor = ({ config, updateConfig, siteId }: TeamEditorProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [photoUrl, setPhotoUrl] = useState('');

    const handleSaveMember = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const newMember = {
            id: editingMember ? editingMember.id : Date.now(),
            name: formData.get('name') as string,
            role: formData.get('role') as string,
            oab: formData.get('oab') as string,
            email: formData.get('email') as string,
            description: formData.get('description') as string,
            photo: photoUrl,
        };

        let newTeam = [...config.team];
        if (editingMember) {
            newTeam = newTeam.map(m => m.id === editingMember.id ? newMember : m);
        } else {
            newTeam.push(newMember);
        }

        updateConfig('team', newTeam);
        setIsDialogOpen(false);
        setEditingMember(null);
        setPhotoUrl('');
    };

    const handleDeleteMember = (id: number) => {
        if (confirm('Tem certeza que deseja remover este membro?')) {
            const newTeam = config.team.filter(m => m.id !== id);
            updateConfig('team', newTeam);
        }
    };

    const openEditDialog = (member: any) => {
        setEditingMember(member);
        setPhotoUrl(member.photo || '');
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">Corpo Jurídico</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gestão de Especialistas e Representantes Institucionais</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            onClick={() => { setEditingMember(null); setPhotoUrl(''); }}
                            className="bg-primary hover:bg-primary/90 h-11 px-8 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Adicionar Membro
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl bg-white rounded-3xl border-none shadow-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black text-primary uppercase tracking-tight">
                                {editingMember ? 'Atualizar Membro' : 'Novo Integrante'}
                            </DialogTitle>
                            <span className="sr-only">Cadastre ou edite as informações do integrante da equipe jurídica</span>
                        </DialogHeader>
                        <form onSubmit={handleSaveMember} className="space-y-8 pt-6">
                            <div className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Nome Completo <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="name" 
                                        name="name" 
                                        defaultValue={editingMember?.name} 
                                        required 
                                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Cargo / Especialidade <span className="text-red-500">*</span></Label>
                                        <Input 
                                            id="role" 
                                            name="role" 
                                            defaultValue={editingMember?.role} 
                                            required 
                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="oab" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Inscrição OAB</Label>
                                        <Input 
                                            id="oab" 
                                            name="oab" 
                                            defaultValue={editingMember?.oab} 
                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-black text-center"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Endereço de E-mail</Label>
                                    <Input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        defaultValue={editingMember?.email} 
                                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-medium"
                                    />
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <ImageUpload
                                        siteId={siteId}
                                        label="Fotografia Institucional"
                                        value={photoUrl}
                                        onChange={setPhotoUrl}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Biografia Curta</Label>
                                    <Textarea 
                                        id="description" 
                                        name="description" 
                                        defaultValue={editingMember?.description} 
                                        rows={4} 
                                        className="bg-slate-50 border-slate-200 focus:bg-white rounded-2xl p-4 font-medium resize-none shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setIsDialogOpen(false)}
                                    className="h-12 px-6 font-black text-[10px] tracking-widest uppercase hover:bg-slate-50 rounded-xl"
                                >Cancelar</Button>
                                <Button 
                                    type="submit"
                                    className="bg-primary h-12 px-10 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20"
                                >Sincronizar Dados</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {config.team.map((member) => (
                    <Card key={member.id} className="relative group border-border/50 shadow-sm hover:shadow-2xl hover:border-primary/10 transition-all rounded-[2rem] overflow-hidden bg-card cursor-default">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => openEditDialog(member)}
                                className="w-10 h-10 bg-white/90 backdrop-blur rounded-xl border-slate-200 shadow-sm hover:bg-white hover:border-primary transition-all"
                            >
                                <Edit className="h-4 w-4 text-primary" />
                            </Button>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleDeleteMember(member.id)}
                                className="w-10 h-10 bg-white/90 backdrop-blur rounded-xl border-red-100 shadow-sm hover:bg-red-50 hover:border-red-300 transition-all"
                            >
                                <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>

                        <CardHeader className="p-8 pb-4 relative z-0">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-2xl group-hover:scale-110 transition-transform duration-500 bg-slate-100">
                                    {member.photo ? (
                                        <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-300">
                                            <Users className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-primary uppercase tracking-tight leading-tight">{member.name}</h3>
                                    <p className="text-[10px] font-black text-secondary-foreground bg-secondary px-3 py-1 rounded-full uppercase tracking-widest inline-block shadow-sm">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-10 text-center">
                            <p className="text-xs text-muted-foreground font-medium italic leading-relaxed line-clamp-3 mb-6">
                                "{member.description || 'Nenhuma descrição fornecida para este profissional.'}"
                            </p>
                            <div className="flex flex-col items-center gap-2 pt-6 border-t border-slate-50">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Inscrição Institucional</span>
                                <span className="text-xs font-black text-primary italic">{member.oab || 'REGISTRO PENDENTE'}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TeamEditor;
