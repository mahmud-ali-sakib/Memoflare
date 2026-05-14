const PreviewSection = () => {
  return (
    <section
      id="preview"
      className="scroll-mt-20 py-24 px-6 border-y border-border bg-card/20"
    >
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Product preview
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
            Built for how students
            <br />
            <em className="font-normal text-muted-foreground">actually</em> study
          </h2>
        </div>

        {/* Main screenshot */}
        <div className="w-full rounded-3xl border border-border bg-card/50 aspect-video flex flex-col items-center justify-center gap-3 text-muted-foreground mb-5 backdrop-blur-sm">
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xl">
            📊
          </div>
          <p className="text-sm font-medium">Main dashboard screenshot</p>
          <p className="text-xs text-muted-foreground/50">Recommended: 1280 × 720px</p>
        </div>

        {/* Two smaller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-3xl border border-border bg-card/50 aspect-video flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-lg">🃏</div>
            <p className="text-sm font-medium">Flashcard study mode</p>
            <p className="text-xs text-muted-foreground/50">640 × 360px</p>
          </div>
          <div className="rounded-3xl border border-border bg-card/50 aspect-video flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-lg">📈</div>
            <p className="text-sm font-medium">Analytics & progress view</p>
            <p className="text-xs text-muted-foreground/50">640 × 360px</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;