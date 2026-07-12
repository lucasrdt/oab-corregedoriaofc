import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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

interface CalendarSectionProps {
  allowNotes?: boolean;
  subsectionId?: string | null;
}

const CalendarSection = ({ allowNotes = false, subsectionId = null }: CalendarSectionProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedAssembly, setSelectedAssembly] = useState<Assembly | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  // Notes & Reminders States
  const [notes, setNotes] = useState<Record<string, { id: string; content: string }>>({});
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchNotes = async () => {
    if (!subsectionId) return;
    setLoadingNotes(true);
    try {
      const { data, error } = await supabase
        .from('calendar_notes')
        .select('id, date, content')
        .eq('subsection_id', subsectionId);
      
      if (error) throw error;
      
      const notesMap: Record<string, { id: string; content: string }> = {};
      data?.forEach(note => {
        notesMap[note.date] = { id: note.id, content: note.content };
      });
      setNotes(notesMap);
    } catch (err) {
      console.error('Error fetching calendar notes:', err);
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    if (allowNotes && subsectionId) {
      fetchNotes();
    }
  }, [allowNotes, subsectionId, currentMonth, currentYear]);

  const getDateKey = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${currentYear}-${monthStr}-${dayStr}`;
  };

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
                  const dateKey = day ? getDateKey(day) : '';
                  const hasNote = day && notes[dateKey];

                  const isSelected = selectedDay === day;

                  const handleClick = () => {
                    if (!day) return;
                    if (allowNotes) {
                      setSelectedDay(day);
                      setNoteContent(notes[dateKey]?.content || '');
                    } else if (event) {
                      setSelectedAssembly(event);
                    }
                  };

                  return (
                    <div
                      key={idx}
                      onClick={handleClick}
                      className={`
                        relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all duration-300 ease-out
                        ${!day ? 'opacity-0 pointer-events-none' : 'border border-slate-200 bg-slate-50/20'}
                        ${day && (allowNotes || !event) ? 'hover:bg-muted/50 text-foreground/70 cursor-pointer' : ''}
                        ${active ? 'bg-secondary/20 text-secondary border-secondary/30 font-bold' : ''}
                        ${event ? 'bg-primary text-primary-foreground font-bold shadow-md hover:shadow-lg hover:-translate-y-1 cursor-pointer scale-95' : ''}
                        ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-95 shadow-md border-2 border-primary z-10' : ''}
                      `}
                    >
                      {day}
                      {event && (
                        <div className={`absolute bottom-1 w-1 h-1 rounded-full ${event ? 'bg-white' : 'bg-primary'}`}></div>
                      )}
                      {hasNote && (
                        <div className={`w-5 h-[3px] rounded-full mt-1 ${event ? 'bg-white' : 'bg-primary'}`} title="Tem anotação/lembrete"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event List / Day Details */}
            <div className="lg:col-span-4 space-y-4">
              {allowNotes && selectedDay ? (
                <div className="bg-card rounded-lg border border-border/50 shadow-sm p-6 space-y-6 animate-fade-in">
                  {(() => {
                    const dateKey = getDateKey(selectedDay);
                    const event = hasEvent(selectedDay);
                    const dateObj = new Date(currentYear, currentMonth, selectedDay);
                    const formattedDate = format(dateObj, "dd 'de' MMMM", { locale: pt });

                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                          <h3 className="text-primary font-black text-lg uppercase tracking-tight flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-secondary" /> {formattedDate}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary p-0 h-auto"
                            onClick={() => setSelectedDay(null)}
                          >
                            ← Ver Mês
                          </Button>
                        </div>

                        {/* Assembly Info if exists */}
                        {event && (
                          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
                                {event.status}
                              </span>
                            </div>
                            <h4 className="font-black text-primary text-xs leading-tight">
                              {event.companyName}
                            </h4>
                            <div className="flex flex-col gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.accessTime}</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-8 text-[9px] font-black uppercase tracking-widest border-secondary/30 text-secondary hover:bg-secondary/10"
                              onClick={() => window.open(event.meetingLink, '_blank')}
                            >
                              Acessar Reunião <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        )}

                        {/* Notes Form */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-primary uppercase tracking-widest block">
                            Anotações e Lembretes
                          </label>
                          <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Escreva lembretes para este dia..."
                            rows={6}
                            className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400 font-medium resize-none text-slate-800 bg-slate-50"
                          />
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          {notes[dateKey] && (
                            <Button
                              type="button"
                              variant="destructive"
                              className="flex-1 text-[10px] font-black uppercase tracking-widest h-9"
                              onClick={() => setShowDeleteConfirm(true)}
                              disabled={isSavingNote}
                            >
                              Excluir
                            </Button>
                          )}
                          <Button
                            type="button"
                            onClick={async () => {
                              if (!noteContent.trim()) {
                                toast.error('Escreva algo para salvar.');
                                return;
                              }
                              setIsSavingNote(true);
                              try {
                                const existingNote = notes[dateKey];
                                if (existingNote) {
                                  const { error } = await supabase
                                    .from('calendar_notes')
                                    .update({ content: noteContent })
                                    .eq('id', existingNote.id);
                                  if (error) throw error;
                                } else {
                                  const { error } = await supabase
                                    .from('calendar_notes')
                                    .insert({
                                      subsection_id: subsectionId,
                                      date: dateKey,
                                      content: noteContent,
                                    });
                                  if (error) throw error;
                                }
                                toast.success('Anotação salva!');
                                await fetchNotes();
                              } catch (err: any) {
                                toast.error('Erro ao salvar.');
                              } finally {
                                setIsSavingNote(false);
                              }
                            }}
                            disabled={isSavingNote}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white font-black text-[10px] tracking-widest uppercase h-9"
                          >
                            {isSavingNote ? 'Salvando...' : 'Salvar'}
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
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
                            onClick={() => {
                              if (allowNotes) {
                                setSelectedDay(date.getDate());
                                setNoteContent(notes[getDateKey(date.getDate())]?.content || '');
                              } else {
                                setSelectedAssembly(assembly);
                              }
                            }}
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
              )}
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

      {/* Reusable Confirm Delete Annotation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md border-none shadow-2xl overflow-hidden p-0 bg-white">
          <DialogHeader className="bg-red-600 p-6 text-white border-b border-red-700">
            <DialogTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Info className="h-4 w-4 text-white" /> Confirmar Exclusão
            </DialogTitle>
            <span className="sr-only">Confirme a exclusão do lembrete</span>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Tem certeza de que deseja excluir permanentemente esta anotação/lembrete?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] px-6 h-10 shadow-lg shadow-red-600/10 transition-all active:scale-95"
                onClick={async () => {
                  if (selectedDay) {
                    const dateKey = getDateKey(selectedDay);
                    const noteId = notes[dateKey]?.id;
                    if (noteId) {
                      setIsSavingNote(true);
                      try {
                        const { error } = await supabase
                          .from('calendar_notes')
                          .delete()
                          .eq('id', noteId);
                        if (error) throw error;
                        toast.success('Anotação excluída.');
                        await fetchNotes();
                        setNoteContent('');
                        setShowDeleteConfirm(false);
                      } catch (err) {
                        toast.error('Erro ao excluir.');
                      } finally {
                        setIsSavingNote(false);
                      }
                    }
                  }
                }}
              >
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarSection;
