import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, Edit, FileText, Settings, X, Maximize2 } from 'lucide-react';
import { TemplateIvaldo } from '@/config/template-ivaldo';
import { ImageUpload } from '@/components/ui/image-upload';
import { formatDate } from '@/utils/formatDate';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ArticlesEditorProps {
    config: TemplateIvaldo;
    updateConfig: (path: string, value: any) => void;
    siteId?: string;
}

const ArticlesEditor = ({ config, updateConfig, siteId }: ArticlesEditorProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<{ id: number, title: string } | null>(null);
    const [excerptValue, setExcerptValue] = useState<string>('');
    const [contentValue, setContentValue] = useState<string>('');
    const [expandedField, setExpandedField] = useState<null | 'excerpt' | 'content'>(null);

    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link'],
        ],
    };

    const quillFormats = [
        'bold',
        'italic',
        'underline',
        'list',
        'bullet',
        'align',
        'link',
    ];

    useEffect(() => {
        if (editingArticle) {
            setExcerptValue(editingArticle.excerpt || '');
            setContentValue(editingArticle.content || '');
        } else {
            setExcerptValue('');
            setContentValue('');
        }
    }, [editingArticle]);

    const handleSaveArticle = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const title = formData.get('title') as string;
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

        const newArticle = {
            id: editingArticle ? editingArticle.id : Date.now(),
            title: title,
            excerpt: excerptValue,
            content: contentValue,
            category: formData.get('category') as string,
            date: formData.get('date') as string,
            image: imageUrl,
            slug: editingArticle?.slug || slug,
        };

        let newArticles = [...(config.content.articles || [])];
        if (editingArticle) {
            newArticles = newArticles.map(a => a.id === editingArticle.id ? newArticle : a);
        } else {
            newArticles.push(newArticle);
        }

        updateConfig('content.articles', newArticles);
        setIsDialogOpen(false);
        setEditingArticle(null);
        setImageUrl('');
        setExpandedField(null);
    };

    const handleDeleteArticle = (id: number) => {
        if (confirm('Tem certeza que deseja remover este artigo?')) {
            const newArticles = (config.content.articles || []).filter(a => a.id !== id);
            updateConfig('content.articles', newArticles);
        }
    };

    const openEditDialog = (article: any) => {
        setEditingArticle(article);
        setImageUrl(article.image || '');
        setIsDialogOpen(true);
    };

    const filteredArticles = selectedCategory
        ? (config.content.articles || []).filter(a => a.category === selectedCategory)
        : (config.content.articles || []);

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">Acervo de Notícias</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gestão de Conteúdo e Publicações Institucionais</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <Dialog open={isCategoryManagerOpen} onOpenChange={setIsCategoryManagerOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-11 px-6 border-primary/10 font-black text-[10px] tracking-widest uppercase rounded-xl hover:bg-primary/5">
                                <Settings className="mr-2 h-4 w-4" /> Categorias
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md bg-white rounded-3xl border-none shadow-2xl p-8">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black text-primary uppercase">Gestão de Editorias</DialogTitle>
                                <span className="sr-only">Gerencie as categorias e editorias das notícias</span>
                            </DialogHeader>
                            <div className="space-y-6 pt-6">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Nova Categoria..."
                                        id="new-category-input"
                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const input = e.currentTarget;
                                                const val = input.value.trim();
                                                if (val) {
                                                    const categories = config.content.newsCategories || [];
                                                    const validCategories = categories.filter(c => c && c.id != null);
                                                    const newId = validCategories.length > 0 ? Math.max(...validCategories.map(c => c.id), 0) + 1 : 1;
                                                    updateConfig('content.newsCategories', [...config.content.newsCategories, { id: newId, title: val }]);
                                                    input.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <Button 
                                        onClick={() => {
                                            const input = document.getElementById('new-category-input') as HTMLInputElement;
                                            const val = input.value.trim();
                                            if (val) {
                                                const categories = config.content.newsCategories || [];
                                                const validCategories = categories.filter(c => c && c.id != null);
                                                const newId = validCategories.length > 0 ? Math.max(...validCategories.map(c => c.id), 0) + 1 : 1;
                                                updateConfig('content.newsCategories', [...config.content.newsCategories, { id: newId, title: val }]);
                                                input.value = '';
                                            }
                                        }}
                                        className="bg-primary h-12 px-6 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-primary/20"
                                    >Adicionar</Button>
                                </div>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {(config.content.newsCategories || []).filter(cat => cat && cat.id != null).map((cat) => (
                                        <div key={cat.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                                            {editingCategory?.id === cat.id ? (
                                                <div className="flex gap-2 w-full">
                                                    <Input
                                                        value={editingCategory.title}
                                                        onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                                                        autoFocus
                                                        className="h-10 font-bold"
                                                    />
                                                    <Button size="sm" onClick={() => {
                                                        const newCats = config.content.newsCategories.map(c =>
                                                            c.id === cat.id ? { ...c, title: editingCategory.title } : c
                                                        );
                                                        updateConfig('content.newsCategories', newCats);
                                                        setEditingCategory(null);
                                                    }} className="bg-primary font-bold text-[10px] uppercase h-10 px-4 rounded-lg">OK</Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-xs font-black text-primary uppercase italic">{cat.title}</span>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-primary/40 hover:text-primary"
                                                            onClick={() => setEditingCategory({ id: cat.id, title: cat.title })}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-300 hover:text-red-500 hover:bg-red-50"
                                                            onClick={() => {
                                                                if (confirm('Remover categoria?')) {
                                                                    const newCats = config.content.newsCategories.filter(c => c.id !== cat.id);
                                                                    updateConfig('content.newsCategories', newCats);
                                                                }
                                                            }}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setExpandedField(null);
                    }}>
                        <DialogTrigger asChild>
                            <Button 
                                onClick={() => { setEditingArticle(null); setImageUrl(''); }}
                                className="bg-primary hover:bg-primary/90 h-11 px-8 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Novo Artigo
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-h-[92vh]">
                            <div className="flex h-full flex-col">
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tight">
                                            {editingArticle ? 'Editar Conteúdo' : 'Nova Publicação'}
                                        </DialogTitle>
                                        <span className="sr-only">Crie ou edite o conteúdo do artigo institucional</span>
                                    </DialogHeader>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-secondary text-primary text-[10px] font-black uppercase rounded-full tracking-tighter shadow-sm">Rascunho Automático</span>
                                    </div>
                                </div>
                                <form onSubmit={handleSaveArticle} className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-10">
                                    <div className="grid lg:grid-cols-12 gap-10">
                                        <div className="lg:col-span-8 space-y-8">
                                            <div className="grid gap-3">
                                                <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Título da Manchete</Label>
                                                <Input 
                                                    id="title" 
                                                    name="title" 
                                                    defaultValue={editingArticle?.title} 
                                                    required 
                                                    className="h-14 bg-slate-50 border-slate-200 focus:bg-white rounded-2xl text-lg font-black text-primary shadow-inner"
                                                />
                                            </div>

                                            <div className="grid lg:grid-cols-2 gap-6">
                                                <div className="grid gap-3">
                                                    <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Escolher Editoria</Label>
                                                    <Select name="category" defaultValue={editingArticle?.category || (config.content.newsCategories[0]?.title || "")}>
                                                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold">
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                            {(config.content.newsCategories || []).filter(cat => cat && cat.title).map(cat => (
                                                                <SelectItem key={cat.id} value={cat.title} className="font-bold py-3 uppercase text-[10px] tracking-widest">{cat.title}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Data de Publicação</Label>
                                                    <Input 
                                                        id="date" 
                                                        name="date" 
                                                        type="date" 
                                                        defaultValue={editingArticle?.date} 
                                                        required 
                                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl font-black text-center"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-3 group">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="excerpt" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Resumo (Lide)</Label>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 text-[9px] font-black uppercase tracking-widest text-secondary-foreground"
                                                        onClick={() => setExpandedField(expandedField === 'excerpt' ? null : 'excerpt')}
                                                    >
                                                        {expandedField === 'excerpt' ? 'Fechar' : 'Expandir'}
                                                    </Button>
                                                </div>
                                                <div className={`transition-all ${expandedField === 'excerpt' ? 'fixed inset-4 z-50 bg-white p-8 rounded-[2.5rem] shadow-2xl overflow-y-auto' : ''}`}>
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={excerptValue}
                                                        onChange={setExcerptValue}
                                                        modules={quillModules}
                                                        formats={quillFormats}
                                                        className="bg-slate-50 rounded-2xl overflow-hidden shadow-inner min-h-[120px]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-3">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Corpo da Matéria</Label>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 text-[9px] font-black uppercase tracking-widest text-secondary-foreground"
                                                        onClick={() => setExpandedField(expandedField === 'content' ? null : 'content')}
                                                    >
                                                        {expandedField === 'content' ? 'Fechar' : 'Expandir'}
                                                    </Button>
                                                </div>
                                                <div className={`transition-all ${expandedField === 'content' ? 'fixed inset-4 z-50 bg-white p-8 rounded-[2.5rem] shadow-2xl overflow-y-auto' : ''}`}>
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={contentValue}
                                                        onChange={setContentValue}
                                                        modules={quillModules}
                                                        formats={quillFormats}
                                                        className="bg-slate-50 rounded-2xl overflow-hidden shadow-inner min-h-[300px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-4 space-y-6">
                                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm space-y-6 sticky top-0">
                                                <div className="grid gap-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 text-center">Imagem de Capa</Label>
                                                    <ImageUpload
                                                        siteId={siteId}
                                                        label=""
                                                        value={imageUrl}
                                                        onChange={setImageUrl}
                                                    />
                                                </div>
                                                
                                                <div className="p-4 bg-white rounded-2xl border border-slate-200">
                                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-primary/40 mb-3">Dicas de SEO</h4>
                                                    <ul className="text-[10px] text-muted-foreground space-y-2 font-medium italic">
                                                        <li>• Use títulos diretos e impactantes</li>
                                                        <li>• Adicione meta-descrições no lide</li>
                                                        <li>• Otimize as imagens antes de subir</li>
                                                    </ul>
                                                </div>
                                            </div>
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
                                        >Publicar Agora</Button>
                                    </div>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 pb-4">
                <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className={`rounded-full px-6 h-9 font-black text-[10px] uppercase tracking-widest transition-all ${
                        selectedCategory === null ? 'bg-primary text-secondary shadow-lg shadow-primary/20' : 'border-primary/10 text-primary/60 hover:text-primary hover:border-primary/30'
                    }`}
                >
                    Todos
                </Button>
                {(config.content.newsCategories || []).filter(cat => cat && cat.id != null).map((cat) => (
                    <Button
                        key={cat.id}
                        variant={selectedCategory === cat.title ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(cat.title)}
                        className={`rounded-full px-6 h-9 font-black text-[10px] uppercase tracking-widest transition-all ${
                            selectedCategory === cat.title ? 'bg-primary text-secondary shadow-lg shadow-primary/20' : 'border-primary/10 text-primary/60 hover:text-primary hover:border-primary/30'
                        }`}
                    >
                        {cat.title}
                    </Button>
                ))}
            </div>

            <div className="grid gap-6">
                {filteredArticles.length === 0 ? (
                    <div className="text-center py-20 px-6 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                        <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="font-black text-primary/40 uppercase tracking-widest text-xs italic">Nenhuma notícia encontrada nesta categoria.</p>
                    </div>
                ) : (
                    filteredArticles.map((article) => (
                        <Card key={article.id} className="group border-border/50 shadow-sm hover:shadow-2xl hover:border-primary/10 transition-all rounded-[1.5rem] overflow-hidden bg-card cursor-default">
                            <CardContent className="p-0 flex flex-col md:flex-row">
                                <div className="h-48 md:w-64 md:h-auto bg-slate-100 flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                    {article.image ? (
                                        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-300">
                                            <FileText className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex-1 p-8 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-primary bg-secondary px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                                    {article.category}
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">{formatDate(article.date)}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    onClick={() => openEditDialog(article)}
                                                    className="w-10 h-10 border-primary/10 rounded-xl text-primary/40 hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    onClick={() => handleDeleteArticle(article.id)}
                                                    className="w-10 h-10 border-red-100 bg-red-50/20 text-red-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl shadow-sm"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-primary uppercase tracking-tight leading-tight group-hover:text-secondary-foreground transition-colors cursor-pointer" onClick={() => openEditDialog(article)}>{article.title}</h3>
                                            <div 
                                                className="text-sm text-muted-foreground font-medium italic line-clamp-2 leading-relaxed opacity-80"
                                                dangerouslySetInnerHTML={{ __html: article.excerpt }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-6 border-t border-slate-50 mt-6 group/link cursor-pointer" onClick={() => openEditDialog(article)}>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary group-hover/link:underline">Editar Documentação</span>
                                        <Plus className="w-3 h-3 text-primary group-hover/link:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ArticlesEditor;
