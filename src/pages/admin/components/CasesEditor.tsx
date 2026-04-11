import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash, Edit } from 'lucide-react';
import { TemplateIvaldo } from '@/config/template-ivaldo';
import { Switch } from "@/components/ui/switch";
import { useNavigate } from 'react-router-dom';
import { useSubsections } from '@/hooks/useSubsections';

interface CasesEditorProps {
    config: TemplateIvaldo;
    updateConfig: (path: string, value: any) => void;
    siteId?: string;
}

const CasesEditor = ({ config, updateConfig }: CasesEditorProps) => {
    const navigate = useNavigate();
    const [selectedSubsection, setSelectedSubsection] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { data: subsections = [] } = useSubsections();

    const handleDeleteCase = (id: number) => {
        if (confirm('Tem certeza que deseja remover este caso?')) {
            const newCompanies = config.content.companies.filter(c => c.id !== id);
            updateConfig('content.companies', newCompanies);
        }
    };

    const toggleHighlight = (id: number, currentStatus: boolean) => {
        const newCompanies = config.content.companies.map(c =>
            c.id === id ? { ...c, highlighted: !currentStatus } : c
        );
        updateConfig('content.companies', newCompanies);
    };

    const filteredCompanies = config.content.companies.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.processo.includes(searchTerm);
        const matchesSubsection = selectedSubsection
            ? (c as any).subsection_id === selectedSubsection
            : true;
        return matchesSearch && matchesSubsection;
    });

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">Acervo de Casos</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gerenciamento e monitoramento de processos ativos</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Input
                            placeholder="Buscar por nome ou processo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-medium"
                        />
                    </div>
                    <Button
                        onClick={() => navigate('/admin/cases/new')}
                        className="bg-primary hover:bg-primary/90 h-11 px-8 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Novo Caso
                    </Button>
                </div>
            </div>

            {subsections.length > 0 && (
                <div className="flex flex-wrap gap-3 pb-4">
                    <Button
                        variant={selectedSubsection === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSubsection(null)}
                        className={`rounded-full px-6 h-9 font-black text-[10px] uppercase tracking-widest transition-all ${
                            selectedSubsection === null
                                ? 'bg-primary text-secondary shadow-lg shadow-primary/20'
                                : 'border-primary/10 text-primary/60 hover:text-primary hover:border-primary/30'
                        }`}
                    >
                        Todas as Subseções
                    </Button>
                    {subsections.map((sub) => (
                        <Button
                            key={sub.id}
                            variant={selectedSubsection === sub.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedSubsection(sub.id)}
                            className={`rounded-full px-6 h-9 font-black text-[10px] uppercase tracking-widest transition-all ${
                                selectedSubsection === sub.id
                                    ? 'bg-primary text-secondary shadow-lg shadow-primary/20'
                                    : 'border-primary/10 text-primary/60 hover:text-primary hover:border-primary/30'
                            }`}
                        >
                            {sub.city}
                        </Button>
                    ))}
                </div>
            )}

            <div className="grid gap-6">
                {filteredCompanies.map((company) => (
                    <Card key={company.id} className={`group border-border/50 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all rounded-2xl overflow-hidden cursor-default ${company.highlighted ? 'bg-secondary/5 border-secondary/20' : 'bg-card'}`}>
                        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-2xl bg-primary text-secondary flex items-center justify-center font-black text-xl shadow-2xl shadow-primary/10 overflow-hidden relative group-hover:scale-105 transition-transform">
                                    {(company as any).logo ? (
                                        <img src={(company as any).logo} alt={company.name} className="h-full w-full object-cover" />
                                    ) : (
                                        company.initials
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-black text-primary uppercase tracking-tight">{company.name}</h3>
                                        {company.highlighted && (
                                            <span className="bg-secondary text-primary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-secondary/20">
                                                Destaque
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest flex items-center gap-2">
                                        <span className="text-primary/40 font-mono tracking-normal">{company.processo}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                        {company.comarca}/{company.uf}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
                                <div className="hidden lg:flex flex-col items-end px-6 border-r border-slate-100">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Passivo</span>
                                    <span className="text-sm font-black text-primary italic">{company.passivo}</span>
                                </div>

                                <div className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-xl group/switch">
                                    <Label htmlFor={`highlight-${company.id}`} className="text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover/switch:text-primary transition-colors cursor-pointer ml-2">
                                        Favorito
                                    </Label>
                                    <Switch
                                        id={`highlight-${company.id}`}
                                        checked={company.highlighted}
                                        onCheckedChange={() => toggleHighlight(company.id, company.highlighted || false)}
                                        className="data-[state=checked]:bg-secondary"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => navigate(`/admin/cases/${company.id}`)}
                                        className="w-11 h-11 border-primary/10 rounded-xl text-primary/40 hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDeleteCase(company.id)}
                                        className="w-11 h-11 border-red-100 bg-red-50/20 text-red-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl shadow-sm"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filteredCompanies.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Nenhum caso encontrado</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CasesEditor;
