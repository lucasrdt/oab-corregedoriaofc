import { useState, useRef } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Loader2, Upload, X, Image as ImageIcon, Crop as CropIcon } from 'lucide-react';
import { toast } from 'sonner';

import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
    label?: string;
    bucket?: string;
    siteId?: string; // Permite passar o siteId diretamente (usado no painel admin)
    aspectRatio?: number; // Propor├º├úo do recorte (ex: 16/9)
}

// Utility para extrair a imagem cortada como um File
async function getCroppedImg(
    imageSrc: string,
    pixelCrop: any,
    fileName: string,
    scaleX: number = 1,
    scaleY: number = 1
): Promise<File | null> {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    const scaledWidth = pixelCrop.width * scaleX;
    const scaledHeight = pixelCrop.height * scaleY;

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        scaledWidth,
        scaledHeight,
        0,
        0,
        scaledWidth,
        scaledHeight
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                resolve(null);
                return;
            }
            const file = new File([blob], fileName, { type: 'image/jpeg' });
            resolve(file);
        }, 'image/jpeg', 0.95);
    });
}

export function ImageUpload({
    value,
    onChange,
    disabled,
    label = "Imagem",
    bucket = "site-assets",
    siteId: propSiteId,
    aspectRatio = 16 / 9, // Retangular por padr├úo
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { siteId: contextSiteId } = useSite();

    // Estados do Cropper
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [upImg, setUpImg] = useState<string>();
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<any>(null);
    const [originalFileParams, setOriginalFileParams] = useState<{ name: string; ext: string } | null>(null);

    // Prioriza a prop, depois contexto
    const activeSiteId = propSiteId || contextSiteId;

    if (!activeSiteId) {
        console.warn('[ImageUpload] activeSiteId is falsy ÔÇö uploads will go to "temp/" folder. Set VITE_SITE_ID in .env.local.');
    }

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            
            // Basic validation
            if (!file.type.startsWith('image/')) {
                toast.error("Formato inv├ílido", { description: "Por favor, selecione uma imagem." });
                return;
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB limit para poder carregar a original
                toast.error("Arquivo muito grande", { description: "A imagem original deve ter no m├íximo 10MB." });
                return;
            }

            const fileExt = file.name.split('.').pop() || 'jpg';
            setOriginalFileParams({ name: file.name, ext: fileExt });

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setUpImg(reader.result?.toString() || '');
                setCropModalOpen(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleUploadCropped = async () => {
        if (!completedCrop || !imgRef.current || !upImg || !originalFileParams) {
            toast.error("Erro no recorte", { description: "Fa├ºa o recorte da imagem primeiro." });
            return;
        }

        try {
            // Calcula a escala real da imagem em rela├º├úo ao tamanho exibido no Cropper
            const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
            const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

            // Pega o blob da imagem cortada
            const croppedFile = await getCroppedImg(upImg, completedCrop, originalFileParams.name, scaleX, scaleY);
            
            if (!croppedFile) {
                throw new Error("Falha ao gerar recorte da imagem");
            }

            // Usa activeSiteId para definir o caminho da pasta
            const fileName = `${activeSiteId || 'temp'}/${Math.random().toString(36).substring(2)}.jpg`; // Salva sempre como JPG
            
            setCropModalOpen(false); // Fecha o modal pra mostrar estado de "Enviando..." no bot├úo

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, croppedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            onChange(publicUrl);
            toast.success("Imagem enviada com sucesso!");

        } catch (error) {
            console.error('Upload error:', error);
            toast.error("Erro no upload", { description: "N├úo foi poss├¡vel enviar a imagem." });
            setCropModalOpen(true); // Reabre se deu erro
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className="space-y-4 w-full">
            <Label>{label}</Label>

            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative aspect-video w-40 rounded-lg overflow-hidden border bg-muted">
                        <img
                            src={value}
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />
                        <button
                            onClick={handleRemove}
                            disabled={disabled}
                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                            type="button"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ) : (
                    <div className="aspect-video w-40 rounded-lg border border-dashed flex items-center justify-center bg-muted/50 text-muted-foreground">
                        <ImageIcon className="h-8 w-8 opacity-50" />
                    </div>
                )}

                <div className="flex-1 space-y-2">
                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onSelectFile}
                        disabled={disabled || isUploading}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={disabled || isUploading}
                        onClick={() => {
                            // Reset state
                            setUpImg(undefined);
                            setCropModalOpen(false);
                            fileInputRef.current?.click();
                        }}
                        className="w-full sm:w-auto"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Carregar Imagem
                            </>
                        )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        JPG, PNG ou WEBP. A imagem ser├í recortada no envio.
                    </p>
                </div>
            </div>

            {/* Modal de Crop */}
            <Dialog 
                open={cropModalOpen} 
                onOpenChange={(open) => {
                    if (!open && !isUploading) {
                        setCropModalOpen(false);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }
                }}
            >
                <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl rounded-2xl overflow-hidden p-0">
                    <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50">
                        <DialogTitle className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-lg">
                            <CropIcon className="h-5 w-5 text-secondary" />
                            Ajustar Enquadramento
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground font-medium">Arraste e redimensione a ├írea delimitada para aplicar um recorte padronizado ├á foto.</p>
                    </DialogHeader>

                    <div className="p-6 flex justify-center bg-[#1a1a1a]">
                        {upImg && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspectRatio}
                                className="max-h-[50vh]"
                            >
                                <img 
                                    ref={imgRef} 
                                    alt="Crop me" 
                                    src={upImg} 
                                    className="max-h-[50vh] w-auto mx-auto border shadow-sm object-contain"
                                    onLoad={(e) => {
                                        // Definir recorte inicial centrado
                                        const { width, height } = e.currentTarget;
                                        const cropWidthInPercent = 80;
                                        const cropHeightInPercent = (cropWidthInPercent * aspectRatio * width) / height;
                                        
                                        // Apenas um recorte safe garantindo que inicialize dentro
                                        const w = Math.min(80, (height / aspectRatio / width) * 100);
                                        const h = w * (width / height) * (1 / aspectRatio);
                                        
                                        setCrop({
                                            unit: '%',
                                            width: 80,
                                            height: 80 / aspectRatio,
                                            x: 10,
                                            y: 10,
                                        });
                                    }}
                                />
                            </ReactCrop>
                        )}
                    </div>

                    <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                        <Button 
                            variant="ghost" 
                            onClick={() => {
                                setCropModalOpen(false);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleUploadCropped}
                            disabled={isUploading || !completedCrop?.width || !completedCrop?.height}
                            className="bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-widest px-6 h-10 transition-all rounded-lg shadow-lg shadow-primary/20"
                        >
                            {isUploading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando</>
                            ) : (
                                <><CropIcon className="w-4 h-4 mr-2" /> Cortar e Salvar</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
