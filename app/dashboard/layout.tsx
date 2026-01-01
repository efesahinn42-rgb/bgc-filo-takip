// app/dashboard/layout.tsx
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "./actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Güvenlik Kontrolü: Kullanıcı giriş yapmış mı?
  const session = await verifySession();

  // Eğer giriş yapmamışsa login sayfasına postala
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* --- SOL MENÜ (SIDEBAR) --- */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex-shrink-0 hidden md:flex flex-col">
        {/* Logo Alanı */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center mr-3 font-bold shadow-red-900/50 shadow-lg">
            B
          </div>
          <span className="font-bold text-lg tracking-wide">BGC Filo</span>
        </div>

        {/* Menü Linkleri */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-red-900/20 text-red-500 border border-red-900/30"
          >
            {/* Dashboard İkonu */}
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Genel Bakış
          </Link>

          {/* Sadece ADMIN görebilir */}
          {session.role === "ADMIN" && (
            <>
              <div className="pt-4 pb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Yönetim
              </div>

              <Link
                href="/dashboard/companies"
                className="flex items-center px-4 py-3 text-sm font-medium text-neutral-400 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Şirketler
              </Link>

              <Link
                href="/dashboard/vehicles"
                className="flex items-center px-4 py-3 text-sm font-medium text-neutral-400 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Araçlar
              </Link>
              <Link
                href="/dashboard/reports"
                className="flex items-center px-4 py-3 text-sm font-medium text-neutral-400 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Raporlar
              </Link>
            </>
          )}
        </nav>

        {/* Alt Kısım: Kullanıcı Bilgisi */}
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold">
              {session.role === "ADMIN" ? "A" : "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Oturum Açık</p>
              <p className="text-xs text-neutral-500">{session.role}</p>
            </div>
          </div>

          <form action={logoutAction}>
            <button className="w-full flex items-center justify-center px-4 py-2 text-xs font-medium text-neutral-400 bg-neutral-800 rounded-lg hover:bg-red-900/30 hover:text-red-400 transition-colors">
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* --- ANA İÇERİK ALANI --- */}
      <main className="flex-1 overflow-y-auto bg-black/50 p-8">{children}</main>
    </div>
  );
}
