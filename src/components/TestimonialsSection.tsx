import { Card, CardContent, CardHeader } from "./ui/card";

const TESTIMONIALS = [
  {
    name: "Demo",
    role: "Medical Student, AIIMS Delhi",
    initials: "PS",
    accent: "bg-primary/20 text-primary",
    text: "I used to juggle 4 different apps for studying. Now everything — notes, flashcards, timers — lives in one place. My retention improved noticeably within the first week.",
  },
  {
    name: "Demo1",
    role: "CS Undergraduate, UCL",
    initials: "JO",
    accent: "bg-cyan-500/20 text-cyan-400",
    text: "The AI quiz generator is insane. I uploaded my lecture slides and had a 30-question practice test in under a minute. Aced my data structures exam.",
  },
  {
    name: "Demo2",
    role: "Bar Exam Prep, Mexico City",
    initials: "SR",
    accent: "bg-emerald-500/20 text-emerald-400",
    text: "Spaced repetition flashcards finally make sense when the system builds them from my own material. This tool gets out of your way and lets you study.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="scroll-mt-20 py-24 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            What students say
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
            Trusted by students
            <br />
            around the world
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardHeader>
                <div className="flex text-primary gap-0.5 text-sm mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div
                    className={`h-9 w-9 rounded-full ${t.accent} flex items-center justify-center text-xs font-bold`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none mb-1">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;