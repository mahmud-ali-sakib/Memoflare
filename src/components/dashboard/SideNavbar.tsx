"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Notes",
    href: "/notes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    label: "Calendar",
    href: "/dashboard/calendar",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
      </svg>
    ),
  },
];

// Mock user — replace with real auth data
const USER = {
  name: "Mahmud Ali Sakib",
  role: "Student",
  avatar: null, // set to "/img/avatar.png" when you have one
};

const SideNavbar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col border-r border-border bg-card/60 backdrop-blur-md z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0">
        <span className="font-heading text-base font-bold tracking-tight">Memoflare</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <span
                className={`transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="px-3 py-4 border-t border-border shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-muted/60 transition-colors cursor-pointer group">
          {/* Avatar */}
          <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden bg-primary/20 border border-primary/30 flex items-center justify-center">
            {USER.avatar ? (
              <Image
                src={USER.avatar}
                alt={USER.name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="font-heading text-xs font-bold text-primary">
                {USER.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate leading-none mb-0.5">
              {USER.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">{USER.role}</p>
          </div>

          {/* Options icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0"
          >
            <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
          </svg>
        </div>
      </div>
    </aside>
  );
};

export default SideNavbar;