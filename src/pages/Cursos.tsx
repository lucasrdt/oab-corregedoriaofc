import { isPast, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookOpen, MapPin } from 'lucide-react';
import { useCourses, Course } from '@/hooks/useCourses';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function CourseCard({ course }: { course: Course }) {
  const past = isPast(parseISO(course.date));

  return (
    <div className={past ? 'opacity-50 grayscale' : undefined}>
      <Card className="h-full flex flex-col overflow-hidden">
        {/* Image */}
        <div className="aspect-video w-full overflow-hidden bg-muted flex items-center justify-center">
          {course.image_url ? (
            <img
              src={course.image_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        <CardContent className="flex flex-col gap-3 flex-1 p-5">
          <h3 className="text-lg font-semibold leading-snug">{course.title}</h3>

          {course.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {course.description}
            </p>
          )}

          <p className="text-sm font-medium">
            {format(parseISO(course.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </p>

          {(course.modality || course.location) && (
            <div className="flex items-start gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                {[course.modality, course.location].filter(Boolean).join(' — ')}
              </span>
            </div>
          )}

          {course.registration_link && (
            <div className="mt-auto pt-2">
              <Button asChild variant="outline" size="sm">
                <a
                  href={course.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Inscrever-se
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const Cursos = () => {
  const { data: courses, isLoading, isError } = useCourses();

  const upcoming = courses?.filter((c) => !isPast(parseISO(c.date))) ?? [];
  const past = courses?.filter((c) => isPast(parseISO(c.date))) ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Cursos e Eventos</h1>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-muted rounded-xl h-64"
              />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-destructive">
            Erro ao carregar cursos. Tente novamente mais tarde.
          </p>
        )}

        {!isLoading && !isError && courses?.length === 0 && (
          <p className="text-muted-foreground">
            Nenhum curso disponível no momento.
          </p>
        )}

        {!isLoading && !isError && courses && courses.length > 0 && (
          <>
            {upcoming.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6">Próximos Cursos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-6">Cursos Realizados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {past.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
    </div>
  );
};

export default Cursos;
