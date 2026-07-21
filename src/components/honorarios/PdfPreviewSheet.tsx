import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PDF_URL = "/Tabela_Honorarios_OABMA_2026_VisualLaw.pdf";

interface PdfPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mesmo padrão de primitivos Radix crus do DetalheItemSheet — o wrapper compartilhado em
// src/components/ui/sheet.tsx não permite a largura estendida (max-w-4xl) que essa
// pré-visualização de PDF precisa, e é um arquivo fora de /honorarios.
const PdfPreviewSheet = ({ open, onOpenChange }: PdfPreviewSheetProps) => (
  <SheetPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <SheetPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-border/60 bg-background shadow-2xl outline-none transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-4xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/50 px-6 py-4">
          <div className="min-w-0">
            <SheetPrimitive.Title className="font-heading text-base font-bold text-primary">
              Tabela Oficial de Honorários OAB-MA 2026
            </SheetPrimitive.Title>
            <SheetPrimitive.Description className="text-xs text-muted-foreground">
              Proposta Consolidada · Formato Visual Law — 31 áreas, 970 itens
            </SheetPrimitive.Description>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={PDF_URL} download>
                <Download className="h-4 w-4" />
                Baixar PDF
              </a>
            </Button>
            <SheetPrimitive.Close
              aria-label="Fechar"
              className="shrink-0 rounded-full p-1.5 text-muted-foreground opacity-80 transition-opacity hover:bg-muted hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <X className="h-4 w-4" />
            </SheetPrimitive.Close>
          </div>
        </div>

        <div className="flex-1 bg-muted/30">
          <object data={PDF_URL} type="application/pdf" className="h-full w-full">
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não foi possível exibir a pré-visualização do PDF neste navegador.
              </p>
              <Button asChild variant="outline" className="gap-2">
                <a href={PDF_URL} download>
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </a>
              </Button>
            </div>
          </object>
        </div>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  </SheetPrimitive.Root>
);

export default PdfPreviewSheet;
