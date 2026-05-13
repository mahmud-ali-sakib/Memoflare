const FOOTER_LINKS = ["Features", "Dashboard", "Pricing", "Docs", "GitHub"];

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-heading text-sm font-bold tracking-tight">Memoflare</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-6">
          {FOOTER_LINKS.map((l) => (
            <a
              key={l}
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {l}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Memoflare. Built by Mahmud Ali Sakib.
        </p>
      </div>
    </footer>
  );
};

export default Footer;