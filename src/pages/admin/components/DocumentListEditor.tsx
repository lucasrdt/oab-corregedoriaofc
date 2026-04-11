import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash, ArrowUp, ArrowDown } from 'lucide-react';

interface Document {
    id: number;
    nome: string;
    url: string;
    data?: string;
}

interface DocumentListEditorProps {
    title: string;
    documents: Document[];
    onChange: (docs: Document[]) => void;
}

const DocumentListEditor = ({ title, documents, onChange }: DocumentListEditorProps) => {
    const addDocument = () => {
        const newId = Math.max(...documents.map(d => d.id), 0) + 1;
        onChange([...documents, { id: newId, nome: '', url: '' }]);
    };

    const removeDocument = (index: number) => {
        onChange(documents.filter((_, i) => i !== index));
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

    return (
        <div className="space-y-6 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-inner group/list">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                    <h4 className="font-black text-[11px] uppercase tracking-widest text-primary">{title}</h4>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter italic">Acervo Digital de PDFs e Anexos</p>
                </div>
                <Button 
                    type="button" 
                    onClick={addDocument}
                    className="h-8 px-4 bg-primary hover:bg-primary/90 rounded-lg font-black text-[8px] tracking-widest uppercase shadow-lg shadow-primary/10 transition-all active:scale-95"
                >
                    <Plus className="h-3 w-3 mr-1.5" /> Vincular Arquivo
                </Button>
            </div>

            {documents.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 opacity-30">
                    <Plus className="w-8 h-8 text-primary" />
                    <p className="font-black text-[9px] uppercase tracking-[0.2em]">Lista de Documentos Vazia</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {documents.map((doc, index) => (
                        <div key={doc.id} className="group/item flex gap-4 items-start bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/10 transition-all duration-300">
                            <div className="grid grid-cols-12 gap-5 flex-1">
                                <div className="col-span-12 md:col-span-5 space-y-1.5">
                                    <Label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-1">Identificação do Título</Label>
                                    <Input
                                        placeholder="Ex: Edital 001/2024"
                                        className="h-10 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-bold text-primary text-xs"
                                        value={doc.nome}
                                        onChange={(e) => updateDocument(index, 'nome', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-5 space-y-1.5">
                                    <Label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-1">Caminho Digital (URL)</Label>
                                    <Input
                                        placeholder="https://..."
                                        className="h-10 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-medium text-slate-500 text-xs italic"
                                        value={doc.url}
                                        onChange={(e) => updateDocument(index, 'url', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-2 space-y-1.5">
                                    <Label className="text-[8px] font-black uppercase tracking-widest text-primary/40 ml-1">Publicação</Label>
                                    <Input
                                        placeholder="DD/MM/AAAA"
                                        className="h-10 bg-slate-50 border-slate-200 focus:bg-white rounded-xl font-black text-primary text-xs text-center"
                                        value={doc.data || ''}
                                        onChange={(e) => updateDocument(index, 'data', e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                                <div className="flex p-0.5 bg-slate-50 rounded-lg border border-slate-100">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-primary/40 hover:text-primary hover:bg-white rounded-md transition-all"
                                        onClick={() => moveDocument(index, 'up')}
                                        disabled={index === 0}
                                    >
                                        <ArrowUp className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-primary/40 hover:text-primary hover:bg-white rounded-md transition-all"
                                        onClick={() => moveDocument(index, 'down')}
                                        disabled={index === documents.length - 1}
                                    >
                                        <ArrowDown className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all mt-1"
                                    onClick={() => removeDocument(index)}
                                >
                                    <Trash className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentListEditor;
