import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-24 px-6 mx-auto flex flex-col items-center text-center">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary tracking-wide">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        Now in public beta
      </div>

      {/* Headline */}
      <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight max-w-4xl">
        Study Smarter,
        <br />
        <span className="text-primary">Not Harder.</span>
      </h1>

      {/* Subheadline */}
      <p className="max-w-xl text-base text-muted-foreground mb-10 leading-relaxed">
        Organize notes, generate flashcards, track progress, and boost
        productivity — all inside one clean AI-powered workspace.
      </p>

      {/* CTAs */}
      <div className="flex gap-3 flex-wrap justify-center mb-16">
        <Button size="lg"><Link href={'/login'}>Get Started for Free</Link></Button>
        {/* <Button size="lg" variant="outline">
          Live Demo →
        </Button> */}
      </div>

      {/* Stats row */}
      <div className="flex gap-12 flex-wrap justify-center border-t border-border pt-10">
        {[
          ["12k+", "Active students"],
          ["4.9★", "Avg. rating"],
          ["3×", "Faster recall"],
        ].map(([num, label]) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="font-heading text-3xl font-bold text-foreground">
              {num}
            </span>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Hero image placeholder */}
      <div className="mt-16 w-full max-w-5xl rounded-3xl border border-border overflow-hidden relative">
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
    </section>
  );
};

export default HeroSection;
