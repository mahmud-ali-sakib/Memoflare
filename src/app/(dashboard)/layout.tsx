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
    <div className="min-h-screen flex">
      <SideNavbar />
      <main className="flex-1 ml-60 min-h-screen">{children}</main>
    </div>
  );
}