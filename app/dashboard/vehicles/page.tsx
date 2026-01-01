import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DeleteButton from "./DeleteButton";

// Vercel'de verilerin anlık güncellenmesi için kritik ayar
export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  // 1. Güvenlik Kontrolü
  const session = await verifySession();
  if (session?.role !== "ADMIN") redirect("/dashboard");

  // 2. Veritabanından araçları çek
  const vehicles = await prisma.vehicle.findMany({
    include: {
      company: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <div className="p-4 md:p-6 pb-24">
      {/* BAŞLIK VE EKLEME BUTONU */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Araç Listesi
          </h1>
          <p className="text-neutral-400 mt-1 text-sm">
            Sistemdeki tüm kayıtlı araçlar ve bağlı şirketleri yönetin.
          </p>
        </div>
        <Link
          href="/dashboard/vehicles/new"
          className="w-full md:w-auto bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all text-center shadow-lg shadow-red-900/20 active:scale-95"
        >
          + Yeni Araç Ekle
        </Link>
      </div>

      {/* TABLO KONTEYNERI */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400 min-w-[700px]">
            <thead className="bg-neutral-950 text-neutral-200 uppercase text-[10px] md:text-xs font-bold tracking-widest">
              <tr>
                <th className="px-6 py-5">Plaka</th>
                <th className="px-6 py-5">Marka / Model</th>
                <th className="px-6 py-5">Bağlı Şirket</th>
                <th className="px-6 py-5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="hover:bg-neutral-800/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg font-bold text-white w-fit tracking-wider shadow-sm group-hover:border-red-900/50 transition-colors">
                      {vehicle.plate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-200">
                    {vehicle.model || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-red-400 font-medium whitespace-nowrap">
                      {vehicle.company?.name || "Bilinmiyor"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-5">
                      <Link
                        href={`/dashboard/vehicles/${vehicle.id}`}
                        className="text-yellow-500 hover:text-yellow-400 font-bold text-[11px] md:text-xs tracking-tighter uppercase transition-colors"
                      >
                        DÜZENLE
                      </Link>

                      {/* Silme işlemi için Client Component */}
                      <DeleteButton vehicleId={vehicle.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {vehicles.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-neutral-500 italic"
                  >
                    Henüz kayıtlı araç bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
