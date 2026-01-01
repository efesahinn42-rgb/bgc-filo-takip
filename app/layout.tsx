import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar"; // Az önce oluşturduğumuz bileşeni import ediyoruz

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-neutral-950 text-white">
      {/* İstemci Tarafı Yönetilen Sidebar */}
      <Sidebar session={session} />

      {/* Ana İçerik */}
      <main className="flex-1 pt-16 lg:pt-0 p-4 md:p-8 bg-black/50 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
