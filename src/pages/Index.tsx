import Hero from "@/components/Hero";
import QuickAccess from "@/components/QuickAccess";
import QuemSomos from "@/components/QuemSomos";
import MostConsultedProcesses from "@/components/MostConsultedProcesses";
import CalendarSection from "@/components/CalendarSection";
import InfoCards from "@/components/InfoCards";
import Statistics from "@/components/Statistics";

/**
 * Ordem das seções — lógica de corregedoria:
 *
 * 1. Hero              → Banner institucional
 * 2. QuickAccess       → Acesso rápido a serviços e links
 * 3. QuemSomos         → Apresentação institucional (quem somos, missão)
 * 4. MostConsultedProcesses → Acesso rápido a processos (função principal)
 * 5. CalendarSection   → Agenda de assembleias (compromissos próximos)
 * 6. InfoCards         → Cards grandes informativos (Judicial, etc.)
 * 7. Statistics        → Mapa + subseções + números (atuação territorial)
 */
const Index = () => {
  return (
    <div className="space-y-0 pb-12">
      <Hero />
      <div className="space-y-16 mt-16">
        <QuemSomos />
        <QuickAccess />
        <MostConsultedProcesses />
        <CalendarSection />
        <InfoCards />
        <Statistics />
      </div>
    </div>
  );
};

export default Index;

