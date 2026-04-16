import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { TemplateIvaldo, templateIvaldo, fullIvaldoTemplate } from '@/config/template-ivaldo';
import { Save, Gavel, Globe, MessageSquare, Plus, Trash2, Settings, LayoutDashboard, Palette, Building2, ShieldAlert } from 'lucide-react';
import TeamEditor from './components/TeamEditor';
import CasesEditor from './components/CasesEditor';
import CalendarEditor from './components/CalendarEditor';
import ArticlesEditor from './components/ArticlesEditor';
import FaqEditor from './components/FaqEditor';
import LeadsEditor from './components/LeadsEditor';
import { ImageUpload } from '@/components/ui/image-upload';
import AdminLayout from './AdminLayout';
import SubsectionsEditor from './components/SubsectionsEditor';
import CoursesEditor from './components/CoursesEditor';

const OAB_MA_SITE_ID = import.meta.env.VITE_SITE_ID || '870aef8b-6f85-4b59-8729-56dfaf35b6fa';
const IS_SITE_CONFIGURED = OAB_MA_SITE_ID && OAB_MA_SITE_ID !== 'CONFIGURE_SITE_ID';


const SiteEditor = () => {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<TemplateIvaldo>(templateIvaldo);
    const [siteName, setSiteName] = useState('');
    const [siteDomain, setSiteDomain] = useState('');

    useEffect(() => {
        if (location.state && (location.state as any).section) {
            setActiveSection((location.state as any).section);
        }
    }, [location.state]);

    useEffect(() => {
        fetchSite();
    }, []);

    const isObject = (item: any) => {
        return (item && typeof item === 'object' && !Array.isArray(item));
    };

    const deepMerge = (target: any, source: any): any => {
        const output = Object.assign({}, target);
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = deepMerge(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    };

    const fetchSite = async () => {
        if (!IS_SITE_CONFIGURED) {
            setLoading(false);
            toast.error('Site não configurado. Verifique o VITE_SITE_ID.');
            return;
        }
        try {
            const { data, error } = await supabase
                .from('sites')
                .select('*')
                .eq('id', OAB_MA_SITE_ID)
                .single();

            if (error) throw error;

            setSiteName(data.name);
            setSiteDomain(data.domain || window.location.hostname);
            // Deep merge to ensure all nested properties exist
            const mergedConfig = deepMerge(templateIvaldo, data.config) as TemplateIvaldo;

            // Inject default FAQs if missing or empty
            if (!mergedConfig.content.faq || mergedConfig.content.faq.length === 0) {
                mergedConfig.content.faq = fullIvaldoTemplate.content.faq;
            }

            // Inject default newsCategories if missing or empty
            if (!mergedConfig.content.newsCategories || mergedConfig.content.newsCategories.length === 0) {
                mergedConfig.content.newsCategories = fullIvaldoTemplate.content.newsCategories;
            }

            // Inject default caseTypes if missing or empty
            if (!mergedConfig.content.caseTypes || mergedConfig.content.caseTypes.length === 0) {
                mergedConfig.content.caseTypes = fullIvaldoTemplate.content.caseTypes;
            }

            // Inject default stats if missing or empty
            if (!mergedConfig.content.stats || mergedConfig.content.stats.length === 0) {
                mergedConfig.content.stats = fullIvaldoTemplate.content.stats;
            }

            // Inject default about.benefits if missing or empty
            if (!mergedConfig.content.about?.benefits || mergedConfig.content.about.benefits.length === 0) {
                mergedConfig.content.about = {
                    ...mergedConfig.content.about,
                    benefits: fullIvaldoTemplate.content.about.benefits
                };
            }

            // Ensure footer exists
            if (!mergedConfig.content.footer) {
                mergedConfig.content.footer = fullIvaldoTemplate.content.footer;
            }

            // Ensure companies array exists
            if (!mergedConfig.content.companies) {
                mergedConfig.content.companies = [];
            }

            setConfig(mergedConfig);

        } catch (error: any) {
            toast.error('Erro ao carregar site');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('sites')
                .upsert({
                    id: OAB_MA_SITE_ID,
                    name: siteName || 'Corregedoria OAB-MA',
                    domain: siteDomain || window.location.hostname,
                    config
                });

            if (error) throw error;
            toast.success('Alterações salvas com sucesso!');
        } catch (error: any) {
            toast.error('Erro ao salvar alterações');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const updateConfig = (path: string, value: any) => {
        setConfig(prev => {
            const newConfig = { ...prev };
            const keys = path.split('.');
            let current: any = newConfig;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newConfig;
        });
    };

    if (loading) return <div className="p-8">Carregando...</div>;

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection} logoUrl={config.content.logo?.imageUrlWhite || config.content.logo?.imageUrl}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-fade-in">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-primary uppercase tracking-tight flex items-center gap-3">
                        <Settings className="h-8 w-8 text-secondary" /> 
                        Centro de Configurações
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm">
                        Editando: <span className="text-primary font-bold italic">{siteName || 'OAB Corporativo'}</span>
                    </p>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] tracking-widest uppercase px-8 h-12 shadow-xl shadow-primary/20 transition-all active:scale-95 group"
                >
                    <Save className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    {saving ? 'SINCRONIZANDO...' : 'SALVAR ALTERAÇÕES'}
                </Button>
            </div>

            {/* General Section */}
            {activeSection === 'general' && (
                <div className="grid gap-6">
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Globe className="h-4 w-4 text-secondary" /> Branding & Identidade
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <ImageUpload
                                        siteId={OAB_MA_SITE_ID}
                                        label="Logo Principal (Cores)"
                                        value={config.content.logo.imageUrl}
                                        onChange={(url) => updateConfig('content.logo.imageUrl', url)}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <ImageUpload
                                        siteId={OAB_MA_SITE_ID}
                                        label="Logo Negativa (Branca)"
                                        value={config.content.logo.imageUrlWhite}
                                        onChange={(url) => updateConfig('content.logo.imageUrlWhite', url)}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <ImageUpload
                                        siteId={OAB_MA_SITE_ID}
                                        label="Banner Hero (Destaque)"
                                        value={config.content.images.hero}
                                        onChange={(url) => updateConfig('content.images.hero', url)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-secondary" /> Comunicação & Atendimento
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Telefone de Exibição</Label>
                                        <Input
                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                            value={config.content.phone}
                                            onChange={(e) => updateConfig('content.phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">WhatsApp (Números + DDD)</Label>
                                        <Input
                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                            value={config.content.whatsapp}
                                            onChange={(e) => updateConfig('content.whatsapp', e.target.value)}
                                            placeholder="5598999999999"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">E-mail Institucional</Label>
                                        <Input
                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                            value={config.content.email}
                                            onChange={(e) => updateConfig('content.email', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Website Oficial (URL)</Label>
                                        <Input
                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                            value={config.content.website}
                                            onChange={(e) => updateConfig('content.website', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Globe className="h-4 w-4 text-secondary" /> Ecossistema Social
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                                {[
                                    { key: 'instagram', label: 'Instagram' },
                                    { key: 'facebook', label: 'Facebook' },
                                    { key: 'linkedin', label: 'LinkedIn' },
                                    { key: 'twitter', label: 'Twitter (X)' },
                                    { key: 'youtube', label: 'YouTube' }
                                ].map((item) => (
                                    <div key={item.key} className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">{item.label}</Label>
                                        <Input
                                            className="bg-slate-50 border-slate-200 focus:bg-white rounded-xl text-xs font-bold text-primary"
                                            value={(config.content.social as any)[item.key]}
                                            onChange={(e) => updateConfig(`content.social.${item.key}`, e.target.value)}
                                            placeholder={`URL do ${item.label}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-secondary" /> Unidades Judiciais (Endereços)
                            </CardTitle>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-[10px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary/5"
                                onClick={() => {
                                    const newAddress = { id: Date.now().toString(), label: "Nova Unidade", street: "", city: "", state: "", zip: "" };
                                    updateConfig('content.addresses', [...config.content.addresses, newAddress]);
                                }}
                            >
                                <Plus className="w-3 h-3 mr-1" /> ADICIONAR UNIDADE
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid lg:grid-cols-2 gap-8">
                                {config.content.addresses.map((address: any, index: number) => (
                                    <div key={address.id || index} className="group relative bg-slate-50 border border-slate-200 p-6 rounded-2xl hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20">
                                                    <Building2 className="w-4 h-4 text-secondary" />
                                                </div>
                                                <span className="text-sm font-black text-primary uppercase tracking-tight">
                                                    Endereço {index + 1}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                onClick={() => {
                                                    const newAddresses = config.content.addresses.filter((_: any, i: number) => i !== index);
                                                    updateConfig('content.addresses', newAddresses);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Logradouro & Número</Label>
                                                <Input
                                                    className="bg-white border-slate-100 rounded-xl text-sm font-medium"
                                                    value={address.street ?? ''}
                                                    onChange={(e) => {
                                                        const newAddresses = [...config.content.addresses];
                                                        newAddresses[index].street = e.target.value;
                                                        updateConfig('content.addresses', newAddresses);
                                                    }}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Complemento</Label>
                                                <Input
                                                    className="bg-white border-slate-100 rounded-xl text-sm font-medium"
                                                    value={address.complement ?? ''}
                                                    onChange={(e) => {
                                                        const newAddresses = [...config.content.addresses];
                                                        newAddresses[index].complement = e.target.value;
                                                        updateConfig('content.addresses', newAddresses);
                                                    }}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Bairro</Label>
                                                <Input
                                                    className="bg-white border-slate-100 rounded-xl text-sm font-medium"
                                                    value={address.neighborhood ?? ''}
                                                    onChange={(e) => {
                                                        const newAddresses = [...config.content.addresses];
                                                        newAddresses[index].neighborhood = e.target.value;
                                                        updateConfig('content.addresses', newAddresses);
                                                    }}
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="grid gap-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Município</Label>
                                                    <Input
                                                        className="bg-white border-slate-100 rounded-xl text-sm font-medium"
                                                        value={address.city ?? ''}
                                                        onChange={(e) => {
                                                            const newAddresses = [...config.content.addresses];
                                                            newAddresses[index].city = e.target.value;
                                                            updateConfig('content.addresses', newAddresses);
                                                        }}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Estado (UF)</Label>
                                                    <Input
                                                        className="bg-white border-slate-100 rounded-xl text-sm font-medium"
                                                        placeholder="MA"
                                                        value={address.state ?? ''}
                                                        onChange={(e) => {
                                                            const newAddresses = [...config.content.addresses];
                                                            newAddresses[index].state = e.target.value;
                                                            updateConfig('content.addresses', newAddresses);
                                                        }}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">CEP</Label>
                                                    <Input
                                                        className="bg-white border-slate-100 rounded-xl text-sm font-medium"
                                                        value={address.zip ?? ''}
                                                        onChange={(e) => {
                                                            const newAddresses = [...config.content.addresses];
                                                            newAddresses[index].zip = e.target.value;
                                                            updateConfig('content.addresses', newAddresses);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Gavel className="h-4 w-4 text-secondary" /> Identidade & Textos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Nome da Empresa</Label>
                                    <Input
                                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                        value={config.content.companyName}
                                        onChange={(e) => updateConfig('content.companyName', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Tagline (subtítulo no cabeçalho)</Label>
                                    <Input
                                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                        value={config.content.tagline}
                                        onChange={(e) => updateConfig('content.tagline', e.target.value)}
                                        placeholder="Ex: Administração Judicial"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Slogan (rodapé / quem somos)</Label>
                                    <Input
                                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                        value={config.content.slogan}
                                        onChange={(e) => updateConfig('content.slogan', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Horário — Semana</Label>
                                    <Input
                                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                        value={(config.content as any).businessHours?.weekdays || ''}
                                        onChange={(e) => updateConfig('content.businessHours.weekdays', e.target.value)}
                                        placeholder="Segunda a Sexta: 8h às 18h"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Horário — Sábado</Label>
                                    <Input
                                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                        value={(config.content as any).businessHours?.saturday || ''}
                                        onChange={(e) => updateConfig('content.businessHours.saturday', e.target.value)}
                                        placeholder="Sábado: 8h às 12h"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Horário — Domingo</Label>
                                    <Input
                                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                        value={(config.content as any).businessHours?.sunday || ''}
                                        onChange={(e) => updateConfig('content.businessHours.sunday', e.target.value)}
                                        placeholder="Domingo: Fechado"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 text-secondary" /> SEO & Indexação (Google)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Título da Página (Browser)</Label>
                                        <Input
                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                            value={(config as any).seo?.title || ''}
                                            onChange={(e) => updateConfig('seo.title', e.target.value)}
                                            placeholder="Ex: Ivaldo Praddo - Administração Judicial"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Meta Descrição (Snippet)</Label>
                                        <Textarea
                                            className="bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-medium text-primary text-sm min-h-[120px]"
                                            value={(config as any).seo?.description || ''}
                                            onChange={(e) => updateConfig('seo.description', e.target.value)}
                                            placeholder="Descrição curta para os resultados de busca..."
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <ImageUpload
                                            siteId={OAB_MA_SITE_ID}
                                            label="Ícone do Browser (Favicon)"
                                            value={(config as any).seo?.favicon || ''}
                                            onChange={(url) => updateConfig('seo.favicon', url)}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <ImageUpload
                                            siteId={OAB_MA_SITE_ID}
                                            label="Imagem de Compartilhamento (OG)"
                                            value={(config as any).seo?.ogImage || ''}
                                            onChange={(url) => updateConfig('seo.ogImage', url)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <LayoutDashboard className="h-4 w-4 text-secondary" /> Rodapé Institucional (Footer)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Mensagem de Copyright</Label>
                                    <Input
                                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary"
                                        value={config.content.footer?.copyright || ""}
                                        onChange={(e) => updateConfig('content.footer.copyright', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Descrição Autoral</Label>
                                    <Textarea
                                        className="bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-medium text-primary text-sm min-h-[100px]"
                                        value={config.content.footer?.description || ""}
                                        onChange={(e) => updateConfig('content.footer.description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Palette className="h-4 w-4 text-secondary" /> Identidade Cromática (Cores)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { key: 'primary', label: 'Cor Primária' },
                                    { key: 'secondary', label: 'Cor Secundária' },
                                    { key: 'background', label: 'Cor de Fundo' },
                                    { key: 'textDark', label: 'Cor do Texto' }
                                ].map((color) => (
                                    <div key={color.key} className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1 text-center block">{color.label}</Label>
                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 group hover:border-primary/20 transition-all">
                                            <div 
                                                className="w-12 h-12 rounded-lg shadow-lg border-2 border-white ring-1 ring-slate-200" 
                                                style={{ backgroundColor: ((config as any).colors as any)?.[color.key] }} 
                                            />
                                            <Input
                                                className="bg-transparent border-none text-xs font-mono font-black text-primary uppercase h-auto p-0 focus-visible:ring-0"
                                                value={((config as any).colors as any)?.[color.key] || ''}
                                                onChange={(e) => updateConfig(`colors.${color.key}`, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            )}

            {/* Content Section */}
            {activeSection === 'content' && (
                <div className="grid gap-6">
                    <Card>
                        <CardHeader><CardTitle>Quem Somos</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Título</Label>
                                <Input
                                    value={config.content.about.title}
                                    onChange={(e) => updateConfig('content.about.title', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Descrição</Label>
                                <Textarea
                                    rows={6}
                                    value={config.content.about.description}
                                    onChange={(e) => updateConfig('content.about.description', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <ImageUpload
                                    siteId={OAB_MA_SITE_ID}
                                    label="Imagem de Fundo (Quem Somos)"
                                    value={config.content.images.aboutBackground || ''}
                                    onChange={(url) => updateConfig('content.images.aboutBackground', url)}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold">Benefícios (4 Itens)</h3>
                                {config.content.about.benefits.map((benefit, index) => (
                                    <div key={benefit.id} className="grid gap-2 border p-3 rounded">
                                        <Label>Benefício {index + 1}</Label>
                                        <Input
                                            placeholder="Título"
                                            value={benefit.text}
                                            onChange={(e) => {
                                                const newBenefits = [...config.content.about.benefits];
                                                newBenefits[index].text = e.target.value;
                                                updateConfig('content.about.benefits', newBenefits);
                                            }}
                                        />
                                        <Input
                                            placeholder="Descrição"
                                            value={benefit.description}
                                            onChange={(e) => {
                                                const newBenefits = [...config.content.about.benefits];
                                                newBenefits[index].description = e.target.value;
                                                updateConfig('content.about.benefits', newBenefits);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Estatísticas (Sucessos Medidos)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {config.content.stats.map((stat, index) => (
                                    <div key={stat.id} className="border p-3 rounded space-y-2">
                                        <Label>Estatística {index + 1}</Label>
                                        <Input
                                            placeholder="Rótulo (ex: Processos)"
                                            value={stat.label}
                                            onChange={(e) => {
                                                const newStats = [...config.content.stats];
                                                newStats[index].label = e.target.value;
                                                updateConfig('content.stats', newStats);
                                            }}
                                        />
                                        <Input
                                            placeholder="Valor (ex: 5000)"
                                            value={stat.value}
                                            onChange={(e) => {
                                                const newStats = [...config.content.stats];
                                                newStats[index].value = e.target.value;
                                                updateConfig('content.stats', newStats);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            )}

            {/* Team Section */}
            {activeSection === 'team' && (
                <TeamEditor config={config} updateConfig={updateConfig} siteId={OAB_MA_SITE_ID} />
            )}

            {/* Subsections Section */}
            {activeSection === 'subsections' && (
                <SubsectionsEditor />
            )}

            {/* Courses Section */}
            {activeSection === 'courses' && (
                <CoursesEditor />
            )}

            {/* Cases Section */}
            {activeSection === 'cases' && (
                <CasesEditor config={config} updateConfig={updateConfig} siteId={OAB_MA_SITE_ID} />
            )}

            {/* FAQ Section */}
            {activeSection === 'faq' && (
                <FaqEditor config={config} updateConfig={updateConfig} />
            )}

            {/* Leads Section */}
            {activeSection === 'leads' && (
                <LeadsEditor siteId={OAB_MA_SITE_ID} />
            )}

            {/* Calendar Section */}
            {activeSection === 'calendar' && (
                <CalendarEditor config={config} updateConfig={updateConfig} />
            )}

            {/* Articles Section */}
            {activeSection === 'articles' && (
                <ArticlesEditor config={config} updateConfig={updateConfig} siteId={OAB_MA_SITE_ID} />
            )}

            {/* Advanced Section — removed */}
            {false && (
                <Card>
                    <CardHeader><CardTitle>Editor JSON Avançado</CardTitle></CardHeader>
                    <CardContent>
                        <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                            <h3 className="font-semibold text-yellow-800 mb-2">Restaurar Padrões de Categorias</h3>
                            <p className="text-sm text-yellow-700 mb-4">
                                Se as categorias de notícias ou tipos de casos sumiram ou estão incorretos, clique abaixo para restaurar os padrões do sistema.
                                Isso não apagará seus artigos ou casos, apenas restaurará as categorias padrão.
                            </p>
                            <Button
                                variant="outline"
                                className="bg-white border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                                onClick={() => {
                                    if (confirm('Isso irá restaurar as categorias de notícias, tipos de casos e dúvidas frequentes para o padrão. Deseja continuar?')) {
                                        const defaultNewsCategories = [
                                            { id: 1, title: "RECUPERAÇÃO JUDICIAL" },
                                            { id: 2, title: "ADMINISTRAÇÃO JUDICIAL" },
                                            { id: 3, title: "ANÁLISE" },
                                            { id: 4, title: "ASSEMBLEIA" },
                                            { id: 5, title: "ENTREVISTA" }
                                        ];

                                        const defaultCaseTypes = [
                                            {
                                                id: "recuperacao-judicial",
                                                slug: "recuperacao-judicial",
                                                title: "Recuperação Judicial",
                                                description: "O que é recuperação judicial?",
                                                explanation: "É um procedimento instituído pela Lei n.º 11.101/2005, utilizado por empresários individuais e sociedades empresárias que desejam superar crises econômico-financeiras e evitar a decretação de falência.\n\nA recuperação judicial possibilita a renegociação do passivo com a elaboração de um plano que engloba propostas de pagamento e estratégias de soerguimento. Este plano é apresentado pela empresa nos autos do processo, e, caso algum credor manifeste objeção aos seus termos, será designada uma assembleia-geral de credores para deliberação da proposta.\n\nCaso o plano seja aprovado pelos credores e homologado pelo Juiz condutor do processo, as obrigações da empresa devedora são novadas. Através disso, permite-se que a devedora modifique substancialmente seu perfil de endividamento, a viabilizar a preservação de sua atuação no mercado.\n\nEm síntese, o processo de recuperação judicial oferece um amparo a que a empresa reverta sua situação de insolvência, porém sem perder de vista os interesses de seus credores. Assim, privilegia-se o empreendedorismo e fomenta-se a atividade econômica, a geração de empregos e o recolhimento de tributos."
                                            },
                                            {
                                                id: "falencia",
                                                slug: "falencia",
                                                title: "Falência",
                                                description: "O que é falência?",
                                                explanation: "A falência é um processo judicial destinado à liquidação dos bens do devedor empresário para satisfação dos credores. É decretada pelo juiz quando verificada a impossibilidade de recuperação da empresa e o não pagamento de dívidas líquidas vencidas.\n\nQuando uma empresa não consegue mais honrar suas obrigações financeiras e não há possibilidade de recuperação, o juiz decreta a falência. Este processo visa a arrecadação, administração e venda dos bens da empresa para pagamento dos credores, seguindo a ordem de preferência estabelecida em lei.\n\nO administrador judicial fica responsável por administrar os bens do falido, realizar o inventário patrimonial, e proceder à alienação dos ativos para converter em recursos financeiros destinados ao pagamento dos credores.\n\nDiferentemente da recuperação judicial, na falência não há perspectiva de continuidade das atividades empresariais. O objetivo é encerrar a empresa de forma ordenada, preservando ao máximo os direitos dos credores."
                                            },
                                            {
                                                id: "administracao-judicial",
                                                slug: "administracao-judicial",
                                                title: "Administração Judicial",
                                                description: "O que é administração judicial?",
                                                explanation: "A administração judicial é exercida por profissional especializado nomeado pelo juiz para fiscalizar as atividades do devedor em recuperação judicial, receber e processar as habilitações de créditos, além de convocar e presidir as assembleias gerais de credores.\n\nO administrador judicial atua como um auxiliar da justiça, zelando pela lisura e transparência do processo de recuperação judicial ou falência. Entre suas atribuições está a verificação da regularidade do plano de recuperação, análise das habilitações de crédito apresentadas pelos credores, e prestação de contas ao juízo.\n\nEm processos de recuperação judicial, o administrador monitora o cumprimento das obrigações assumidas pela empresa recuperanda, apresenta relatórios mensais sobre as atividades da empresa, e manifesta-se sobre qualquer questão relevante ao processo.\n\nSua atuação é fundamental para garantir o equilíbrio entre os interesses da empresa em recuperação e os direitos dos credores, sempre sob a supervisão do Poder Judiciário."
                                            },
                                            {
                                                id: "litisconsorcio",
                                                slug: "litisconsorcio",
                                                title: "Litisconsórcio",
                                                description: "O que é litisconsórcio?",
                                                explanation: "Litisconsórcio ocorre quando há pluralidade de partes no polo ativo ou passivo de uma ação judicial. Em processos de recuperação judicial, é comum quando várias empresas do mesmo grupo econômico buscam a recuperação conjunta.\n\nQuando empresas de um mesmo grupo empresarial enfrentam dificuldades financeiras correlacionadas, podem requerer a recuperação judicial em litisconsórcio, ou seja, conjuntamente no mesmo processo. Isso permite uma visão integrada da situação econômico-financeira do grupo e facilita a elaboração de um plano de recuperação unificado.\n\nO litisconsórcio pode ser ativo (quando várias empresas figuram como requerentes) ou passivo (quando há vários requeridos). No contexto da recuperação judicial, o litisconsórcio ativo é mais comum, permitindo economia processual e melhor coordenação das atividades de reestruturação.\n\nEsta modalidade é particularmente útil quando as empresas do grupo possuem operações integradas, compartilham credores, ou quando a viabilidade de uma depende da recuperação das demais."
                                            }
                                        ];

                                        const defaultFaqs = [
                                            {
                                                id: 1,
                                                question: "O que é administração judicial?",
                                                answer: "A administração judicial é o processo de gestão de empresas em recuperação judicial ou falência, realizado por profissionais especializados para preservar os ativos da empresa e viabilizar o pagamento dos credores."
                                            },
                                            {
                                                id: 2,
                                                question: "Como consultar meu processo?",
                                                answer: "Você pode consultar seu processo através da área do credor em nosso site, utilizando seu CPF/CNPJ e número do processo. Também é possível entrar em contato com nossa equipe através dos canais de atendimento."
                                            },
                                            {
                                                id: 3,
                                                question: "Quais documentos são necessários para habilitação de crédito?",
                                                answer: "Os documentos necessários incluem: comprovante de crédito (notas fiscais, contratos, etc.), documentos pessoais do credor (RG, CPF para pessoa física ou contrato social para pessoa jurídica), e procuração caso seja representado por advogado."
                                            },
                                            {
                                                id: 4,
                                                question: "Quanto tempo dura um processo de recuperação judicial?",
                                                answer: "O tempo de duração varia de acordo com a complexidade do caso, mas geralmente um processo de recuperação judicial dura entre 2 e 5 anos, desde o pedido inicial até a homologação final."
                                            },
                                            {
                                                id: 5,
                                                question: "Como participo das assembleias?",
                                                answer: "As datas das assembleias são publicadas em nosso calendário. É importante comparecer ou enviar um representante legal com procuração adequada."
                                            },
                                            {
                                                id: 6,
                                                question: "O que acontece se o plano de recuperação não for aprovado?",
                                                answer: "Caso o plano de recuperação judicial não seja aprovado pela assembleia de credores, o juiz pode decretar a falência da empresa ou solicitar a apresentação de um novo plano modificado."
                                            }
                                        ];

                                        setConfig(prev => ({
                                            ...prev,
                                            faq: defaultFaqs,
                                            content: {
                                                ...prev.content,
                                                newsCategories: defaultNewsCategories,
                                                caseTypes: defaultCaseTypes
                                            }
                                        }));
                                        toast.success("Padrões restaurados com sucesso! Clique em Salvar Alterações para persistir.");
                                    }
                                }}
                            >
                                Restaurar Padrões
                            </Button>
                        </div>

                        <p className="text-sm text-yellow-600 mb-4">
                            Cuidado ao editar o JSON diretamente. Erros de sintaxe podem quebrar o site.
                        </p>
                        <Textarea
                            className="font-mono text-xs h-[500px]"
                            value={JSON.stringify(config, null, 2)}
                            onChange={(e) => {
                                try {
                                    setConfig(JSON.parse(e.target.value));
                                } catch (err) {
                                    // Ignore parse errors while typing
                                }
                            }}
                        />
                    </CardContent>
                </Card>
            )}
        </AdminLayout>
    );
};

export default SiteEditor;
