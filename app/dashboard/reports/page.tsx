// app/dashboard/reports/page.tsx
import { PrismaClient } from "@prisma/client";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExportButton from "../export-button";

const prisma = new PrismaClient();

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
    Fotoğraf: log.photoUrl ? "Var" : "Yok", // Excel'de link yerine Var/Yok yazsın
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            KM Hareket Raporları
          </h1>
          <p className="text-neutral-400 mt-1">
            Sisteme girilen tüm araç hareketlerini buradan takip edebilirsiniz.
          </p>
        </div>

        {/* Excel Butonu */}
        <ExportButton data={exportData} />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-neutral-800 text-neutral-400 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Tarih / Saat</th>
              <th className="px-6 py-4">Şirket</th>
              <th className="px-6 py-4">Araç Bilgisi</th>
              <th className="px-6 py-4">Giren Personel</th>
              <th className="px-6 py-4 text-right">KM Bilgisi</th>
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
                <td className="px-6 py-4">
                  <div className="font-medium text-white">
                    {new Date(log.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {new Date(log.createdAt).toLocaleTimeString("tr-TR")}
                  </div>
                </td>

                <td className="px-6 py-4 font-medium text-red-400">
                  {log.vehicle.company.name}
                </td>

                <td className="px-6 py-4">
                  <div className="font-bold text-white tracking-wide border-2 border-neutral-700 bg-neutral-950 px-2 py-0.5 rounded w-fit text-xs mb-1">
                    {log.vehicle.plate}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {log.vehicle.model}
                  </div>
                </td>

                <td className="px-6 py-4 text-neutral-400">
                  {log.user.fullName || log.user.username}
                </td>

                {/* --- GÜNCELLENEN KISIM: KM ve FOTOĞRAF --- */}
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-lg text-white font-bold">
                      {log.km.toLocaleString("tr-TR")}{" "}
                      <span className="text-xs text-neutral-500 font-normal">
                        km
                      </span>
                    </span>

                    {/* Eğer fotoğraf varsa link göster */}
                    {log.photoUrl && (
                      <a
                        href={log.photoUrl}
                        target="_blank"
                        className="mt-1 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
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
                        Fotoğrafı Gör
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
