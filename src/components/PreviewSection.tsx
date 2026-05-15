import Image from "next/image";

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
        <div className="w-full rounded-3xl border border-border bg-card/50  flex flex-col items-center justify-center gap-3 text-muted-foreground mb-5 backdrop-blur-sm">
            <Image
              alt="Dashboard"
              src="/img/3.png"
              width={2560}
              height={1600}
              sizes="100vw"
              className="w-full h-auto rounded-3xl"
              priority
              unoptimized
            />
        </div>

        {/* Two smaller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-3xl border border-border bg-card/50  flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Image
              alt="Dashboard"
              src="/img/1.png"
              width={2560}
              height={1600}
              sizes="100vw"
              className="w-full h-auto rounded-3xl"
              priority
              unoptimized
            />
          </div>
          <div className="rounded-3xl border border-border bg-card/50  flex flex-col items-center justify-center gap-3 text-muted-foreground">
             <Image
               alt="Dashboard"
               src="/img/2.png"
               width={2560}
               height={1600}
               sizes="100vw"
               className="w-full h-auto rounded-3xl"
               priority
               unoptimized
             />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;