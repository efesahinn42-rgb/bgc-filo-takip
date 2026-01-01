import { prisma } from "@/lib/prisma"; // MERKEZİ PRISMA KULLANIMI
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExportButton from "../export-button";

export default async function ReportsPage() {
  // 1. Sadece Admin Girebilir
  const session = await verifySession();
  if (session?.role !== "ADMIN") redirect("/dashboard");

  // 2. Verileri İlişkileriyle Beraber Çek
  const logs = await prisma.log.findMany({
    include: {
      user: true,
      vehicle: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 3. Excel için veriyi sadeleştirelim
  const exportData = logs.map((log) => ({
    Tarih: new Date(log.createdAt).toLocaleDateString("tr-TR"),
    Saat: new Date(log.createdAt).toLocaleTimeString("tr-TR"),
    Şirket: log.vehicle.company.name,
    Plaka: log.vehicle.plate,
    Araç: log.vehicle.model,
    Personel: log.user.fullName || log.user.username,
    Kilometre: log.km,
    Fotoğraf: log.photoUrl ? "Var" : "Yok",
  }));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            KM Hareket Raporları
          </h1>
          <p className="text-neutral-400 mt-1 text-sm">
            Sisteme girilen tüm araç hareketlerini buradan takip edebilirsiniz.
          </p>
        </div>

        {/* Excel Butonu - Mobilde tam genişlik */}
        <div className="w-full md:w-auto">
          <ExportButton data={exportData} />
        </div>
      </div>

      {/* MOBİL UYUMLU KAYDIRILABİLİR TABLO ALANI */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            {" "}
            {/* min-w: Sütunların birbirine girmesini önler */}
            <thead className="bg-neutral-800 text-neutral-400 uppercase text-[10px] md:text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Tarih / Saat</th>
                <th className="px-6 py-4">Şirket</th>
                <th className="px-6 py-4">Araç Bilgisi</th>
                <th className="px-6 py-4">Giren Personel</th>
                <th className="px-6 py-4 text-right">KM & Fotoğraf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300 text-sm">
              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-neutral-500"
                  >
                    Henüz hiç kayıt girilmemiş.
                  </td>
                </tr>
              )}

              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-white">
                      {new Date(log.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {new Date(log.createdAt).toLocaleTimeString("tr-TR")}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium text-red-400 whitespace-nowrap">
                    {log.vehicle.company.name}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-bold text-white tracking-wide border-2 border-neutral-700 bg-neutral-950 px-2 py-0.5 rounded w-fit text-[11px] mb-1">
                      {log.vehicle.plate}
                    </div>
                    <div className="text-xs text-neutral-500 whitespace-nowrap">
                      {log.vehicle.model}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-neutral-400 whitespace-nowrap">
                    {log.user.fullName || log.user.username}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-base md:text-lg text-white font-bold">
                        {log.km.toLocaleString("tr-TR")}{" "}
                        <span className="text-[10px] text-neutral-500 font-normal">
                          km
                        </span>
                      </span>

                      {/* FOTOĞRAF BUTONU - Mobilde tıklanabilir şık tasarım */}
                      {log.photoUrl ? (
                        <a
                          href={log.photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-900/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded border border-blue-900/30 hover:bg-blue-900/40 transition-all flex items-center gap-1 active:scale-95"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          FOTOĞRAF
                        </a>
                      ) : (
                        <span className="text-neutral-600 text-[10px]">
                          FOTO YOK
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
