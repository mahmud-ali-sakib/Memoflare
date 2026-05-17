"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
      </svg>
    ),
  },
];

const LogoutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

type UserAvatarProps = {
  size?: "md" | "sm";
  name?: string | null;
  image?: string | null;
};

const UserAvatar = ({ size = "md", name, image }: UserAvatarProps) => (
  <div
    className={`relative shrink-0 rounded-full overflow-hidden bg-primary/20 border border-primary/30 flex items-center justify-center ${
      size === "sm" ? "h-7 w-7" : "h-8 w-8"
    }`}
  >
    {image ? (
      <Image
        src={image}
        alt={name ?? "User"}
        fill
        className="object-cover"
      />
    ) : (
      <span className="font-heading text-xs font-bold text-primary">
        {name?.charAt(0)?.toUpperCase() ?? "?"}
      </span>
    )}
  </div>
);

const SideNavbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const user = session?.user;

  const handleLogout = async () => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = (isActive: boolean, compact = false) =>
    compact
      ? `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-medium transition-colors ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`
      : `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 group ${
          isActive
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        }`;

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col border-r border-border bg-card/60 backdrop-blur-md z-40">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0">
          <span className="font-heading text-base font-bold tracking-tight">
            Memoflare
          </span>
        </div>

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
                className={navLinkClass(isActive)}
              >
                <span
                  className={`transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
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

        <div
          ref={menuRef}
          className="px-3 py-4 border-t border-border shrink-0 relative"
        >
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out flex flex-col gap-1 ${
              isMenuOpen
                ? "max-h-20 opacity-100 mb-2 scale-100 origin-bottom"
                : "max-h-0 opacity-0 mb-0 scale-95 origin-bottom pointer-events-none"
            }`}
          >
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 text-destructive hover:bg-destructive/10 w-full text-left"
            >
              <span className="text-destructive">
                <LogoutIcon />
              </span>
              Logout
            </button>
          </div>

          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all cursor-pointer group ${
              isMenuOpen ? "bg-muted" : "hover:bg-muted/60"
            }`}
          >
            <UserAvatar name={user?.name} image={user?.image} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-none">
                {user?.name}
              </p>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`size-4 text-muted-foreground/50 transition-transform duration-200 shrink-0 group-hover:text-muted-foreground ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            >
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </div>
        </div>
      </aside>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
        aria-label="Main navigation"
      >
        <div className="flex items-stretch h-16 px-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass(isActive, true)}
              >
                <span className={isActive ? "text-primary" : ""}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setIsAccountOpen((o) => !o)}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-medium transition-colors ${
              isAccountOpen ? "text-primary" : "text-muted-foreground"
            }`}
            aria-expanded={isAccountOpen}
            aria-label="Account menu"
          >
            <UserAvatar size="sm" name={user?.name} image={user?.image} />
            Account
          </button>
        </div>
      </nav>

      {isAccountOpen && (
        <>
          <button
            type="button"
            className="md:hidden fixed inset-0 z-[60] bg-background/60"
            aria-label="Close account menu"
            onClick={() => setIsAccountOpen(false)}
          />
          <div
            ref={accountRef}
            className="md:hidden fixed inset-x-3 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-[70] rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <UserAvatar name={user?.name} image={user?.image} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogoutIcon />
              Logout
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default SideNavbar;
