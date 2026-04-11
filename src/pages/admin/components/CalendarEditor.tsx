import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, Edit, Calendar as CalendarIcon } from 'lucide-react';
import { TemplateIvaldo } from '@/config/template-ivaldo';
import { format } from 'date-fns';

interface CalendarEditorProps {
    config: TemplateIvaldo;
    updateConfig: (path: string, value: any) => void;
}

const CalendarEditor = ({ config, updateConfig }: CalendarEditorProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);

    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const dateStr = formData.get('date') as string;

        const newEvent = {
            id: editingEvent ? editingEvent.id : Date.now(),
            date: dateStr,
            companyName: formData.get('companyName') as string,
            fullCompanyName: formData.get('fullCompanyName') as string,
            convocation: formData.get('convocation') as string,
            description: formData.get('description') as string,
            meetingLink: formData.get('meetingLink') as string,
            accessTime: formData.get('accessTime') as string,
            status: formData.get('status') as string,
        };

        let newAssemblies = [...(config.content.assemblies || [])];
        if (editingEvent) {
            newAssemblies = newAssemblies.map(e => e.id === editingEvent.id ? (newEvent as any) : e);
        } else {
            newAssemblies.push(newEvent as any);
        }

        // Sort by date
        newAssemblies.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        updateConfig('content.assemblies', newAssemblies);
        setIsDialogOpen(false);
        setEditingEvent(null);
    };

    const handleDeleteEvent = (id: number) => {
        if (confirm('Tem certeza que deseja remover este evento?')) {
            const newAssemblies = (config.content.assemblies || []).filter(e => e.id !== id);
            updateConfig('content.assemblies', newAssemblies);
        }
    };

    const openEditDialog = (event: any) => {
        setEditingEvent(event);
        setIsDialogOpen(true);
    };

    const formatDateForInput = (date: string | Date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
    };

    const displayDate = (date: string | Date) => {
        try {
            return format(new Date(date), 'dd/MM/yyyy HH:mm');
        } catch (e) {
            return String(date);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">Agenda Corporativa</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Controle de Assembleias e Reuniões Institucionais</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            onClick={() => setEditingEvent(null)}
                            className="bg-primary hover:bg-primary/90 h-11 px-8 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Novo Evento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                        <div className="p-8 border-b border-slate-100">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black text-primary uppercase tracking-tighter">
                                    {editingEvent ? 'Ajustar Evento' : 'Agendar Novo Evento'}
                                </DialogTitle>
                                <span className="sr-only">Preencha os detalhes para agendar ou editar um evento na agenda corporativa</span>
                            </DialogHeader>
                        </div>
                        <form onSubmit={handleSaveEvent} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="companyName" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Identificação Curta</Label>
                                    <Input id="companyName" name="companyName" defaultValue={editingEvent?.companyName} required className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="fullCompanyName" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Razão Social Completa</Label>
                                    <Input id="fullCompanyName" name="fullCompanyName" defaultValue={editingEvent?.fullCompanyName} required className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold" />
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Data e Horário</Label>
                                    <Input
                                        id="date"
                                        name="date"
                                        type="datetime-local"
                                        defaultValue={editingEvent ? formatDateForInput(editingEvent.date) : ''}
                                        required
                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl font-black text-center"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Status da Agenda</Label>
                                    <Select name="status" defaultValue={editingEvent?.status || "Agendada"}>
                                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold">
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                                            <SelectItem value="Agendada" className="font-bold py-3 uppercase text-[10px] tracking-widest">Agendada</SelectItem>
                                            <SelectItem value="Realizada" className="font-bold py-3 uppercase text-[10px] tracking-widest">Realizada</SelectItem>
                                            <SelectItem value="Cancelada" className="font-bold py-3 uppercase text-[10px] tracking-widest text-red-500">Cancelada</SelectItem>
                                            <SelectItem value="Suspensa" className="font-bold py-3 uppercase text-[10px] tracking-widest text-amber-600">Suspensa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <div className="grid gap-3">
                                    <Label htmlFor="convocation" className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Tipo de Edital / Convocação</Label>
                                    <Input id="convocation" name="convocation" defaultValue={editingEvent?.convocation} placeholder="Ex: 1ª Convocação Extraordinária" className="h-12 bg-white border-slate-200 rounded-xl font-bold" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Pauta e Observações</Label>
                                    <Input id="description" name="description" defaultValue={editingEvent?.description} className="h-12 bg-white border-slate-200 rounded-xl font-bold" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="meetingLink" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Link de Acesso Digital</Label>
                                    <Input id="meetingLink" name="meetingLink" defaultValue={editingEvent?.meetingLink} placeholder="https://zoom.us/j/..." className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="accessTime" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Início da Liberação</Label>
                                    <Input id="accessTime" name="accessTime" defaultValue={editingEvent?.accessTime} placeholder="Ex: 15 minutos antes" className="h-12 bg-slate-50 border-slate-200 rounded-xl font-black text-center" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setIsDialogOpen(false)}
                                    className="h-12 px-8 font-black text-[10px] tracking-widest uppercase hover:bg-slate-100 rounded-xl"
                                >Descartar</Button>
                                <Button 
                                    type="submit"
                                    className="bg-primary h-12 px-12 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20"
                                >Confirmar Evento</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(config.content.assemblies || []).map((event) => (
                    <Card key={event.id} className="group border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/10 transition-all rounded-3xl overflow-hidden bg-white">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 text-primary flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                    <CalendarIcon className="h-6 w-6" />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => openEditDialog(event)}
                                        className="h-9 w-9 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDeleteEvent(event.id)}
                                        className="h-9 w-9 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] mb-1 italic">Processo Institucional</span>
                                    <h3 className="font-black text-primary text-xl leading-tight uppercase tracking-tighter line-clamp-2">{event.companyName}</h3>
                                </div>
                                
                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                        <span className="text-[11px] font-black text-primary/80 uppercase tracking-widest">{displayDate(event.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-slate-200" />
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic">{event.convocation}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between items-center">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                                    event.status === 'Agendada' ? 'bg-primary/5 border-primary/10 text-primary' : 
                                    event.status === 'Realizada' ? 'bg-green-50 border-green-100 text-green-600' : 
                                    'bg-red-50 border-red-100 text-red-500'
                                }`}>
                                    {event.status}
                                </span>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 text-[9px] font-black uppercase tracking-widest text-primary/40 hover:text-primary group/more"
                                    onClick={() => openEditDialog(event)}
                                >
                                    Detalhes <Plus className="ml-1 h-3 w-3 group-hover:rotate-90 transition-transform" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {(config.content.assemblies || []).length === 0 && (
                <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <CalendarIcon className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <p className="font-black text-primary/30 uppercase tracking-[0.3em] text-xs">Pauta Vazia • Sem Assembleias Agendadas</p>
                </div>
            )}
        </div>
    );
};

export default CalendarEditor;
