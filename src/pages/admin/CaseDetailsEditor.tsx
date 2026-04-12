import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Save, Trash, FileText, Building2, Scale, FolderOpen, ShieldCheck, Calendar, MapPin, User, DollarSign, ExternalLink } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import DocumentUploadEditor from './components/DocumentUploadEditor';
import { toast } from 'sonner';
import { TemplateIvaldo, templateIvaldo, fullIvaldoTemplate } from '@/config/template-ivaldo';
import AdminLayout from './AdminLayout';
import { useSubsections } from '@/hooks/useSubsections';

const OAB_MA_SITE_ID = import.meta.env.VITE_SITE_ID || '870aef8b-6f85-4b59-8729-56dfaf35b6fa';
const IS_SITE_CONFIGURED = !!OAB_MA_SITE_ID && OAB_MA_SITE_ID !== 'CONFIGURE_SITE_ID';

const CaseDetailsEditor = () => {
    const { caseId } = useParams();
    const navigate = useNavigate();
    const [config, setConfig] = useState<TemplateIvaldo | null>(null);
    const [caseData, setCaseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { data: subsections = [] } = useSubsections();

    useEffect(() => {
        fetchSite();
    }, []);

    useEffect(() => {
        if (config && caseId) {
            initializeCaseData();
        }
    }, [config, caseId]);

    const fetchSite = async () => {
        if (!IS_SITE_CONFIGURED) {
            setLoading(false);
            toast.error('Site ID n├úo configurado. Verifique o arquivo .env');
            navigate('/admin/dashboard');
            return;
        }
        try {
            const { data, error } = await supabase
                .from('sites')
                .select('*')
                .eq('id', OAB_MA_SITE_ID)
                .single();

            if (error) throw error;

            let mergedConfig = data.config || templateIvaldo;
            if (!mergedConfig.content) mergedConfig.content = {};
            if (!mergedConfig.content.companies) mergedConfig.content.companies = [];
            if (!mergedConfig.content.caseTypes || mergedConfig.content.caseTypes.length === 0) {
                mergedConfig.content.caseTypes = fullIvaldoTemplate.content.caseTypes;
            }

            setConfig(mergedConfig);
        } catch (error) {
            console.error('Error fetching site:', error);
            toast.error('Erro ao carregar dados do site');
            navigate('/admin/dashboard');
        }
    };

    const initializeCaseData = () => {
        if (!config) return;

        if (caseId === 'new') {
            setCaseData({
                id: Date.now(),
                name: '',
                initials: '',
                logo: '',
                highlighted: false,
                subsection_id: '',
                comarca: '',
                uf: '',
                processo: '',
                passivo: '',
                credores: 0,
                linkHabilitacoes: '',
                especialistaResponsavel: '',
                ajuizamento: '',
                deferimento: '',
                vara: '',
                documentos: {
                    demandasTed: [],
                    ouvidoria: [],
                    prerrogativas: [],
                    fiscalizacao: [],
                    esa: [],
                    comissoes: [],
                    financeiro: [],
                    customCategories: []
                }
            });
        } else {
            const foundCase = (config.content.companies || []).find((c: any) => c.id.toString() === caseId);
            if (foundCase) {
                setCaseData(JSON.parse(JSON.stringify(foundCase)));
            } else {
                toast.error("Caso n├úo encontrado");
                navigate('/admin/editor');
            }
        }
        setLoading(false);
    };

    const handleSave = async (e?: any) => {
        if (e) e.preventDefault();
        if (!config || !caseData) return;

        if (!IS_SITE_CONFIGURED) {
            toast.error("Site ID n├úo configurado. N├úo ├® poss├¡vel salvar.");
            return;
        }

        if (!caseData.name || !caseData.processo) {
            toast.error("Preencha os campos obrigat├│rios (Nome e Processo)");
            return;
        }

        setSaving(true);

        try {
            let newCompanies = [...(config.content.companies || [])];

            if (caseId === 'new') {
                newCompanies.push(caseData);
            } else {
                newCompanies = newCompanies.map((c: any) =>
                    c.id.toString() === caseId ? caseData : c
                );
            }

            const newConfig = {
                ...config,
                content: {
                    ...config.content,
                    companies: newCompanies
                }
            };

            const { error } = await supabase
                .from('sites')
                .update({ config: newConfig })
                .eq('id', OAB_MA_SITE_ID);

            if (error) throw error;

            setConfig(newConfig);
            toast.success("Caso salvo com sucesso!");
            navigate('/admin/editor');

        } catch (error) {
            console.error('Error saving case:', error);
            toast.error('Erro ao salvar caso');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!config) return;

        if (confirm('Tem certeza que deseja remover este caso permanentemente?')) {
            setSaving(true);
            try {
                const newCompanies = (config.content.companies || []).filter((c: any) => c.id.toString() !== caseId);

                const newConfig = {
                    ...config,
                    content: {
                        ...config.content,
                        companies: newCompanies
                    }
                };

                const { error } = await supabase
                    .from('sites')
                    .update({ config: newConfig })
                    .eq('id', OAB_MA_SITE_ID);

                if (error) throw error;

                toast.success("Caso removido.");
                navigate('/admin/editor');
            } catch (error) {
                console.error('Error deleting case:', error);
                toast.error('Erro ao excluir caso');
            } finally {
                setSaving(false);
            }
        }
    };

    const updateField = (field: string, value: any) => {
        setCaseData((prev: any) => ({ ...prev, [field]: value }));
    };

    const updateDocuments = (category: string, docs: any[]) => {
        setCaseData((prev: any) => ({
            ...prev,
            documentos: {
                ...prev.documentos,
                [category]: docs
            }
        }));
    };

    // Count total documents
    const getTotalDocs = () => {
        if (!caseData?.documentos) return 0;
        const d = caseData.documentos;
        let total = 0;
        Object.keys(d).forEach(key => {
            if (key !== 'customCategories' && Array.isArray(d[key])) {
                total += d[key].length;
            }
        });
        return total;
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    if (!caseData) return null;

    return (
        <AdminLayout activeSection="cases" onSectionChange={() => navigate('/admin/editor')}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-fade-in">
                <div className="space-y-1">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate('/admin/editor')}
                        className="p-0 hover:bg-transparent text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mb-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Voltar para listagem</span>
                    </Button>
                    <h1 className="text-3xl font-black text-primary uppercase tracking-tight flex items-center gap-3">
                        <Scale className="h-8 w-8 text-secondary" /> 
                        {caseId === 'new' ? 'Abertura de Novo Caso' : 'Gest├úo de Processo'}
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm">
                        Processo: <span className="text-primary font-bold italic">{caseData.processo || 'N├âO DEFINIDO'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {caseId !== 'new' && (
                        <Button 
                            variant="outline"
                            onClick={handleDelete} 
                            disabled={saving}
                            className="border-red-200 text-red-600 hover:bg-red-50 font-black text-[10px] tracking-widest uppercase px-6 h-12 rounded-xl transition-all"
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            EXCLUIR
                        </Button>
                    )}
                    <Button 
                        onClick={() => handleSave()} 
                        disabled={saving}
                        className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] tracking-widest uppercase px-8 h-12 shadow-xl shadow-primary/20 transition-all active:scale-95 group"
                    >
                        <Save className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                        {saving ? 'SINCRONIZANDO...' : 'SALVAR ALTERA├ç├òES'}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8">
                    {/* Card 1: Informa├º├Áes da Empresa */}
                    <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-secondary" /> Dados Institucionais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Raz├úo Social / Nome Fantasia <span className="text-red-500">*</span></Label>
                                        <Input
                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                            value={caseData.name}
                                            onChange={e => updateField('name', e.target.value)}
                                            placeholder="Ex: Empresa ABC Ltda"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Sigla (ID Visual) <span className="text-red-500">*</span></Label>
                                            <Input
                                                className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-black text-center text-primary uppercase"
                                                value={caseData.initials}
                                                onChange={e => updateField('initials', e.target.value.toUpperCase())}
                                                required
                                                maxLength={2}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Subse├º├úo</Label>
                                            <Select
                                                value={caseData.subsection_id || ''}
                                                onValueChange={val => updateField('subsection_id', val)}
                                            >
                                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold">
                                                    <SelectValue placeholder="Selecione a subse├º├úo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subsections.map((sub) => (
                                                        <SelectItem key={sub.id} value={sub.id} className="text-xs font-bold uppercase">{sub.city}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <ImageUpload
                                        siteId={OAB_MA_SITE_ID}
                                        label="Branding do Caso (Logo)"
                                        value={caseData.logo || ''}
                                        onChange={url => updateField('logo', url)}
                                    />
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest text-center">Resolu├º├úo recomendada: 400x400px</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Detalhes do Processo */}
                    <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-secondary" /> Especifica├º├Áes Jur├¡dicas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">N├║mero Unificado do Processo <span className="text-red-500">*</span></Label>
                                <Input
                                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-mono text-lg font-black text-primary"
                                    value={caseData.processo}
                                    onChange={e => updateField('processo', e.target.value)}
                                    required
                                    placeholder="0000000-00.0000.8.00.0000"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2 grid gap-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Comarca / Sede</Label>
                                            <Input
                                                className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold"
                                                value={caseData.comarca}
                                                onChange={e => updateField('comarca', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">UF</Label>
                                            <Input
                                                className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-black text-center uppercase"
                                                value={caseData.uf}
                                                onChange={e => updateField('uf', e.target.value.toUpperCase())}
                                                maxLength={2}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Vara / Ju├¡zo</Label>
                                        <Input
                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold"
                                            value={caseData.vara}
                                            onChange={e => updateField('vara', e.target.value)}
                                            placeholder="Ex: 1┬¬ Vara Empresarial"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Especialista Respons├ível</Label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                                            <Input
                                                className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold pl-12"
                                                value={caseData.especialistaResponsavel}
                                                onChange={e => updateField('especialistaResponsavel', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Passivo Estimado</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                                                <Input
                                                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold pl-12"
                                                    value={caseData.passivo}
                                                    onChange={e => updateField('passivo', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Qtd. Credores</Label>
                                            <Input
                                                type="number"
                                                className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-center"
                                                value={caseData.credores}
                                                onChange={e => updateField('credores', Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Data de Ajuizamento</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                                        <Input
                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold pl-12"
                                            value={caseData.ajuizamento}
                                            onChange={e => updateField('ajuizamento', e.target.value)}
                                            placeholder="DD/MM/AAAA"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Data de Deferimento</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                                        <Input
                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold pl-12"
                                            value={caseData.deferimento}
                                            onChange={e => updateField('deferimento', e.target.value)}
                                            placeholder="DD/MM/AAAA"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1 mb-3 block text-center">Sistemas Externos</Label>
                                <div className="relative">
                                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                                    <Input
                                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-medium text-xs text-blue-600 underline pl-12"
                                        value={caseData.linkHabilitacoes || ''}
                                        onChange={e => updateField('linkHabilitacoes', e.target.value)}
                                        placeholder="https://exemplo.com/habilitacoes"
                                        type="url"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 3: Documentos - Bento Accordion */}
                    <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <FolderOpen className="h-4 w-4 text-secondary" /> Acervo Documental
                                </CardTitle>
                                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Clique nas abas para expandir e gerenciar os arquivos</p>
                            </div>
                            {getTotalDocs() > 0 && (
                                <div className="bg-primary text-secondary text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-primary/10">
                                    {getTotalDocs()} DOCUMENTOS
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="p-8">
                            <Accordion type="single" collapsible className="space-y-4">
                                {[
                                    { id: 'demandasTed', label: 'Demandas do TED', icon: FileText },
                                    { id: 'ouvidoria', label: 'Ouvidoria', icon: FileText },
                                    { id: 'prerrogativas', label: 'Prerrogativas', icon: FileText },
                                    { id: 'fiscalizacao', label: 'Fiscaliza├º├úo', icon: FileText },
                                    { id: 'esa', label: 'ESA', icon: FileText },
                                    { id: 'comissoes', label: 'Comiss├Áes', icon: FileText },
                                    { id: 'financeiro', label: 'Financeiro', icon: FileText },
                                    ...(caseData.documentos?.customCategories || []).map((cat: any) => ({
                                        id: `custom_${cat.id}`,
                                        label: cat.name,
                                        icon: FileText,
                                        isCustom: true,
                                        customId: cat.id
                                    }))
                                ].map((tab) => (
                                    <AccordionItem key={tab.id} value={tab.id} className="border border-slate-100 rounded-2xl overflow-hidden px-4 bg-slate-50/50 hover:bg-white transition-colors">
                                        <AccordionTrigger className="hover:no-underline py-6">
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <tab.icon className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest text-primary">{tab.label}</span>
                                                {(caseData.documentos?.[tab.id]?.length || 0) > 0 && (
                                                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                                                        {caseData.documentos?.[tab.id]?.length}
                                                    </span>
                                                )}
                                                {'isCustom' in tab && tab.isCustom && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm(`Remover a categoria "${tab.label}"? Os documentos ser├úo perdidos.`)) {
                                                                setCaseData((prev: any) => {
                                                                    const newDocs = { ...prev.documentos };
                                                                    const newCustom = (newDocs.customCategories || []).filter((c: any) => c.id !== tab.customId);
                                                                    delete newDocs[tab.id];
                                                                    newDocs.customCategories = newCustom;
                                                                    return { ...prev, documentos: newDocs };
                                                                });
                                                            }
                                                        }}
                                                        className="ml-auto mr-4 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Remover categoria"
                                                    >
                                                        <Trash className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-8">
                                            <div className="pt-4 px-2 border-t border-slate-100">
                                                <DocumentUploadEditor
                                                    title=""
                                                    siteId={OAB_MA_SITE_ID}
                                                    documents={caseData.documentos?.[tab.id] || []}
                                                    onChange={docs => updateDocuments(tab.id, docs)}
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>

                            {/* Bot├úo para adicionar nova categoria */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const name = prompt('Digite o nome da nova categoria:');
                                        if (name && name.trim()) {
                                            const catId = Date.now().toString();
                                            setCaseData((prev: any) => ({
                                                ...prev,
                                                documentos: {
                                                    ...prev.documentos,
                                                    customCategories: [
                                                        ...(prev.documentos?.customCategories || []),
                                                        { id: catId, name: name.trim() }
                                                    ],
                                                    [`custom_${catId}`]: []
                                                }
                                            }));
                                            toast.success(`Categoria "${name.trim()}" criada!`);
                                        }
                                    }}
                                    className="w-full h-14 border-dashed border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all"
                                >
                                    <FolderOpen className="h-4 w-4 mr-2" />
                                    + Nova Categoria de Documentos
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-8 sticky top-24">
                    {/* Status Card & Overview */}
                    <Card className="border-border/50 shadow-sm bg-primary text-white overflow-hidden rounded-3xl">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary text-2xl font-black shadow-xl">
                                    {caseData.initials || '??'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase leading-tight">{caseData.name || 'Novo Caso'}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                                        <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Processo Ativo</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Documentos</span>
                                    <span className="text-lg font-black">{getTotalDocs()}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Credores</span>
                                    <span className="text-lg font-black">{caseData.credores || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-secondary" /> Guia de Preenchimento
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-secondary/20 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-primary">1</div>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">Certifique-se de que o <strong>N├║mero do Processo</strong> esteja no formato correto (CNJ).</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-secondary/20 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-primary">2</div>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">O link de <strong>Habilita├º├Áes</strong> deve ser uma URL v├ílida apontando para o sistema de gest├úo de cr├®ditos.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-secondary/20 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-primary">3</div>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">Documentos de grande escala devem ser otimizados para web (PDFs preferencialmente).</p>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CaseDetailsEditor;
