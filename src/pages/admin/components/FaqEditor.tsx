import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TemplateIvaldo } from '@/config/template-ivaldo';
import { Plus, Trash, ArrowUp, ArrowDown } from 'lucide-react';

interface FaqEditorProps {
    config: TemplateIvaldo;
    updateConfig: (path: string, value: any) => void;
}

const FaqEditor = ({ config, updateConfig }: FaqEditorProps) => {
    // Safely access content.faq, defaulting to empty array if undefined
    const faqs = config.content?.faq || [];

    const addFaq = () => {
        const newId = Math.max(...faqs.map(f => f.id), 0) + 1;
        const newFaq = {
            id: newId,
            question: '',
            answer: ''
        };
        updateConfig('content.faq', [...faqs, newFaq]);
    };

    const removeFaq = (index: number) => {
        const newFaqs = faqs.filter((_, i) => i !== index);
        updateConfig('content.faq', newFaqs);
    };

    const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        updateConfig('content.faq', newFaqs);
    };

    const moveFaq = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index > 0) {
            const newFaqs = [...faqs];
            [newFaqs[index], newFaqs[index - 1]] = [newFaqs[index - 1], newFaqs[index]];
            updateConfig('content.faq', newFaqs);
        } else if (direction === 'down' && index < faqs.length - 1) {
            const newFaqs = [...faqs];
            [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
            updateConfig('content.faq', newFaqs);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">Base de Conhecimento</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Gestão de Perguntas e Respostas Frequentes (FAQ)</p>
                </div>
                <Button 
                    onClick={addFaq} 
                    className="bg-primary hover:bg-primary/90 h-11 px-8 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                    <Plus className="h-4 w-4 mr-2" /> Nova Pergunta
                </Button>
            </div>

            <div className="space-y-8">
                {faqs.length === 0 ? (
                    <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <Plus className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <p className="font-black text-primary/30 uppercase tracking-[0.3em] text-xs">Nenhum Registro Encontrado</p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {faqs.map((faq, index) => (
                            <Card key={faq.id} className="group border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/10 transition-all rounded-[2.5rem] overflow-hidden bg-white">
                                <CardContent className="p-10 space-y-8">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 text-primary/40 font-black text-xs flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all italic">
                                                #{index + 1}
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em]">Item do FAQ</span>
                                                <h3 className="font-black text-primary uppercase tracking-tight text-lg leading-tight">Módulo de Resposta</h3>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                            <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-primary/40 hover:text-primary hover:bg-white rounded-lg transition-all"
                                                    onClick={() => moveFaq(index, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-primary/40 hover:text-primary hover:bg-white rounded-lg transition-all"
                                                    onClick={() => moveFaq(index, 'down')}
                                                    disabled={index === faqs.length - 1}
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                onClick={() => removeFaq(index)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-12 gap-10">
                                        <div className="md:col-span-12 space-y-8">
                                            <div className="grid gap-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Enunciado da Pergunta</Label>
                                                <Input
                                                    value={faq.question}
                                                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                                    placeholder="Ex: Como protocolar uma nova solicitação?"
                                                    className="h-14 bg-slate-50 border-slate-200 focus:bg-white rounded-2xl font-black text-primary shadow-inner"
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Resposta / Orientação Técnica</Label>
                                                <Textarea
                                                    value={faq.answer}
                                                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                                    placeholder="Descreva a solução ou esclarecimento..."
                                                    className="bg-slate-50 border-slate-200 focus:bg-white rounded-[2rem] font-medium shadow-inner resize-none min-h-[120px] p-6 leading-relaxed italic"
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
                                        <div className="h-px flex-1 bg-slate-200 mr-10" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">Redação Institucional</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FaqEditor;
