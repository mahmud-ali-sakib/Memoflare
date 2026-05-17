import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SideNavbar from "@/components/dashboard/SideNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <SideNavbar />
      <main className="flex-1 flex flex-col min-h-screen ml-0 md:ml-60 pb-20 md:pb-0">
        <header className="md:hidden flex h-14 shrink-0 items-center border-b border-border px-4 bg-card/40 backdrop-blur-sm">
          <span className="font-heading text-base font-bold tracking-tight">
            Memoflare
          </span>
        </header>
        {children}
      </main>
    </div>
  );
}
