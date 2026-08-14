import { useEffect, useRef, type ReactNode } from "react";
import { PenTool } from "lucide-react";
import gsap from "gsap";

interface CanetaDestaqueProps {
  children: ReactNode;
}

// Substitui o cursor laranja da referência por uma caneta-tinteiro: ao montar, ela
// "assina" a palavra (traço se desenha da esquerda pra direita) e se acomoda num balanço
// bem sutil, contínuo. prefers-reduced-motion pula direto pro estado final (traço cheio,
// caneta parada).
const CanetaDestaque = ({ children }: CanetaDestaqueProps) => {
  const underlineRef = useRef<HTMLSpanElement>(null);
  const penRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!underlineRef.current || !penRef.current) return;

    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzMovimento) {
      gsap.set(underlineRef.current, { scaleX: 1 });
      gsap.set(penRef.current, { opacity: 1, x: 0, y: 0, rotate: -10 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.fromTo(
        underlineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: "power2.out" },
      )
        .fromTo(
          penRef.current,
          { x: -22, y: 6, opacity: 0, rotate: -32 },
          { x: 0, y: 0, opacity: 1, rotate: -10, duration: 0.7, ease: "power2.out" },
          "<0.1",
        )
        .to(
          penRef.current,
          { y: -3, rotate: -6, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 },
          "+=0.2",
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <span className="relative inline-block">
      {children}
      <span
        ref={underlineRef}
        aria-hidden
        className="absolute inset-x-0 -bottom-1.5 h-[3px] origin-left rounded-full bg-gradient-to-r from-[#1D4E89]/10 via-[#1D4E89] to-[#1D4E89]/70"
        style={{ transform: "scaleX(0)" }}
      />
      <PenTool
        ref={penRef}
        aria-hidden
        style={{ opacity: 0 }}
        className="absolute -right-2 -top-3 h-4 w-4 text-[#1D4E89] drop-shadow-[0_0_6px_rgba(29,78,137,0.5)] sm:-right-3 sm:-top-4 sm:h-5 sm:w-5"
      />
    </span>
  );
};

export default CanetaDestaque;
