import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExportButton from "../export-button";

// Sayfanın her zaman güncel veriyi çekmesini sağlar
export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  // 1. Sadece Admin Girebilir
  const session = await verifySession();
  if (session?.role !== "ADMIN") redirect("/dashboard");

  // 2. Verileri İlişkileriyle Beraber Çek
  const rawLogs = await prisma.log.findMany({
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

  // 3. BigInt Dönüşümü ve Veri Hazırlama
  // Hem Excel hem de tablo için verileri tek seferde güvenli hale getiriyoruz
  const logs = rawLogs.map((log) => ({
    ...log,
    km: Number(log.km), // BigInt hatasını önlemek için sayıya çeviriyoruz
  }));

  // Excel butonu için veriyi sadeleştirelim (Türkiye saatiyle)
  const exportData = logs.map((log) => ({
    Tarih: new Date(log.createdAt).toLocaleDateString("tr-TR", {
      timeZone: "Europe/Istanbul",
    }),
    Saat: new Date(log.createdAt).toLocaleTimeString("tr-TR", {
      timeZone: "Europe/Istanbul",
    }),
    Şirket: log.vehicle.company.name,
    Plaka: log.vehicle.plate,
    Araç: log.vehicle.model || "-",
    Personel: log.user.fullName || log.user.username,
    Kilometre: log.km,
    Fotoğraf: log.photoUrl ? "Var" : "Yok",
  }));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
            KM Hareket Raporları
          </h1>
          <p className="text-neutral-400 mt-1 text-sm">
            Sisteme girilen tüm araç hareketlerini buradan takip edebilirsiniz.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <ExportButton data={exportData} />
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead className="bg-neutral-800 text-neutral-400 uppercase text-[10px] md:text-xs font-bold tracking-widest">
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
                    className="px-6 py-12 text-center text-neutral-500 italic"
                  >
                    Henüz hiç kayıt girilmemiş.
                  </td>
                </tr>
              )}

              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-neutral-800/50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-white">
                      {new Date(log.createdAt).toLocaleDateString("tr-TR", {
                        timeZone: "Europe/Istanbul",
                      })}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono uppercase">
                      {new Date(log.createdAt).toLocaleTimeString("tr-TR", {
                        timeZone: "Europe/Istanbul",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-bold text-red-500 whitespace-nowrap">
                    {log.vehicle.company.name}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-black text-white tracking-widest border-2 border-neutral-700 bg-black px-2 py-0.5 rounded w-fit text-[11px] mb-1">
                      {log.vehicle.plate}
                    </div>
                    <div className="text-[10px] text-neutral-500 uppercase">
                      {log.vehicle.model || "Belirtilmemiş"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-neutral-400 font-medium">
                    {log.user.fullName || log.user.username}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="font-mono text-base md:text-lg text-white font-black">
                        {log.km.toLocaleString("tr-TR")}{" "}
                        <span className="text-[10px] text-neutral-500 font-normal">
                          km
                        </span>
                      </span>

                      {log.photoUrl ? (
                        <a
                          href={log.photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                        >
                          FOTOĞRAFI GÖR
                        </a>
                      ) : (
                        <span className="text-neutral-600 text-[10px] font-bold italic">
                          FOTOĞRAF YOK
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
