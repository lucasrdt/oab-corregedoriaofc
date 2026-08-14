import { useEffect, useRef } from "react";
import gsap from "gsap";

// Fluid mesh gradient sobre fundo branco: manchas translúcidas (Midnight Navy, Azul
// Institucional, vermelho da marca) que derivam devagar via GSAP — estética "SaaS clean"
// clara, mantendo a paleta oficial em vez do navy escuro usado antes neste Hero.
const HeroMeshBackground = () => {
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzMovimento) return;

    const ctx = gsap.context(() => {
      blobsRef.current.forEach((blob, i) => {
        if (!blob) return;
        gsap.to(blob, {
          x: () => gsap.utils.random(-80, 80),
          y: () => gsap.utils.random(-60, 60),
          scale: () => gsap.utils.random(0.92, 1.18),
          duration: 13 + i * 4,
          delay: i * 0.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const setBlobRef = (index: number) => (el: HTMLDivElement | null) => {
    blobsRef.current[index] = el;
  };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-white">
      <div
        ref={setBlobRef(0)}
        className="absolute -top-1/4 -left-1/5 h-[34rem] w-[34rem] rounded-full bg-[#1A2238] opacity-[0.10] blur-[130px]"
      />
      <div
        ref={setBlobRef(1)}
        className="absolute -top-1/3 right-0 h-[32rem] w-[32rem] rounded-full bg-[#1D4E89] opacity-[0.14] blur-[130px]"
      />
      <div
        ref={setBlobRef(2)}
        className="absolute bottom-0 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[#BC231A] opacity-[0.08] blur-[120px]"
      />
      <div
        ref={setBlobRef(3)}
        className="absolute -bottom-1/4 right-1/4 h-[26rem] w-[26rem] rounded-full bg-[#1A2238] opacity-[0.08] blur-[130px]"
      />
    </div>
  );
};

export default HeroMeshBackground;
