import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Save, Trash, FileText, Scale, FolderOpen } from 'lucide-react';
import DocumentUploadEditor from '@/pages/admin/components/DocumentUploadEditor';
import { toast } from 'sonner';

const OAB_MA_SITE_ID = import.meta.env.VITE_SITE_ID || '';
const IS_SITE_CONFIGURED = !!OAB_MA_SITE_ID && OAB_MA_SITE_ID !== 'CONFIGURE_SITE_ID';

interface DocumentItem {
  id: number;
  nome: string;
  url: string;
  data?: string;
}

interface CasoDocumentos {
  [key: string]: DocumentItem[] | any[];
}

interface CasoData {
  id?: string;
  subsection_id?: string;
  nome: string;
  processo: string;
  comarca: string;
  uf: string;
  vara: string;
  especialista: string;
  passivo: string;
  credores: number;
  ajuizamento: string;
  deferimento: string;
  link_habilitacoes: string;
  documentos: CasoDocumentos;
}

const emptyCase = (): CasoData => ({
  nome: '',
  processo: '',
  comarca: '',
  uf: '',
  vara: '',
  especialista: '',
  passivo: '',
  credores: 0,
  ajuizamento: '',
  deferimento: '',
  link_habilitacoes: '',
  documentos: {
    demandasTed: [],
    ouvidoria: [],
    prerrogativas: [],
    fiscalizacao: [],
    esa: [],
    comissoes: [],
    financeiro: [],
    customCategories: [],
  },
});

const CasoEditor = () => {
  const { casoId } = useParams<{ casoId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role, subsectionId } = useAuth();

  // Admin can create cases for a specific subsection via ?subsection_id=<uuid>
  const urlSubsectionId = searchParams.get('subsection_id');
  const effectiveSubsectionId = subsectionId ?? urlSubsectionId;

  const readonly = role === 'user';
  const isNew = casoId === 'new';

  const [casoData, setCasoData] = useState<CasoData>(emptyCase());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const backPath =
    role === 'admin' ? '/portal/admin' :
    role === 'presidente' ? '/portal/presidente' :
    '/portal';

  useEffect(() => {
    if (isNew) return;

    const fetchCaso = async () => {
      const { data, error } = await supabase
        .from('casos')
        .select('*')
        .eq('id', casoId)
        .single();

      if (error || !data) {
        toast.error('Caso n├úo encontrado ou acesso negado');
        navigate(backPath);
        return;
      }

      setCasoData({
        id: data.id,
        subsection_id: data.subsection_id,
        nome: data.nome ?? '',
        processo: data.processo ?? '',
        comarca: data.comarca ?? '',
        uf: data.uf ?? '',
        vara: data.vara ?? '',
        especialista: data.especialista ?? '',
        passivo: data.passivo ?? '',
        credores: data.credores ?? 0,
        ajuizamento: data.ajuizamento ?? '',
        deferimento: data.deferimento ?? '',
        link_habilitacoes: data.link_habilitacoes ?? '',
        documentos: data.documentos ?? {},
      });
      setLoading(false);
    };

    fetchCaso();
  }, [casoId, isNew]);

  const updateField = (field: keyof CasoData, value: string | number) => {
    setCasoData(prev => ({ ...prev, [field]: value }));
  };

  const updateDocumentos = (section: string, docs: DocumentItem[]) => {
    setCasoData(prev => ({
      ...prev,
      documentos: {
        ...prev.documentos,
        [section]: docs,
      },
    }));
  };

  const getTotalDocs = () => {
    const d = casoData.documentos;
    let total = 0;
    Object.keys(d).forEach(key => {
      if (key !== 'customCategories' && Array.isArray(d[key])) {
        total += d[key].length;
      }
    });
    return total;
  };

  const handleSave = async () => {
    if (!IS_SITE_CONFIGURED) {
      toast.error('Site ID n├úo configurado. N├úo ├® poss├¡vel salvar.');
      return;
    }

    if (!casoData.nome || !casoData.processo) {
      toast.error('Preencha os campos obrigat├│rios: Nome e Processo');
      return;
    }

    if (!effectiveSubsectionId && isNew) {
      toast.error('Subse├º├úo n├úo identificada. Selecione uma subse├º├úo antes de criar o caso.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nome: casoData.nome,
        processo: casoData.processo,
        comarca: casoData.comarca || null,
        uf: casoData.uf || null,
        vara: casoData.vara || null,
        especialista: casoData.especialista || null,
        passivo: casoData.passivo || null,
        credores: casoData.credores || 0,
        ajuizamento: casoData.ajuizamento || null,
        deferimento: casoData.deferimento || null,
        link_habilitacoes: casoData.link_habilitacoes || null,
        documentos: casoData.documentos || {},
      };

      if (isNew) {
        const { error } = await supabase.from('casos').insert({
          subsection_id: effectiveSubsectionId,
          ...payload,
        });
        if (error) throw error;
        toast.success('Caso criado com sucesso!');
        navigate(backPath);
      } else {
        const { error } = await supabase
          .from('casos')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', casoId);
        if (error) throw error;
        toast.success('Caso salvo com sucesso!');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar caso';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este caso permanentemente?')) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('casos').delete().eq('id', casoId);
      if (error) throw error;
      toast.success('Caso exclu├¡do.');
      navigate(backPath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir caso';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sticky Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">
                  {isNew ? 'Novo Caso' : (casoData.nome || 'Editar Caso')}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {isNew ? 'Preencha os dados do caso' : `ID: ${casoId}`}
                  {readonly && (
                    <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs">
                      Somente leitura
                    </span>
                  )}
                </p>
              </div>
            </div>
            {!readonly && (
              <div className="flex gap-2 justify-end">
                {!isNew && (
                  <Button variant="destructive" size="sm" onClick={handleDelete} disabled={saving}>
                    <Trash className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Excluir</span>
                  </Button>
                )}
                <Button onClick={handleSave} disabled={saving} size="sm">
                  <Save className="h-4 w-4 sm:mr-2" />
                  {saving ? 'Salvando...' : <span className="hidden sm:inline">Salvar</span>}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">

        {readonly && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Voc├¬ est├í visualizando este caso em modo somente leitura.
            </p>
          </div>
        )}

        {/* Card 1: Informa├º├Áes do Caso */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="h-5 w-5 text-primary" />
              Informa├º├Áes do Caso
            </CardTitle>
            <CardDescription>Dados de identifica├º├úo e processo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Nome do Caso <span className="text-red-500">*</span>
              </Label>
              <Input
                value={casoData.nome}
                onChange={e => updateField('nome', e.target.value)}
                placeholder="Ex: Empresa ABC Ltda"
                disabled={readonly}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>
                N├║mero do Processo <span className="text-red-500">*</span>
              </Label>
              <Input
                value={casoData.processo}
                onChange={e => updateField('processo', e.target.value)}
                placeholder="0000000-00.0000.8.00.0000"
                disabled={readonly}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Comarca</Label>
                <Input
                  value={casoData.comarca}
                  onChange={e => updateField('comarca', e.target.value)}
                  placeholder="S├úo Lu├¡s"
                  disabled={readonly}
                />
              </div>
              <div className="space-y-2">
                <Label>UF</Label>
                <Input
                  value={casoData.uf}
                  onChange={e => updateField('uf', e.target.value.toUpperCase())}
                  maxLength={2}
                  placeholder="MA"
                  className="text-center"
                  disabled={readonly}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vara</Label>
                <Input
                  value={casoData.vara}
                  onChange={e => updateField('vara', e.target.value)}
                  placeholder="1┬¬ Vara Empresarial"
                  disabled={readonly}
                />
              </div>
              <div className="space-y-2">
                <Label>Especialista Respons├ível</Label>
                <Input
                  value={casoData.especialista}
                  onChange={e => updateField('especialista', e.target.value)}
                  placeholder="Nome do respons├ível"
                  disabled={readonly}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Passivo (Valor)</Label>
                <Input
                  value={casoData.passivo}
                  onChange={e => updateField('passivo', e.target.value)}
                  placeholder="R$ 1.000.000,00"
                  disabled={readonly}
                />
              </div>
              <div className="space-y-2">
                <Label>N┬║ de Credores</Label>
                <Input
                  type="number"
                  value={casoData.credores}
                  onChange={e => updateField('credores', Number(e.target.value))}
                  placeholder="0"
                  disabled={readonly}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Link Habilita├º├Áes e Cr├®dito / Impugna├º├Áes</Label>
              <Input
                value={casoData.link_habilitacoes}
                onChange={e => updateField('link_habilitacoes', e.target.value)}
                placeholder="https://exemplo.com/habilitacoes"
                type="url"
                disabled={readonly}
              />
              <p className="text-xs text-muted-foreground">
                URL externa. Deixe vazio para ocultar o bot├úo.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Datas */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Datas</CardTitle>
            <CardDescription>Datas de ajuizamento e deferimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Ajuizamento</Label>
                <Input
                  type="date"
                  value={casoData.ajuizamento}
                  onChange={e => updateField('ajuizamento', e.target.value)}
                  disabled={readonly}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Deferimento</Label>
                <Input
                  type="date"
                  value={casoData.deferimento}
                  onChange={e => updateField('deferimento', e.target.value)}
                  disabled={readonly}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Documentos */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FolderOpen className="h-5 w-5 text-primary" />
              Documentos
              {getTotalDocs() > 0 && (
                <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {getTotalDocs()}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {readonly
                ? 'Documentos do caso'
                : 'Clique para expandir cada se├º├úo e adicionar documentos'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {[
                { id: 'demandasTed', label: 'Demandas do TED' },
                { id: 'ouvidoria', label: 'Ouvidoria' },
                { id: 'prerrogativas', label: 'Prerrogativas' },
                { id: 'fiscalizacao', label: 'Fiscaliza├º├úo' },
                { id: 'esa', label: 'ESA' },
                { id: 'comissoes', label: 'Comiss├Áes' },
                { id: 'financeiro', label: 'Financeiro' },
                ...(casoData.documentos?.customCategories || []).map((cat: any) => ({
                  id: `custom_${cat.id}`,
                  label: cat.name,
                  isCustom: true,
                  customId: cat.id
                }))
              ].map((tab) => (
                <AccordionItem key={tab.id} value={tab.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 w-full">
                      <FileText className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {(casoData.documentos?.[tab.id]?.length ?? 0) > 0 && (
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded">
                          {casoData.documentos?.[tab.id]?.length}
                        </span>
                      )}
                      {'isCustom' in tab && tab.isCustom && !readonly && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Remover a categoria "${tab.label}"?`)) {
                              setCasoData(prev => {
                                const newDocs = { ...prev.documentos };
                                const newCustom = (newDocs.customCategories || []).filter((c: any) => c.id !== tab.customId);
                                delete newDocs[tab.id];
                                newDocs.customCategories = newCustom;
                                return { ...prev, documentos: newDocs };
                              });
                            }
                          }}
                          className="ml-auto mr-4 p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remover categoria"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <DocumentUploadEditor
                      title=""
                      siteId={OAB_MA_SITE_ID}
                      documents={casoData.documentos?.[tab.id] ?? []}
                      onChange={docs => updateDocumentos(tab.id, docs)}
                      bucket="site-assets"
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Bot├úo para adicionar nova categoria */}
            {!readonly && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const name = prompt('Digite o nome da nova categoria:');
                    if (name && name.trim()) {
                      const catId = Date.now().toString();
                      setCasoData(prev => ({
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
                  className="w-full h-12 border-dashed border-2"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  + Nova Categoria de Documentos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Floating Save Button for Mobile */}
        {!readonly && (
          <div className="fixed bottom-6 right-6 sm:hidden">
            <Button
              onClick={handleSave}
              disabled={saving}
              size="lg"
              className="shadow-lg rounded-full h-14 w-14"
            >
              <Save className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CasoEditor;
