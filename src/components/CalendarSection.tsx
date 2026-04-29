import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useSite } from "@/contexts/SiteContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Assembly {
  id: number;
  date: Date | string;
  companyName: string;
  fullCompanyName: string;
  convocation: string;
  description: string;
  meetingLink: string;
  accessTime: string;
  status: string;
}

const CalendarSection = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedAssembly, setSelectedAssembly] = useState<Assembly | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  const { config } = useSite();
  const { content } = config;
  const assemblies: Assembly[] = content.assemblies;

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const currentMonthAssemblies = assemblies.filter(assembly => {
    const assemblyDate = new Date(assembly.date);
    return assemblyDate.getMonth() === currentMonth && assemblyDate.getFullYear() === currentYear;
  });

  const hasEvent = (day: number) => {
    return currentMonthAssemblies.find(assembly => {
      const assemblyDate = new Date(assembly.date);
      return assemblyDate.getDate() === day;
    });
  };

  const today = new Date();
  const isToday = (day: number) => 
    today.getDate() === day && 
    today.getMonth() === currentMonth && 
    today.getFullYear() === currentYear;

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <>
      <section ref={ref} className={`scroll-fade-in ${isVisible ? 'visible' : ''}`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-primary font-bold text-3xl md:text-4xl">Calendário de Assembleias</h2>
              <p className="text-muted-foreground mt-2">Acompanhe as reuniões e decisões importantes em tempo real.</p>
            </div>
            <div className="flex items-center gap-4 bg-card p-1 rounded-lg border border-border shadow-sm">
              <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-bold text-primary min-w-[140px] text-center">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Calendar Grid */}
            <div className="lg:col-span-8 bg-card rounded-lg border border-border/50 shadow-sm p-6 overflow-hidden">
              <div className="grid grid-cols-7 gap-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div key={day} className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest pb-4">
                    {day}
                  </div>
                ))}
                {days.map((day, idx) => {
                  const event = day ? hasEvent(day) : null;
                  const active = day && isToday(day);

                  return (
                    <div
                      key={idx}
                      onClick={() => event && setSelectedAssembly(event)}
                      className={`
                        relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all duration-300
                        ${!day ? 'opacity-0' : 'border border-transparent'}
                        ${day && !event ? 'hover:bg-muted/50 text-foreground/70' : ''}
                        ${active ? 'bg-secondary/20 text-secondary border-secondary/30 font-bold' : ''}
                        ${event ? 'bg-primary text-primary-foreground font-bold shadow-md hover:shadow-lg hover:-translate-y-1 cursor-pointer scale-95' : ''}
                      `}
                    >
                      {day}
                      {event && (
                        <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-card rounded-lg border border-border/50 shadow-sm p-6">
                <h3 className="text-primary font-bold text-lg mb-6 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" /> Agendadas para {monthNames[currentMonth]}
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {currentMonthAssemblies.length > 0 ? (
                    currentMonthAssemblies.map((assembly) => {
                      const date = new Date(assembly.date);
                      return (
                        <div
                          key={assembly.id}
                          onClick={() => setSelectedAssembly(assembly)}
                          className="group p-4 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-card hover:shadow-sm transition-all cursor-pointer"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 text-primary w-10 h-10 rounded flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                              <span className="text-[10px] font-bold uppercase leading-none">{format(date, "MMM", { locale: pt })}</span>
                              <span className="text-lg font-black leading-none">{date.getDate()}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                                {assembly.companyName}
                              </h4>
                              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {assembly.accessTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarIcon className="h-6 w-6 opacity-20" />
                      </div>
                      <p className="text-sm">Nenhuma assembleia este mês.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assembly Modal */}
      <Dialog open={!!selectedAssembly} onOpenChange={() => setSelectedAssembly(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
          <span className="sr-only">Visualize os detalhes da assembleia ou reunião agendada</span>
          {selectedAssembly && (
            <div className="flex flex-col">
              {/* Header with high visual impact */}
              <div className="bg-primary p-8 md:p-12 text-primary-foreground relative">
                <div className="absolute top-4 right-4 bg-white/10 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                  {selectedAssembly.status}
                </div>
                <h3 className="text-white bg-white/10 w-fit px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                  {selectedAssembly.convocation}
                </h3>
                <DialogTitle className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  {selectedAssembly.fullCompanyName}
                </DialogTitle>
                <div className="flex flex-wrap gap-6 mt-8">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-secondary" />
                    <span className="font-bold text-lg">{format(new Date(selectedAssembly.date), "dd 'de' MMMM", { locale: pt })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-secondary" />
                    <span className="font-bold text-lg">{selectedAssembly.accessTime}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 md:p-12 space-y-8 bg-card">
                <div className="p-6 bg-muted/30 rounded-lg border border-border/50 text-muted-foreground leading-relaxed text-sm italic">
                  <Info className="h-5 w-5 text-primary mb-3" />
                  {selectedAssembly.description}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => window.open(selectedAssembly.meetingLink, '_blank')}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-md"
                  >
                    ACESSAR REUNIÃO <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setSelectedAssembly(null)}
                    variant="outline"
                    className="flex-1 h-12 border-border/50 font-bold"
                  >
                    FECHAR
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarSection;
