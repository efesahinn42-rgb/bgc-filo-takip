// app/dashboard/layout.tsx
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "./sidebar"; // Buradaki yol doğru (./ aynı klasör demek)

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-neutral-950 text-white">
      <Sidebar session={session} />
      <main className="flex-1 pt-16 lg:pt-0 p-4 md:p-8 bg-black/50 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
