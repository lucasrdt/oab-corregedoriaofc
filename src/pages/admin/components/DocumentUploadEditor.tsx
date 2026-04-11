import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Loader2, Upload, Trash, FileText, ExternalLink, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
    id: number;
    nome: string;
    url: string;
    data?: string;
}

interface DocumentUploadEditorProps {
    title: string;
    documents: Document[];
    onChange: (docs: Document[]) => void;
    bucket?: string;
    siteId: string; // Obrigatório para garantir que uploads vão para o site correto
}

const DocumentUploadEditor = ({
    title,
    documents,
    onChange,
    bucket = "site-assets",
    siteId
}: DocumentUploadEditorProps) => {
    const { toast } = useToast();
    const [uploadingId, setUploadingId] = useState<number | null>(null);
    const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

    const addDocument = () => {
        const newId = Math.max(...documents.map(d => d.id), 0) + 1;
        onChange([...documents, { id: newId, nome: '', url: '' }]);
    };

    const removeDocument = (index: number) => {
        if (confirm('Tem certeza que deseja remover este documento?')) {
            onChange(documents.filter((_, i) => i !== index));
        }
    };

    const updateDocument = (index: number, field: keyof Document, value: string) => {
        const newDocs = [...documents];
        newDocs[index] = { ...newDocs[index], [field]: value };
        onChange(newDocs);
    };

    const moveDocument = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index > 0) {
            const newDocs = [...documents];
            [newDocs[index], newDocs[index - 1]] = [newDocs[index - 1], newDocs[index]];
            onChange(newDocs);
        } else if (direction === 'down' && index < documents.length - 1) {
            const newDocs = [...documents];
            [newDocs[index], newDocs[index + 1]] = [newDocs[index + 1], newDocs[index]];
            onChange(newDocs);
        }
    };

    const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            toast({
                title: "Arquivo muito grande",
                description: "O documento deve ter no máximo 10MB.",
                variant: "destructive"
            });
            return;
        }

        try {
            setUploadingId(documents[index].id);

            const fileExt = file.name.split('.').pop();
            // Create a clean filename
            const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            const storagePath = `${siteId || 'docs'}/cases/${Date.now()}_${cleanFileName}`;

            const { error } = await supabase.storage
                .from(bucket)
                .upload(storagePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(storagePath);

            // Update document with URL and default name if empty
            const newDocs = [...documents];
            newDocs[index] = {
                ...newDocs[index],
                url: publicUrl,
                nome: newDocs[index].nome || file.name.split('.')[0] // Use filename as default title if empty
            };
            onChange(newDocs);

            toast({
                title: "Sucesso",
                description: "Documento enviado com sucesso!",
            });

        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: "Erro no upload",
                description: "Não foi possível enviar o documento.",
                variant: "destructive"
            });
        } finally {
            setUploadingId(null);
            // Reset input
            if (fileInputRefs.current[documents[index].id]) {
                fileInputRefs.current[documents[index].id]!.value = '';
            }
        }
    };

    const triggerFileInput = (id: number) => {
        fileInputRefs.current[id]?.click();
    };

    return (
        <div className="space-y-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner group/upload">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                    <h4 className="font-black text-[11px] uppercase tracking-widest text-primary flex items-center gap-2">
                        <FileText className="h-3 w-3 text-secondary" />
                        {title || 'Gestão de Documentos'}
                    </h4>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter italic">Upload Seguro de Processos e Editais</p>
                </div>
                <Button 
                    type="button" 
                    onClick={addDocument}
                    className="h-8 px-4 bg-primary hover:bg-primary/90 rounded-lg font-black text-[8px] tracking-widest uppercase shadow-lg shadow-primary/10 transition-all active:scale-95"
                >
                    <Plus className="h-3 w-3 mr-1.5" /> Novo Registro
                </Button>
            </div>

            {documents.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-4 bg-white/50 rounded-[2rem] border border-dashed border-slate-200">
                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-primary/20" />
                    </div>
                    <p className="font-black text-[9px] uppercase tracking-[0.3em] text-primary/30 text-center">Nenhum Documento<br/>Anexado ao Caso</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {documents.map((doc, index) => (
                        <Card key={doc.id} className="group/item border-slate-100 shadow-sm hover:shadow-md hover:border-primary/10 transition-all duration-300 rounded-[1.8rem] overflow-hidden bg-white">
                            <CardContent className="p-6">
                                <div className="flex gap-4 items-start">
                                    <div className="grid gap-6 flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                                            <div className="lg:col-span-5 space-y-1.5">
                                                <Label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-1">Denominação do Arquivo</Label>
                                                <Input
                                                    placeholder="Ex: Portaria de Nomeação"
                                                    className="h-10 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary text-xs"
                                                    value={doc.nome}
                                                    onChange={(e) => updateDocument(index, 'nome', e.target.value)}
                                                />
                                            </div>
                                            <div className="lg:col-span-4 space-y-1.5">
                                                <Label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-1">Referência Temporal</Label>
                                                <Input
                                                    placeholder="DD/MM/AAAA"
                                                    className="h-10 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-black text-primary text-xs text-center"
                                                    value={doc.data || ''}
                                                    onChange={(e) => updateDocument(index, 'data', e.target.value)}
                                                />
                                            </div>
                                            <div className="lg:col-span-3 space-y-1.5">
                                                <Label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-1 opacity-0">-</Label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="file"
                                                        ref={el => fileInputRefs.current[doc.id] = el}
                                                        className="hidden"
                                                        onChange={(e) => handleFileUpload(index, e)}
                                                    />

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 h-10 border-slate-200 hover:bg-slate-50 hover:text-primary rounded-xl font-black text-[9px] tracking-widest uppercase transition-all"
                                                        disabled={uploadingId === doc.id}
                                                        onClick={() => triggerFileInput(doc.id)}
                                                    >
                                                        {uploadingId === doc.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                        ) : (
                                                            <>
                                                                <Upload className="h-3 w-3 mr-2" /> 
                                                                Cloud Upload
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                <ExternalLink className="h-3.5 w-3.5 text-primary/30" />
                                            </div>
                                            <Input
                                                placeholder="Localização Digital (URL)"
                                                className="flex-1 h-8 bg-transparent border-none focus-visible:ring-0 font-medium text-slate-400 text-[10px] italic p-0"
                                                value={doc.url}
                                                onChange={(e) => updateDocument(index, 'url', e.target.value)}
                                            />
                                            {doc.url && (
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-3 text-[8px] font-black uppercase tracking-widest text-primary hover:bg-white rounded-lg"
                                                >
                                                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                        Abrir Anexo
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5 opacity-0 group-hover/item:opacity-100 transition-all border-l border-slate-100 pl-4 py-2">
                                         <div className="flex flex-col p-1 bg-slate-50 rounded-xl border border-slate-100">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-primary/40 hover:text-primary hover:bg-white rounded-lg transition-all"
                                                onClick={() => moveDocument(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-primary/40 hover:text-primary hover:bg-white rounded-lg transition-all"
                                                onClick={() => moveDocument(index, 'down')}
                                                disabled={index === documents.length - 1}
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            onClick={() => removeDocument(index)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentUploadEditor;
