import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useSite } from "@/contexts/SiteContext";
import { ChevronRight, Phone, Mail, MapPin, Send, ExternalLink, MessageSquare, Shield, Search, Ear, Scale, Upload, X, FileText, Loader2, Paperclip, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = { Shield, Search, Ear, Scale };

const DEFAULT_CHANNELS = [
  { id: "prerrogativas", title: "Prerrogativas", iconName: "Shield", desc: "Denuncie violações ao exercício profissional.", channels: [{ type: "E-mail", val: "prerrogativas@oabma.org.br" }, { type: "Plantão", val: "(98) 99202-0000" }] },
  { id: "fiscalizacao",  title: "Fiscalização",  iconName: "Search", desc: "Comunique irregularidades e exercício ilegal.",  channels: [{ type: "E-mail", val: "fiscalizacao@oabma.org.br" }, { type: "WhatsApp", val: "(98) 98116-0000" }] },
  { id: "ouvidoria",     title: "Ouvidoria",     iconName: "Ear",    desc: "Elogios, sugestões ou reclamações institucionais.", channels: [{ type: "E-mail", val: "ouvidoria@oabma.org.br" }, { type: "Telefone", val: "(98) 2107-5400" }] },
  { id: "ted",           title: "TED",           iconName: "Scale",  desc: "Representações ético-disciplinares.",             channels: [{ type: "E-mail", val: "ted@oabma.org.br" }, { type: "Secretaria", val: "(98) 2107-5421" }] },
];
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB por arquivo
const MAX_FILES = 10;

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

const Contato = () => {
  const { toast } = useToast();
  const { config } = useSite();
  const { content } = config;
  const { ref, isVisible } = useScrollAnimation();

  const { siteId } = useSite();
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_FILES - attachments.length;
    if (remainingSlots <= 0) {
      toast({
        title: "Limite atingido",
        description: `Máximo de ${MAX_FILES} arquivos permitidos.`,
        variant: "destructive"
      });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    // Validate files
    for (const file of filesToUpload) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Arquivo muito grande",
          description: `"${file.name}" excede o limite de 15MB.`,
          variant: "destructive"
        });
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Formato não suportado",
          description: `"${file.name}" — Use PDF, PNG, JPG, DOC, DOCX, XLS ou XLSX.`,
          variant: "destructive"
        });
        return;
      }
    }

    setUploadingFiles(true);
    const newAttachments: UploadedFile[] = [];

    try {
      for (const file of filesToUpload) {
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
        const storagePath = `denuncias/${Date.now()}_${cleanName}`;

        const { error } = await supabase.storage
          .from('site-assets')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(storagePath);

        newAttachments.push({
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type
        });
      }

      setAttachments(prev => [...prev, ...newAttachments]);
      toast({
        title: "Arquivos anexados",
        description: `${newAttachments.length} arquivo(s) carregado(s) com sucesso.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar um ou mais arquivos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploadingFiles(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!siteId) {
      toast({
        title: "Erro",
        description: "Não foi possível identificar o site para envio.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          site_id: siteId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          read: false,
          attachments: attachments.length > 0 ? attachments : null
        }]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground gap-2">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary">Fale Conosco</span>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-primary leading-tight">
          Estamos aqui para ajudar.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg font-medium">
          Caso tenha dúvidas sobre algum processo ou necessite de informações institucionais, selecione um canal abaixo.
        </p>
      </div>

      {/* Canais de Denúncia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-6 duration-700">
        {((content as any).contactChannels || DEFAULT_CHANNELS).map((canal: typeof DEFAULT_CHANNELS[0]) => {
          const IconComponent = ICON_MAP[canal.iconName] || Shield;
          return (
          <div
            key={canal.id}
            id={canal.id}
            className="group scroll-mt-24 bg-white border border-border/50 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-default flex flex-col h-full"
          >
            <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
              <IconComponent className="h-6 w-6 text-primary group-hover:text-white" />
            </div>
            <h3 className="font-bold text-primary mb-2 uppercase tracking-tight text-sm">{canal.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-grow">
              {canal.desc}
            </p>
            <div className="space-y-2 mt-auto pt-4 border-t border-border/40">
              {canal.channels.map((ch, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-muted-foreground/60">{ch.type}</span>
                  <span className="text-xs font-bold text-primary">{ch.val}</span>
                </div>
              ))}
            </div>
            <Button variant="link" className="p-0 mt-4 h-auto text-[10px] font-bold uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors justify-start" asChild>
              <a href="#contato-form">Enviar Mensagem <ChevronRight className="ml-1 h-3 w-3" /></a>
            </Button>
          </div>
        ); })}
      </div>

      <div id="contato-form" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Form Card */}
        <div className="lg:col-span-2 bg-card border border-border/50 rounded-lg p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-primary uppercase tracking-tight">Envie sua mensagem</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome Completo</label>
              <Input
                required
                name="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
                className="bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail</label>
              <Input
                required
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Telefone</label>
              <Input
                required
                type="tel"
                name="phone"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={handleChange}
                className="bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assunto</label>
              <Input
                required
                name="subject"
                placeholder="Qual o motivo do contato?"
                value={formData.subject}
                onChange={handleChange}
                className="bg-muted/30 border-none focus:ring-2 focus:ring-primary h-12"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sua Mensagem</label>
              <Textarea
                required
                name="message"
                placeholder="Descreva sua dúvida ou solicitação..."
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="bg-muted/30 border-none focus:ring-2 focus:ring-primary p-4"
              />
            </div>

            {/* Seção de Anexos */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <Paperclip className="h-3 w-3" />
                  Anexar Documentos
                  <span className="text-muted-foreground/40 font-medium normal-case tracking-normal">
                    ({attachments.length}/{MAX_FILES})
                  </span>
                </label>
              </div>
              
              {/* Área de upload */}
              <div 
                className="relative border-2 border-dashed border-primary/15 hover:border-primary/30 rounded-xl p-6 transition-all cursor-pointer bg-muted/20 hover:bg-muted/30 group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileSelect}
                  disabled={uploadingFiles || attachments.length >= MAX_FILES}
                />
                <div className="flex flex-col items-center gap-3 text-center">
                  {uploadingFiles ? (
                    <>
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      <p className="text-sm font-bold text-primary">Enviando arquivos...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <Upload className="h-6 w-6 text-primary/40 group-hover:text-primary/60 transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary/60">
                          Clique para selecionar arquivos
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          PDF, PNG, JPG, DOC, DOCX, XLS, XLSX — Máx. 15MB cada — Até {MAX_FILES} arquivos
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Lista de arquivos anexados */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white border border-border/50 rounded-lg group/file hover:border-primary/20 transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-primary/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-primary truncate">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover/file:opacity-100"
                        title="Remover anexo"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 pt-4">
              <Button type="submit" disabled={loading || uploadingFiles} className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-[0.98]">
                {loading ? 'ENVIANDO...' : (
                  <>ENVIAR MENSAGEM <Send className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          {/* Phone & Email */}
          <div className="bg-primary p-8 rounded-lg shadow-lg text-primary-foreground space-y-8">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Phone className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Telefone</p>
                  <a href={`tel:${content.phoneClean}`} className="text-xl font-black hover:text-secondary transition-colors">
                    {content.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start pt-6 border-t border-white/10">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Mail className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">E-mail</p>
                  <a href={`mailto:${content.email}`} className="text-lg font-black hover:text-secondary transition-colors break-all">
                    {content.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-card border border-border/50 rounded-lg p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-primary uppercase tracking-tight">Localização</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground font-medium leading-relaxed">
                {content.addresses[0]?.street}, {content.addresses[0]?.number}<br />
                {content.addresses[0]?.complement && <>{content.addresses[0]?.complement}<br /></>}
                {content.addresses[0]?.neighborhood}<br />
                {content.addresses[0]?.city} - {content.addresses[0]?.state}<br />
                CEP: {content.addresses[0]?.zip}
              </p>
              
              <Button variant="outline" className="w-full border-primary/20 text-primary font-black text-[10px] tracking-widest uppercase hover:bg-primary/5 h-11" asChild>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${content.addresses[0]?.street}, ${content.addresses[0]?.city}`)}`} target="_blank" rel="noopener noreferrer">
                  VER NO MAPA <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;
