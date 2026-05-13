import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

const FEATURES = [
  {
    icon: "✦",
    title: "AI Summaries",
    desc: "Paste any text or upload a PDF — get a clean, structured summary in seconds.",
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: "◈",
    title: "Smart Flashcards",
    desc: "Auto-generate flashcards from your notes with spaced-repetition built in.",
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: "◎",
    title: "Quiz Generator",
    desc: "Turn your materials into MCQ, true/false, or short-answer quizzes instantly.",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: "◉",
    title: "Study Analytics",
    desc: "Track sessions, streaks, and see exactly where you need more practice.",
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: "◷",
    title: "Pomodoro Timer",
    desc: "Built-in focus timer with break reminders. Stay locked in, recover fast.",
    accent: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: "❐",
    title: "PDF Notes",
    desc: "Upload PDFs, highlight, annotate, and extract key points with one click.",
    accent: "text-violet-400",
    bg: "bg-violet-500/10",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className=" scroll-mt-20 py-24 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Everything you need
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
            One workspace.
            <br />
            Every study tool.
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Stop switching between apps. Memoflare brings together everything
            that makes studying actually work.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              className="transition-transform duration-200 hover:-translate-y-1"
            >
              <CardHeader>
                <div
                  className={`mb-2 h-10 w-10 rounded-2xl ${f.bg} flex items-center justify-center text-lg ${f.accent}`}
                >
                  {f.icon}
                </div>
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;