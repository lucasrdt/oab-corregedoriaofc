import { cn } from "@/lib/utils";

// Recriado localmente a partir do padrão do Kbd da HeroUI (@heroui/react), sem instalar a
// lib — instalar exigiria envolver a aplicação inteira num <HeroUIProvider> fora de
// /honorarios, só pra um componente de atalho de teclado.
const SIMBOLOS: Record<string, string> = {
  command: "⌘",
  cmd: "⌘",
  shift: "⇧",
  ctrl: "⌃",
  control: "⌃",
  option: "⌥",
  alt: "⌥",
  enter: "⏎",
  return: "⏎",
  escape: "⎋",
  esc: "⎋",
  tab: "⇥",
  delete: "⌫",
  backspace: "⌫",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

interface KbdProps {
  /** Nomes semânticos ("command", "shift"...) viram símbolo; qualquer outro valor é exibido em maiúsculas. */
  keys: string[];
  className?: string;
}

const Kbd = ({ keys, className }: KbdProps) => (
  <kbd
    className={cn(
      "inline-flex shrink-0 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground",
      className,
    )}
  >
    {keys.map((k) => SIMBOLOS[k.toLowerCase()] ?? k.toUpperCase()).join("")}
  </kbd>
);

export default Kbd;
