import Link from "next/link";
import { Button } from "./ui/button";

const CTASection = () => {
  return (
    <section className="py-28 px-6">
      <div className="container mx-auto">
        <div className="relative rounded-4xl border border-primary/20 bg-primary/5 px-8 py-20 text-center overflow-hidden">
          {/* Glow decoration */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(6, 182, 212, 0.2), transparent 70%)",
            }}
          />

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
            Free to start
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Start studying better today.
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-10 leading-relaxed">
            Join thousands of students who use Memoflare every day. No credit
            card required.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg"><Link href={'/login'}>Get started for free</Link></Button>
            {/* <Button size="lg" variant="outline">
              View on GitHub
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;