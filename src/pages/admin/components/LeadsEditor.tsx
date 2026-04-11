import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Mail, Phone, Eye, EyeOff, Trash, MessageSquare, Calendar, User } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    read: boolean;
    created_at: string;
}

interface LeadsEditorProps {
    siteId: string | undefined;
}

const LeadsEditor = ({ siteId }: LeadsEditorProps) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    useEffect(() => {
        if (siteId) fetchLeads();
    }, [siteId]);

    const fetchLeads = async () => {
        if (!siteId || siteId === 'CONFIGURE_SITE_ID') {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('site_id', siteId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (error) {
            console.error('Error fetching leads:', error);
            toast.error('Erro ao carregar leads');
        } finally {
            setLoading(false);
        }
    };

    const toggleRead = async (lead: Lead) => {
        try {
            const { error } = await supabase
                .from('leads')
                .update({ read: !lead.read })
                .eq('id', lead.id);

            if (error) throw error;

            setLeads(leads.map(l =>
                l.id === lead.id ? { ...l, read: !l.read } : l
            ));
            toast.success(lead.read ? 'Marcado como não lido' : 'Marcado como lido');
        } catch (error) {
            console.error('Error updating lead:', error);
            toast.error('Erro ao atualizar');
        }
    };

    const deleteLead = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este lead?')) return;

        try {
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setLeads(leads.filter(l => l.id !== id));
            setSelectedLead(null);
            toast.success('Lead excluído');
        } catch (error) {
            console.error('Error deleting lead:', error);
            toast.error('Erro ao excluir');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredLeads = leads.filter(lead => {
        if (filter === 'unread') return !lead.read;
        if (filter === 'read') return lead.read;
        return true;
    });

    const unreadCount = leads.filter(l => !l.read).length;

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Carregando leads...</div>;
    }

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-black text-primary uppercase tracking-tight">Centro de Triagem</h2>
                        {unreadCount > 0 && (
                            <Badge className="bg-red-500 hover:bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full animate-pulse">{unreadCount} Pendentes</Badge>
                        )}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Monitoramento de Contatos e Solicitações</p>
                </div>
                <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner">
                    <Button
                        variant={filter === 'all' ? 'default' : 'ghost'}
                        className={`h-10 px-6 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${filter === 'all' ? 'bg-primary shadow-lg shadow-primary/20' : 'text-primary/40'}`}
                        onClick={() => setFilter('all')}
                    >
                        Todos <span className="ml-2 font-bold opacity-40">({leads.length})</span>
                    </Button>
                    <Button
                        variant={filter === 'unread' ? 'default' : 'ghost'}
                        className={`h-10 px-6 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${filter === 'unread' ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20' : 'text-primary/40'}`}
                        onClick={() => setFilter('unread')}
                    >
                        Não lidos <span className="ml-2 font-bold opacity-40">({unreadCount})</span>
                    </Button>
                    <Button
                        variant={filter === 'read' ? 'default' : 'ghost'}
                        className={`h-10 px-6 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${filter === 'read' ? 'bg-primary shadow-lg shadow-primary/20' : 'text-primary/40'}`}
                        onClick={() => setFilter('read')}
                    >
                        Arquivados <span className="ml-2 font-bold opacity-40">({leads.length - unreadCount})</span>
                    </Button>
                </div>
            </div>

            {filteredLeads.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <p className="font-black text-primary/30 uppercase tracking-[0.3em] text-xs">Caixa de Entrada Vazia</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLeads.map((lead) => (
                        <Card
                            key={lead.id}
                            className={`group relative cursor-pointer transition-all duration-500 hover:shadow-2xl hover:border-primary/10 border-slate-100 rounded-[2.5rem] overflow-hidden bg-white ${!lead.read ? 'ring-1 ring-primary/20 shadow-xl shadow-primary/5' : ''}`}
                            onClick={() => setSelectedLead(lead)}
                        >
                            <CardContent className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 text-primary flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <span className="text-[9px] font-black text-primary/30 uppercase tracking-widest italic">{formatDate(lead.created_at)}</span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-black uppercase tracking-tight text-lg line-clamp-1 ${!lead.read ? 'text-primary' : 'text-primary/60'}`}>
                                            {lead.name}
                                        </h3>
                                        {!lead.read && <div className="w-2 h-2 rounded-full bg-red-500" />}
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest line-clamp-1">{lead.email}</p>
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    <p className="text-xs text-primary/70 line-clamp-2 leading-relaxed min-h-[2.5rem] italic font-medium">
                                        "{lead.message}"
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleRead(lead);
                                            }}
                                        >
                                            {lead.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteLead(lead.id);
                                            }}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 text-[9px] font-black uppercase tracking-widest text-primary/40 hover:text-primary group/more bg-slate-50 border border-slate-100 rounded-full px-4"
                                    >
                                        Ver Tudo <Plus className="ml-1 h-3 w-3 group-hover:rotate-90 transition-transform" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
                <DialogContent className="max-w-2xl bg-white rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-xl font-black text-primary uppercase tracking-tight">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 italic">ID</div>
                                Detalhes do Lead
                            </DialogTitle>
                            <span className="sr-only">Visualize as informações completas do lead abaixo</span>
                        </DialogHeader>
                        <Badge className={`${selectedLead?.read ? 'bg-slate-200 text-slate-600' : 'bg-red-500 text-white animate-pulse'} font-black text-[9px] px-4 py-1.5 rounded-full uppercase tracking-widest`}>
                            {selectedLead?.read ? 'Arquivado' : 'Nova Solicitação'}
                        </Badge>
                    </div>
                    {selectedLead && (
                        <div className="p-10 space-y-10">
                            <div className="grid md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] ml-1">Requerente</label>
                                        <div className="flex items-center gap-3 text-primary">
                                            <User className="h-5 w-5 text-secondary" />
                                            <span className="font-black text-lg uppercase tracking-tight leading-tight">{selectedLead.name}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] ml-1">Correio Eletrônico</label>
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-primary/40" />
                                            <a href={`mailto:${selectedLead.email}`} className="text-sm font-bold text-primary hover:text-secondary-foreground transition-colors underline-offset-4 underline decoration-slate-200">
                                                {selectedLead.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] ml-1">Terminal Telefônico</label>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-primary/40" />
                                            <span className="text-sm font-black text-primary uppercase">
                                                {selectedLead.phone || 'NÃO INFORMADO'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] ml-1">Protocolo em</label>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-primary/40" />
                                            <span className="text-sm font-bold text-primary/60 uppercase italic">{formatDate(selectedLead.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] ml-1">Assunto / Tópico</label>
                                    <p className="font-black text-primary text-xl uppercase tracking-tighter leading-tight bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">{selectedLead.subject || 'SEM ASSUNTO DEFINIDO'}</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] ml-1">Mensagem na Íntegra</label>
                                    <div className="relative group/msg">
                                        <p className="whitespace-pre-wrap bg-white p-8 rounded-[2rem] border border-slate-100 text-sm leading-relaxed text-slate-600 shadow-sm italic font-medium">
                                            "{selectedLead.message}"
                                        </p>
                                        <MessageSquare className="absolute -top-3 -right-3 h-8 w-8 text-primary shadow-2xl bg-white rounded-full p-2 border border-slate-100 group-hover/msg:rotate-12 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                                <Button
                                    variant="ghost"
                                    onClick={() => toggleRead(selectedLead)}
                                    className="h-12 px-8 font-black text-[10px] tracking-widest uppercase text-primary hover:bg-slate-50 rounded-xl transition-all"
                                >
                                    {selectedLead.read ? (
                                        <><EyeOff className="h-4 w-4 mr-2" /> Restaurar Pendência</>
                                    ) : (
                                        <><Eye className="h-4 w-4 mr-2" /> Arquivar Leitura</>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => deleteLead(selectedLead.id)}
                                    className="h-12 px-8 font-black text-[10px] tracking-widest uppercase text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash className="h-4 w-4 mr-2" /> Eliminar Registro
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LeadsEditor;
